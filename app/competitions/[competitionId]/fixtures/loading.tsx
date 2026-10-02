import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div
      className="min-h-screen bg-[#555958] text-white p-6
        [--skeleton-base:rgb(0_0_0/0.18)] [--skeleton-shine:rgb(255_255_255/0.14)]"
    >
      <Skeleton className="h-4 w-40 mb-4" />
      <Skeleton className="h-8 w-32 mb-6" />

      {Array.from({ length: 2 }).map((_, roundIdx) => (
        <div key={roundIdx} className="mb-6">
          <Skeleton className="h-3 w-24 mb-2" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, rowIdx) => {
              const delay = (roundIdx * 3 + rowIdx) * 80;
              return (
                <div
                  key={rowIdx}
                  className="bg-[#343a38] rounded-lg px-4 py-3 flex items-center gap-3"
                >
                  <div className="flex-1 flex justify-end">
                    <Skeleton
                      className="h-4 w-24"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  </div>
                  <Skeleton
                    className="h-8 w-16 rounded-md shrink-0"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                  <div className="flex-1">
                    <Skeleton
                      className="h-4 w-24"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
