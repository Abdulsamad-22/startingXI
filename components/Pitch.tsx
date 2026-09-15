"use client";

import { useState, useEffect } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
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
            isGoalkeeper={player?.position_group === 'GK'}
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
          <span className="text-[0.875rem] font-medium text-white/80 max-w-[70px] spacing-medium truncate">
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
  const pitchStyle = useLineupStore((s) => s.pitchStyle);

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

  return (
    <div className={pitchStyle === "tilted" ? "[perspective:1200px] py-6" : ""}>
      <div
        className="relative w-full max-w-[420px] mx-auto aspect-[2/3] bg-[#0E2F21] rounded-xl border border-white/10 overflow-hidden"
        style={
          pitchStyle === "tilted"
            ? {
                transform: "rotateX(30deg)",
                boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
              }
            : undefined
        }
      >
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
    </div>
  );
}
