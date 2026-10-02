import { Skeleton } from "../ui/Skeleton";
import { LineupBuilderSkeleton } from "./lineup-builder-skeletons";

export function HomeSkeleton() {
  return (
    <div
      className="min-h-screen bg-[#555958] p-6
        [--skeleton-base:rgb(0_0_0/0.18)] [--skeleton-shine:rgb(255_255_255/0.14)]"
    >
      {/* top-right buttons: Competitions + SavedTeamsButton */}
      <div className="mb-4 flex justify-end gap-2">
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      <LineupBuilderSkeleton />
    </div>
  );
}
