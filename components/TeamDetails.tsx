"use client";

import { useLineupStore } from "@/lib/store/lineupStore";
import { useState } from "react";

export function TeamDetailsForm() {
  const { teamName, coachName, displayCoach, crestUrl, setTeamDetails } =
    useLineupStore();
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  function handleCrestChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setTeamDetails({ crestFile: file });
    setLocalPreview(URL.createObjectURL(file));
  }

  const previewSrc = localPreview ?? crestUrl;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/60">Team name</label>
        <input
          value={teamName}
          onChange={(e) => setTeamDetails({ teamName: e.target.value })}
          className="bg-[#0A1A14] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/60">Coach name</label>
        <input
          value={coachName}
          onChange={(e) => setTeamDetails({ coachName: e.target.value })}
          className="bg-[#0A1A14] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
        />
      </div>

      <label className="flex items-center justify-between bg-[#0A1A14] rounded-lg px-3 py-2 text-sm">
        <span>Display coach on lineup</span>
        <button
          type="button"
          onClick={() => setTeamDetails({ displayCoach: !displayCoach })}
          className={`w-10 h-6 rounded-full relative transition-colors ${displayCoach ? "bg-[#3CEFA1]" : "bg-white/20"}`}
        >
          <span
            className={`absolute top-1 left-0 w-4 h-4 rounded-full bg-white transition-transform ${displayCoach ? "translate-x-5" : "translate-x-1"}`}
          />
        </button>
      </label>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-white/60">Club logo</label>
        <div className="flex flex-col items-left gap-3">
          <div className="w-14 h-14 rounded-full bg-[#343a38] border border-white/30 flex items-center justify-center overflow-hidden shrink-0">
            {previewSrc ? (
              <img
                src={previewSrc}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white/30 text-xs">Add logo</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleCrestChange}
            className="text-sm text-white/60 file:bg-[#3CEFA1] file:text-[#0E2F21] file:border-0 file:rounded-lg file:px-3 file:py-1.5 file:text-xs file:font-semibold"
          />
        </div>
      </div>
    </div>
  );
}
