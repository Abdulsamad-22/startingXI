"use client";

import { useLineupStore } from "@/lib/store/lineupStore";
import { capitalizeName } from "@/lib/utils/formatPlayerName";

export function SuperTeamTemplate({ children }: { children: React.ReactNode }) {
  const {
    teamName,
    coachName,
    displayCoach,
    formationName,
    crestUrl,
    crestFile,
    primaryColor,
  } = useLineupStore();
  const crestSrc = crestFile ? URL.createObjectURL(crestFile) : crestUrl;

  const stripes = `repeating-linear-gradient(115deg, ${primaryColor} 0 10px, transparent 10px 24px)`;

  return (
    <div
      className="relative p-4 rounded-xl overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 0%, #3a1d78, #140a30 65%, #0c061f)`,
      }}
    >
      {/* Diagonal stripes: top-left */}
      <div
        className="absolute top-0 left-0 w-44 h-44 pointer-events-none"
        style={{
          backgroundImage: stripes,
          opacity: 0.85,
          WebkitMaskImage: "linear-gradient(135deg, #000 20%, transparent 65%)",
          maskImage: "linear-gradient(135deg, #000 20%, transparent 65%)",
        }}
      />
      {/* Diagonal stripes: bottom-right */}
      <div
        className="absolute bottom-0 right-0 w-44 h-44 pointer-events-none"
        style={{
          backgroundImage: stripes,
          opacity: 0.85,
          WebkitMaskImage: "linear-gradient(315deg, #000 20%, transparent 65%)",
          maskImage: "linear-gradient(315deg, #000 20%, transparent 65%)",
        }}
      />

      {/* Header */}
      <div className="relative mb-4 flex flex-col items-center text-center">
        {crestSrc && (
          <img
            src={crestSrc}
            crossOrigin="anonymous"
            alt=""
            className="w-12 h-12 rounded-full object-cover shrink-0 mb-2"
            style={{ border: `2px solid ${primaryColor}` }}
          />
        )}

        <div className="relative">
          <h2
            className="font-heading text-5xl font-black uppercase leading-none max-w-[340px] truncate text-white"
            style={{ textShadow: `0 0 24px ${primaryColor}55` }}
          >
            {teamName}
          </h2>
          {/* Badge overlapping the title (shows formation) */}
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-px text-[12px] font-black uppercase tracking-wider text-[#0E2F21]"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 0 10px ${primaryColor}`,
            }}
          >
            {formationName}
          </span>
        </div>

        {displayCoach && coachName && (
          <p
            className="text-sm font-semibold mt-2 tracking-wide"
            style={{ color: primaryColor }}
          >
            Coach: {capitalizeName(coachName)}
          </p>
        )}
      </div>

      {/* Pitch + players */}

      <div className="relative">{children}</div>
    </div>
  );
}
