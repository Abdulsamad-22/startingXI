import { Skeleton } from "@/components/ui/Skeleton";
import { BackButton } from "@/components/BackButton";

export default function Loading() {
  return (
    <div
      className="min-h-screen bg-[#555958] text-white p-6
        [--skeleton-base:rgb(0_0_0/0.18)] [--skeleton-shine:rgb(255_255_255/0.14)]"
    >
      <BackButton href="/competitions" label="All Competitions" />

      {/* title + subtitle */}
      <Skeleton className="mb-2 h-8 w-64" />
      <Skeleton className="mb-6 h-4 w-52" />

      {/* Fixtures / Standings / Organizers */}
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>

      {/* AddTeamForm: input + button */}
      <div className="mb-4 flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* team rows */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg bg-[#1D2A25] px-4 py-3"
          >
            <Skeleton
              className="h-5 w-32"
              style={{ animationDelay: `${i * 80}ms` }}
            />
            <Skeleton
              className="h-4 w-36"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
