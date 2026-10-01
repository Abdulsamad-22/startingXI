"use client";

import { hasUnusedAccess } from "@/app/payments/action";
import type { PaidFeature } from "@/lib/payments/pricing";
import { useLineupStore } from "@/lib/store/lineupStore";
import { useEffect, useState } from "react";
import { PaymentGate } from "./PaymentGate";

const OPTIONS: {
  id: "classic" | "broadcast" | "stadium" | "elite";
  label: string;
  feature: PaidFeature | null;
}[] = [
  { id: "classic", label: "Classic", feature: null },
  { id: "broadcast", label: "Broadcast", feature: "template_broadcast" },
  { id: "stadium", label: "Stadium", feature: "template_stadium" },
  { id: "elite", label: "Elite", feature: "template_elite" },
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

const SWATCHES = {
  classic: ClassicSwatch,
  broadcast: BroadcastSwatch,
  stadium: StadiumSwatch,
  elite: EliteSwatch,
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
    <div>
      <div className="flex gap-3 flex-wrap">
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
              disabled={paying === opt.feature}
              className={`relative flex flex-col items-center gap-1.5 p-1.5 rounded-lg border transition-colors ${
                templateId === opt.id
                  ? "border-[#3CEFA1] bg-[#3CEFA1]/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="relative">
                <Swatch color={primaryColor} />
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
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
