import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { TeamListRow } from "@/components/TeamListRow";
import { BackButton } from "@/components/BackButton";

export default async function TeamsListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: teams } = await supabase
    .from("teams")
    .select("id, name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#555958] text-white p-6">
      <BackButton href="/" label="Lineup Builder" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Teams</h1>
        <Link
          href="/"
          className="bg-[#3CEFA1] text-[#0E2F21] font-semibold rounded-lg px-4 py-2 text-sm"
        >
          + New Team
        </Link>
      </div>

      {teams && teams.length > 0 ? (
        <div className="space-y-2">
          {teams.map((team) => (
            <TeamListRow key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <p className="text-white/50">No saved teams yet.</p>
      )}
    </div>
  );
}
