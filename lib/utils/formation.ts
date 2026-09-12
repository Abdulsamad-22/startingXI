type Slot = { slot_index: number; label: string };
type StorePlayer = {
  slot_index: number | null;
  is_starting: boolean;
  position_group: string;
};

export function findOpenSlotForPosition(
  slots: Slot[],
  players: StorePlayer[],
  positionGroup: string,
): number | null {
  const filledSlots = new Set(
    players
      .filter((p) => p.is_starting && p.slot_index !== null)
      .map((p) => p.slot_index),
  );

  const match = slots
    .filter((s) => s.label === positionGroup && !filledSlots.has(s.slot_index))
    .sort((a, b) => a.slot_index - b.slot_index)[0];

  return match ? match.slot_index : null;
}
