export function PitchMarkings() {
  return (
    <svg
      viewBox="0 0 100 150"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="none"
    >
      {/* outer boundary */}
      <rect
        x="2"
        y="2"
        width="96"
        height="146"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.4"
      />

      {/* halfway line */}
      <line
        x1="2"
        y1="75"
        x2="98"
        y2="75"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.4"
      />
      {/* center circle */}
      <circle
        cx="50"
        cy="75"
        r="10"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.4"
      />
      <circle cx="50" cy="75" r="0.6" fill="rgba(255,255,255,0.4)" />

      {/* top penalty box (opponent's end) */}
      <rect
        x="22"
        y="2"
        width="56"
        height="18"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.4"
      />
      <rect
        x="37"
        y="2"
        width="26"
        height="7"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.4"
      />
      <circle cx="50" cy="14" r="0.6" fill="rgba(255,255,255,0.4)" />
      <path
        d="M 40 20 A 10 10 0 0 0 60 20"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.4"
      />

      {/* bottom penalty box (your own end) */}
      <rect
        x="22"
        y="130"
        width="56"
        height="18"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.4"
      />
      <rect
        x="37"
        y="141"
        width="26"
        height="7"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.4"
      />
      <circle cx="50" cy="136" r="0.6" fill="rgba(255,255,255,0.4)" />
      <path
        d="M 40 130 A 10 10 0 0 1 60 130"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.4"
      />

      {/* corner arcs */}
      <path
        d="M 2 5 A 3 3 0 0 0 5 2"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.4"
      />
      <path
        d="M 95 2 A 3 3 0 0 0 98 5"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.4"
      />
      <path
        d="M 2 145 A 3 3 0 0 1 5 148"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.4"
      />
      <path
        d="M 95 148 A 3 3 0 0 1 98 145"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.4"
      />
    </svg>
  );
}
