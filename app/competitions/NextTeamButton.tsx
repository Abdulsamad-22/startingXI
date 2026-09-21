"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCompetitionSquadStore } from "@/lib/store/competitionSquadStore";
import {
  saveCompetitionSquad,
  getNextUnvisitedTeam,
} from "@/app/competitions/actions";

function getVisitedKey(competitionId: string) {
  return `visited-teams-${competitionId}`;
}

function getVisited(competitionId: string): string[] {
  try {
    return JSON.parse(
      localStorage.getItem(getVisitedKey(competitionId)) ?? "[]",
    );
  } catch {
    return [];
  }
}

function markVisited(competitionId: string, teamId: string) {
  const visited = getVisited(competitionId);
  if (!visited.includes(teamId)) {
    localStorage.setItem(
      getVisitedKey(competitionId),
      JSON.stringify([...visited, teamId]),
    );
  }
}

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

    markVisited(competitionId, currentTeamId);
    const visited = getVisited(competitionId);
    const nextId = await getNextUnvisitedTeam(competitionId, visited);

    if (nextId) {
      router.push(`/competitions/${competitionId}/teams/${nextId}`);
    } else {
      localStorage.removeItem(getVisitedKey(competitionId)); // reset so a future visit cycle can start fresh
      router.push(`/competitions/${competitionId}`);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-[#1D2A25] border border-white/10 text-white text-sm rounded-lg px-4 py-2 hover:border-white/20 disabled:opacity-50"
    >
      {loading ? "Saving..." : "Save & Go to Another Team →"}
    </button>
  );
}
