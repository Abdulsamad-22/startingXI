"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getLineupAssignments } from "@/lib/queries/lineup";
import { findOpenSlotForPosition } from "@/lib/utils/formation";

export async function createDefaultTeamAndLineup(userId: string) {
  const supabase = await createClient();

  const { data: team, error: teamError } = await supabase
    .from("teams")
    .insert({
      user_id: userId,
      name: "My Team",
      primary_color: "#3CEFA1",
      secondary_color: "#1D2A25",
    })
    .select()
    .single();
  if (teamError) throw teamError;

  const { data: formation } = await supabase
    .from("formations")
    .select("id")
    .eq("name", "4-3-3")
    .eq("format_size", 11)
    .single();
  if (!formation)
    throw new Error("Default formation not found — check formations seed data");

  const { data: lineup, error: lineupError } = await supabase
    .from("lineups")
    .insert({ team_id: team.id, formation_id: formation.id })
    .select()
    .single();
  if (lineupError) throw lineupError;

  return { teamId: team.id, lineupId: lineup.id };
}

export async function addPlayerToSquad(formData: FormData) {
  const supabase = await createClient();
  const lineupId = formData.get("lineup_id") as string;
  const requestedStarting = formData.get("is_starting") === "true";
  const positionGroup = formData.get("position_group") as string;
  const photo = formData.get("photo") as File | null;

  const { data: lineup } = await supabase
    .from("lineups")
    .select("team_id, formation:formations(slots)")
    .eq("id", lineupId)
    .single();
  if (!lineup || !lineup.formation) throw new Error("Lineup not found");

  let photo_url: string | null = null;
  if (photo && photo.size > 0) {
    const path = `${lineup.team_id}/${crypto.randomUUID()}`;
    const { data: uploaded, error: uploadError } = await supabase.storage
      .from("player-photos")
      .upload(path, photo);
    if (uploadError) throw uploadError;
    photo_url = supabase.storage
      .from("player-photos")
      .getPublicUrl(uploaded.path).data.publicUrl;
  }

  const { data: player, error: playerError } = await supabase
    .from("players")
    .insert({
      team_id: lineup.team_id,
      name: formData.get("name") as string,
      jersey_number: Number(formData.get("jersey_number")),
      position_group: positionGroup,
      photo_url,
    })
    .select()
    .single();
  if (playerError) throw playerError;

  let slotIndex: number | null = null;
  let isStarting = false;

  if (requestedStarting) {
    const assignments = await getLineupAssignments(lineupId);
    const slots = (lineup.formation as any).slots as {
      slot_index: number;
      label: string;
    }[];
    slotIndex = findOpenSlotForPosition(slots, assignments, positionGroup);
    isStarting = slotIndex !== null; // falls back to bench if no matching slot is open
  }

  const { error: linkError } = await supabase.from("lineup_players").insert({
    lineup_id: lineupId,
    player_id: player.id,
    is_starting: isStarting,
    slot_index: slotIndex,
  });
  if (linkError) throw linkError;

  revalidatePath(`/teams/${lineup.team_id}/lineup/${lineupId}`);
  return { placedOnPitch: isStarting };
}

