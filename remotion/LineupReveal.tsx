import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Img,
} from "remotion";
import { PitchTexture } from "../components/PitchTexture";
import { PitchMarkings } from "../components/PitchMarkings";

export function LineupReveal({
  teamName,
  formationName,
  primaryColor,
  pitchPattern,
  pitchBgColor,
  pitchStripeColor,
  pitchLineColor,
  sizePreset,
  players,
}: {
  teamName: string;
  formationName: string;
  primaryColor: string;
  pitchPattern: "solid" | "stripe" | "circle";
  pitchBgColor: string;
  pitchStripeColor: string;
  pitchLineColor: string;
  sizePreset: "story" | "square" | "landscape";
  players: {
    id: string;
    name: string;
    jersey_number: number;
    photo_url: string | null;
    slot_x: number;
    slot_y: number;
  }[];
}) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const headerHeight = height * 0.12;
  const availableHeight = height - headerHeight - 40;
  const availableWidth = width - 64;

  const PITCH_RATIO = 2 / 3;
  let pitchWidth = availableWidth;
  let pitchHeight = pitchWidth / PITCH_RATIO;
  if (pitchHeight > availableHeight) {
    pitchHeight = availableHeight;
    pitchWidth = pitchHeight * PITCH_RATIO;
  }

  const staggerFrames = 21;
  const durationFrames = 24;
  const markerSize = pitchWidth * 0.14;
  const nameSize = pitchWidth * 0.03;

  return (
    <AbsoluteFill style={{ backgroundColor: pitchBgColor }}>
      <div style={{ padding: 32, height: headerHeight }}>
        <h1
          style={{
            fontSize: width * 0.05,
            fontWeight: 900,
            textTransform: "uppercase",
            margin: 0,
            color: "white",
          }}
        >
          {teamName}
        </h1>
        <p
          style={{
            color: primaryColor,
            fontWeight: 700,
            fontSize: width * 0.025,
            marginTop: 6,
          }}
        >
          {formationName}
        </p>
      </div>

      <div
        style={{
          position: "relative",
          width: pitchWidth,
          height: pitchHeight,
          margin: "0 auto",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <PitchTexture
          pattern={pitchPattern}
          bgColor={pitchBgColor}
          stripeColor={pitchStripeColor}
        />
        <PitchMarkings lineColor={pitchLineColor} />

        {players.map((p, i) => {
          const delay = i * staggerFrames;
          const localFrame = frame - delay;

          const progress = interpolate(
            localFrame,
            [0, durationFrames],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            },
          );
          const opacity = interpolate(localFrame, [0, durationFrames], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: `${p.slot_x}%`,
                top: `${p.slot_y}%`,
                transform: `translate(-50%, -50%) scale(${localFrame < 0 ? 0 : progress})`,
                opacity: localFrame < 0 ? 0 : opacity,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: markerSize,
                  height: markerSize,
                }}
              >
                {p.photo_url ? (
                  <Img
                    src={p.photo_url}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: `3px solid ${primaryColor}`,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      backgroundColor: primaryColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: markerSize * 0.4,
                      color: "#0E2F21",
                    }}
                  >
                    {p.jersey_number}
                  </div>
                )}
              </div>
              <span
                style={{
                  fontSize: nameSize,
                  color: "white",
                  fontWeight: 600,
                  maxWidth: markerSize * 1.6,
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {p.name}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
