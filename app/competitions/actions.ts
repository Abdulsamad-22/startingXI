"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  generateRoundRobin,
  generateKnockoutBracket,
  shuffle,
} from "@/lib/utils/fixtures";

export async function createCompetition(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("competitions")
    .insert({
      creator_id: user.id,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      format_size: Number(formData.get("format_size")),
      max_teams: Number(formData.get("max_teams")) || 8,
      max_squad_size: Number(formData.get("max_squad_size")) || 23,
    })
    .select()
    .single();

  if (error) throw error;
  redirect(`/competitions/${data.id}`);
}

export async function deleteCompetition(competitionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: competition } = await supabase
    .from("competitions")
    .select("creator_id")
    .eq("id", competitionId)
    .single();

  if (!competition || competition.creator_id !== user?.id) {
    throw new Error("Only the creator can delete this competition");
  }

  const { error } = await supabase
    .from("competitions")
    .delete()
    .eq("id", competitionId);
  if (error) throw error;
}

export async function getNextIncompleteTeam(
  competitionId: string,
  currentTeamId: string,
) {
  const supabase = await createClient();

  const { data: competition } = await supabase
    .from("competitions")
    .select("max_squad_size")
    .eq("id", competitionId)
    .single();
  const { data: teams } = await supabase
    .from("competition_teams")
    .select("id, created_at")
    .eq("competition_id", competitionId)
    .order("created_at");

  if (!teams || !competition) return null;

  const withCounts = await Promise.all(
    teams.map(async (t) => {
      const { count } = await supabase
        .from("competition_squad_players")
        .select("id", { count: "exact", head: true })
        .eq("competition_team_id", t.id);
      return { id: t.id, count: count ?? 0 };
    }),
  );

  const currentIndex = withCounts.findIndex((t) => t.id === currentTeamId);
  const ordered = [
    ...withCounts.slice(currentIndex + 1),
    ...withCounts.slice(0, currentIndex + 1),
  ];

  const next = ordered.find(
    (t) => t.id !== currentTeamId && t.count < competition.max_squad_size,
  );
  return next?.id ?? null;
}

export async function createOrganizerInvite(competitionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { count } = await supabase
    .from("competition_organizers")
    .select("id", { count: "exact", head: true })
    .eq("competition_id", competitionId);

  if (count !== null && count >= 2)
    throw new Error("Maximum of 2 organizers already added");

  const { data, error } = await supabase
    .from("competition_invites")
    .insert({ competition_id: competitionId, created_by: user.id })
    .select("token")
    .single();

  if (error) throw error;
  return data.token;
}

export async function acceptOrganizerInvite(token: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("accept_competition_invite", {
    invite_token: token,
  });
  if (error) throw error;
}

export async function addOrganizer(competitionId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: competition } = await supabase
    .from("competitions")
    .select("creator_id")
    .eq("id", competitionId)
    .single();

  if (!competition || competition.creator_id !== user?.id) {
    throw new Error("Only the creator can manage organizers");
  }

  const { count } = await supabase
    .from("competition_organizers")
    .select("id", { count: "exact", head: true })
    .eq("competition_id", competitionId);

  if (count !== null && count >= 2)
    throw new Error("Maximum of 2 organizers already added");

  // look up the invited user by email via a matching Supabase auth user —
  // requires the invitee already has an account
  const email = formData.get("email") as string;
  const { data: invitedUser } = await supabase
    .from("teams") // any table exposing user_id is fine for a lookup helper; see note below
    .select("user_id")
    .limit(0);

  throw new Error(
    "See note below — organizer invite by email needs a lookup helper, not built yet",
  );
}

export async function removeOrganizer(
  competitionId: string,
  organizerId: string,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("competition_organizers")
    .delete()
    .eq("id", organizerId);
  if (error) throw error;
  revalidatePath(`/competitions/${competitionId}`);
}

export async function addCompetitionTeam(
  competitionId: string,
  formData: FormData,
) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("competition_teams")
    .select("id", { count: "exact", head: true })
    .eq("competition_id", competitionId);

  const { data: competition } = await supabase
    .from("competitions")
    .select("max_teams")
    .eq("id", competitionId)
    .single();

  if (competition && count !== null && count >= competition.max_teams) {
    throw new Error(
      `Maximum of ${competition.max_teams} teams reached — upgrade to add more`,
    );
  }

  const { error } = await supabase.from("competition_teams").insert({
    competition_id: competitionId,
    name: formData.get("name") as string,
  });

  if (error) throw error;
  revalidatePath(`/competitions/${competitionId}`);
}

