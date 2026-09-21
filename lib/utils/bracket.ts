// Classic bracket vertical rhythm: each round's matches are spaced at
// baseHeight * 2^roundIndex apart, with the first match offset by half
// that spacing minus half a match height — this makes every match in
// round N+1 sit vertically centered between the two matches in round N
// that feed into it.
export function getMatchSpacing(roundIndex: number, baseHeight: number) {
  const spacing = baseHeight * Math.pow(2, roundIndex);
  const topOffset = roundIndex === 0 ? 0 : spacing / 2 - baseHeight / 2;
  return { spacing, topOffset };
}
