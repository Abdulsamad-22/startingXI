"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteTeam } from "@/app/teams/action";
import { useRouter } from "next/navigation";

export function TeamListRow({ team }: { team: { id: string; name: string } }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setDeleting(true);
    await deleteTeam(team.id);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center justify-between bg-[#343a38] rounded-lg px-4 py-3">
        <span className="text-sm text-white/70">
          Delete "{team.name}"? This can't be undone.
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-400 text-sm font-semibold hover:text-red-300 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="text-white/40 text-sm hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-[#343a38] rounded-lg px-4 py-3 hover:bg-[#1D2A25]/70 transition-colors">
      <Link href={`/teams/${team.id}`} className="flex-1">
        {team.name}
      </Link>
      <button
        onClick={() => setConfirming(true)}
        className="text-white/30 hover:text-red-400 transition-colors text-sm ml-3"
      >
        Delete
      </button>
    </div>
  );
}