export async function bulkImportSquad(
  competitionTeamId: string,
  competitionId: string,
  rows: { name: string; jersey_number: number; position_group: string }[],
) {
  const supabase = await createClient();

  const { data: competition } = await supabase
    .from("competitions")
    .select("max_squad_size")
    .eq("id", competitionId)
    .single();

  const { count } = await supabase
    .from("competition_squad_players")
    .select("id", { count: "exact", head: true })
    .eq("competition_team_id", competitionTeamId);

  const wouldExceed =
    competition &&
    count !== null &&
    count + rows.length > competition.max_squad_size;
  if (wouldExceed)
    throw new Error(
      `Import would exceed the ${competition.max_squad_size}-player squad limit`,
    );

  const { error } = await supabase.from("competition_squad_players").insert(
    rows.map((r) => ({
      competition_team_id: competitionTeamId,
      name: r.name,
      jersey_number: r.jersey_number,
      position_group: r.position_group,
    })),
  );

  if (error) throw error;
  revalidatePath(`/competitions/${competitionId}/teams/${competitionTeamId}`);
}

async function buildFixtures(
  competitionId: string,
  type: "league" | "cup",
  teamIds: string[],
) {
  const supabase = await createClient();
  const shuffledIds = shuffle(teamIds);

  if (type === "league") {
    const pairings = generateRoundRobin(shuffledIds);
    const { error } = await supabase.from("fixtures").insert(
      pairings.map((p) => ({
        competition_id: competitionId,
        round: p.round,
        home_team_id: p.home,
        away_team_id: p.away,
      })),
    );
    if (error) throw error;
  } else {
    const { round1, byeTeams, totalRounds } =
      generateKnockoutBracket(shuffledIds);

    const laterRoundFixtures: { round: number; id: string }[] = [];
    for (let r = 2; r <= totalRounds; r++) {
      const fixturesInRound = Math.pow(2, totalRounds - r);
      for (let i = 0; i < fixturesInRound; i++) {
        const { data, error } = await supabase
          .from("fixtures")
          .insert({ competition_id: competitionId, round: r })
          .select("id")
          .single();
        if (error) throw error;
        laterRoundFixtures.push({ round: r, id: data.id });
      }
    }

    const round2Fixtures = laterRoundFixtures.filter((f) => f.round === 2);

    for (let i = 0; i < round1.length; i++) {
      const nextFixtureId = round2Fixtures[Math.floor(i / 2)]?.id ?? null;
      const slot = i % 2 === 0 ? "home" : "away";
      await supabase.from("fixtures").insert({
        competition_id: competitionId,
        round: 1,
        home_team_id: round1[i].home,
        away_team_id: round1[i].away,
        next_fixture_id: nextFixtureId,
        next_fixture_slot: slot,
      });
    }

    for (let i = 0; i < byeTeams.length; i++) {
      const dest = round2Fixtures[Math.floor((round1.length + i) / 2)];
      if (!dest) continue;
      const slot = (round1.length + i) % 2 === 0 ? "home" : "away";
      await supabase
        .from("fixtures")
        .update({ [`${slot}_team_id`]: byeTeams[i] })
        .eq("id", dest.id);
    }
  }
}

export async function generateFixtures(competitionId: string) {
  const supabase = await createClient();

  const { data: competition } = await supabase
    .from("competitions")
    .select("type")
    .eq("id", competitionId)
    .single();
  if (!competition) throw new Error("Competition not found");

  const { data: teams } = await supabase
    .from("competition_teams")
    .select("id")
    .eq("competition_id", competitionId);
  if (!teams || teams.length < 2)
    throw new Error("Need at least 2 teams to generate fixtures");

  const { count: existing } = await supabase
    .from("fixtures")
    .select("id", { count: "exact", head: true })
    .eq("competition_id", competitionId);
  if (existing && existing > 0)
    throw new Error("Fixtures already generated for this competition");

  await buildFixtures(
    competitionId,
    competition.type as "league" | "cup",
    teams.map((t) => t.id),
  );
  revalidatePath(`/competitions/${competitionId}/fixtures`);
}

