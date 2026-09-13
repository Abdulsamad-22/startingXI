"use client";

import { useState } from "react";
import { Select } from "./ui/Select";
import { POSITION_GROUPS } from "@/lib/types";
import { useLineupStore } from "@/lib/store/lineupStore";
import { compressImage } from "@/lib/utils/compressPlayerImage";
import { findOpenSlotForPosition } from "@/lib/utils/formation";

export function SquadBuilder({ formatSize }: { formatSize: number }) {
  const players = useLineupStore((s) => s.players);
  const addOrUpdatePlayer = useLineupStore((s) => s.addOrUpdatePlayer);

  const [name, setName] = useState("");
  const [number, setNumber] = useState<number | "">("");
  const [positionGroup, setPositionGroup] = useState<
    (typeof POSITION_GROUPS)[number]
  >(POSITION_GROUPS[0]);
  const [wantsStarting, setWantsStarting] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const startingCount = players.filter((p) => p.is_starting).length;
  const squadFull = startingCount >= formatSize;

  function sortByPosition(list: typeof players) {
    return [...list].sort(
      (a, b) =>
        POSITION_GROUPS.indexOf(a.position_group as any) -
        POSITION_GROUPS.indexOf(b.position_group as any),
    );
  }

  const starters = sortByPosition(players.filter((p) => p.is_starting));
  const subs = sortByPosition(players.filter((p) => !p.is_starting));

  const slots = useLineupStore((s) => s.slots);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (number === "") return;

    let slotIndex: number | null = null;
    let isStarting = false;

    if (wantsStarting && !squadFull) {
      slotIndex = findOpenSlotForPosition(slots, players, positionGroup);
      isStarting = slotIndex !== null; // no open slot for this position → falls back to bench
    }

    addOrUpdatePlayer({
      name,
      jersey_number: Number(number),
      position_group: positionGroup,
      photo_file: null,
      photo_preview: null,
      photo_url: null,
      is_starting: isStarting,
      slot_index: slotIndex,
    });

    setNotice(
      wantsStarting && !squadFull && !isStarting
        ? `No open ${positionGroup} slot — added to bench instead.`
        : null,
    );
    setName("");
    setNumber("");
  }

  return (
    <div className="w-full lg:w-80 flex flex-col gap-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#343A38] rounded-xl p-4 flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/60">Player Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Player name"
            required
            className="bg-[#0A1A14] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/60">Squad Number</label>
          <input
            value={number}
            onChange={(e) =>
              setNumber(e.target.value === "" ? "" : Number(e.target.value))
            }
            type="number"
            min={1}
            max={99}
            required
            placeholder="Shirt number"
            className="no-spinner bg-[#0A1A14] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/60">Position</label>
          <Select
            name="position_group"
            options={POSITION_GROUPS}
            ariaLabel="position"
            defaultValue={positionGroup}
            onChange={(value) =>
              setPositionGroup(value as (typeof POSITION_GROUPS)[number])
            }
          />
        </div>

        <label className="flex items-center justify-between bg-[#0A1A14] rounded-lg px-3 py-2 text-sm">
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
        <p className="text-xs text-white/60 uppercase tracking-wide px-1 mt-2">
          Starting XI
        </p>
        {starters.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 bg-[#343A38] rounded-lg px-3 py-2 text-sm"
          >
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#3CEFA1] text-[#0E2F21] font-bold text-xs">
              {p.jersey_number}
            </span>
            <span className="flex-1">{p.name}</span>
            <span className="text-xs text-white/40">{p.position_group}</span>
          </div>
        ))}
      </div>

      {subs.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-xs text-white/60 uppercase tracking-wide px-1 mt-2">
            Subs
          </p>
          {subs.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 bg-[#1D2A25] rounded-lg px-3 py-2 text-sm opacity-70"
            >
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-white font-bold text-xs">
                {p.jersey_number}
              </span>
              <span className="flex-1">{p.name}</span>
              <span className="text-xs text-white/40">{p.position_group}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
