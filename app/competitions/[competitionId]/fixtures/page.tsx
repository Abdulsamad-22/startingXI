import { createClient } from "@/lib/supabase/server";
import { generateFixtures, confirmResult } from "@/app/competitions/actions";
import { ScoreEntryForm } from "@/components/ScoreEntryForm";
import { BackButton } from "@/components/BackButton";
import { ReshuffleButton } from "@/components/ReshuffleButton";

export default async function FixturesPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = await params;
  const supabase = await createClient();

  const { data: competition } = await supabase
    .from("competitions")
    .select("type")
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
      {teamsWithNoSquad.length > 0 && (!fixtures || fixtures.length === 0) && (
        <p className="text-xs text-white/40 mb-2">
          {teamsWithNoSquad.length} team
          {teamsWithNoSquad.length > 1 ? "s have" : " has"} no players
          registered yet — you can still generate fixtures and add squads later.
        </p>
      )}
      {(!fixtures || fixtures.length === 0) && (
        <form action={generate}>
          <button
            type="submit"
            className="bg-[#3CEFA1] text-[#0E2F21] font-semibold rounded-lg px-4 py-2 text-sm"
          >
            Generate Fixtures
          </button>
        </form>
      )}
      {fixtures && fixtures.length > 0 && !hasConfirmedResults && (
        <div className="mb-6">
          <ReshuffleButton competitionId={competitionId} />
        </div>
      )}

      {rounds.map((round) => (
        <div key={round} className="mb-6">
          <h2 className="text-sm text-white/50 uppercase tracking-wide mb-2">
            {competition?.type === "cup"
              ? `Round ${round}`
              : `Matchday ${round}`}
          </h2>
          <div className="space-y-2">
            {fixtures
              ?.filter((f) => f.round === round)
              .map((f) => (
                <div
                  key={f.id}
                  className="bg-[#343a38] rounded-lg px-4 py-3 flex items-center gap-3"
                >
                  <span className="flex-1 text-right">
                    {f.home?.name ?? "TBD"}
                  </span>
                  {f.confirmed_at ? (
                    <span className="font-bold text-[#3CEFA1] flex items-center gap-1">
                      {f.home_score} – {f.away_score}
                      {f.home_penalties !== null &&
                        f.away_penalties !== null && (
                          <span className="text-xs text-white/50 font-normal">
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
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
