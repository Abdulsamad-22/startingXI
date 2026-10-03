"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useLineupStore } from "@/lib/store/lineupStore";
import { saveDraft } from "@/app/teams/action";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { BroadcastTemplate } from "./templates/BroadcastTemplate";
import { StadiumTemplate } from "./templates/StadiumTemplate";
import { AnimatedRevealModal } from "./AnimatedRevealModal";
import { PaymentGate } from "./PaymentGate";
import { EliteTemplate } from "./templates/EliteTemplate";
import { PaidFeature } from "@/lib/payments/pricing";
import { waitForImagesToLoad } from "@/lib/utils/waitForImages";
import { consumeAccess, hasUnusedAccess } from "@/app/payments/action";

const TEMPLATES = {
  classic: ClassicTemplate,
  broadcast: BroadcastTemplate,
  stadium: StadiumTemplate,
  elite: EliteTemplate,
};

const TEMPLATE_FEATURE: Record<string, PaidFeature | null> = {
  classic: null,
  broadcast: "template_broadcast",
  stadium: "template_stadium",
  elite: "template_elite",
};

export function ExportCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const templateId = useLineupStore((s) => s.templateId);
  const [revealOpen, setRevealOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);

  const Template = TEMPLATES[templateId];
  const feature = TEMPLATE_FEATURE[templateId];

  async function runExport() {
    const state = useLineupStore.getState();
    await saveDraft(state);

    if (!cardRef.current) return;
    await waitForImagesToLoad(cardRef.current);
    if (document.fonts?.ready) await document.fonts.ready;

    cardRef.current.classList.add("export-freeze");
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve)); // extra settle frame

    const rect = cardRef.current.getBoundingClientRect();

    const dataUrl = await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      width: rect.width,
      height: rect.height,
      style: {
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      },
    });

    cardRef.current.classList.remove("export-freeze");

    const link = document.createElement("a");
    link.download = `${(state.teamName || "lineup").replace(/\s+/g, "-").toLowerCase()}-lineup.png`;
    link.href = dataUrl;
    link.click();
  }

  async function handlePublish() {
    setExporting(true);
    setError(null);
    try {
      if (feature) {
        const hasAccess = await hasUnusedAccess(feature);
        if (hasAccess) {
          await runExport();
          await consumeAccess(feature);
          useLineupStore.getState().setFeatureUnlocked(feature, false);
          useLineupStore.getState().setTemplate("classic");
        } else {
          setGateOpen(true);
        }
      } else {
        await runExport();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish/export failed");
    } finally {
      setExporting(false);
    }
  }

  async function handlePaymentSuccess() {
    if (!feature) return;
    setExporting(true);
    setError(null);
    try {
      useLineupStore.getState().setFeatureUnlocked(feature, true);
      await runExport();
      await consumeAccess(feature);
      useLineupStore.getState().setFeatureUnlocked(feature, false);
      useLineupStore.getState().setTemplate("classic"); // reset to free template after use
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Payment succeeded but export failed — try downloading again",
      );
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="bg-[#343A38] p-4 md:rounded-xl">
      <div ref={cardRef}>
        <Template>{children}</Template>
      </div>

      <button
        onClick={handlePublish}
        disabled={exporting}
        className="w-full bg-[#3CEFA1] text-[#0E2F21] font-bold rounded-lg py-3 mt-4 disabled:opacity-50"
      >
        {exporting ? "Processing..." : "Save & Download"}
      </button>
      {error && (
        <p className="text-red-400 text-xs mt-2 text-center">{error}</p>
      )}
      <button
        onClick={() => setRevealOpen(true)}
        className="w-full bg-[#1D2A25] border border-white/10 text-white font-semibold rounded-lg py-3 mt-2 hover:border-white/20"
      >
        Preview Animated Reveal
      </button>
      <AnimatedRevealModal open={revealOpen} onOpenChange={setRevealOpen} />

      {feature && (
        <PaymentGate
          feature={feature}
          open={gateOpen}
          onOpenChange={setGateOpen}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
