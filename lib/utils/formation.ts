type Slot = { slot_index: number; label: string };
type Assignment = { slot_index: number | null; is_starting: boolean };

export function findOpenSlotForPosition(
  slots: Slot[],
  assignments: Assignment[],
  positionGroup: string,
): number | null {
  const filledSlots = new Set(
    assignments
      .filter((a) => a.is_starting && a.slot_index !== null)
      .map((a) => a.slot_index),
  );

  const match = slots
    .filter((s) => s.label === positionGroup && !filledSlots.has(s.slot_index))
    .sort((a, b) => a.slot_index - b.slot_index)[0];

  return match ? match.slot_index : null;
}
