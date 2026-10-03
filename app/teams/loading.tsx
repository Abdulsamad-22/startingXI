import { Skeleton } from "@/components/ui/Skeleton";
import { BackButton } from "@/components/BackButton";
import Link from "next/link";

export default function Loading() {
  return (
    <div
      className="min-h-screen bg-[#555958] text-white p-6
        [--skeleton-base:rgb(0_0_0/0.18)] [--skeleton-shine:rgb(255_255_255/0.14)]"
    >
      <BackButton href="/" label="Lineup Builder" />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Teams</h1>
        <Link
          href="/"
          className="bg-[#3CEFA1] text-[#0E2F21] font-semibold rounded-lg px-4 py-2 text-sm"
        >
          + New Team
        </Link>
      </div>

      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => {
          const delay = { animationDelay: `${i * 80}ms` };
          return (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-[#343a38] px-4 py-3"
            >
              <div className="flex h-6 flex-1 items-center">
                <Skeleton className="h-4 w-40" style={delay} />
              </div>
              <Skeleton className="ml-3 h-4 w-11" style={delay} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
