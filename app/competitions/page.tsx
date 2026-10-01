import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";

export default async function CompetitionsListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: competitions } = await supabase
    .from("competitions")
    .select("id, name, type")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#555958] text-white p-6">
      <BackButton href="/" label="Lineup builder" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Competitions</h1>
        <Link
          href="/competitions/new"
          className="bg-[#3CEFA1] text-[#0E2F21] font-semibold rounded-lg px-4 py-2 text-sm"
        >
          + New Competition
        </Link>
      </div>

      {competitions && competitions.length > 0 ? (
        <div className="space-y-2">
          {competitions.map((c) => (
            <Link
              key={c.id}
              href={`/competitions/${c.id}`}
              className="block bg-[#343a38] rounded-lg px-4 py-3 hover:bg-[#1D2A25]/70"
            >
              {c.name}{" "}
              <span className="text-xs text-white/40 uppercase ml-2">
                {c.type}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-white/50">No competitions yet.</p>
      )}
    </div>
  );
}
