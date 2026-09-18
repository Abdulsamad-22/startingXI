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

  const isLandscape = sizePreset === "landscape";
  const headerHeight = height * 0.12;
  const availableHeight = height - headerHeight - 40;
  const availableWidth = width - 64;

  // boxW/boxH are the pitch's *logical* portrait dimensions (touchline-width x
  // goal-to-goal-height), always kept at the true 2:3 football ratio — only the
  // rotation applied to them at render time changes their visual footprint.
  const PORTRAIT_RATIO = 1.5; // height / width
  let boxW: number;
  let boxH: number;

  if (isLandscape) {
    // after a 90° rotation, the box's visual footprint is boxH (wide) x boxW (tall) —
    // so fit boxH against the available width and boxW against the available height
    boxH = availableWidth;
    boxW = boxH / PORTRAIT_RATIO;
    if (boxW > availableHeight) {
      boxW = availableHeight;
      boxH = boxW * PORTRAIT_RATIO;
    }
  } else {
    boxW = availableWidth;
    boxH = boxW * PORTRAIT_RATIO;
    if (boxH > availableHeight) {
      boxH = availableHeight;
      boxW = boxH / PORTRAIT_RATIO;
    }
  }

  const stageWidth = isLandscape ? boxH : boxW;
  const stageHeight = isLandscape ? boxW : boxH;

  const staggerFrames = 21;
  const durationFrames = 24;
  const markerSize = boxW * 0.14;
  const nameSize = boxW * 0.03;

  return (
    <AbsoluteFill style={{ backgroundColor: pitchBgColor }}>
      <div
        style={{
          padding: 32,
          paddingBottom: isLandscape ? 32 + 24 : 32,
          height: headerHeight,
        }}
      >
        <h1
          style={{
            fontSize: width * 0.05,
            fontFamily: "'Anton', sans-serif",
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
            fontFamily: "'Inter', sans-serif",
            marginTop: 6,
          }}
        >
          {formationName}
        </p>
      </div>

      {/* stage: sized to the pitch's actual visual footprint, centered in available space */}
      <div
        style={{
          position: "relative",
          width: stageWidth,
          height: stageHeight,
          margin: "0 auto",
          overflow: "hidden",
          borderRadius: 12,
        }}
      >
        {/* rotator: always the pitch's TRUE portrait shape (boxW x boxH), rotated
            90° for landscape — background and markers live inside this together,
            so they rotate as one rigid unit */}
        <div
          style={{
            position: "absolute",
            width: boxW,
            height: boxH,
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) rotate(${isLandscape ? 90 : 0}deg)`,
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
            const opacity = interpolate(
              localFrame,
              [0, durationFrames],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );

            return (
              <div
                key={p.id}
                style={{
                  position: "absolute",
                  left: `${p.slot_x}%`,
                  top: `${p.slot_y}%`,
                  // counter-rotate so the marker+name render upright regardless
                  // of the parent rotator's rotation — net visual rotation cancels
                  transform: `translate(-50%, -50%) rotate(${isLandscape ? -90 : 0}deg) scale(${localFrame < 0 ? 0 : progress})`,
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
      </div>
    </AbsoluteFill>
  );
}
