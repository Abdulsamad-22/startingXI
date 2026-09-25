"use client";

import { useLineupStore } from "@/lib/store/lineupStore";

export function StadiumTemplate({ children }: { children: React.ReactNode }) {
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

  return (
    <div
      className="relative p-4 rounded-xl overflow-hidden"
      style={{
        background: `radial-gradient(circle at 30% 0%, ${primaryColor}33, #0E2F21 70%)`,
      }}
    >
      <span
        className="absolute top-14 right-2 text-[80px] font-black uppercase leading-none pointer-events-none select-none"
        style={{ color: `${primaryColor}14` }}
      >
        {formationName}
      </span>

      <div className="relative mb-3 flex items-start gap-3">
        {crestSrc && (
          <img
            src={crestSrc}
            crossOrigin="anonymous"
            alt=""
            className="w-14 h-14 rounded-full object-cover shrink-0"
            style={{ border: `2px solid ${primaryColor}` }}
          />
        )}
        <div>
          <h2
            className="font-heading text-3xl font-black uppercase max-w-[320px] truncate leading-none"
            style={{ textShadow: `0 0 20px ${primaryColor}55` }}
          >
            {teamName}
          </h2>
          {displayCoach && coachName && (
            <p className="text-sm text-white/50 mt-1">Coach: {coachName}</p>
          )}
          <p className="font-bold mt-1" style={{ color: primaryColor }}>
            {formationName}
          </p>
        </div>
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}
