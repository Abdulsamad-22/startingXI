export function ShieldMarker({
  color,
  number,
  size = 48,
}: {
  color: string;
  number: number;
  size?: number;
}) {
  const height = size * 1.1; // matches viewBox 100x110 exactly
  return (
    <svg width={size} height={height} viewBox="0 0 100 110">
      <path
        d="M50 2 L95 15 V55 C95 85 75 100 50 108 C25 100 5 85 5 55 V15 Z"
        fill="#0E2F21"
        stroke={color}
        strokeWidth="3"
      />
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontSize="30"
        fontWeight="bold"
        fill={color}
      >
        {number}
      </text>
    </svg>
  );
}
