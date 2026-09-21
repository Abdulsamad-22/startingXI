import { createClient } from "@/lib/supabase/server";
import { OrganizerInvite } from "@/components/OrganizerInvite";
import { RemoveOrganizerButton } from "@/components/RemoveOrganizerButton";
import { notFound, redirect } from "next/navigation";
import { BackButton } from "@/components/BackButton";

export default async function OrganizersPage({
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
    .select("id, name, creator_id")
    .eq("id", competitionId)
    .single();

  if (!competition) notFound();
  if (competition.creator_id !== user?.id)
    redirect(`/competitions/${competitionId}`);

  const { data: organizers } = await supabase
    .from("competition_organizers")
    .select("id, user_id, created_at")
    .eq("competition_id", competitionId)
    .order("created_at");

  return (
    <div className="min-h-screen bg-[#555958] text-white p-6">
      <BackButton
        href={`/competitions/${competitionId}`}
        label="Back to Competition"
      />

      <h1 className="text-2xl font-bold mb-1">Organizers</h1>
      <p className="text-white/50 text-sm mb-6">{competition.name}</p>

      <div className="mb-6">
        <h2 className="text-xs text-white/60 uppercase tracking-wide mb-2">
          You
        </h2>
        <div className="bg-[#343a38] rounded-lg px-4 py-3 flex items-center justify-between">
          <span>Creator</span>
          <span className="text-xs text-[#3CEFA1] font-semibold">Owner</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xs text-white/60 uppercase tracking-wide mb-2">
          Co-organizers ({organizers?.length ?? 0}/2)
        </h2>

        {organizers && organizers.length > 0 ? (
          <div className="space-y-2">
            {organizers.map((o) => (
              <div
                key={o.id}
                className="bg-[#343a38] rounded-lg px-4 py-3 flex items-center justify-between"
              >
                <span className="text-sm text-white/70">Organizer</span>
                <RemoveOrganizerButton
                  competitionId={competitionId}
                  organizerId={o.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/30">No co-organizers added yet.</p>
        )}
      </div>

      {(organizers?.length ?? 0) < 2 && (
        <OrganizerInvite competitionId={competitionId} />
      )}
    </div>
  );
}
