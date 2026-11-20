"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "completed-matchday";

type CompletedMatchday = {
  competitionId: string;
  round: number;
};

export function MatchdayCompletionPrompt({
  competitionId,
}: {
  competitionId: string;
}) {
  const [round, setRound] = useState<number | null>(null);

  function dismissPrompt() {
    sessionStorage.removeItem(STORAGE_KEY);
    setRound(null);
  }

  useEffect(() => {
    function showPrompt(completed: CompletedMatchday) {
      if (completed.competitionId === competitionId) {
        setRound(completed.round);
      }
    }

    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        showPrompt(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    function handleMatchdayComplete(event: Event) {
      showPrompt((event as CustomEvent<CompletedMatchday>).detail);
    }

    window.addEventListener("matchday-complete", handleMatchdayComplete);

    return () => {
      window.removeEventListener("matchday-complete", handleMatchdayComplete);
    };
  }, [competitionId]);

  if (round === null) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#343A38] p-6 text-center shadow-2xl">
        <p className="mb-2 text-3xl">🎉</p>

        <h2 className="text-xl font-bold text-white">
          Matchday {round} complete
        </h2>

        <p className="mt-2 text-sm text-white/55">
          All Matchday {round} results have been confirmed. The current
          standings are now updated.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href={`/competitions/${competitionId}/fixtures#matchday-${round}`}
            onClick={dismissPrompt}
            className="rounded-lg bg-[#3CEFA1] px-4 py-3 text-sm font-bold text-[#0E2F21]"
          >
            View Matchday Results
          </Link>

          <Link
            href={`/competitions/${competitionId}/standings`}
            onClick={dismissPrompt}
            className="rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold text-white"
          >
            View Current Standings
          </Link>

          <button
            type="button"
            onClick={dismissPrompt}
            className="mt-1 text-sm text-white/45 transition-colors hover:text-white"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
