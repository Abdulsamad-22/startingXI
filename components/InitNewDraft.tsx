"use client";

import { useEffect, useRef } from "react";
import { useLineupStore } from "@/lib/store/lineupStore";

export function InitNewDraft({
  defaultFormation,
}: {
  defaultFormation: {
    id: string;
    name: string;
    slots: any;
    format_size: number;
  };
}) {
  const hasInit = useRef(false);

  useEffect(() => {
    if (hasInit.current) return;
    hasInit.current = true;

    useLineupStore.setState({
      teamId: crypto.randomUUID(),
      lineupId: crypto.randomUUID(),
      teamName: "My Team",
      coachName: "",
      displayCoach: false,
      crestFile: null,
      crestUrl: null,
      primaryColor: "#3CEFA1",
      secondaryColor: "#1D2A25",
      formationId: defaultFormation.id,
      formationName: defaultFormation.name,
      slots: defaultFormation.slots,
      markerStyle: "shield",
      players: [],
    });
  }, [defaultFormation]);

  return null;
}
