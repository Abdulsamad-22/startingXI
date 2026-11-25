"use client";

import { hasUnusedAccess } from "@/app/payments/action";
import type { PaidFeature } from "@/lib/payments/pricing";
import { useLineupStore } from "@/lib/store/lineupStore";
import { useEffect, useState } from "react";
import { PaymentGate } from "./PaymentGate";

const OPTIONS: {
  id:
    | "classic"
    | "broadcast"
    | "stadium"
    | "elite"
    | "super"
    | "sold_xi"
    | "world_cup";
  label: string;
  feature: PaidFeature | null;
}[] = [
  { id: "classic", label: "Classic", feature: null },
  { id: "broadcast", label: "Broadcast", feature: "template_broadcast" },
  { id: "stadium", label: "Stadium", feature: "template_stadium" },
  { id: "elite", label: "Elite", feature: "template_elite" },
  { id: "super", label: "Super Team", feature: "template_super" },
  { id: "sold_xi", label: "Sold XI", feature: null },
  { id: "world_cup", label: "World Cup", feature: null },
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

function EliteSwatch({ color }: { color: string }) {
  return (
    <div className="w-16 h-20 bg-[#0E2F21] rounded-md p-1.5 flex flex-col items-center justify-center gap-0.5 relative overflow-hidden">
      <div
        className="absolute top-1 left-1 w-1 h-1 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute top-1 right-1 w-1 h-1 rounded-full"
        style={{ backgroundColor: color }}
      />
      <svg viewBox="0 0 100 24" className="w-12">
        <path id="swatch-arc" d="M 4 20 Q 50 -4 96 20" fill="transparent" />
        <text fill={color} fontSize="7" fontWeight="700" letterSpacing="1">
          <textPath href="#swatch-arc" startOffset="50%" textAnchor="middle">
            STARTING
          </textPath>
        </text>
      </svg>
      <span className="text-lg font-black leading-none -mt-1 text-white">
        XI
      </span>
      <div className="w-8 h-1 rounded-full bg-white/10 mt-1" />
    </div>
  );
}

function SuperTeamSwatch({ color }: { color: string }) {
  const stripes = `repeating-linear-gradient(115deg, ${color} 0 2px, transparent 2px 5px)`;

  return (
    <div
      className="w-16 h-20 rounded-md p-1.5 flex flex-col items-center gap-1 relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 0%, #3a1d78, #140a30 70%)`,
      }}
    >
      {/* Corner stripes */}
      <div
        className="absolute top-0 left-0 w-8 h-8"
        style={{
          backgroundImage: stripes,
          WebkitMaskImage: "linear-gradient(135deg, #000 20%, transparent 70%)",
          maskImage: "linear-gradient(135deg, #000 20%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-8 h-8"
        style={{
          backgroundImage: stripes,
          WebkitMaskImage: "linear-gradient(315deg, #000 20%, transparent 70%)",
          maskImage: "linear-gradient(315deg, #000 20%, transparent 70%)",
        }}
      />

      {/* Crest */}
      <div
        className="relative w-3 h-3 rounded-full border"
        style={{ borderColor: color }}
      />

      {/* Title bar */}
      <div className="relative w-10 h-1.5 rounded-sm bg-white/90" />
      <div
        className="relative w-3 h-1 rounded-sm"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
      />

      {/* Mini pitch */}
      <div
        className="relative flex-1 w-full rounded-[2px]"
        style={{ border: `1px solid ${color}88` }}
      >
        <div
          className="absolute left-0 right-0 top-1/2 h-px"
          style={{ backgroundColor: `${color}88` }}
        />
        <div
          className="absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ border: `1px solid ${color}88` }}
        />
      </div>
    </div>
  );
}

function SoldXISwatch({ color }: { color: string }) {
  return (
    <div
      className="w-16 h-20 rounded-md p-1.5 flex flex-col items-center gap-1 relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 35%, ${color}66, #07102e 60%, #030816)`,
      }}
    >
      {/* Crest: top right */}
      <div
        className="absolute top-1 right-1 w-2.5 h-3 rounded-[2px]"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
      />

      {/* Title */}
      <div className="relative mt-0.5 w-9 h-2 rounded-[1px] bg-white/90" />
      {/* Sub-title bar */}
      <div
        className="relative w-6 h-1.5"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
      />

      {/* Player dots: 1-4-3-2-1 style cluster */}
      <div className="relative flex-1 w-full flex flex-col justify-around items-center py-0.5">
        {[1, 3, 3, 2, 1].map((n, row) => (
          <div key={row} className="flex gap-1.5">
            {Array.from({ length: n }).map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/80"
                style={{ boxShadow: `0 0 4px ${color}` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function WorldCupSwatch({ color }: { color: string }) {
  const band = (
    <>
      <div className="absolute inset-0" style={{ backgroundColor: color }} />
      <div
        className="absolute inset-y-0 right-0 w-1/2 bg-black/40"
        style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" }}
      />
    </>
  );

  return (
    <div className="w-16 h-20 rounded-md p-1.5 pt-2.5 flex flex-col items-center gap-1 relative overflow-hidden bg-black">
      {/* Top and bottom bands */}
      <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
        {band}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
        {band}
      </div>

      {/* Title */}
      <div
        className="relative w-10 h-2 rounded-[1px] bg-white"
        style={{ boxShadow: "0 0 6px rgba(255,255,255,0.6)" }}
      />

      {/* Player dots */}
      <div className="relative flex-1 w-full flex flex-col justify-around items-center py-0.5">
        {[1, 2, 2, 2, 1].map((n, row) => (
          <div key={row} className="flex gap-3">
            {Array.from({ length: n }).map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-[2px]"
                style={{ backgroundColor: row === 4 ? "#38d6c8" : "#1e3a8a" }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer: crest + date line */}
      <div className="relative flex flex-col items-center gap-0.5 mb-0.5">
        <div
          className="w-3.5 h-2.5 rounded-tl-[1px] rounded-tr-[5px]"
          style={{
            border: `1px solid ${color}`,
            backgroundColor: `${color}55`,
          }}
        />
        <div className="w-8 h-1 rounded-[1px] bg-white/80" />
      </div>
    </div>
  );
}

const SWATCHES = {
  classic: ClassicSwatch,
  broadcast: BroadcastSwatch,
  stadium: StadiumSwatch,
  elite: EliteSwatch,
  super: SuperTeamSwatch,
  sold_xi: SoldXISwatch,
  world_cup: WorldCupSwatch,
};

function LockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function TemplatePanel() {
  const {
    templateId,
    setTemplate,
    primaryColor,
    unlockedFeatures,
    setFeatureUnlocked,
  } = useLineupStore();
  const [paying, setPaying] = useState<string | null>(null);
  const [gateFeature, setGateFeature] = useState<PaidFeature | null>(null);
  const [pendingTemplateId, setPendingTemplateId] = useState<
    (typeof OPTIONS)[number]["id"] | null
  >(null);

  useEffect(() => {
    OPTIONS.forEach((opt) => {
      if (!opt.feature) return;
      hasUnusedAccess(opt.feature).then((has) =>
        setFeatureUnlocked(opt.feature!, has),
      );
    });
  }, []);

  function handleLockClick(
    feature: PaidFeature,
    templateOptionId: (typeof OPTIONS)[number]["id"],
  ) {
    setGateFeature(feature);
    setPendingTemplateId(templateOptionId);
  }

  return (
    <div className="px-4">
      <div className="grid grid-cols-3 gap-3">
        {OPTIONS.map((opt) => {
          const Swatch = SWATCHES[opt.id];
          const isLocked = !!opt.feature && !unlockedFeatures[opt.feature];

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() =>
                isLocked && opt.feature
                  ? handleLockClick(opt.feature, opt.id)
                  : setTemplate(opt.id)
              }
              disabled={!!opt.feature && paying === opt.feature}
              className={`relative flex min-w-0 flex-col items-center gap-1.5 rounded-lg border p-1.5 transition-colors ${
                templateId === opt.id
                  ? "border-[#3CEFA1] bg-[#3CEFA1]/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="relative">
                <Swatch color={primaryColor} />
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50">
                    {paying === opt.feature ? (
                      <span className="text-[10px] text-white animate-pulse">
                        ...
                      </span>
                    ) : (
                      <LockIcon />
                    )}
                  </div>
                )}
              </div>
              <span className="text-[11px] text-white/60">{opt.label}</span>
            </button>
          );
        })}
      </div>
      {gateFeature && (
        <PaymentGate
          feature={gateFeature}
          open={!!gateFeature}
          onOpenChange={(open) => !open && setGateFeature(null)}
          onSuccess={() => {
            setFeatureUnlocked(gateFeature, true);
            if (pendingTemplateId) setTemplate(pendingTemplateId);
          }}
        />
      )}
    </div>
  );
}
