export function PitchTexture({
  pattern,
  bgColor,
  stripeColor,
}: {
  pattern: 'solid' | 'stripe' | 'circle'
  bgColor: string
  stripeColor: string
}) {
   if (pattern === 'solid') {
    return (
      <svg viewBox="0 0 100 150" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="150" fill={bgColor} />
      </svg>
    )
  }

  
  if (pattern === 'circle') {
    const rings = [70, 60, 50, 40, 30, 20, 10]
    return (
      <svg viewBox="0 0 100 150" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="150" fill={bgColor} />
        {rings.map((r, i) => (
          <circle
            key={r}
            cx="50"
            cy="75"
            r={r}
            fill={i % 2 === 0 ? stripeColor : bgColor}
          />
        ))}
      </svg>
    )
  }

  // stripe
  const bandHeight = 150 / 15
  return (
    <svg viewBox="0 0 100 150" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <rect x="0" y="0" width="100" height="150" fill={bgColor} />
      {Array.from({ length: 15 }).map((_, i) =>
        i % 2 === 0 ? (
          <rect key={i} x="0" y={i * bandHeight} width="100" height={bandHeight} fill={stripeColor} />
        ) : null
      )}
    </svg>
  )
}