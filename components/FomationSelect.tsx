"use client";

import styles from "@/components/ui/Select.module.css";
import { useLineupStore } from "@/lib/store/lineupStore";

type Formation = { id: string; name: string; slots: any };

export function FormationSelect({ formations }: { formations: Formation[] }) {
  const setFormation = useLineupStore((s) => s.setFormation);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = formations.find((f) => f.id === e.target.value);
    if (selected) setFormation(selected.id, selected.name, selected.slots);
  }

  return (
    <select
      name="formation_id"
      id="formation_id"
      aria-label="formation"
      className={styles.select}
      onChange={handleChange}
      defaultValue=""
    >
      <option value="" disabled>
        Select formation
      </option>
      {formations.map((f) => (
        <option key={f.id} value={f.id}>
          {f.name}
        </option>
      ))}
    </select>
  );
}
