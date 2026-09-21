import { createClient } from "@/lib/supabase/server";
import { BackButton } from "@/components/BackButton";
export default async function StandingsPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = await params;
  const supabase = await createClient();

  const { data: standings } = await supabase.rpc("get_competition_standings", {
    comp_id: competitionId,
  });

  const { count: totalFixtures } = await supabase
    .from("fixtures")
    .select("id", { count: "exact", head: true })
    .eq("competition_id", competitionId);

  const { count: confirmedFixtures } = await supabase
    .from("fixtures")
    .select("id", { count: "exact", head: true })
    .eq("competition_id", competitionId)
    .not("home_score", "is", null);

  const seasonComplete =
    totalFixtures !== null &&
    totalFixtures > 0 &&
    totalFixtures === confirmedFixtures;

  return (
    <div className="min-h-screen bg-[#555958] text-white p-6">
      <BackButton
        href={`/competitions/${competitionId}`}
        label="Back to Competition"
      />

      <h1 className="text-2xl font-bold mb-6">Standings</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-white/40 text-left border-b border-white/10">
            <th className="py-2 w-8"></th>
            <th className="py-2">Team</th>
            <th className="py-2 text-center">P</th>
            <th className="py-2 text-center">GD</th>
            <th className="py-2 text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings?.map((s: any, i: number) => {
            const isChampion = seasonComplete && i === 0;
            return (
              <tr
                key={s.team_id}
                className={`border-b border-white/5 ${isChampion ? "bg-[#3CEFA1]/15" : ""}`}
              >
                <td className="py-2">
                  {isChampion ? (
                    <span className="font-bold pl-2 text-[#3CEFA1]">C</span>
                  ) : (
                    <span className="text-white/40 pl-2">{i + 1}</span>
                  )}
                </td>
                <td
                  className={`py-2 ${isChampion ? "font-semibold text-[#3CEFA1]" : ""}`}
                >
                  {s.team_name}
                </td>
                <td className="py-2 text-center">{s.played}</td>
                <td className="py-2 text-center">
                  {s.goals_for - s.goals_against}
                </td>
                <td
                  className={`py-2 text-center font-bold ${isChampion ? "text-[#3CEFA1]" : "text-[#3CEFA1]"}`}
                >
                  {s.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
