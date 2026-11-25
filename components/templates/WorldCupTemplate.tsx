"use client";

import { useLineupStore } from "@/lib/store/lineupStore";

export function WorldCupTemplate({ children }: { children: React.ReactNode }) {
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

  // Two-tone band: left half is primaryColor, right half is a darker shade of it
  const band = (
    <>
      <div
        className="absolute inset-0"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/2 bg-[#0C2C1E]"
        style={{ clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0 100%)" }}
      />
    </>
  );

  return (
    <div className="relative px-4 py-8 rounded-xl overflow-hidden bg-[#04140D]">
      {/* Top band */}
      <div className="absolute top-0 left-0 right-0 h-3 overflow-hidden pointer-events-none">
        {band}
      </div>
      {/* Bottom band */}
      <div className="absolute bottom-0 left-0 right-0 h-3 overflow-hidden pointer-events-none">
        {band}
      </div>

      {/* Title */}

      <div className="flex items-center justify-center max-w-[680px]">
        <h2
          className={`relative mb-4 text-center font-heading text-6xl font-black uppercase leading-none tracking-tight w-full  truncate text-white ${
            pitchStyle === "tilted" ? "translate-y-8" : "translate-y-0"
          }`}
          style={{
            textShadow: "0 0 18px rgba(255,255,255,0.55)",
          }}
        >
          {teamName}
        </h2>
      </div>

      {/* pitch & Players */}
      <div
        className={`relative ${pitchStyle === "tilted" ? "-translate-y-3" : "translate-y-0"}`}
      >
        {children}
      </div>

      {/* Footer: crest, subtitle, coach */}
      <div
        className={`relative mt-5 flex flex-col items-center text-center ${pitchStyle === "tilted" ? "gap-4" : "gap-3"}`}
      >
        {crestSrc && (
          <img
            src={crestSrc}
            crossOrigin="anonymous"
            alt=""
            className="w-16 h-11 object-cover rounded-tl-md rounded-tr-[22px]"
            style={{ border: `2px solid ${primaryColor}` }}
          />
        )}

        <p className="font-heading text-3xl font-black uppercase tracking-wide text-white leading-none">
          {formationName}
        </p>

        {displayCoach && coachName && (
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: primaryColor }}
          >
            Coach: {coachName}
          </p>
        )}
      </div>
    </div>
  );
}
