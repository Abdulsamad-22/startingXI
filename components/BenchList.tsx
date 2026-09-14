"use client";

import { useLineupStore } from "@/lib/store/lineupStore";
import { useDraggable } from "@dnd-kit/core";

function DraggableBenchPlayer({
  player,
}: {
  player: { id: string; jersey_number: number; name: string };
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `bench-${player.id}`,
  });

  return (
    <p
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="text-sm text-white/90 cursor-grab active:cursor-grabbing touch-none"
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      <span className="font-semibold text-[#3CEFA1]">
        {player.jersey_number}.
      </span>{" "}
      {player.name}
    </p>
  );
}

export function BenchList() {
  const players = useLineupStore((s) => s.players);
  const subs = players.filter((p) => !p.is_starting);

  return (
    <div className="mt-4 bg-[#343a38] rounded-xl p-4">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-xs text-white/60 mb-3 uppercase tracking-wide">
          Substitutes
        </h3>
        {subs.length === 0 ? (
          <p className="text-sm text-white/30">No substitutes yet</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {subs.map((p) => (
              <DraggableBenchPlayer key={p.id} player={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
