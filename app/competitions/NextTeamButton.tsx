"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCompetitionSquadStore } from "@/lib/store/competitionSquadStore";
import {
  saveCompetitionSquad,
  getNextIncompleteTeam,
} from "@/app/competitions/actions";

export function NextTeamButton({
  competitionId,
  currentTeamId,
}: {
  competitionId: string;
  currentTeamId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    await saveCompetitionSquad(useCompetitionSquadStore.getState());
    const nextId = await getNextIncompleteTeam(competitionId, currentTeamId);

    if (nextId) {
      router.push(`/competitions/${competitionId}/teams/${nextId}`);
    } else {
      router.push(`/competitions/${competitionId}`);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-[#3CEFA1] text-[#0E2F21] font-bold rounded-lg px-4 py-2 text-sm disabled:opacity-50"
    >
      {loading ? "Saving..." : "Save & Next Team →"}
    </button>
  );
}
