"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCompetition } from "@/app/competitions/actions";

export function DeleteCompetitionButton({
  competitionId,
  competitionName,
}: {
  competitionId: string;
  competitionName: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await deleteCompetition(competitionId);
      router.push("/competitions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setDeleting(false);
    }
  }

  if (confirming) {
    return (
      <div className="bg-[#1D2A25] border border-red-400/30 rounded-lg p-3">
        <p className="text-sm text-white/70 mb-2">
          Delete "{competitionName}"? This removes every team, squad, and
          fixture — permanently.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-400 text-sm font-semibold hover:text-red-300 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Yes, delete it"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="text-white/40 text-sm hover:text-white"
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-white/50 hover:text-red-400 text-sm transition-colors"
    >
      Delete Competition
    </button>
  );
}
