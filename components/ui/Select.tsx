import styles from "./Select.module.css";

export function Select({
  name,
  options,
  defaultValue,
  ariaLabel,
}: {
  name: string;
  options: readonly string[];
  defaultValue?: string;
  ariaLabel?: string;
}) {
  return (
    <select
      name={name}
      id={name}
      aria-label={ariaLabel ?? name}
      defaultValue={defaultValue}
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
