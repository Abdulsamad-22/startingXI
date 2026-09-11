import { useId } from "react";

export function ShieldMarker({
  color,
  number,
  photoUrl,
  size = 38,
}: {
  color: string;
  number?: number;
  photoUrl?: string | null;
  size?: number;
}) {
  const height = size * 1.1;
  const reactId = useId();
  const clipId = `shield-clip-${size}-${reactId}`;
  return (
    <svg width={size} height={height} viewBox="0 0 100 110">
      <defs>
        <clipPath id={clipId}>
          <path d="M50 2 L95 15 V55 C95 85 75 100 50 108 C25 100 5 85 5 55 V15 Z" />
        </clipPath>
      </defs>

      <path
        d="M50 2 L95 15 V55 C95 85 75 100 50 108 C25 100 5 85 5 55 V15 Z"
        fill="#0E2F21"
        stroke={color}
        strokeWidth="3"
      />

      {photoUrl && (
        <image
          href={photoUrl}
          crossOrigin="anonymous"
          x="0"
          y="0"
          width="100"
          height="110"
          clipPath={`url(#${clipId})`}
          preserveAspectRatio="xMidYMid slice"
        />
      )}

      {photoUrl ? (
        <>
          <circle
            cx="80"
            cy="95"
            r="14"
            fill={color}
            stroke="#0E2F21"
            strokeWidth="2"
          />
          <text
            x="80"
            y="100"
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#0E2F21"
          >
            {number}
          </text>
        </>
      ) : number !== undefined ? (
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
      ) : (
        <svg
          x="35"
          y="40"
          width="30"
          height="30"
          viewBox="0 0 32 32"
          fill="none"
        >
          <path
            d="M31.064 10.576C31.304 10.576 31.496 10.672 31.64 10.864C31.832 11.008 31.928 11.2 31.928 11.44V19.936C31.928 20.176 31.832 20.392 31.64 20.584C31.496 20.728 31.304 20.8 31.064 20.8H21.92C21.68 20.8 21.56 20.92 21.56 21.16V30.232C21.56 30.472 21.464 30.688 21.272 30.88C21.128 31.024 20.936 31.096 20.696 31.096H12.272C12.032 31.096 11.816 31.024 11.624 30.88C11.48 30.688 11.408 30.472 11.408 30.232V21.16C11.408 20.92 11.288 20.8 11.048 20.8H1.83197C1.59197 20.8 1.37597 20.728 1.18397 20.584C1.03997 20.392 0.967969 20.176 0.967969 19.936V11.44C0.967969 11.2 1.03997 11.008 1.18397 10.864C1.37597 10.672 1.59197 10.576 1.83197 10.576H11.048C11.288 10.576 11.408 10.456 11.408 10.216V1C11.408 0.76 11.48 0.568 11.624 0.423999C11.816 0.231998 12.032 0.135998 12.272 0.135998H20.696C20.936 0.135998 21.128 0.231998 21.272 0.423999C21.464 0.568 21.56 0.76 21.56 1V10.216C21.56 10.456 21.68 10.576 21.92 10.576H31.064Z"
            fill={color}
          />
        </svg>
      )}
    </svg>
  );
}
