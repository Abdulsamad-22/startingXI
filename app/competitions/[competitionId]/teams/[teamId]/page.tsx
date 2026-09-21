import { createClient } from "@/lib/supabase/server";
import { CompetitionSquadForm } from "@/components/CompetitionSquadForm";
import { NextTeamButton } from "@/app/competitions/NextTeamButton";
import { HydrateCompetitionSquad } from "@/components/HydrateCompetitionSquad";
import { SquadCsvImport } from "@/components/SquadCsvImport";
import { notFound } from "next/navigation";
import { BackButton } from "@/components/BackButton";

export default async function CompetitionSquadPage({
  params,
}: {
  params: Promise<{ competitionId: string; teamId: string }>;
}) {
  const { competitionId, teamId } = await params;
  const supabase = await createClient();

  const { data: team } = await supabase
    .from("competition_teams")
    .select("*")
    .eq("id", teamId)
    .single();
  if (!team) notFound();

  const { data: competition } = await supabase
    .from("competitions")
    .select("max_squad_size")
    .eq("id", competitionId)
    .single();
  const { data: players } = await supabase
    .from("competition_squad_players")
    .select("*")
    .eq("competition_team_id", teamId)
    .order("jersey_number");

  return (
    <div className="min-h-screen bg-[#555958] text-white p-6">
      <HydrateCompetitionSquad
        data={{
          competitionId,
          competitionTeamId: teamId,
          players: players ?? [],
        }}
      />
      <BackButton
        href={`/competitions/${competitionId}`}
        label={team.name ? "Back to Competition" : "Back"}
      />

      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">{team.name}</h1>
        <NextTeamButton competitionId={competitionId} currentTeamId={teamId} />
      </div>
      <p className="text-white/50 text-sm mb-6">
        {players?.length ?? 0}/{competition?.max_squad_size ?? 23} registered
      </p>

      <SquadCsvImport
        competitionTeamId={teamId}
        competitionId={competitionId}
      />
      <CompetitionSquadForm maxSquadSize={competition?.max_squad_size ?? 23} />
    </div>
  );
}
