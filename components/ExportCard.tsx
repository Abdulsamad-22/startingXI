"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useLineupStore } from "@/lib/store/lineupStore";
import { saveDraft } from "@/app/teams/action";

export function ExportCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  async function handlePublish() {
    setExporting(true);
    try {
      const state = useLineupStore.getState();
      await saveDraft(state);

      if (!cardRef.current) return;
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#343A38",
      });

      const link = document.createElement("a");
      link.download = `${(state.teamName || "lineup").replace(/\s+/g, "-").toLowerCase()}-lineup.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Publish/export failed:", err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <div ref={cardRef} className="bg-[#343A38] p-4 rounded-xl">
        {children}
      </div>

      <button
        onClick={handlePublish}
        disabled={exporting}
        className="w-full bg-[#3CEFA1] text-[#0E2F21] font-bold rounded-lg py-3 mt-4 disabled:opacity-50"
      >
        {exporting ? "Saving & Generating..." : "Save & Download"}
      </button>
    </div>
  );
}
