import { useLineupStore } from "@/lib/store/lineupStore";

export function PitchHeader() {
  const { teamName, coachName, displayCoach, formationId, formationName } =
    useLineupStore();
  return (
    <div className="mb-3">
      <h2 className="text-2xl font-black uppercase">{teamName}</h2>
      {displayCoach && coachName && (
        <p className="text-sm text-white/60">Coach: {coachName}</p>
      )}
      <p className="text-[#3CEFA1] font-bold">{formationName}</p>
    </div>
  );
}
