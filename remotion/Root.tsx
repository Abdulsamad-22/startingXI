import { Composition } from "remotion";
import { LineupReveal } from "./LineupReveal";

const STAGGER_FRAMES = 21;
const TAIL_FRAMES = 60;

const SIZE_PRESETS = {
  story: { width: 1080, height: 1920 }, // 9:16 — Reels/Stories/TikTok
  square: { width: 1080, height: 1080 }, // 1:1 — feed post
  landscape: { width: 1920, height: 1080 }, // 16:9 — X/YouTube
} as const;

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
        teamName: "My Team",
        formationName: "4-3-3",
        primaryColor: "#3CEFA1",
        pitchPattern: "solid" as const,
        pitchBgColor: "#0E2F21",
        pitchStripeColor: "#123A28",
        pitchLineColor: "rgba(255,255,255,0.25)",
        sizePreset: "story" as keyof typeof SIZE_PRESETS,
        players: [] as {
          id: string;
          name: string;
          jersey_number: number;
          photo_url: string | null;
          slot_x: number;
          slot_y: number;
        }[],
      }}
      calculateMetadata={({ props }) => {
        const durationInFrames =
          props.players.length * STAGGER_FRAMES + TAIL_FRAMES;
        const dimensions =
          SIZE_PRESETS[props.sizePreset as keyof typeof SIZE_PRESETS] ??
          SIZE_PRESETS.story;
        return { durationInFrames, ...dimensions };
      }}
    />
  );
};
