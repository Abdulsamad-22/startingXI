import { createCompetition } from "../actions";
import { Select } from "@/components/ui/Select";

export default function NewCompetitionPage() {
  return (
    <div className="min-h-screen bg-[#555958] text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-[#343a38] rounded-xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Competition
        </h1>

        <form action={createCompetition} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/60">Competition name</label>
            <input
              name="name"
              required
              className="bg-[#0a1a14] rounded-lg px-3 py-2 outline-none border border-white/10 focus:ring-2 focus:ring-[#3CEFA1] focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/60">Type</label>
            <Select
              name="type"
              required
              defaultValue="league"
              options={[
                { value: "league", label: "League" },
                { value: "cup", label: "Cup (knockout)" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/60">Format size</label>
            <Select
              name="format_size"
              required
              defaultValue="11"
              options={[5, 7, 8, 9, 11].map((n) => ({
                value: String(n),
                label: `${n}-a-side`,
              }))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/60">
              Max teams (free tier: 8)
            </label>
            <input
              name="max_teams"
              type="number"
              defaultValue={8}
              className="bg-[#0a1a14] rounded-lg px-3 py-2 outline-none border border-white/10 focus:ring-2 focus:ring-[#3CEFA1] focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/60">
              Max squad size per team
            </label>
            <input
              name="max_squad_size"
              type="number"
              defaultValue={23}
              className="bg-[#0a1a14] rounded-lg px-3 py-2 outline-none border border-white/10 focus:ring-2 focus:ring-[#3CEFA1] focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="bg-[#3CEFA1] text-[#0E2F21] font-bold rounded-lg py-3 mt-2"
          >
            Create Competition
          </button>
        </form>
      </div>
    </div>
  );
}
