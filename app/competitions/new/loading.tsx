import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#555958] p-6
        [--skeleton-base:rgb(0_0_0/0.18)] [--skeleton-shine:rgb(255_255_255/0.14)]"
    >
      <div className="w-full max-w-sm rounded-xl bg-[#343a38] p-6 sm:max-w-md sm:p-8 lg:max-w-lg">
        <Skeleton className="mx-auto mb-6 h-8 w-56" />

        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton
                className="h-10 w-full"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            </div>
          ))}
          <Skeleton className="mt-2 h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
