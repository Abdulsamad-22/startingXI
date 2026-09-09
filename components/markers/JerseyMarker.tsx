export function JerseyMarker({
  primaryColor,
  secondaryColor,
  number,
  size = 48,
}: {
  primaryColor: string;
  secondaryColor: string;
  number: number;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* sleeves */}
      <path d="M20 20 L2 32 L14 50 L28 40 Z" fill={secondaryColor} />
      <path d="M80 20 L98 32 L86 50 L72 40 Z" fill={secondaryColor} />
      {/* body */}
      <path
        d="M32 15 Q50 28 68 15 L78 38 L70 95 L30 95 L22 38 Z"
        fill={primaryColor}
      />
      <text
        x="50"
        y="65"
        textAnchor="middle"
        fontSize="26"
        fontWeight="bold"
        fill="#0E2F21"
      >
        {number}
      </text>
    </svg>
  );
}
