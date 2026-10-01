"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { acceptOrganizerInvite } from "@/app/competitions/actions";

export default function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "accepting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setStatus("accepting");
    try {
      await acceptOrganizerInvite(token);
      router.push("/competitions");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to accept invite");
    }
  }

  return (
    <div className="min-h-screen bg-[#0E2F21] text-white flex items-center justify-center p-6">
      <div className="text-center">
        <p className="mb-4 text-white/70">
          You've been invited to help organize a competition.
        </p>
        <button
          onClick={handleAccept}
          disabled={status === "accepting"}
          className="bg-[#3CEFA1] text-[#0E2F21] font-bold rounded-lg px-6 py-3 disabled:opacity-50"
        >
          {status === "accepting" ? "Joining..." : "Accept & Join as Organizer"}
        </button>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
}