export async function createTeam(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("teams")
    .insert({
      user_id: user.id,
      name: formData.get("name") as string,
      primary_color: (formData.get("primary_color") as string) || "#3CEFA1",
      secondary_color: (formData.get("secondary_color") as string) || "#1D2A25",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addPlayer(teamId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("players").insert({
    team_id: teamId,
    name: formData.get("name") as string,
    jersey_number: Number(formData.get("jersey_number")),
    position_group: formData.get("position_group") as string,
  });

  if (error) throw error;
  revalidatePath(`/teams/${teamId}`);
}

export async function deletePlayer(playerId: string, teamId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("players").delete().eq("id", playerId);
  if (error) throw error;
  revalidatePath(`/teams/${teamId}`);
}

export async function assignPlayerToSlot(formData: FormData) {
  const supabase = await createClient();
  const lineupId = formData.get("lineup_id") as string;
  const photo = formData.get("photo") as File | null;

  const { data: lineup } = await supabase
    .from("lineups")
    .select("team_id")
    .eq("id", lineupId)
    .single();
  if (!lineup) throw new Error("Lineup not found");

  let photo_url: string | null = null;
  if (photo && photo.size > 0) {
    const path = `${lineup.team_id}/${crypto.randomUUID()}`;
    const { data: uploaded, error: uploadError } = await supabase.storage
      .from("player-photos")
      .upload(path, photo);
    if (uploadError) throw uploadError;
    photo_url = supabase.storage
      .from("player-photos")
      .getPublicUrl(uploaded.path).data.publicUrl;
  }

  const { data: player, error: playerError } = await supabase
    .from("players")
    .insert({
      team_id: lineup.team_id,
      name: formData.get("name") as string,
      jersey_number: Number(formData.get("jersey_number")),
      position_group: formData.get("position_group") as string,
      photo_url,
    })
    .select()
    .single();
  if (playerError) throw playerError;

  const isStarting = formData.get("is_starting") === "true";
  const slotIndexRaw = formData.get("slot_index") as string;

  const { error: linkError } = await supabase.from("lineup_players").insert({
    lineup_id: lineupId,
    player_id: player.id,
    is_starting: isStarting,
    slot_index: isStarting ? Number(slotIndexRaw) : null,
  });
  if (linkError) throw linkError;

  revalidatePath(`/teams/${lineup.team_id}/lineup/${lineupId}`);
}

export async function updatePlayerInSlot(formData: FormData) {
  const supabase = await createClient();
  const lineupId = formData.get("lineup_id") as string;
  const playerId = formData.get("player_id") as string;
  const photo = formData.get("photo") as File | null;

  const { data: lineup } = await supabase
    .from("lineups")
    .select("team_id")
    .eq("id", lineupId)
    .single();
  if (!lineup) throw new Error("Lineup not found");

  let photo_url: string | undefined;
  if (photo && photo.size > 0) {
    const path = `${lineup.team_id}/${crypto.randomUUID()}`;
    const { data: uploaded, error: uploadError } = await supabase.storage
      .from("player-photos")
      .upload(path, photo);
    if (uploadError) throw uploadError;
    photo_url = supabase.storage
      .from("player-photos")
      .getPublicUrl(uploaded.path).data.publicUrl;
  }

  const { error: playerError } = await supabase
    .from("players")
    .update({
      name: formData.get("name") as string,
      jersey_number: Number(formData.get("jersey_number")),
      ...(photo_url ? { photo_url } : {}),
    })
    .eq("id", playerId);
  if (playerError) throw playerError;

  const isStarting = formData.get("is_starting") === "true";
  const slotIndexRaw = formData.get("slot_index") as string;

  const { error: linkError } = await supabase
    .from("lineup_players")
    .update({
      is_starting: isStarting,
      slot_index: isStarting ? Number(slotIndexRaw) : null,
    })
    .eq("lineup_id", lineupId)
    .eq("player_id", playerId);
  if (linkError) throw linkError;

  revalidatePath(`/teams/${lineup.team_id}/lineup/${lineupId}`);
}

export async function swapSlots(
  lineupId: string,
  fromSlot: number,
  toSlot: number,
) {
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("lineup_players")
    .select("id, slot_index")
    .eq("lineup_id", lineupId)
    .in("slot_index", [fromSlot, toSlot]);

  if (error) throw error;

  const fromRow = rows.find((r) => r.slot_index === fromSlot);
  const toRow = rows.find((r) => r.slot_index === toSlot);

  if (fromRow) {
    await supabase
      .from("lineup_players")
      .update({ slot_index: toSlot })
      .eq("id", fromRow.id);
  }
  if (toRow) {
    await supabase
      .from("lineup_players")
      .update({ slot_index: fromSlot })
      .eq("id", toRow.id);
  }

  const { data: lineup } = await supabase
    .from("lineups")
    .select("team_id")
    .eq("id", lineupId)
    .single();
  if (lineup) revalidatePath(`/teams/${lineup.team_id}/lineup/${lineupId}`);
}
