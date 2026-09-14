"use client";

import { useLineupStore } from "@/lib/store/lineupStore";
import { PitchMarkings } from "./PitchMarkings";

export function PitchStyleSelect() {
  const { pitchStyle, setPitchStyle } = useLineupStore();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setPitchStyle("flat")}
        className={`p-1.5 rounded-lg border transition-colors ${
          pitchStyle === "flat"
            ? "border-[#3CEFA1] bg-[#3CEFA1]/10"
            : "border-white/10 hover:border-white/20"
        }`}
      >
        <div className="relative w-8 h-10 bg-[#0E2F21] rounded-sm overflow-hidden">
          <PitchMarkings />
        </div>
      </button>

      <button
        type="button"
        onClick={() => setPitchStyle("tilted")}
        className={`p-1.5 rounded-lg border transition-colors ${
          pitchStyle === "tilted"
            ? "border-[#3CEFA1] bg-[#3CEFA1]/10"
            : "border-white/10 hover:border-white/20"
        }`}
      >
        <div className="[perspective:100px] py-1">
          <div
            className="relative w-8 h-10 bg-[#0E2F21] rounded-sm overflow-hidden mx-auto"
            style={{ transform: "rotateX(35deg)" }}
          >
            <PitchMarkings />
          </div>
        </div>
      </button>
    </div>
  );
}
