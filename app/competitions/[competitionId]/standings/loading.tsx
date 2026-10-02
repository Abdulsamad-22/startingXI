import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div
      className="min-h-screen bg-[#555958] text-white p-6
        [--skeleton-base:rgb(0_0_0/0.18)] [--skeleton-shine:rgb(255_255_255/0.14)]"
    >
      <Skeleton className="h-4 w-40 mb-4" />
      <Skeleton className="h-8 w-40 mb-6" />

      <table className="w-full text-sm">
        <thead>
          <tr className="text-white/40 text-left border-b border-white/10">
            <th className="py-2 w-8"></th>
            <th className="py-2">Team</th>
            <th className="py-2 text-center">P</th>
            <th className="py-2 text-center">GD</th>
            <th className="py-2 text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, i) => {
            const delay = i * 60;
            return (
              <tr key={i} className="border-b border-white/5">
                <td className="py-2">
                  <Skeleton
                    className="h-3 w-3 ml-2"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                </td>
                <td className="py-2">
                  <Skeleton
                    className="h-4 w-32"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                </td>
                <td className="py-2">
                  <Skeleton
                    className="h-4 w-5 mx-auto"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                </td>
                <td className="py-2">
                  <Skeleton
                    className="h-4 w-6 mx-auto"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                </td>
                <td className="py-2">
                  <Skeleton
                    className="h-4 w-6 mx-auto"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
