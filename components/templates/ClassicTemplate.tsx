"use client";

import { useLineupStore } from "@/lib/store/lineupStore";

export function ClassicTemplate({ children }: { children: React.ReactNode }) {
  const {
    teamName,
    coachName,
    displayCoach,
    formationName,
    crestUrl,
    crestFile,
  } = useLineupStore();
  const crestSrc = crestFile ? URL.createObjectURL(crestFile) : crestUrl;

  return (
    <div className="bg-[#0E2F21] p-4 rounded-xl">
      <div className="mb-3 flex items-center gap-3">
        {crestSrc && (
          <img
            src={crestSrc}
            crossOrigin="anonymous"
            alt=""
            className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0"
          />
        )}
        <div>
          <h2 className="text-2xl font-black uppercase max-w-[320px] truncate">
            {teamName}
          </h2>
          {displayCoach && coachName && (
            <p className="text-sm text-white/60">Coach: {coachName}</p>
          )}
          <p className="text-[#3CEFA1] font-bold">{formationName}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
