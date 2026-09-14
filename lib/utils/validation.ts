export function isNumberTaken(
  players: { id: string; jersey_number: number }[],
  number: number,
  excludeId?: string,
): boolean {
  return players.some((p) => p.jersey_number === number && p.id !== excludeId);
}
