// components/skeletons/lineup-builder-skeleton.tsx
import { Skeleton } from "../ui/Skeleton";

export function LineupBuilderSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* left: controls + side panel + pitch */}
      <div className="flex-1 order-1">
        {/* ControlBar: tabs */}
        <div className="mb-4 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-10 w-24 rounded-full"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* SidePanel */}
          <div className="w-full md:w-64 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>

          <div className="flex-1">
            {/* ExportCard + Pitch: same padding/radius as the real card */}
            <div className="rounded-xl bg-[#343A38] p-4">
              <Skeleton className="mx-auto aspect-[3/4] w-full max-w-[420px] rounded-xl" />
            </div>

            {/* BenchList */}
            <div className="mt-4 flex gap-3 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-14 shrink-0 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* right: SquadBuilder */}
      <div className="order-2 w-full lg:w-80 space-y-3">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
