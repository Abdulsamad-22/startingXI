"use client";

import { useEffect, useRef } from "react";
import { LineupState, useLineupStore } from "@/lib/store/lineupStore";

type HydrationData = Parameters<LineupState["hydrate"]>[0];

export function HydrateStore({ data }: { data: HydrationData }) {
  const hydrate = useLineupStore((s) => s.hydrate);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;
    hydrate(data);
  }, [data, hydrate]);

  return null;
}
