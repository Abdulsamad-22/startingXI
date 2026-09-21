import { createCompetition } from "../actions";

export default function NewCompetitionPage() {
  return (
    <div className="min-h-screen bg-[#555958] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Create Competition</h1>

      <form action={createCompetition} className="flex flex-col gap-4 max-w-sm">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/60">Competition name</label>
          <input
            name="name"
            required
            className="bg-[#1D2A25] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/60">Type</label>
          <select
            name="type"
            required
            className="bg-[#1D2A25] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
          >
            <option value="league">League</option>
            <option value="cup">Cup (knockout)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/60">Format size</label>
          <select
            name="format_size"
            required
            className="bg-[#1D2A25] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
          >
            {[5, 7, 8, 9, 11].map((n) => (
              <option key={n} value={n}>
                {n}-a-side
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/60">
            Max teams (free tier: 8)
          </label>
          <input
            name="max_teams"
            type="number"
            defaultValue={8}
            className="bg-[#1D2A25] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
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
            className="bg-[#1D2A25] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
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
  );
}