export async function reshuffleFixtures(competitionId: string) {
  const supabase = await createClient();

  const { count: confirmedCount } = await supabase
    .from("fixtures")
    .select("id", { count: "exact", head: true })
    .eq("competition_id", competitionId)
    .not("confirmed_at", "is", null);

  if (confirmedCount && confirmedCount > 0) {
    throw new Error(
      "Cannot reshuffle — results have already been confirmed for this competition",
    );
  }

  const { data: competition } = await supabase
    .from("competitions")
    .select("type")
    .eq("id", competitionId)
    .single();
  const { data: teams } = await supabase
    .from("competition_teams")
    .select("id")
    .eq("competition_id", competitionId);
  if (!competition || !teams) throw new Error("Competition or teams not found");

  await supabase.from("fixtures").delete().eq("competition_id", competitionId);
  await buildFixtures(
    competitionId,
    competition.type as "league" | "cup",
    teams.map((t) => t.id),
  );

  revalidatePath(`/competitions/${competitionId}/fixtures`);
}

export async function confirmResult(
  competitionId: string,
  fixtureId: string,
  homeScore: number,
  awayScore: number,
  homePenalties?: number,
  awayPenalties?: number,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: fixture } = await supabase
    .from("fixtures")
    .select("*")
    .eq("id", fixtureId)
    .single();
  if (!fixture) throw new Error("Fixture not found");

  const isDraw = homeScore === awayScore;
  const isCupKnockout = !!fixture.next_fixture_id || fixture.round === 1; // adjust if you need a stricter cup-only check

  if (
    isDraw &&
    isCupKnockout &&
    (homePenalties === undefined || awayPenalties === undefined)
  ) {
    throw new Error(
      "This is a knockout match — enter penalty scores to determine the winner",
    );
  }

  if (isDraw && homePenalties === awayPenalties) {
    throw new Error("Penalty scores cannot also be level");
  }

  const { error } = await supabase
    .from("fixtures")
    .update({
      home_score: homeScore,
      away_score: awayScore,
      home_penalties: isDraw ? homePenalties : null,
      away_penalties: isDraw ? awayPenalties : null,
      confirmed_at: new Date().toISOString(),
      confirmed_by: user?.id,
    })
    .eq("id", fixtureId);
  if (error) throw error;

  if (fixture.next_fixture_id && fixture.next_fixture_slot) {
    let winnerId: string | null = null;
    if (!isDraw) {
      winnerId =
        homeScore > awayScore ? fixture.home_team_id : fixture.away_team_id;
    } else if (homePenalties !== undefined && awayPenalties !== undefined) {
      winnerId =
        homePenalties > awayPenalties
          ? fixture.home_team_id
          : fixture.away_team_id;
    }

    if (winnerId) {
      await supabase
        .from("fixtures")
        .update({
          [fixture.next_fixture_slot === "home"
            ? "home_team_id"
            : "away_team_id"]: winnerId,
        })
        .eq("id", fixture.next_fixture_id);
    }
  }

  revalidatePath(`/competitions/${competitionId}/fixtures`);
}

export async function saveCompetitionSquad(state: {
  competitionId: string;
  competitionTeamId: string;
  players: {
    id: string;
    name: string;
    jersey_number: number;
    position_group: string;
    photo_file: File | null;
    photo_url: string | null;
  }[];
}) {
  const supabase = await createClient();

  for (const player of state.players) {
    let photo_url = player.photo_url ?? undefined;
    if (player.photo_file) {
      const path = `${state.competitionTeamId}/${player.id}`;
      const { data: uploaded, error: uploadError } = await supabase.storage
        .from("competition-players")
        .upload(path, player.photo_file, { upsert: true });
      if (uploadError) throw uploadError;
      photo_url = supabase.storage
        .from("competition-players")
        .getPublicUrl(uploaded.path).data.publicUrl;
    }

    const { error } = await supabase.from("competition_squad_players").upsert({
      id: player.id,
      competition_team_id: state.competitionTeamId,
      name: player.name,
      jersey_number: player.jersey_number,
      position_group: player.position_group,
      ...(photo_url ? { photo_url } : {}),
    });
    if (error) throw error;
  }

  // handle deletions: remove any DB row whose id is no longer in the current player list
  const currentIds = state.players.map((p) => p.id);
  await supabase
    .from("competition_squad_players")
    .delete()
    .eq("competition_team_id", state.competitionTeamId)
    .not("id", "in", `(${currentIds.length ? currentIds.join(",") : "null"})`);

  revalidatePath(
    `/competitions/${state.competitionId}/teams/${state.competitionTeamId}`,
  );
}
