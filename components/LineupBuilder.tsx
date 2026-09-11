"use client";

import { useEffect } from "react";
import { useLineupStore } from "@/lib/store/lineupStore";
import { FormationSelect } from "./FomationSelect";
import { Pitch } from "./Pitch";
import { BenchList } from "./BenchList";
import { SquadBuilder } from "./SquadBuilder";
import type { Assignment } from "@/lib/queries/lineup";
import { ControlBar } from "./ControlBar";
import { ExportCard } from "./ExportCard";

type Formation = { id: string; name: string; slots: any; format_size: number };

export function LineupBuilder({
  lineupId,
  formations,
  teamName,
  currentFormation,
  assignments,
  primaryColor,
  secondaryColor,
}: {
  lineupId: string;
  formations: Formation[];
  teamName: string;
  currentFormation: Formation;
  assignments: Assignment[];
  primaryColor: string;
  secondaryColor: string;
}) {
  const setFormation = useLineupStore((s) => s.setFormation);

  useEffect(() => {
    setFormation(currentFormation.id, currentFormation.slots);
  }, [currentFormation.id]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 order-1">
        <ControlBar
          formations={formations}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />

        <ExportCard teamName={teamName} formationName={currentFormation.name}>
          <Pitch
            lineupId={lineupId}
            assignments={assignments}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
          <BenchList
            assignments={assignments}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </ExportCard>
      </div>
      <div className="order-2">
        <SquadBuilder
          lineupId={lineupId}
          assignments={assignments}
          formatSize={currentFormation.format_size}
        />
      </div>
    </div>
  );
}
