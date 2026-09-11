"use client";

import { useState } from "react";
import { Select } from "./ui/Select";
import { POSITION_GROUPS } from "@/lib/types";
import { addPlayerToSquad } from "@/app/teams/action";
import type { Assignment } from "@/lib/queries/lineup";

export function SquadBuilder({
  lineupId,
  assignments,
  formatSize,
}: {
  lineupId: string;
  assignments: Assignment[];
  formatSize: number;
}) {
  const [wantsStarting, setWantsStarting] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const startingCount = assignments.filter((a) => a.is_starting).length;
  const squadFull = startingCount >= formatSize;

  const sortedSquad = [...assignments].sort(
    (a, b) =>
      POSITION_GROUPS.indexOf(a.player.position_group as any) -
      POSITION_GROUPS.indexOf(b.player.position_group as any),
  );

  async function handleSubmit(formData: FormData) {
    formData.set("lineup_id", lineupId);
    formData.set("is_starting", String(wantsStarting && !squadFull));

    const result = await addPlayerToSquad(formData);

    setNotice(
      wantsStarting && !result.placedOnPitch
        ? "No open slot for that position — added to bench instead."
        : null,
    );
  }

  return (
    <div className="w-full lg:w-80 flex flex-col gap-4">
      <form
        action={handleSubmit}
        className="bg-[#1D2A25] rounded-xl p-4 flex flex-col gap-3"
      >
        <input
          name="name"
          placeholder="Player name"
          required
          className="bg-[#0E2F21] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
        />
        <div className="flex gap-3">
          <input
            name="jersey_number"
            type="number"
            min={1}
            max={99}
            required
            placeholder="No."
            className="no-spinner bg-[#0E2F21] rounded-lg px-3 py-2 w-20 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
          />
          <Select
            name="position_group"
            options={POSITION_GROUPS}
            ariaLabel="position"
          />
        </div>

        <label className="flex items-center justify-between bg-[#0E2F21] rounded-lg px-3 py-2 text-sm">
          <span>{wantsStarting && !squadFull ? "Starting" : "Bench"}</span>
          <button
            type="button"
            onClick={() => setWantsStarting((s) => !s)}
            disabled={squadFull}
            className={`w-10 h-6 rounded-full relative transition-colors ${
              wantsStarting && !squadFull ? "bg-[#3CEFA1]" : "bg-white/20"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                wantsStarting && !squadFull ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </label>

        {squadFull && (
          <p className="text-xs text-white/40">
            Starting XI is full — new players go to bench.
          </p>
        )}
        {notice && <p className="text-xs text-yellow-400">{notice}</p>}

        <button
          type="submit"
          className="bg-[#3CEFA1] text-[#0E2F21] font-semibold rounded-lg py-2 text-sm"
        >
          Add to Squad
        </button>
      </form>

      <div className="flex flex-col gap-1">
        {sortedSquad.map((a) => (
          <div
            key={a.player.id}
            className="flex items-center gap-3 bg-[#1D2A25] rounded-lg px-3 py-2 text-sm"
          >
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#3CEFA1] text-[#0E2F21] font-bold text-xs">
              {a.player.jersey_number}
            </span>
            <span className="flex-1">{a.player.name}</span>
            <span className="text-xs text-white/40">
              {a.player.position_group}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                a.is_starting
                  ? "bg-[#3CEFA1]/20 text-[#3CEFA1]"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {a.is_starting ? "Start" : "Bench"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
