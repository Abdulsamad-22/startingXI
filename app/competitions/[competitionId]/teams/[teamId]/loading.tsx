import { Skeleton } from "@/components/ui/Skeleton";
import { BackButton } from "@/components/BackButton";

export default function Loading() {
  return (
    <div
      className="min-h-screen bg-[#555958] text-white p-6
        [--skeleton-base:rgb(0_0_0/0.18)] [--skeleton-shine:rgb(255_255_255/0.14)]"
    >
      <BackButton href="/competitions" label="Back" />

      {/* team name + NextTeamButton */}
      <div className="mb-1 flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-28" />
      </div>
      <Skeleton className="mb-6 h-4 w-32" />

      {/* SquadCsvImport */}
      <Skeleton className="mb-6 h-24 w-full rounded-xl" />

      {/* CompetitionSquadForm: same card + wrapping row as the real form */}
      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-xl bg-[#343a38] p-4">
        <Skeleton className="h-10 w-44" /> {/* player name */}
        <Skeleton className="h-10 w-20" /> {/* No. */}
        <Skeleton className="h-10 w-32" /> {/* position select */}
        <Skeleton className="h-9 w-56" /> {/* file input */}
        <Skeleton className="h-9 w-28" /> {/* Add Player */}
      </div>

      {/* player rows */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => {
          const delay = { animationDelay: `${i * 80}ms` };
          return (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg bg-[#343a38] px-4 py-3"
            >
              <Skeleton className="h-10 w-10 rounded-full" style={delay} />
              <Skeleton className="h-8 w-8 rounded-full" style={delay} />
              <Skeleton className="h-4 flex-1 max-w-48" style={delay} />
              <div className="ml-auto flex items-center gap-4">
                <Skeleton className="h-3 w-10" style={delay} />
                <Skeleton className="h-4 w-14" style={delay} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
