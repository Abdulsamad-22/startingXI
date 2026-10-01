"use client";

import styles from "./Select.module.css";

type Option = string | { value: string; label: string };

export function Select({
  name,
  options,
  defaultValue,
  ariaLabel,
  required,
  onChange,
}: {
  name: string;
  options: readonly Option[];
  defaultValue?: string;
  ariaLabel?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <select
      name={name}
      id={name}
      required={required}
      aria-label={ariaLabel ?? name}
      defaultValue={defaultValue}
      onChange={(e) => onChange?.(e.target.value)}
      className={styles.select}
    >
      {options.map((opt) => {
        const value = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        return (
          <option key={value} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );
}
