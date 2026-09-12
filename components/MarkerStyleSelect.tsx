"use client";

import { useLineupStore } from "@/lib/store/lineupStore";
import { ShieldMarker } from "./markers/ShieldMarker";
import { JerseyMarker } from "./markers/JerseyMarker";
import { CircleMarker } from "./markers/CircleMarker";
import type { MarkerStyle } from "@/lib/types";

const OPTIONS: { style: MarkerStyle; label: string }[] = [
  { style: "shield", label: "Shield" },
  { style: "jersey", label: "Jersey" },
  { style: "circle", label: "Circle" },
];

export function MarkerStyleSelect({
  primaryColor,
  secondaryColor,
}: {
  primaryColor: string;
  secondaryColor: string;
}) {
  const { markerStyle, setMarkerStyle } = useLineupStore();

  return (
    <div className="flex gap-3">
      {OPTIONS.map(({ style, label }) => (
        <button
          key={style}
          type="button"
          onClick={() => setMarkerStyle(style)}
          className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-[16px] transition-colors ${
            markerStyle === style
              ? "border-[#3CEFA1] bg-[#3CEFA1]/10"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          <div className="scale-75 -my-1">
            {style === "shield" && (
              <ShieldMarker color={primaryColor} number={9} />
            )}
            {style === "jersey" && (
              <JerseyMarker
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                number={9}
              />
            )}
            {style === "circle" && (
              <CircleMarker color={primaryColor} number={9} />
            )}
          </div>
          <span className="text-[12px] text-white/60">{label}</span>
        </button>
      ))}
    </div>
  );
}
