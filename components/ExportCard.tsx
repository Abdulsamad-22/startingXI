"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";

export function ExportCard({
  teamName,
  formationName,
  children,
}: {
  teamName: string;
  formationName: string;
  children: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    if (!cardRef.current) return;
    setExporting(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // sharper output than the screen's actual pixel density
        backgroundColor: "#0E2F21",
      });

      const link = document.createElement("a");
      link.download = `${teamName.replace(/\s+/g, "-").toLowerCase()}-lineup.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <div ref={cardRef} className="bg-[#343A38] p-4 rounded-xl">
        <div className="mb-3">
          <h2 className="text-xl font-bold">{teamName}</h2>
          <p className="text-sm text-[#3CEFA1]">{formationName}</p>
        </div>
        {children}
      </div>

      <button
        onClick={handleExport}
        disabled={exporting}
        className="w-full bg-[#3CEFA1] text-[#0E2F21] font-bold rounded-lg py-3 mt-4 disabled:opacity-50"
      >
        {exporting ? "Generating..." : "Download Image"}
      </button>
    </div>
  );
}
