import { createClient } from "@/lib/supabase/server";
import { LineupBuilder } from "@/components/LineupBuilder";
import { InitNewDraft } from "@/components/InitNewDraft";
import { SavedTeamsButton } from "@/components/SavedTeamsButton";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: defaultFormation } = await supabase
    .from("formations")
    .select("id, name, slots, format_size")
    .eq("name", "4-3-3")
    .eq("format_size", 11)
    .single();

  const { data: allFormations } = await supabase
    .from("formations")
    .select("id, name, slots, format_size")
    .order("name");

  if (!defaultFormation) {
    return (
      <div className="min-h-screen bg-[#0E2F21] text-white p-6">
        Setup error — default formation missing.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#555958] text-white p-6">
      <div className="flex justify-end gap-2 mb-4">
        <Link
          href="/competitions"
          className="bg-[#1D2A25] hover:bg-[#1D2A25]/70 transition-colors rounded-lg px-4 py-2 text-sm font-medium"
        >
          Competitions
        </Link>
        <SavedTeamsButton />
      </div>
      <InitNewDraft defaultFormation={defaultFormation} />
      <LineupBuilder allFormations={allFormations ?? []} />
    </div>
  );
}
