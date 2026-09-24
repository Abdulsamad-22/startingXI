"use client";

import { useState } from "react";
import { confirmResult } from "@/app/competitions/actions";
import { Check } from "lucide-react";

export function ScoreEntryForm({
  competitionId,
  fixtureId,
  isCup,
}: {
  competitionId: string;
  fixtureId: string;
  isCup: boolean;
}) {
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [homePens, setHomePens] = useState("");
  const [awayPens, setAwayPens] = useState("");
  const [error, setError] = useState<string | null>(null);

  const showPenalties =
    isCup && homeScore !== "" && awayScore !== "" && homeScore === awayScore;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await confirmResult(
        competitionId,
        fixtureId,
        Number(homeScore),
        Number(awayScore),
        showPenalties ? Number(homePens) : undefined,
        showPenalties ? Number(awayPens) : undefined,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm result");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1">
        <input
          value={homeScore}
          onChange={(e) => setHomeScore(e.target.value)}
          type="number"
          min={0}
          required
          className="no-spinner w-10 bg-[#0A1A14] rounded px-1 py-1 text-center text-sm outline-none focus:ring-2 focus:ring-[#3CEFA1]"
        />
        <span className="text-white/30">–</span>
        <input
          value={awayScore}
          onChange={(e) => setAwayScore(e.target.value)}
          type="number"
          min={0}
          required
          className="no-spinner w-10 bg-[#0A1A14] rounded px-1 py-1 text-center text-sm outline-none focus:ring-2 focus:ring-[#3CEFA1]"
        />
        <button type="submit" className="text-xs text-[#3CEFA1] ml-1">
          <Check size={16} />
        </button>
      </div>

      {showPenalties && (
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-white/40">Pens</span>
          <input
            value={homePens}
            onChange={(e) => setHomePens(e.target.value)}
            type="number"
            min={0}
            required
            className="no-spinner w-10 bg-[#0E2F21] rounded px-1 py-1 text-center text-xs"
          />
          <span className="text-white/30 text-xs">–</span>
          <input
            value={awayPens}
            onChange={(e) => setAwayPens(e.target.value)}
            type="number"
            min={0}
            required
            className="no-spinner w-10 bg-[#0E2F21] rounded px-1 py-1 text-center text-xs"
          />
        </div>
      )}

      {error && <p className="text-[10px] text-red-400">{error}</p>}
    </form>
  );
}
