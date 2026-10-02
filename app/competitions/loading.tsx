import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div
      className="min-h-screen bg-[#555958] p-6
        [--skeleton-base:rgb(0_0_0/0.18)] [--skeleton-shine:rgb(255_255_255/0.14)]"
    >
      <Skeleton className="h-4 w-32 mb-4" />

      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>

      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-[52px] w-full rounded-lg"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
