import { createClient } from "@/lib/supabase/server";
import { LineupBuilder } from "@/components/LineupBuilder";
import { InitNewDraft } from "@/components/InitNewDraft";
import { SavedTeamsButton } from "@/components/SavedTeamsButton";
import Link from "next/link";
import { SeoContent } from "@/components/SeoContent";
import { JsonLd } from "@/components/JsonLd";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string; formation?: string; size?: string }>;
}) {
  const { team: resumeTeamId, formation, size } = await searchParams;
  const supabase = await createClient();

  const requestedSize = Number(size);
  const validSize = [5, 7, 8, 9, 11].includes(requestedSize)
    ? requestedSize
    : 11;

  let { data: defaultFormation } = await supabase
    .from("formations")
    .select("id, name, slots, format_size")
    .eq("name", formation ?? "4-3-3")
    .eq("format_size", validSize)
    .maybeSingle();

  if (!defaultFormation) {
    const fallback = await supabase
      .from("formations")
      .select("id, name, slots, format_size")
      .eq("name", "4-3-3")
      .eq("format_size", 11)
      .maybeSingle();
    defaultFormation = fallback.data;
  }

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

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: "StartingXI",
              alternateName: "Starting XI",
              url: "https://www.startingxi.xyz",
              inLanguage: "en-NG",
              sameAs: [
                "https://x.com/_Hoossayn",
                "https://www.instagram.com/hoosayn_10?igsh=MWQzNDRlaHVnaTJqOA==",
              ],
            },
            {
              "@type": "WebApplication",
              name: "StartingXI",
              url: "https://www.startingxi.xyz",
              applicationCategory: "SportsApplication",
              operatingSystem: "Any",
              description:
                "Free football lineup maker. Build a starting XI, export a lineup graphic, make lineup videos and run tournaments.",
              offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
            },
          ],
        }}
      />
      <SeoContent />
    </div>
  );
}
