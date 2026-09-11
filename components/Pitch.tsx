"use client";

import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";
import { useLineupStore } from "@/lib/store/lineupStore";
import { ShieldMarker } from "./markers/ShieldMarker";
import { JerseyMarker } from "./markers/JerseyMarker";
import { CircleMarker } from "./markers/CircleMarker";
import { PlayerModal } from "./PlayerModal";
import { swapSlots } from "@/app/teams/action";
import { useState, useEffect } from "react";
import { PitchMarkings } from "./PitchMarkings";

type Assignment = {
  slot_index: number | null;
  is_starting: boolean;
  player: {
    id: string;
    name: string;
    jersey_number: number;
    photo_url: string | null;
    position_group: string;
  };
};

function DroppableSlot({
  slot,
  player,
  markerStyle,
  markerSize,
  primaryColor,
  secondaryColor,
  onOpen,
}: any) {
  const { setNodeRef } = useDroppable({ id: `slot-${slot.slot_index}` });
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({
    id: `player-${slot.slot_index}`,
    disabled: !player,
  });

  return (
    <div
      ref={setNodeRef}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
    >
      <button
        ref={setDragRef}
        {...listeners}
        {...attributes}
        onClick={() => onOpen(slot.slot_index)}
        className="flex flex-col items-center gap-1 touch-none"
        style={{
          transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
          transition: transform ? "none" : "transform 500ms ease-out",
        }}
      >
        {markerStyle === "shield" && (
          <ShieldMarker
            color={primaryColor}
            number={player?.jersey_number}
            photoUrl={player?.photo_url}
            size={markerSize}
          />
        )}
        {markerStyle === "jersey" && (
          <JerseyMarker
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            number={player?.jersey_number}
            photoUrl={player?.photo_url}
            size={markerSize}
          />
        )}
        {markerStyle === "circle" && (
          <CircleMarker
            color={primaryColor}
            number={player?.jersey_number}
            photoUrl={player?.photo_url}
            size={markerSize}
          />
        )}
        {player && (
          <span className="text-[0.75rem] text-white/80 max-w-[70px] px-3 py-0.5 rounded-[16px] border border-[#3CEFA1] truncate">
            {player.name}
          </span>
        )}
      </button>
    </div>
  );
}

export function Pitch({
  lineupId,
  assignments,
  primaryColor,
  secondaryColor,
}: {
  lineupId: string;
  assignments: Assignment[];
  primaryColor: string;
  secondaryColor: string;
}) {
  const [markerSize, setMarkerSize] = useState(40);
  const { slots, markerStyle } = useLineupStore();
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  useEffect(() => {
    function updateSize() {
      if (window.innerWidth >= 1024) setMarkerSize(64);
      else if (window.innerWidth >= 768) setMarkerSize(52);
      else setMarkerSize(40);
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const byslot = new Map(
    assignments
      .filter((a) => a.is_starting)
      .map((a) => [a.slot_index, a.player]),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromSlot = Number(String(active.id).replace("player-", ""));
    const toSlot = Number(String(over.id).replace("slot-", ""));

    await swapSlots(lineupId, fromSlot, toSlot);
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="[perspective:1200px] py-6">
        <div className="relative w-full max-w-[420px] mx-auto aspect-[2/3] max-h-[calc(100dvh-180px)] bg-[#0E2F21] rounded-xl border border-white/10 overflow-hidden">
          <PitchMarkings />
          {slots.map((slot) => (
            <DroppableSlot
              key={slot.slot_index}
              slot={slot}
              player={byslot.get(slot.slot_index)}
              markerSize={markerSize}
              markerStyle={markerStyle}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              onOpen={setActiveSlot}
            />
          ))}

          {activeSlot !== null && (
            <PlayerModal
              open={activeSlot !== null}
              onOpenChange={(open) => !open && setActiveSlot(null)}
              lineupId={lineupId}
              slotIndex={activeSlot}
              slotLabel={
                slots.find((s) => s.slot_index === activeSlot)?.label ?? ""
              }
              existingPlayer={byslot.get(activeSlot) ?? null}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          )}
        </div>
      </div>
    </DndContext>
  );
}
