"use server";

import { createClient } from "@/lib/supabase/server";
import { type LineupState } from "@/lib/store/lineupStore";
import { revalidatePath } from "next/cache";

export async function saveDraft(state: LineupState) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return; // AuthProvider guarantees this rarely fires, but bail safely if it does

  let crest_url = state.crestUrl ?? undefined;
  if (state.crestFile) {
    const path = `${state.teamId}/crest-${crypto.randomUUID()}`;
    const { data: uploaded } = await supabase.storage
      .from("team-crests")
      .upload(path, state.crestFile, { upsert: true });
    if (uploaded)
      crest_url = supabase.storage
        .from("team-crests")
        .getPublicUrl(uploaded.path).data.publicUrl;
  }

  await supabase.from("teams").upsert({
    id: state.teamId,
    user_id: user.id,
    name: state.teamName || "My Team",
    coach_name: state.coachName,
    display_coach: state.displayCoach,
    primary_color: state.primaryColor,
    secondary_color: state.secondaryColor,
    ...(crest_url ? { crest_url } : {}),
  });

  await supabase.from("lineups").upsert({
    id: state.lineupId,
    team_id: state.teamId,
    formation_id: state.formationId,
    updated_at: new Date().toISOString(),
  });

  for (const player of state.players) {
    let photo_url = player.photo_url ?? undefined;
    if (player.photo_file) {
      const path = `${state.teamId}/${player.id}`;
      const { data: uploaded } = await supabase.storage
        .from("player-photos")
        .upload(path, player.photo_file, { upsert: true });
      if (uploaded)
        photo_url = supabase.storage
          .from("player-photos")
          .getPublicUrl(uploaded.path).data.publicUrl;
    }

    await supabase.from("players").upsert({
      id: player.id,
      team_id: state.teamId,
      name: player.name,
      jersey_number: player.jersey_number,
      position_group: player.position_group,
      ...(photo_url ? { photo_url } : {}),
    });

    await supabase.from("lineup_players").upsert(
      {
        lineup_id: state.lineupId,
        player_id: player.id,
        is_starting: player.is_starting,
        slot_index: player.slot_index,
      },
      { onConflict: "lineup_id,player_id" },
    );
  }
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

export async function deleteTeam(teamId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("teams").delete().eq("id", teamId);
  if (error) throw error;
  revalidatePath("/teams");
}
