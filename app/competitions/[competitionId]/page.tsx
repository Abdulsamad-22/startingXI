import { createClient } from "@/lib/supabase/server";
import { addCompetitionTeam } from "../actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddTeamForm } from "@/components/AddTeamForm";
import { BackButton } from "@/components/BackButton";
import { DeleteCompetitionButton } from "@/components/DeleteCompetitionButton";

export default async function CompetitionOverviewPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: competition } = await supabase
    .from("competitions")
    .select("*")
    .eq("id", competitionId)
    .single();
  if (!competition) notFound();

  const { data: teams } = await supabase
    .from("competition_teams")
    .select("id, name, competition_squad_players(count)")
    .eq("competition_id", competitionId)
    .order("created_at");

  const addTeam = addCompetitionTeam.bind(null, competitionId);

  return (
    <div className="min-h-screen bg-[#555958] text-white p-6">
      <BackButton href="/competitions" label="All Competitions" />

      <h1 className="text-2xl font-bold mb-1">{competition.name}</h1>
      <p className="text-white/50 text-sm mb-6">
        {competition.type === "league" ? "League" : "Cup"} ·{" "}
        {competition.format_size}-a-side · {teams?.length ?? 0}/
        {competition.max_teams} teams
      </p>

      <div className="flex gap-2 mb-6">
        <Link
          href={`/competitions/${competitionId}/fixtures`}
          className="bg-[#1D2A25] hover:bg-[#1D2A25]/70 rounded-lg px-4 py-2 text-sm"
        >
          Fixtures
        </Link>
        {competition.type === "league" && (
          <Link
            href={`/competitions/${competitionId}/standings`}
            className="bg-[#1D2A25] hover:bg-[#1D2A25]/70 rounded-lg px-4 py-2 text-sm"
          >
            Standings
          </Link>
        )}

        {competition.creator_id === user?.id && (
          <Link
            href={`/competitions/${competitionId}/organizers`}
            className="bg-[#1D2A25] hover:bg-[#1D2A25]/70 rounded-lg px-4 py-2 text-sm"
          >
            Organizers
          </Link>
        )}
      </div>

      {competition.creator_id === user?.id && (
        <div className="mb-6 pt-2 border-t border-white/20">
          <DeleteCompetitionButton
            competitionId={competitionId}
            competitionName={competition.name}
          />
        </div>
      )}

      <AddTeamForm competitionId={competitionId} />

      <div className="space-y-2">
        {teams?.map((t: any) => {
          const playerCount = t.competition_squad_players?.[0]?.count ?? 0;
          return (
            <div
              key={t.id}
              className="bg-[#1D2A25] rounded-lg px-4 py-3 flex items-center justify-between"
            >
              <span>{t.name}</span>
              <Link
                href={`/competitions/${competitionId}/teams/${t.id}`}
                className="text-xs text-white/50 hover:text-[#3CEFA1]"
              >
                {playerCount > 0
                  ? `${playerCount}/${competition.max_squad_size} registered`
                  : "Register players (optional)"}{" "}
                →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
