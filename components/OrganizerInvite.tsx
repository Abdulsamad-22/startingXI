"use client";

import { useState } from "react";
import { createOrganizerInvite } from "@/app/competitions/actions";

export function OrganizerInvite({ competitionId }: { competitionId: string }) {
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setError(null);
    try {
      const token = await createOrganizerInvite(competitionId);
      setLink(`${location.origin}/competitions/invite/${token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invite");
    }
  }

  async function handleCopy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Could not copy — try selecting and copying the link manually");
    }
  }

  return (
    <div className="bg-[#343a38] rounded-lg p-3">
      <button
        onClick={handleGenerate}
        className="text-sm text-[#3CEFA1] font-semibold"
      >
        + Generate organizer invite link
      </button>
      {link && (
        <div className="mt-2 flex items-center gap-2 bg-[#0E2F21] rounded px-2 py-1.5">
          <p className="text-xs text-white/60 mt-2 break-all bg-[#0E2F21] rounded px-2 py-1.5">
            {link}
          </p>

          <button
            onClick={handleCopy}
            className="shrink-0 text-xs font-semibold text-[#3CEFA1] hover:text-[#3CEFA1]/70"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
