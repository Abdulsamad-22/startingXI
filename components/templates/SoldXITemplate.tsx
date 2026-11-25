"use client";

import { useLineupStore } from "@/lib/store/lineupStore";
import { capitalizeName } from "@/lib/utils/formatPlayerName";

export function SoldXITemplate({ children }: { children: React.ReactNode }) {
  const {
    teamName,
    coachName,
    displayCoach,
    formationName,
    crestUrl,
    crestFile,
    primaryColor,
    pitchStyle,
  } = useLineupStore();
  const crestSrc = crestFile ? URL.createObjectURL(crestFile) : crestUrl;

  // Film-grain texture (inline SVG noise, no external asset)
  const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

  return (
    <div
      className="relative p-4 rounded-xl overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 35%, ${primaryColor}55, #07102e 55%, #030816 100%)`,
      }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: grain,
          backgroundSize: "160px 160px",
          opacity: 0.35,
        }}
      />

      {/* Crest: top right */}
      {crestSrc && (
        <img
          src={crestSrc}
          crossOrigin="anonymous"
          alt=""
          className="absolute top-3 right-3 w-12 h-14 object-contain"
          style={{ filter: `drop-shadow(0 0 10px ${primaryColor}88)` }}
        />
      )}

      {/* Header */}
      <div className="relative mb-4 flex flex-col items-center text-center">
        <h2
          className="font-heading text-5xl font-black uppercase leading-none tracking-tight max-w-[300px] truncate text-white"
          style={{ textShadow: `0 0 24px ${primaryColor}77` }}
        >
          {teamName}
        </h2>

        {/* Sub-title bar */}
        <span
          className="mt-1.5 px-8 py-0.5 text-lg font-black uppercase tracking-wide text-[#0E2F21]"
          style={{
            backgroundColor: primaryColor,
            boxShadow: `0 0 14px ${primaryColor}88`,
          }}
        >
          {formationName}
        </span>
      </div>

      {/* Players */}
      <div
        className={`relative ${pitchStyle === "tilted" ? "-translate-y-8" : "translate-y-0"}`}
      >
        {children}
      </div>

      {/* Footnote */}
      {displayCoach && coachName && (
        <p className="relative mt-3 text-[12px] italic font-semibold text-white/70">
          Coach: {capitalizeName(coachName)}
        </p>
      )}
    </div>
  );
}
