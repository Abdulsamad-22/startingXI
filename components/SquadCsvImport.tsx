"use client";

import { useState } from "react";
import { bulkImportSquad } from "@/app/competitions/actions";

export function SquadCsvImport({
  competitionTeamId,
  competitionId,
}: {
  competitionTeamId: string;
  competitionId: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setImporting(true);

    try {
      const text = await file.text();
      const lines = text.trim().split("\n").slice(1); // skip header row

      const rows = lines
        .map((line) => {
          const [name, jersey_number, position_group] = line
            .split(",")
            .map((s) => s.trim());
          return { name, jersey_number: Number(jersey_number), position_group };
        })
        .filter((r) => r.name && !isNaN(r.jersey_number));

      if (rows.length === 0) throw new Error("No valid rows found in file");

      await bulkImportSquad(competitionTeamId, competitionId, rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  }

  return (
    <div className="bg-[#1D2A25] rounded-xl p-4">
      <p className="text-sm text-white/70 mb-2">
        Bulk import from CSV (Name, Jersey Number, Position)
      </p>
      <input
        type="file"
        accept=".csv"
        onChange={handleFile}
        disabled={importing}
        className="text-sm text-white/60"
      />
      {importing && <p className="text-xs text-white/40 mt-1">Importing...</p>}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
