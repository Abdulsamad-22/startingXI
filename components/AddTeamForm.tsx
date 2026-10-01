"use client";

import { useState } from "react";
import {
  addCompetitionTeam,
  addCompetitionTeamPaid,
} from "@/app/competitions/actions";
import { PaymentGate } from "./PaymentGate";

export function AddTeamForm({ competitionId }: { competitionId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    try {
      await addCompetitionTeam(competitionId, formData);
    } catch (err) {
      if (err instanceof Error && err.message === "PAYMENT_REQUIRED") {
        setPendingFormData(formData);
        setGateOpen(true);
      } else {
        setError(err instanceof Error ? err.message : "Failed to add team");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handlePaymentSuccess() {
    if (!pendingFormData) return;
    setLoading(true);
    try {
      await addCompetitionTeamPaid(competitionId, pendingFormData);
      setPendingFormData(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add team after payment",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#1D2A25] rounded-xl p-4 mb-6">
      <form action={handleSubmit} className="flex gap-3 items-end">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-white/60">Team name</label>
          <input
            name="name"
            required
            className="bg-[#c4c4c4] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3CEFA1]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#3CEFA1] text-[#0E2F21] font-semibold rounded-lg px-4 py-2 text-sm disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Team"}
        </button>
      </form>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

      <PaymentGate
        feature="competition_extra_team"
        open={gateOpen}
        onOpenChange={setGateOpen}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
