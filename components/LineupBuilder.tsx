"use client";

import { useEffect } from "react";
import { useLineupStore } from "@/lib/store/lineupStore";
import { FormationSelect } from "./FomationSelect";
import { Pitch } from "./Pitch";
import { BenchList } from "./BenchList";
import { SquadBuilder } from "./SquadBuilder";
import type { Assignment } from "@/lib/queries/lineup";
import { ControlBar } from "./ControlBar";

type Formation = { id: string; name: string; slots: any; format_size: number };

export function LineupBuilder({
  lineupId,
  formations,
  currentFormation,
  assignments,
  primaryColor,
  secondaryColor,
}: {
  lineupId: string;
  formations: Formation[];
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
    // <div>
    //   <div className="mb-4">
    //     <FormationSelect formations={formations} />
    //   </div>

    //   <Pitch
    //     lineupId={lineupId}
    //     assignments={assignments}
    //     primaryColor={primaryColor}
    //     secondaryColor={secondaryColor}
    //   />

    //   <BenchList assignments={assignments} />
    // </div>

    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 order-1">
        {/* <FormationSelect formations={formations} /> */}
        <ControlBar
          formations={formations}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
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
