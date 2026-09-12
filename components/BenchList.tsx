"use client";

import { useLineupStore } from "@/lib/store/lineupStore";

export function BenchList() {
  const players = useLineupStore((s) => s.players);
  const subs = players.filter((p) => !p.is_starting);

  return (
    <div className="mt-4 bg-[#1D2A25] rounded-xl p-4">
      <h3 className="text-xs text-white/60 mb-3 uppercase tracking-wide">
        Substitutes
      </h3>

      {subs.length === 0 ? (
        <p className="text-sm text-white/30">No substitutes yet</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {subs.map((p) => (
            <p key={p.id} className="text-sm text-white/90">
              <span className="font-semibold text-[#3CEFA1]">
                {p.jersey_number}.
              </span>{" "}
              {p.name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
