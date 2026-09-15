"use client";

import { useLineupStore } from "@/lib/store/lineupStore";

// const OPTIONS = [
//   { id: "classic" as const, label: "Classic", desc: "Clean and minimal" },
//   { id: "broadcast" as const, label: "Broadcast", desc: "TV-style graphic" },
//   { id: "stadium" as const, label: "Stadium", desc: "Bold and atmospheric" },
// ];

const OPTIONS = [
  { id: "classic" as const, label: "Classic" },
  { id: "broadcast" as const, label: "Broadcast" },
  { id: "stadium" as const, label: "Stadium" },
];

function ClassicSwatch({ color }: { color: string }) {
  return (
    <div className="w-16 h-20 bg-[#0E2F21] rounded-md p-1.5 flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full border border-white/30" />
        <div
          className="flex-1 h-1.5 rounded-full"
          style={{ backgroundColor: color, opacity: 0.9 }}
        />
      </div>
      <div className="flex-1 rounded-sm border border-white/10" />
    </div>
  );
}

function BroadcastSwatch({ color }: { color: string }) {
  return (
    <div
      className="w-16 h-20 rounded-md overflow-hidden border"
      style={{ borderColor: `${color}55` }}
    >
      <div
        className="flex items-center gap-1 px-1.5 py-1"
        style={{ backgroundColor: color }}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-[#0E2F21]" />
        <div className="flex-1 h-1 rounded-full bg-[#0E2F21]/60" />
      </div>
      <div className="bg-[#0E2F21] h-[calc(100%-18px)]" />
    </div>
  );
}

function StadiumSwatch({ color }: { color: string }) {
  return (
    <div
      className="w-16 h-20 rounded-md p-1.5 flex flex-col gap-1 relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at 30% 0%, ${color}44, #0E2F21 70%)`,
      }}
    >
      <span
        className="absolute -top-1 -right-2 text-[26px] font-black leading-none select-none"
        style={{ color: `${color}22` }}
      >
        4-3-3
      </span>
      <div
        className="relative w-3.5 h-3.5 rounded-full border-2"
        style={{ borderColor: color }}
      />
      <div
        className="relative flex-1 h-1.5 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
      />
    </div>
  );
}

const SWATCHES = {
  classic: ClassicSwatch,
  broadcast: BroadcastSwatch,
  stadium: StadiumSwatch,
};

export function TemplatePanel() {
  const { templateId, setTemplate, primaryColor } = useLineupStore();

  return (
    <div className="flex flex-wrap gap-3">
      {OPTIONS.map((opt) => {
        const Swatch = SWATCHES[opt.id];
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTemplate(opt.id)}
            className={`flex flex-col items-center gap-1.5 p-1.5 rounded-lg border transition-colors ${
              templateId === opt.id
                ? "border-[#3CEFA1] bg-[#3CEFA1]/10"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <Swatch color={primaryColor} />
            <span className="text-[11px] text-white/60">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
