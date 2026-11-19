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
import { PaymentGate } from "./PaymentGate";
import { hasUnusedAccess, verifyPayment } from "@/app/payments/action";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { capitalizeName } from "@/lib/utils/formatPlayerName";

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

const PENDING_VIDEO_RENDER_KEY = "pending-video-render";

type RevealRenderPayload = {
  teamId: string;
  teamName: string;
  formationName: string;
  primaryColor: string;
  pitchPattern: string;
  pitchBgColor: string;
  pitchStripeColor: string;
  pitchLineColor: string;
  sizePreset: "story" | "square" | "landscape";
  players: {
    id: string;
    name: string;
    jersey_number: number;
    photo_url: string | null;
    slot_x: number;
    slot_y: number;
  }[];
};

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
  const [gateOpen, setGateOpen] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [activeSize, setActiveSize] = useState<
    "story" | "square" | "landscape"
  >("story");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const resumingPaymentRef = useRef(false);

  const SIZE_OPTIONS = [
    { id: "story" as const, label: "Story", ratio: "9:16" },
    { id: "square" as const, label: "Square", ratio: "1:1" },
    { id: "landscape" as const, label: "Landscape", ratio: "16:9" },
  ];

  const starters = players
    .filter((p) => p.is_starting && p.slot_index !== null)
    .sort(
      (a, b) =>
        POSITION_GROUPS.indexOf(a.position_group as any) -
        POSITION_GROUPS.indexOf(b.position_group as any),
    );

  function createRenderPayload(): RevealRenderPayload {
    return {
      teamId: useLineupStore.getState().teamId,
      teamName,
      formationName,
      primaryColor: jerseyColor,
      pitchPattern,
      pitchBgColor,
      pitchStripeColor,
      pitchLineColor,
      sizePreset: activeSize,
      players: starters.map((player) => {
        const slot = slots.find(
          (item) => item.slot_index === player.slot_index,
        );

        return {
          id: player.id,
          name: player.name,
          jersey_number: player.jersey_number,
          photo_url: player.photo_url,
          slot_x: slot?.x ?? 50,
          slot_y: slot?.y ?? 50,
        };
      }),
    };
  }

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

  async function runRenderFlow(payload: RevealRenderPayload) {
    setRendering(true);
    setRenderError(null);

    try {
      const startRes = await fetch("/api/render-reveal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (startRes.status === 402) {
        setGateOpen(true);
        return;
      }

      if (!startRes.ok) {
        const error = await startRes.json().catch(() => ({}));
        throw new Error(error.error || "Failed to start render");
      }

      const { renderId, bucketName, sizePreset } = await startRes.json();

      let done = false;

      while (!done) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const statusRes = await fetch(
          `/api/render-reveal/status?renderId=${renderId}&bucketName=${bucketName}&sizePreset=${sizePreset}`,
        );

        if (!statusRes.ok) {
          const error = await statusRes.json().catch(() => ({}));
          throw new Error(error.error || "Render failed");
        }

        const status = await statusRes.json();

        if (status.done) {
          done = true;
          setVideoUrl(status.url);
        } else {
          setRenderProgress(status.overallProgress ?? 0);
        }
      }
    } catch (error) {
      setRenderError(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setRendering(false);
    }
  }

  async function handleRenderVideo() {
    setRenderError(null);
    setRenderProgress(0);

    const payload = createRenderPayload();
    const hasAccess = await hasUnusedAccess("video_export");

    if (!hasAccess) {
      // Preserve the exact video request across the Bachs redirect.
      sessionStorage.setItem(PENDING_VIDEO_RENDER_KEY, JSON.stringify(payload));

      setGateOpen(true);
      return;
    }

    void runRenderFlow(payload);
  }

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const reference = searchParams.get("reference");
    const feature = searchParams.get("feature");
    const resume = searchParams.get("resume");

    if (
      paymentStatus === "cancelled" &&
      feature === "video_export" &&
      resume === "video-render"
    ) {
      sessionStorage.removeItem(PENDING_VIDEO_RENDER_KEY);
      router.replace(pathname);
      return;
    }

    if (
      paymentStatus !== "success" ||
      feature !== "video_export" ||
      resume !== "video-render" ||
      !reference ||
      resumingPaymentRef.current
    ) {
      return;
    }

    const paymentReference = reference;

    resumingPaymentRef.current = true;
    let cancelled = false;

    async function waitForPayment() {
      for (let attempt = 0; attempt < 15; attempt++) {
        if (cancelled) return;

        const result = await verifyPayment(paymentReference);

        if (result.success) {
          const pendingRender = sessionStorage.getItem(
            PENDING_VIDEO_RENDER_KEY,
          );

          if (!pendingRender) {
            setRenderError(
              "Your payment was confirmed, but the video request expired. Please try again.",
            );
            router.replace(pathname);
            return;
          }

          const payload = JSON.parse(pendingRender) as RevealRenderPayload;

          sessionStorage.removeItem(PENDING_VIDEO_RENDER_KEY);
          setGateOpen(false);
          onOpenChange(true);
          router.replace(pathname);

          void runRenderFlow(payload);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setRenderError(
        "We could not confirm your payment yet. Please refresh and try again.",
      );
    }

    void waitForPayment();

    return () => {
      cancelled = true;
    };
  }, [searchParams, pathname, router, onOpenChange]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1D2A25] rounded-xl p-4 z-50 max-h-[90vh] overflow-y-auto">
          <p className="text-sm text-white/60 mb-4 text-center">
            {capitalizeName(teamName)} — {formationName}
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
            className="w-full mt-2 bg-[#3CEFA1] text-[#0E2F21] font-semibold rounded-lg py-2 text-sm disabled:opacity-50 relative overflow-hidden"
          >
            {rendering && (
              <div
                className="absolute inset-0 bg-[#0E2F21]/20 transition-all duration-300"
                style={{ width: `${renderProgress * 100}%` }}
              />
            )}
            <span className="relative">
              {rendering
                ? `Rendering... ${Math.round(renderProgress * 100)}%`
                : `Download ${SIZE_OPTIONS.find((o) => o.id === activeSize)?.label} Video`}
            </span>
          </button>

          {renderError && (
            <p className="text-red-400 text-xs mt-2 text-center">
              {renderError}
            </p>
          )}

          <PaymentGate
            feature="video_export"
            open={gateOpen}
            onOpenChange={setGateOpen}
            returnAction="video-render"
          />

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
