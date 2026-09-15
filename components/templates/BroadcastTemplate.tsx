"use client";

import { useLineupStore } from "@/lib/store/lineupStore";

export function BroadcastTemplate({ children }: { children: React.ReactNode }) {
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
      className="bg-[#0E2F21] rounded-xl overflow-hidden"
      style={{
        border: `1px solid ${primaryColor}55`,
        boxShadow: `0 10px 40px rgba(0,0,0,0.5)`,
      }}
    >
      <div
        className="flex flex-wrap items-center gap-3 px-4 py-3"
        style={{ backgroundColor: primaryColor }}
      >
        {crestSrc && (
          <img
            src={crestSrc}
            crossOrigin="anonymous"
            alt=""
            className="w-10 h-10 rounded-full object-cover border-2 border-[#0E2F21] shrink-0"
          />
        )}
        <div className="flex-1">
          <h2 className="text-xl font-black uppercase max-w-[320px] truncate tracking-tight text-[#0E2F21]">
            {teamName}
          </h2>
          {displayCoach && coachName && (
            <p className="text-xs text-[#0E2F21]/70">Coach: {coachName}</p>
          )}
        </div>
        <span className="bg-[#0E2F21] text-white text-xs font-bold px-3 py-1 rounded-full">
          {formationName}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
