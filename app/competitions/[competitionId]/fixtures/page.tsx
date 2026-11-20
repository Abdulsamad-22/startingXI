import { createClient } from "@/lib/supabase/server";
import { generateFixtures, confirmResult } from "@/app/competitions/actions";
import { ScoreEntryForm } from "@/components/ScoreEntryForm";
import { BackButton } from "@/components/BackButton";
import { ReshuffleButton } from "@/components/ReshuffleButton";
import Link from "next/link";
import { MatchdayCompletionPrompt } from "@/components/MatchdayCompletionPrompt";
import { FixtureScheduleForm } from "@/components/FixtureScheduleForm";

export default async function FixturesPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = await params;
  const supabase = await createClient();

  const { data: competition } = await supabase
    .from("competitions")
    .select("type, timezone")
    .eq("id", competitionId)
    .single();

  const { data: fixtures } = await supabase
    .from("fixtures")
    .select(
      "*, home:competition_teams!fixtures_home_team_id_fkey(name), away:competition_teams!fixtures_away_team_id_fkey(name)",
    )
    .eq("competition_id", competitionId)
    .order("round");

  const { data: teamsWithCounts } = await supabase
    .from("competition_teams")
    .select("id, name, competition_squad_players(count)")
    .eq("competition_id", competitionId);

  const teamsWithNoSquad =
    teamsWithCounts?.filter(
      (t: any) => (t.competition_squad_players?.[0]?.count ?? 0) === 0,
    ) ?? [];

  const teamCount = teamsWithCounts?.length ?? 0;
  const hasEnoughTeams = teamCount >= 2;

  const generate = generateFixtures.bind(null, competitionId);
  const rounds = [...new Set(fixtures?.map((f) => f.round))];

  const hasConfirmedResults = fixtures?.some((f) => f.confirmed_at) ?? false;

  return (
    <div className="min-h-screen bg-[#555958] text-white p-6">
      <BackButton
        href={`/competitions/${competitionId}`}
        label="Back to Competition"
      />
      <h1 className="text-2xl font-bold mb-6">Fixtures</h1>
      <MatchdayCompletionPrompt competitionId={competitionId} />

      {teamsWithNoSquad.length > 0 && (!fixtures || fixtures.length === 0) && (
        <p className="text-xs text-white/40 mb-2">
          {teamsWithNoSquad.length} team
          {teamsWithNoSquad.length > 1 ? "s have" : " has"} no players
          registered yet — you can still generate fixtures and add squads later.
        </p>
      )}
      {(!fixtures || fixtures.length === 0) &&
        (hasEnoughTeams ? (
          <form action={generate}>
            <button
              type="submit"
              className="bg-[#3CEFA1] text-[#0E2F21] font-semibold rounded-lg px-4 py-2 text-sm"
            >
              Generate Fixtures
            </button>
          </form>
        ) : (
          <div className="rounded-xl border border-white/10 bg-[#343a38] p-5">
            <h2 className="text-base font-semibold text-white">
              {teamCount === 0
                ? "No teams registered yet"
                : "Add one more team to generate fixtures"}
            </h2>

            <p className="mt-1 text-sm text-white/50">
              {teamCount === 0
                ? "Register at least two teams before generating fixtures."
                : "Fixtures need at least two registered teams."}
            </p>

            <Link
              href={`/competitions/${competitionId}`}
              className="mt-4 inline-flex rounded-lg bg-[#3CEFA1] px-4 py-2 text-sm font-semibold text-[#0E2F21]"
            >
              Register teams
            </Link>
          </div>
        ))}
      {fixtures && fixtures.length > 0 && !hasConfirmedResults && (
        <div className="mb-6">
          <ReshuffleButton competitionId={competitionId} />
        </div>
      )}

      {rounds.map((round) => (
        <div key={round} id={`matchday-${round}`} className="mb-6 scroll-mt-6">
          <h2 className="text-sm text-white/50 uppercase tracking-wide mb-2">
            {competition?.type === "cup"
              ? `Round ${round}`
              : `Matchday ${round}`}
          </h2>
          <div className="space-y-2">
            {fixtures
              ?.filter((f) => f.round === round)
              .map((f) => (
                <div key={f.id} className="rounded-lg bg-[#343a38] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex-1 text-right">
                      {f.home?.name ?? "TBD"}
                    </span>

                    {f.confirmed_at ? (
                      <span className="flex items-center gap-1 font-bold text-[#3CEFA1]">
                        {f.home_score} – {f.away_score}
                        {f.home_penalties !== null &&
                          f.away_penalties !== null && (
                            <span className="text-xs font-normal text-white/50">
                              ({f.home_penalties}–{f.away_penalties} pens)
                            </span>
                          )}
                      </span>
                    ) : (
                      <ScoreEntryForm
                        competitionId={competitionId}
                        fixtureId={f.id}
                        isCup={competition?.type === "cup"}
                      />
                    )}

                    <span className="flex-1">{f.away?.name ?? "TBD"}</span>
                  </div>

                  <div className="mt-3 flex justify-center border-t border-white/5 pt-2">
                    <FixtureScheduleForm
                      competitionId={competitionId}
                      fixtureId={f.id}
                      kickoffAt={f.kickoff_at}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
