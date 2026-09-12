import { createClient } from "@/lib/supabase/server";

export type LineupPlayer = {
  id: string;
  name: string;
  jersey_number: number;
  photo_url: string | null;
  position_group: string;
};

export type Assignment = {
  slot_index: number | null;
  is_starting: boolean;
  sub_order: number | null;
  player: LineupPlayer;
};

export async function getLineupAssignments(
  lineupId: string,
): Promise<Assignment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lineup_players")
    .select(
      "slot_index, is_starting, sub_order, player:players(id, name, jersey_number, photo_url, position_group)",
    )
    .eq("lineup_id", lineupId);

  if (error) throw error;

  // Supabase types this join as an array even though it's a single-row
  // relation — flatten it here so every consumer gets one clean object.
  return (data ?? []).map((row) => ({
    slot_index: row.slot_index,
    is_starting: row.is_starting,
    sub_order: row.sub_order,
    player: Array.isArray(row.player) ? row.player[0] : row.player,
  })) as Assignment[];
}
