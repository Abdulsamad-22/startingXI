import { useLineupStore } from "@/lib/store/lineupStore";

export function PitchHeader() {
  const {
    teamName,
    coachName,
    displayCoach,
    formationName,
    crestFile,
    crestUrl,
  } = useLineupStore();

  const crestSrc = crestFile ? URL.createObjectURL(crestFile) : crestUrl;
  return (
    <div className="mb-3 flex items-center gap-3">
      {crestSrc && (
        <img
          src={crestSrc}
          crossOrigin="anonymous"
          alt=""
          className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0"
        />
      )}
      <div>
        <h2 className="text-2xl font-black uppercase">{teamName}</h2>
        {displayCoach && coachName && (
          <p className="text-sm text-white/60">Coach: {coachName}</p>
        )}
        <p className="text-[#3CEFA1] font-bold">{formationName}</p>
      </div>
    </div>
  );
}
