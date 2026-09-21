type FixtureRow = {
  id: string;
  round: number;
  home_score: number | null;
  away_score: number | null;
  home_penalties: number | null;
  away_penalties: number | null;
  confirmed_at: string | null;
  home: { name: string } | null;
  away: { name: string } | null;
};
import { getMatchSpacing } from "@/lib/utils/bracket";

const MATCH_HEIGHT = 64;

export function BracketView({ fixtures }: { fixtures: FixtureRow[] }) {
  const rounds = [...new Set(fixtures.map((f) => f.round))].sort(
    (a, b) => a - b,
  );

  return (
    <div className="flex gap-8 overflow-x-auto pb-4">
      {rounds.map((round, roundIndex) => {
        const roundFixtures = fixtures
          .filter((f) => f.round === round)
          .sort((a, b) => a.id.localeCompare(b.id)); // stable order; see note below

        const { spacing, topOffset } = getMatchSpacing(
          roundIndex,
          MATCH_HEIGHT,
        );

        return (
          <div
            key={round}
            className="flex flex-col shrink-0"
            style={{ width: 180 }}
          >
            <p className="text-xs text-white/40 uppercase tracking-wide mb-3 text-center">
              {roundLabel(round, rounds.length)}
            </p>

            <div className="relative flex flex-col">
              {roundFixtures.map((f, i) => (
                <div
                  key={f.id}
                  style={{
                    marginTop: i === 0 ? topOffset : spacing - MATCH_HEIGHT,
                    height: MATCH_HEIGHT,
                  }}
                  className="relative"
                >
                  <MatchCard fixture={f} />
                  {/* connector line to the next round, skipped on the final round */}
                  {roundIndex < rounds.length - 1 && (
                    <div
                      className="absolute top-1/2 -right-8 w-8 border-t border-white/20"
                      style={{ transform: "translateY(-0.5px)" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function roundLabel(round: number, totalRounds: number) {
  const fromEnd = totalRounds - round;
  if (fromEnd === 0) return "Final";
  if (fromEnd === 1) return "Semi-Final";
  if (fromEnd === 2) return "Quarter-Final";
  return `Round ${round}`;
}

function MatchCard({ fixture }: { fixture: FixtureRow }) {
  const homeWon =
    fixture.confirmed_at &&
    ((fixture.home_score ?? 0) > (fixture.away_score ?? 0) ||
      (fixture.home_score === fixture.away_score &&
        (fixture.home_penalties ?? 0) > (fixture.away_penalties ?? 0)));
  const awayWon =
    fixture.confirmed_at &&
    ((fixture.away_score ?? 0) > (fixture.home_score ?? 0) ||
      (fixture.home_score === fixture.away_score &&
        (fixture.away_penalties ?? 0) > (fixture.home_penalties ?? 0)));

  return (
    <div className="bg-[#1D2A25] rounded-lg overflow-hidden border border-white/10 text-xs">
      <div
        className={`flex items-center justify-between px-2 py-1.5 ${homeWon ? "bg-[#3CEFA1]/10" : ""}`}
      >
        <span
          className={homeWon ? "text-[#3CEFA1] font-semibold" : "text-white/70"}
        >
          {fixture.home?.name ?? "TBD"}
        </span>
        {fixture.confirmed_at && (
          <span className="font-bold">{fixture.home_score}</span>
        )}
      </div>
      <div
        className={`flex items-center justify-between px-2 py-1.5 border-t border-white/10 ${awayWon ? "bg-[#3CEFA1]/10" : ""}`}
      >
        <span
          className={awayWon ? "text-[#3CEFA1] font-semibold" : "text-white/70"}
        >
          {fixture.away?.name ?? "TBD"}
        </span>
        {fixture.confirmed_at && (
          <span className="font-bold">{fixture.away_score}</span>
        )}
      </div>
    </div>
  );
}
