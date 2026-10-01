import { useEffect, useRef } from "react";
import { useCompetitionSquadStore } from "@/lib/store/competitionSquadStore";
import { saveCompetitionSquad } from "@/app/competitions/actions";

export function useDebouncedCompetitionSave() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    const unsubscribe = useCompetitionSquadStore.subscribe((state) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        saveCompetitionSquad(state);
      }, 1500);
    });
    return () => {
      clearTimeout(timeoutRef.current);
      unsubscribe();
    };
  }, []);
}
