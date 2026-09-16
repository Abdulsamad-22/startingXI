"use client";

import { IdCard, LayoutGrid, LayoutTemplate, Palette } from "lucide-react";

const TABS = [
  { id: "Team Details" as const, icon: IdCard },
  { id: "Formation" as const, icon: LayoutGrid },
  { id: "Template" as const, icon: LayoutTemplate },
  { id: "Customise" as const, icon: Palette },
];

export type Tab = (typeof TABS)[number]["id"];

export function ControlBar({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  return (
    <div className="bg-[#1D2A25] rounded-xl p-1.5 mb-4">
      <div className="flex gap-1 overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-4 sm:overflow-visible">
        {TABS.map(({ id, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`flex-1 min-w-[84px] snap-start flex flex-col items-center gap-1 py-2.5 rounded-lg transition-colors ${
                active
                  ? "bg-[#3CEFA1] text-[#0E2F21]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} strokeWidth={2.2} />
              <span className="text-[11px] font-semibold whitespace-nowrap">
                {id}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
