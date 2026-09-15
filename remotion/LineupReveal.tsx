import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Img } from 'remotion'
import { PitchMarkings } from '../components/PitchMarkings'

type Player = {
  id: string
  name: string
  jersey_number: number
  photo_url: string | null
  slot_x: number
  slot_y: number
}

export function LineupReveal({
  teamName,
  formationName,
  primaryColor,
  players,
}: {
  teamName: string
  formationName: string
  primaryColor: string
  players: Player[]
}) {
  const frame = useCurrentFrame()
  const { width } = useVideoConfig()

  const staggerFrames = 21
  const durationFrames = 18

  const markerSize = width * 0.14
  const numberSize = width * 0.055
  const nameSize = width * 0.03

  return (
    <AbsoluteFill style={{ backgroundColor: '#0E2F21' }}>
      <div style={{ padding: 32 }}>
        <h1 style={{ fontSize: width * 0.06, fontWeight: 900, textTransform: 'uppercase', margin: 0, color: 'white' }}>
          {teamName}
        </h1>
        <p style={{ color: primaryColor, fontWeight: 700, fontSize: width * 0.03, marginTop: 6 }}>{formationName}</p>
      </div>

      <div style={{ position: 'relative', flex: 1, margin: '0 32px 32px' }}>
        <PitchMarkings />

        {players.map((p, i) => {
          const delay = i * staggerFrames
          const localFrame = frame - delay

          const progress = interpolate(localFrame, [0, durationFrames], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.back(1.7),
          })

          const opacity = interpolate(localFrame, [0, durationFrames], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })

          return (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${p.slot_x}%`,
                top: `${p.slot_y}%`,
                transform: `translate(-50%, -50%) scale(${localFrame < 0 ? 0 : progress})`,
                opacity: localFrame < 0 ? 0 : opacity,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: markerSize,
                  height: markerSize,
                  borderRadius: '50%',
                  backgroundColor: primaryColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: numberSize,
                  color: '#0E2F21',
                  overflow: 'hidden',
                }}
              >
                {p.photo_url ? (
                  <Img src={p.photo_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                       p.jersey_number
                )}
              </div>
              <span
                style={{
                  fontSize: nameSize,
                  color: 'white',
                  fontWeight: 600,
                  maxWidth: markerSize * 1.6,
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.name}
              </span>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}