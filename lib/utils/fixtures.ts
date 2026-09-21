// Round-robin pairing (circle method) — single leg, everyone plays everyone once
export function generateRoundRobin(teamIds: string[]) {
  const ids = [...teamIds];
  if (ids.length % 2 !== 0) ids.push("BYE"); // odd team count needs a dummy to pair against

  const rounds: { round: number; home: string; away: string }[] = [];
  const n = ids.length;

  for (let round = 0; round < n - 1; round++) {
    for (let i = 0; i < n / 2; i++) {
      const home = ids[i];
      const away = ids[n - 1 - i];
      if (home !== "BYE" && away !== "BYE") {
        rounds.push({ round: round + 1, home, away });
      }
    }
    // rotate everyone except the first fixed position
    ids.splice(1, 0, ids.pop()!);
  }

  return rounds;
}

// Single-elimination bracket with byes for non-power-of-two team counts
export function generateKnockoutBracket(teamIds: string[]) {
  const n = teamIds.length;
  const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(n)));
  const byeCount = nextPowerOfTwo - n;

  // first `byeCount` teams skip round 1 — simple, order-based; a real seeding
  // system would be more deliberate, worth revisiting later if it matters
  const byeTeams = teamIds.slice(0, byeCount);
  const playingTeams = teamIds.slice(byeCount);

  const round1: { home: string; away: string | null }[] = [];
  for (let i = 0; i < playingTeams.length; i += 2) {
    round1.push({ home: playingTeams[i], away: playingTeams[i + 1] ?? null });
  }

  return { round1, byeTeams, totalRounds: Math.log2(nextPowerOfTwo) };
}

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
