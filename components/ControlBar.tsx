"use client";

import { MarkerStyleSelect } from "./MarkerStyleSelect";
import { PitchStyleSelect } from "./PitchStyleSelect";

const TABS = ["Team Details", "Formation"] as const;
export type Tab = (typeof TABS)[number];

export function ControlBar({
  activeTab,
  onTabChange,
  primaryColor,
  secondaryColor,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  primaryColor: string;
  secondaryColor: string;
}) {
  return (
    <div className="bg-[#1D2A25] rounded-[52px] p-3 mb-4">
      <div className="flex items-center justify-center gap-1 mb-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "bg-[#3CEFA1] text-[#0E2F21]"
                : "text-white/50 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 uppercase tracking-wide px-2">
            Icon
          </span>
          <MarkerStyleSelect
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 uppercase tracking-wide px-2">
            Pitch
          </span>
          <PitchStyleSelect />
        </div>
      </div>
    </div>
  );
}
