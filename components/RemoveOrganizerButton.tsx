"use client";

import { useState } from "react";
import { removeOrganizer } from "@/app/competitions/actions";

export function RemoveOrganizerButton({
  competitionId,
  organizerId,
}: {
  competitionId: string;
  organizerId: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function handleRemove() {
    setRemoving(true);
    await removeOrganizer(competitionId, organizerId);
    setRemoving(false);
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleRemove}
          disabled={removing}
          className="text-red-400 text-xs font-semibold hover:text-red-300 disabled:opacity-50"
        >
          {removing ? "Removing..." : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-white/40 text-xs hover:text-white"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-white/40 hover:text-red-400 text-xs transition-colors"
    >
      Remove
    </button>
  );
}
