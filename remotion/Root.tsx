import { Composition } from 'remotion'
import { LineupReveal } from './LineupReveal'

const STAGGER_FRAMES = 21
const TAIL_FRAMES = 60

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LineupReveal"
      component={LineupReveal}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        teamName: 'My Team',
        formationName: '4-3-3',
        primaryColor: '#3CEFA1',
        players: [] as {
          id: string
          name: string
          jersey_number: number
          photo_url: string | null
          slot_x: number
          slot_y: number
        }[],
      }}
      calculateMetadata={({ props }) => {
        const durationInFrames = props.players.length * STAGGER_FRAMES + TAIL_FRAMES
        return { durationInFrames }
      }}
    />
  )
}