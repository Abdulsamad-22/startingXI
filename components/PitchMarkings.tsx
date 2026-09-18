export function PitchMarkings({
  lineColor = "rgba(255,255,255,0.25)",
}: {
  lineColor?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 150"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      preserveAspectRatio="none"
    >
      <rect
        x="2"
        y="2"
        width="96"
        height="146"
        fill="none"
        stroke={lineColor}
        strokeWidth="0.4"
      />
      <line
        x1="2"
        y1="75"
        x2="98"
        y2="75"
        stroke={lineColor}
        strokeWidth="0.4"
      />
      <circle
        cx="50"
        cy="75"
        r="10"
        fill="none"
        stroke={lineColor}
        strokeWidth="0.4"
      />
      <circle cx="50" cy="75" r="0.6" fill={lineColor} />
      <rect
        x="22"
        y="2"
        width="56"
        height="18"
        fill="none"
        stroke={lineColor}
        strokeWidth="0.4"
      />
      <rect
        x="37"
        y="2"
        width="26"
        height="7"
        fill="none"
        stroke={lineColor}
        strokeWidth="0.4"
      />
      <circle cx="50" cy="14" r="0.6" fill={lineColor} />
      <path
        d="M 40 20 A 10 10 0 0 0 60 20"
        fill="none"
        stroke={lineColor}
        strokeWidth="0.4"
      />
      <rect
        x="22"
        y="130"
        width="56"
        height="18"
        fill="none"
        stroke={lineColor}
        strokeWidth="0.4"
      />
      <rect
        x="37"
        y="141"
        width="26"
        height="7"
        fill="none"
        stroke={lineColor}
        strokeWidth="0.4"
      />
      <circle cx="50" cy="136" r="0.6" fill={lineColor} />
      <path
        d="M 40 130 A 10 10 0 0 1 60 130"
        fill="none"
        stroke={lineColor}
        strokeWidth="0.4"
      />
      <path
        d="M 2 5 A 3 3 0 0 0 5 2"
        fill="none"
        stroke={lineColor}
        strokeWidth="0.4"
      />
      <path
        d="M 95 2 A 3 3 0 0 0 98 5"
        fill="none"
        stroke={lineColor}
        strokeWidth="0.4"
      />
      <path
        d="M 2 145 A 3 3 0 0 1 5 148"
        fill="none"
        stroke={lineColor}
        strokeWidth="0.4"
      />
      <path
        d="M 95 148 A 3 3 0 0 1 98 145"
        fill="none"
        stroke={lineColor}
        strokeWidth="0.4"
      />
    </svg>
  );
}
