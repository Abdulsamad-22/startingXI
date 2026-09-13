"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useLineupStore } from "@/lib/store/lineupStore";
import { PlayerModal } from "./PlayerModal";
import { ShieldMarker } from "./markers/ShieldMarker";
import { JerseyMarker } from "./markers/JerseyMarker";
import { CircleMarker } from "./markers/CircleMarker";
import { PitchMarkings } from "./PitchMarkings";

function DroppableSlot({
  slot,
  player,
  markerStyle,
  primaryColor,
  secondaryColor,
  markerSize,
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
            photoUrl={player?.photo_url ?? player?.photo_preview}
            size={markerSize}
          />
        )}
        {markerStyle === "jersey" && (
          <JerseyMarker
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            number={player?.jersey_number}
            photoUrl={player?.photo_url ?? player?.photo_preview}
            size={markerSize}
          />
        )}
        {markerStyle === "circle" && (
          <CircleMarker
            color={primaryColor}
            number={player?.jersey_number}
            photoUrl={player?.photo_url ?? player?.photo_preview}
            size={markerSize}
          />
        )}
        {player && (
          <span className="text-[0.75rem] text-white/80 max-w-[70px] truncate">
            {player.name}
          </span>
        )}
      </button>
    </div>
  );
}

export function Pitch({
  primaryColor,
  secondaryColor,
}: {
  primaryColor: string;
  secondaryColor: string;
}) {
  const { slots, markerStyle, players, swapSlots } = useLineupStore();
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [markerSize, setMarkerSize] = useState(40);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // must move 8px before it counts as a drag
    }),
  );

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
    players
      .filter((p) => p.is_starting && p.slot_index !== null)
      .map((p) => [p.slot_index, p]),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromSlot = Number(String(active.id).replace("player-", ""));
    const toSlot = Number(String(over.id).replace("slot-", ""));

    swapSlots(fromSlot, toSlot);
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="relative w-full max-w-[420px] mx-auto aspect-[2/3] bg-[#0E2F21] rounded-xl border border-white/10 overflow-hidden">
        <PitchMarkings />
        {slots.map((slot) => (
          <DroppableSlot
            key={slot.slot_index}
            slot={slot}
            player={byslot.get(slot.slot_index)}
            markerStyle={markerStyle}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            markerSize={markerSize}
            onOpen={setActiveSlot}
          />
        ))}

        {activeSlot !== null && (
          <PlayerModal
            open={activeSlot !== null}
            key={activeSlot}
            onOpenChange={(open) => !open && setActiveSlot(null)}
            slotIndex={activeSlot}
            slotLabel={
              slots.find((s) => s.slot_index === activeSlot)?.label ?? ""
            }
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        )}
      </div>
    </DndContext>
  );
}
