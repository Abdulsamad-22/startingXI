import styles from "./Select.module.css";

export function Select({
  name,
  options,
  defaultValue,
  ariaLabel,
  onChange,
}: {
  name: string;
  options: readonly string[];
  defaultValue?: string;
  ariaLabel?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <select
      name={name}
      id={name}
      aria-label={ariaLabel ?? name}
      defaultValue={defaultValue}
      onChange={(e) => onChange?.(e.target.value)}
      className={styles.select}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
