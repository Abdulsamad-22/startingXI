"use client";

import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import gsap from "gsap";
import { useLineupStore } from "@/lib/store/lineupStore";
import { POSITION_GROUPS } from "@/lib/types";
import { PitchMarkings } from "./PitchMarkings";
import { ShieldMarker } from "./markers/ShieldMarker";
import { JerseyMarker } from "./markers/JerseyMarker";
import { CircleMarker } from "./markers/CircleMarker";
import { PitchTexture } from "./PitchTexture";

function SizeFrameIcon({ id }: { id: "story" | "square" | "landscape" }) {
  const dims = {
    story: { w: 10, h: 18 },
    square: { w: 14, h: 14 },
    landscape: { w: 18, h: 10 },
  }[id];

  return (
    <div
      className="border-2 border-current rounded-[2px]"
      style={{ width: dims.w, height: dims.h }}
    />
  );
}

export function AnimatedRevealModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    slots,
    players,
    markerStyle,
    primaryColor,
    teamName,
    formationName,
    jerseyColor,
    jerseySleeveColor,
    jerseyCollarColor,
    jerseyNumberColor,
    gkJerseyColor,
    gkNumberColor,
    pitchPattern,
    pitchBgColor,
    pitchStripeColor,
    pitchLineColor,
  } = useLineupStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [playKey, setPlayKey] = useState(0);
  const [rendering, setRendering] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [markerSize, setMarkerSize] = useState(38);
  const SIZE_OPTIONS = [
    { id: "story" as const, label: "Story", ratio: "9:16" },
    { id: "square" as const, label: "Square", ratio: "1:1" },
    { id: "landscape" as const, label: "Landscape", ratio: "16:9" },
  ];

  const [activeSize, setActiveSize] = useState<
    "story" | "square" | "landscape"
  >("story");

  const starters = players
    .filter((p) => p.is_starting && p.slot_index !== null)
    .sort(
      (a, b) =>
        POSITION_GROUPS.indexOf(a.position_group as any) -
        POSITION_GROUPS.indexOf(b.position_group as any),
    );

  useEffect(() => {
    if (!open || !containerRef.current) return;

    // wait one frame so the Dialog's content and marker divs are fully mounted/painted
    const raf = requestAnimationFrame(() => {
      const markerEls = containerRef.current?.querySelectorAll(
        "[data-reveal-marker]",
      );
      if (!markerEls || markerEls.length === 0) return;

      gsap.set(markerEls, { opacity: 0, scale: 0.4, y: -24 });

      const tl = gsap.timeline();
      markerEls.forEach((el, i) => {
        tl.to(
          el,
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(2.5)" },
          i * 0.7,
        );
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [open, playKey]);

  async function handleDownload() {
    if (!videoUrl) return;
    const res = await fetch(videoUrl);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${teamName.replace(/\s+/g, "-").toLowerCase()}-reveal.mp4`;
    link.click();

    URL.revokeObjectURL(blobUrl);
  }

  async function handleRenderVideo() {
    setRendering(true);
    setRenderError(null);
    try {
      const res = await fetch("/api/render-reveal", {
        method: "POST",
        body: JSON.stringify({
          teamId: useLineupStore.getState().teamId,
          teamName,
          formationName,
          primaryColor: jerseyColor,
          pitchPattern,
          pitchBgColor,
          pitchStripeColor,
          pitchLineColor,
          sizePreset: activeSize,
          players: starters.map((p) => {
            const slot = slots.find((s) => s.slot_index === p.slot_index);
            return {
              id: p.id,
              name: p.name,
              jersey_number: p.jersey_number,
              photo_url: p.photo_url,
              slot_x: slot?.x ?? 50,
              slot_y: slot?.y ?? 50,
            };
          }),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err.error || `Request failed with status ${res.status}`,
        );
      }

      const data = await res.json();
      setVideoUrl(data.url);
    } catch (err) {
      setRenderError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setRendering(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1D2A25] rounded-xl p-4 z-50 max-h-[90vh] overflow-y-auto">
          <p className="text-sm text-white/60 mb-4 text-center">
            {teamName} — {formationName}
          </p>

          <div className="flex flex-col mb-2">
            <p className="text-[0.75rem] text-white/40 mb-1">Size</p>
            <div className="flex gap-2">
              {SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setActiveSize(opt.id);
                    setVideoUrl(null);
                  }}
                  className={`flex flex-col items-center justify-center gap-2 px-2.5 py-2 rounded-lg border transition-colors ${
                    activeSize === opt.id
                      ? "border-[#3CEFA1] bg-[#3CEFA1]/10 text-[#3CEFA1]"
                      : "border-white/10 text-white/50"
                  }`}
                >
                  <SizeFrameIcon id={opt.id} />
                  {/* <div className="text-left leading-tight">
                  <div className="text-[11px] font-medium">{opt.label}</div>
                  <div className="text-[9px] opacity-70">{opt.ratio}</div>
                </div> */}
                </button>
              ))}
            </div>
          </div>

          <div
            ref={containerRef}
            className="relative w-[280px] aspect-[2/3] bg-[#0E2F21] rounded-xl overflow-hidden mx-auto"
          >
            <PitchTexture
              pattern={pitchPattern}
              bgColor={pitchBgColor}
              stripeColor={pitchStripeColor}
            />
            <PitchMarkings lineColor={pitchLineColor} />
            {starters.map((p) => {
              const slot = slots.find((s) => s.slot_index === p.slot_index);
              if (!slot) return null;
              const photo = p.photo_url ?? p.photo_preview;

              return (
                <div
                  key={p.id}
                  data-reveal-marker
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                  style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                >
                  {markerStyle === "shield" && (
                    <ShieldMarker
                      color={primaryColor}
                      number={p.jersey_number}
                      photoUrl={photo}
                    />
                  )}
                  {markerStyle === "jersey" && (
                    <JerseyMarker
                      number={p?.jersey_number}
                      photoUrl={p?.photo_url ?? p?.photo_preview}
                      isGoalkeeper={p?.position_group === "GK"}
                      jerseyColor={jerseyColor}
                      sleeveColor={jerseySleeveColor}
                      collarColor={jerseyCollarColor}
                      numberColor={jerseyNumberColor}
                      gkJerseyColor={gkJerseyColor}
                      gkNumberColor={gkNumberColor}
                      size={markerSize}
                    />
                  )}
                  {markerStyle === "circle" && (
                    <CircleMarker
                      color={primaryColor}
                      number={p.jersey_number}
                      photoUrl={photo}
                    />
                  )}
                  <span className="text-[9px] text-white/80 max-w-[60px] truncate">
                    {p.name}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setPlayKey((k) => k + 1)}
            className="w-full mt-4 bg-[#1D2A25] border border-white/10 text-white font-semibold rounded-lg py-2 text-sm hover:border-white/20"
          >
            Replay
          </button>

          <button
            onClick={handleRenderVideo}
            disabled={rendering}
            className="w-full mt-2 bg-[#3CEFA1] text-[#0E2F21] font-semibold rounded-lg py-2 text-sm disabled:opacity-50"
          >
            {rendering
              ? "Rendering video..."
              : `Download ${SIZE_OPTIONS.find((o) => o.id === activeSize)?.label} Video`}
          </button>

          {renderError && (
            <p className="text-red-400 text-xs mt-2 text-center">
              {renderError}
            </p>
          )}

          {videoUrl && (
            <button
              onClick={handleDownload}
              className="w-full text-center text-sm text-[#3CEFA1] mt-2"
            >
              Video ready — tap to download
            </button>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
