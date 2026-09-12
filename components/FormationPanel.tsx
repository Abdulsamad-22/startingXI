"use client";

import { useLineupStore } from "@/lib/store/lineupStore";
import { POSITION_GROUPS, DEFAULT_FORMATION_BY_SIZE } from "@/lib/types";
import { findOpenSlotForPosition } from "@/lib/utils/formation";

type Formation = { id: string; name: string; slots: any; format_size: number };

export function FormationPanel({
  allFormations,
}: {
  allFormations: Formation[];
}) {
  const { formationId, setFormation } = useLineupStore();
  const currentFormation = allFormations.find((f) => f.id === formationId);
  const formatSize = currentFormation?.format_size ?? 11;

  const filtered = allFormations.filter((f) => f.format_size === formatSize);

  function handleFormatSizeChange(size: number) {
    const defaultName = DEFAULT_FORMATION_BY_SIZE[size];
    const defaultForSize =
      allFormations.find(
        (f) => f.format_size === size && f.name === defaultName,
      ) ?? allFormations.find((f) => f.format_size === size); // Fallback if name is missing somehow

    if (!defaultForSize) return;

    setFormation(defaultForSize.id, defaultForSize.name, defaultForSize.slots);

    useLineupStore.setState((state) => {
      const newSlots = defaultForSize.slots as {
        slot_index: number;
        label: string;
      }[];
      const reseated: typeof state.players = [];

      const currentStarters = state.players
        .filter((p) => p.is_starting)
        .sort(
          (a, b) =>
            POSITION_GROUPS.indexOf(a.position_group as any) -
            POSITION_GROUPS.indexOf(b.position_group as any),
        );

      for (const player of currentStarters) {
        const slotIndex = findOpenSlotForPosition(
          newSlots,
          reseated,
          player.position_group,
        );
        reseated.push({
          ...player,
          is_starting: slotIndex !== null,
          slot_index: slotIndex,
        });
      }

      const untouched = state.players.filter(
        (p) => !currentStarters.some((c) => c.id === p.id),
      );

      return { players: [...reseated, ...untouched] };
    });
  }

  function handleFormationSelect(formationId: string) {
    const selected = allFormations.find((f) => f.id === formationId);
    if (selected) setFormation(selected.id, selected.name, selected.slots);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-white/60 mb-1 block">Player Count</label>
        <div className="flex gap-1 bg-[#0E2F21] rounded-lg p-1 w-fit">
          {[5, 7, 9, 11].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => handleFormatSizeChange(size)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                formatSize === size
                  ? "bg-white text-[#0E2F21]"
                  : "text-white/50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-white/60 mb-1 block">Formation</label>
        <select
          value={formationId}
          onChange={(e) => handleFormationSelect(e.target.value)}
          className="bg-[#0E2F21] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1] w-full"
        >
          {filtered.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
