"use client";

import { useState } from "react";
import { useCompetitionSquadStore } from "@/lib/store/competitionSquadStore";
import { compressImage } from "@/lib/utils/compressPlayerImage";
import { POSITION_GROUPS } from "@/lib/types";
import { useDebouncedCompetitionSave } from "@/lib/hooks/useDebouncedCompetitionSave";

export function CompetitionSquadForm({
  maxSquadSize,
}: {
  maxSquadSize: number;
}) {
  useDebouncedCompetitionSave();

  const players = useCompetitionSquadStore((s) => s.players);
  const addOrUpdatePlayer = useCompetitionSquadStore(
    (s) => s.addOrUpdatePlayer,
  );
  const removePlayer = useCompetitionSquadStore((s) => s.removePlayer);

  const [name, setName] = useState("");
  const [number, setNumber] = useState<number | "">("");
  const [positionGroup, setPositionGroup] = useState<
    (typeof POSITION_GROUPS)[number]
  >(POSITION_GROUPS[0]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const squadFull = players.length >= maxSquadSize;

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setPhotoFile(compressed);
    setPreview(URL.createObjectURL(compressed));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (number === "" || squadFull) return;

    addOrUpdatePlayer({
      name,
      jersey_number: number,
      position_group: positionGroup,
      photo_file: photoFile,
      photo_preview: preview,
      photo_url: null,
    });

    setName("");
    setNumber("");
    setPhotoFile(null);
    setPreview(null);
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-[#343a38] rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-end"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Player name"
          required
          className="bg-[#0E2F21] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
        />
        <input
          value={number}
          onChange={(e) =>
            setNumber(e.target.value === "" ? "" : Number(e.target.value))
          }
          type="number"
          min={1}
          max={99}
          placeholder="No."
          required
          className="no-spinner bg-[#0E2F21] rounded-lg px-3 py-2 w-20 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
        />
        <select
          value={positionGroup}
          onChange={(e) =>
            setPositionGroup(e.target.value as (typeof POSITION_GROUPS)[number])
          }
          className="bg-[#0E2F21] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
        >
          {POSITION_GROUPS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="text-sm text-white/60"
        />
        <button
          type="submit"
          disabled={squadFull}
          className="bg-[#3CEFA1] text-[#0E2F21] font-semibold rounded-lg px-4 py-2 text-sm disabled:opacity-50"
        >
          Add Player
        </button>
      </form>

      {squadFull && (
        <p className="text-xs text-yellow-400 mb-3">
          Squad is full ({maxSquadSize}/{maxSquadSize})
        </p>
      )}

      <div className="space-y-2">
        {players.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 bg-[#343a38] rounded-lg px-4 py-3"
          >
            {(p.photo_url ?? p.photo_preview) ? (
              <img
                src={p.photo_url ?? p.photo_preview!}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/10" />
            )}
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#3CEFA1] text-[#0E2F21] font-bold text-xs">
              {p.jersey_number}
            </span>
            <span className="flex-1">{p.name}</span>
            <span className="text-xs text-white/40">{p.position_group}</span>
            <button
              onClick={() => removePlayer(p.id)}
              className="text-white/40 hover:text-red-400 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
