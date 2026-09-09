"use client";

import { useLineupStore } from "@/lib/store/lineupStore";
import { ShieldMarker } from "./markers/ShieldMarker";
import { JerseyMarker } from "./markers/JerseyMarker";
import { CircleMarker } from "./markers/CircleMarker";
import type { Assignment } from "@/lib/queries/lineup";

export function BenchList({
  assignments,
  primaryColor,
  secondaryColor,
}: {
  assignments: Assignment[];
  primaryColor: string;
  secondaryColor: string;
}) {
  const markerStyle = useLineupStore((s) => s.markerStyle);

  const subs = assignments
    .filter((a) => !a.is_starting)
    .sort((a, b) => (a.sub_order ?? 0) - (b.sub_order ?? 0));

  return (
    <div className="mt-4 bg-[#1D2A25] rounded-xl p-4">
      <h3 className="text-xs text-white/60 mb-3 uppercase tracking-wide">
        Substitutes
      </h3>

      {subs.length === 0 ? (
        <p className="text-sm text-white/30">No substitutes yet</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-1">
          {subs.map((s) => (
            <div
              key={s.player.id}
              className="flex flex-col items-center gap-1 shrink-0 scale-75 -my-2"
            >
              {markerStyle === "shield" && (
                <ShieldMarker
                  color={primaryColor}
                  number={s.player.jersey_number}
                />
              )}
              {markerStyle === "jersey" && (
                <JerseyMarker
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  number={s.player.jersey_number}
                />
              )}
              {markerStyle === "circle" && (
                <CircleMarker
                  color={primaryColor}
                  number={s.player.jersey_number}
                />
              )}
              <span className="text-[10px] text-white/70 max-w-[70px] truncate">
                {s.player.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
