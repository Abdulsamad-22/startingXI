"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { scheduleFixture } from "@/app/competitions/actions";

const DEFAULT_TIMEZONE = "Africa/Lagos";

function getDateValue(kickoffAt: string | null) {
  if (!kickoffAt) return "";

  return new Date(kickoffAt).toLocaleDateString("sv-SE", {
    timeZone: DEFAULT_TIMEZONE,
  });
}

function getTimeValue(kickoffAt: string | null) {
  if (!kickoffAt) return "";

  return new Date(kickoffAt).toLocaleTimeString("en-GB", {
    timeZone: DEFAULT_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatKickoff(kickoffAt: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: DEFAULT_TIMEZONE,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(kickoffAt));
}

export function FixtureScheduleForm({
  competitionId,
  fixtureId,
  kickoffAt,
}: {
  competitionId: string;
  fixtureId: string;
  kickoffAt: string | null;
}) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(() => getDateValue(kickoffAt));
  const [time, setTime] = useState(() => getTimeValue(kickoffAt));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!date || !time) {
      setError("Choose both a date and time");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // StartinXI currently schedules in West Africa Time.
      const kickoffAt = new Date(`${date}T${time}:00+01:00`).toISOString();

      await scheduleFixture(competitionId, fixtureId, kickoffAt);

      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save schedule");
    } finally {
      setSaving(false);
    }
  }

  async function handleClear() {
    setSaving(true);
    setError(null);

    try {
      await scheduleFixture(competitionId, fixtureId, null);
      setDate("");
      setTime("");
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not clear schedule");
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-xs text-white/45 transition-colors hover:text-[#3CEFA1]"
      >
        {kickoffAt
          ? `🗓 ${formatKickoff(kickoffAt)}`
          : "+ Set match date & time"}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="mt-2 flex flex-wrap items-center gap-2 rounded-lg bg-[#0A1A14]/60 p-2"
    >
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="rounded bg-[#1D2A25] px-2 py-1 text-xs text-white outline-none focus:ring-1 focus:ring-[#3CEFA1]"
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
        className="rounded bg-[#1D2A25] px-2 py-1 text-xs text-white outline-none focus:ring-1 focus:ring-[#3CEFA1]"
      />

      <button
        type="submit"
        disabled={saving}
        className="rounded bg-[#3CEFA1] px-2 py-1 text-xs font-semibold text-[#0E2F21] disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>

      {kickoffAt && (
        <button
          type="button"
          onClick={handleClear}
          disabled={saving}
          className="text-xs text-white/45 hover:text-red-300"
        >
          Clear
        </button>
      )}

      <button
        type="button"
        onClick={() => setEditing(false)}
        className="text-xs text-white/45 hover:text-white"
      >
        Cancel
      </button>

      {error && <p className="w-full text-xs text-red-400">{error}</p>}
    </form>
  );
}
