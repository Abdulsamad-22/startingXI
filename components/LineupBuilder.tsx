"use client";

import { ControlBar, type Tab } from "./ControlBar";
import { SidePanel } from "./SidePanel";
import { ExportCard } from "./ExportCard";
import { PitchHeader } from "./PitchHeader";
import { Pitch } from "./Pitch";
import { BenchList } from "./BenchList";
import { SquadBuilder } from "./SquadBuilder";
import { useState } from "react";
import { useLineupStore } from "@/lib/store/lineupStore";

type Formation = { id: string; name: string; slots: any; format_size: number };

export function LineupBuilder({
  allFormations,
}: {
  allFormations: Formation[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("Team Details");
  const { primaryColor, secondaryColor, formationId, teamName } =
    useLineupStore();

  const currentFormation = allFormations.find((f) => f.id === formationId);
  const formatSize = currentFormation?.format_size ?? 11;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 order-1">
        <ControlBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />

        <div className="flex flex-col md:flex-row gap-4">
          <SidePanel activeTab={activeTab} allFormations={allFormations} />

          <div className="flex-1">
            <ExportCard>
              <PitchHeader />
              <Pitch
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
              />
            </ExportCard>

            <BenchList />
          </div>
        </div>
      </div>

      <div className="order-2">
        <SquadBuilder formatSize={formatSize} />
      </div>
    </div>
  );
}
