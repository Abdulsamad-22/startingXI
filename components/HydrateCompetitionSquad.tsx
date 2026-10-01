"use client";

import { useEffect, useRef } from "react";
import { useCompetitionSquadStore } from "@/lib/store/competitionSquadStore";
import { CompetitionSquadState } from "@/lib/store/competitionSquadStore";

type HydrationData = Parameters<CompetitionSquadState["hydrate"]>[0];

export function HydrateCompetitionSquad({ data }: { data: HydrationData }) {
  const hydrate = useCompetitionSquadStore((s) => s.hydrate);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;
    hydrate(data);
  }, [data, hydrate]);

  return null;
}
