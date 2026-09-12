// lib/hooks/useDebouncedSave.ts
import { useEffect, useRef } from "react";
import { useLineupStore } from "@/lib/store/lineupStore";
import { saveDraft } from "@/app/teams/action";

export function useDebouncedSave() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    const unsubscribe = useLineupStore.subscribe((state) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        saveDraft(state);
      }, 1500);
    });
    return () => {
      clearTimeout(timeoutRef.current);
      unsubscribe();
    };
  }, []);
}
