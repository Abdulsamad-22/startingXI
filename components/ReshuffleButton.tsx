"use client";

import { useState } from "react";
import { reshuffleFixtures } from "@/app/competitions/actions";

export function ReshuffleButton({ competitionId }: { competitionId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      await reshuffleFixtures(competitionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reshuffle");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-[#1D2A25] border border-white/10 text-white text-sm rounded-lg px-4 py-2 hover:border-white/20 disabled:opacity-50"
      >
        {loading ? "Reshuffling..." : "🔀 Reshuffle Fixtures"}
      </button>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
