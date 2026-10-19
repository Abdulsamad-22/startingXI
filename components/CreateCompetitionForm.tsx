"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCompetition } from "@/app/competitions/actions";
import { PaymentGate } from "./PaymentGate";
import { Select } from "./ui/Select";

export default function CreateCompetitionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gateOpen, setGateOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);

    const maxTeams = Number(formData.get("max_teams")) || 8;
    if (maxTeams > 8) {
      localStorage.setItem(
        "pending-competition",
        JSON.stringify(Object.fromEntries(formData.entries())),
      );

      setGateOpen(true);
      return;
    }

    setLoading(true);

    try {
      const id = await createCompetition(formData);
      router.push(`/competitions/${id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create competition",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form action={handleSubmit} className="flex flex-col gap-4">
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
          disabled={loading}
          className="bg-[#3CEFA1] text-[#0E2F21] font-bold rounded-lg py-3 mt-2 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Competition"}
        </button>

        <PaymentGate
          feature={"competition_extra_team"}
          open={gateOpen}
          onOpenChange={setGateOpen}
        />
      </form>
    </>
  );
}
