import { createClient } from "@/lib/supabase/server";
import { getLineupAssignments } from "@/lib/queries/lineup";
import { HydrateStore } from "@/components/HydrateStore";
import { LineupBuilder } from "@/components/LineupBuilder";
import { redirect } from "next/navigation";
import { BackButton } from "@/components/BackButton";

export default async function SavedTeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const supabase = await createClient();

  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .single();

  if (!team) redirect("/teams");

  const { data: lineup } = await supabase
    .from("lineups")
    .select("*, formation:formations(id, name, slots, format_size)")
    .eq("team_id", teamId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (!lineup || !lineup.formation) redirect("/teams");

  const { data: allFormations } = await supabase
    .from("formations")
    .select("id, name, slots, format_size")
    .order("name");

  const assignments = await getLineupAssignments(lineup.id);

  const hydrationData = {
    teamId: team.id,
    lineupId: lineup.id,
    teamName: team.name,
    coachName: team.coach_name ?? "",
    displayCoach: team.display_coach,
    crestUrl: team.crest_url,
    primaryColor: team.primary_color,
    secondaryColor: team.secondary_color,
    formationId: lineup.formation.id,
    formationName: lineup.formation.name,
    slots: lineup.formation.slots,
    markerStyle: "shield" as const,
    rawAssignments: assignments,
  };

  return (
    <div className="min-h-screen bg-[#555958] text-white p-6">
      <HydrateStore data={hydrationData} />
      <BackButton href="/team" label="Team" />
      <LineupBuilder allFormations={allFormations ?? []} />
    </div>
  );
}
