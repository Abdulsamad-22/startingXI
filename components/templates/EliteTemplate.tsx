"use client";

import { useLineupStore } from "@/lib/store/lineupStore";

export function EliteTemplate({ children }: { children: React.ReactNode }) {
  const { teamName, formationName, crestUrl, crestFile, primaryColor } =
    useLineupStore();
  const crestSrc = crestFile ? URL.createObjectURL(crestFile) : crestUrl;

  return (
    <div className="relative bg-[#0E2F21] rounded-xl overflow-hidden flex-col p-4">
      {/* faint tactical sketch background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none"
        viewBox="0 0 400 600"
      >
        <path
          d="M40 500 Q 200 300 360 500"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M60 100 L 340 80"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4 6"
        />
        <circle
          cx="80"
          cy="90"
          r="4"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        />
        <path
          d="M300 120 L 340 90 L 320 140 Z"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        />
      </svg>

      {/* corner pin accents */}
      <div
        className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: primaryColor }}
      />

      {/* wordmark */}
      <div className="relative flex items-center justify-center shrink-0 mb-1">
        {crestSrc && (
          <img
            src={crestSrc}
            crossOrigin="anonymous"
            alt=""
            className="w-10 h-10 rounded-full object-cover absolute left-4"
          />
        )}

        <div className="relative flex flex-col items-center">
          <svg viewBox="0 0 240 50" className="w-48 -mb-2">
            <path id="arc" d="M 10 45 Q 120 -5 230 45" fill="transparent" />
            <text
              fill={primaryColor}
              fontSize="15"
              fontWeight="700"
              letterSpacing="4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <textPath href="#arc" startOffset="50%" textAnchor="middle">
                STARTING
              </textPath>
            </text>
          </svg>
          <span
            className="text-5xl font-black leading-none tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            XI
          </span>
        </div>

        <span className="absolute right-4 text-[10px] font-bold uppercase text-white/50 border border-white/20 rounded-full px-2 py-1">
          {formationName}
        </span>
      </div>

      <p className="relative text-center text-sm font-semibold text-white/80 uppercase tracking-wide mb-3 shrink-0">
        {teamName}
      </p>

      <div className="relative">{children}</div>
    </div>
  );
}
