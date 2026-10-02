export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const radius = className.includes("rounded") ? "" : "rounded-lg";

  return (
    <div
      aria-hidden
      className={`skeleton ${radius} ${className}`}
      style={style}
    />
  );
}
