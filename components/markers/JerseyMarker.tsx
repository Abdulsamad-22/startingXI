export function JerseyMarker({
  primaryColor,
  number,
  photoUrl,
  isGoalkeeper = false,
  size = 38,
}: {
  primaryColor: string;
  number?: number;
  photoUrl?: string | null;
  isGoalkeeper?: boolean;
  size?: number;
}) {

  if (photoUrl) {
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <img
          src={photoUrl}
          crossOrigin="anonymous"
          alt=""
          className="w-full h-full rounded-full object-cover"
          style={{ border: `2px solid ${primaryColor}` }}
        />
        {number !== undefined && (
          <span
            className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full font-bold text-[10px]"
            style={{
              width: size * 0.45,
              height: size * 0.45,
              backgroundColor: primaryColor,
              color: '#0E2F21',
              border: '2px solid #0E2F21',
            }}
          >
            {number}
          </span>
        )}
      </div>
    );
  }

  const sleeveColor = isGoalkeeper ? '#FFFFFF' : '#D9DDE1';

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        {isGoalkeeper ? (
          <>
            {/* long sleeves — extend further down the arm than outfield */}
            <path d="M20 18 L0 30 L10 62 L28 48 Z" fill={sleeveColor} />
            <path d="M80 18 L100 30 L90 62 L72 48 Z" fill={sleeveColor} />
          </>
        ) : (
          <>
            {/* short sleeves */}
            <path d="M20 20 L2 32 L14 50 L28 40 Z" fill={sleeveColor} />
            <path d="M80 20 L98 32 L86 50 L72 40 Z" fill={sleeveColor} />
          </>
        )}
        <path
          d="M32 15 Q50 28 68 15 L78 38 L70 95 L30 95 L22 38 Z"
          fill={primaryColor}
        />
        {number !== undefined ? (
          <text
            x="50"
            y="65"
            textAnchor="middle"
            fontSize="35"
            fontWeight="bold"
            fill="#0E2F21"
          >
            {number}
          </text>
        ) : (
          <svg x="35" y="40" width="30" height="30" viewBox="0 0 32 32" fill="none">
            <path
              d="M31.064 10.576C31.304 10.576 31.496 10.672 31.64 10.864C31.832 11.008 31.928 11.2 31.928 11.44V19.936C31.928 20.176 31.832 20.392 31.64 20.584C31.496 20.728 31.304 20.8 31.064 20.8H21.92C21.68 20.8 21.56 20.92 21.56 21.16V30.232C21.56 30.472 21.464 30.688 21.272 30.88C21.128 31.024 20.936 31.096 20.696 31.096H12.272C12.032 31.096 11.816 31.024 11.624 30.88C11.48 30.688 11.408 30.472 11.408 30.232V21.16C11.408 20.92 11.288 20.8 11.048 20.8H1.83197C1.59197 20.8 1.37597 20.728 1.18397 20.584C1.03997 20.392 0.967969 20.176 0.967969 19.936V11.44C0.967969 11.2 1.03997 11.008 1.18397 10.864C1.37597 10.672 1.59197 10.576 1.83197 10.576H11.048C11.288 10.576 11.408 10.456 11.408 10.216V1C11.408 0.76 11.48 0.568 11.624 0.423999C11.816 0.231998 12.032 0.135998 12.272 0.135998H20.696C20.936 0.135998 21.128 0.231998 21.272 0.423999C21.464 0.568 21.56 0.76 21.56 1V10.216C21.56 10.456 21.68 10.576 21.92 10.576H31.064Z"
              fill="#0E2F21"
            />
          </svg>
        )}
      </svg>
    </div>
  );
}