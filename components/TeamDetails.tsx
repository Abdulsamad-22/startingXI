"use client";

import { useLineupStore } from "@/lib/store/lineupStore";

export function TeamDetailsForm() {
  const { teamName, coachName, displayCoach, crestUrl, setTeamDetails } =
    useLineupStore();

  function handleCrestChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setTeamDetails({ crestFile: file });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/60">Team name</label>
        <input
          value={teamName}
          onChange={(e) => setTeamDetails({ teamName: e.target.value })}
          className="bg-[#0E2F21] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/60">Coach name</label>
        <input
          value={coachName}
          onChange={(e) => setTeamDetails({ coachName: e.target.value })}
          className="bg-[#0E2F21] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
        />
      </div>

      <label className="flex items-center justify-between bg-[#0E2F21] rounded-lg px-3 py-2 text-sm">
        <span>Display coach on lineup</span>
        <button
          type="button"
          onClick={() => setTeamDetails({ displayCoach: !displayCoach })}
          className={`w-10 h-6 rounded-full relative transition-colors ${displayCoach ? "bg-[#3CEFA1]" : "bg-white/20"}`}
        >
          <span
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${displayCoach ? "translate-x-5" : "translate-x-1"}`}
          />
        </button>
      </label>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/60">Club logo</label>
        {crestUrl && (
          <img
            src={crestUrl}
            alt=""
            className="w-12 h-12 rounded-full object-cover mb-1"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleCrestChange}
          className="text-sm text-white/60 file:bg-[#3CEFA1] file:text-[#0E2F21] file:border-0 file:rounded-lg file:px-3 file:py-1.5 file:text-xs file:font-semibold"
        />
      </div>
    </div>
  );
}
