"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Select } from "./ui/Select";
import { ShieldMarker } from "./markers/ShieldMarker";
import { JerseyMarker } from "./markers/JerseyMarker";
import { CircleMarker } from "./markers/CircleMarker";
import { useLineupStore } from "@/lib/store/lineupStore";
import { POSITION_GROUPS } from "@/lib/types";
import { compressImage } from "@/lib/utils/compressPlayerImage";

export function PlayerModal({
  open,
  onOpenChange,
  slotIndex,
  slotLabel,
  primaryColor,
  secondaryColor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotIndex: number;
  slotLabel: string;
  primaryColor: string;
  secondaryColor: string;
}) {
  const markerStyle = useLineupStore((s) => s.markerStyle);
  const addOrUpdatePlayer = useLineupStore((s) => s.addOrUpdatePlayer);
  const existingPlayer = useLineupStore((s) =>
    s.players.find((p) => p.is_starting && p.slot_index === slotIndex),
  );

  const [isStarting, setIsStarting] = useState(true);
  const [name, setName] = useState(existingPlayer?.name ?? "");
  const [number, setNumber] = useState(existingPlayer?.jersey_number ?? 1);
  const [photoFile, setPhotoFile] = useState<File | null>(
    existingPlayer?.photo_file ?? null,
  );
  const [preview, setPreview] = useState<string | null>(
    existingPlayer?.photo_url ?? null,
  );

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Please choose an image under 10MB");
      return;
    }
    const compressed = await compressImage(file);
    setPhotoFile(compressed);
    setPreview(URL.createObjectURL(compressed));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    addOrUpdatePlayer({
      id: existingPlayer?.id,
      name,
      jersey_number: number,
      position_group: slotLabel,
      photo_file: photoFile,
      photo_preview: preview, // added — carries the object URL into the store
      photo_url: existingPlayer?.photo_url ?? null,
      is_starting: isStarting,
      slot_index: isStarting ? slotIndex : null,
    });

    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     bg-[#1D2A25] rounded-xl p-6 w-full max-w-sm z-50
                     max-h-[85vh] overflow-y-auto"
        >
          <div className="flex bg-[#0E2F21] rounded-full p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsStarting(true)}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                isStarting ? "bg-[#3CEFA1] text-[#0E2F21]" : "text-white/60"
              }`}
            >
              Start
            </button>
            <button
              type="button"
              onClick={() => setIsStarting(false)}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                !isStarting ? "bg-[#3CEFA1] text-[#0E2F21]" : "text-white/60"
              }`}
            >
              Bench
            </button>
          </div>

          <div className="flex justify-center mb-6">
            {markerStyle === "shield" && (
              <ShieldMarker
                color={primaryColor}
                number={number}
                photoUrl={preview}
              />
            )}
            {markerStyle === "jersey" && (
              <JerseyMarker
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                number={number}
                photoUrl={preview}
              />
            )}
            {markerStyle === "circle" && (
              <CircleMarker
                color={primaryColor}
                number={number}
                photoUrl={preview}
              />
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/60">Name*</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#0E2F21] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/60">Shirt number</label>
              <input
                type="number"
                min={1}
                max={99}
                required
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
                className="no-spinner bg-[#0E2F21] rounded-lg px-3 py-2 w-24 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/60">Player image</label>
              <label className="border border-dashed border-white/20 rounded-lg py-8 text-center text-sm text-white/50 cursor-pointer hover:border-white/40 transition-colors">
                {preview ? (
                  <img
                    src={preview}
                    alt=""
                    className="w-16 h-16 rounded-full mx-auto object-cover"
                  />
                ) : (
                  "Click or drop image here"
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>

            <button
              type="submit"
              className="bg-[#3CEFA1] text-[#0E2F21] font-bold rounded-lg py-3 mt-2 hover:opacity-90"
            >
              {existingPlayer ? "Save changes" : "Add player"}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
