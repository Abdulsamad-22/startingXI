import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Img,
} from "remotion";
import { PitchMarkings } from "../components/PitchMarkings";
import { PitchTexture } from "@/components/PitchTexture";

type Player = {
  id: string;
  name: string;
  jersey_number: number;
  photo_url: string | null;
  slot_x: number;
  slot_y: number;
};

function VideoMarker({
  style,
  primaryColor,
  secondaryColor,
  number,
  photoUrl,
  size,
}: {
  style: "shield" | "jersey" | "circle";
  primaryColor: string;
  secondaryColor: string;
  number: number;
  photoUrl: string | null;
  size: number;
}) {
  if (style === "jersey") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: size,
        }}
      >
        {photoUrl && (
          <Img
            src={photoUrl}
            style={{
              width: size * 0.4,
              height: size * 0.4,
              borderRadius: "50%",
              objectFit: "cover",
              border: `3px solid ${primaryColor}`,
              marginBottom: -size * 0.08,
              zIndex: 1,
            }}
          />
        )}
        <div
          style={{
            width: size,
            height: size * 0.9,
            backgroundColor: primaryColor,
            borderTop: `${size * 0.15}px solid ${secondaryColor}`,
            borderRadius: size * 0.1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: size * 0.35,
            color: "#0E2F21",
          }}
        >
          {number}
        </div>
      </div>
    );
  }

  if (style === "shield") {
    return (
      <div
        style={{
          position: "relative",
          width: size,
          height: size * 1.1,
          clipPath:
            "polygon(50% 0%, 100% 15%, 100% 55%, 50% 100%, 0% 55%, 0% 15%)",
          backgroundColor: "#0E2F21",
          border: `${size * 0.05}px solid ${primaryColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {photoUrl ? (
          <Img
            src={photoUrl}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span
            style={{
              fontWeight: 800,
              fontSize: size * 0.35,
              color: primaryColor,
            }}
          >
            {number}
          </span>
        )}
      </div>
    );
  }

  // circle
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {photoUrl ? (
        <Img
          src={photoUrl}
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
            fontSize: size * 0.4,
            color: "#0E2F21",
          }}
        >
          {number}
        </div>
      )}
    </div>
  );
}

export function LineupReveal({
  teamName,
  formationName,
  primaryColor,
  secondaryColor,
  markerStyle,
  pitchPattern,
  pitchBgColor,
  sizePreset,
  pitchStripeColor,
  pitchLineColor,
  players,
}: {
  teamName: string;
  formationName: string;
  primaryColor: string;
  secondaryColor: string;
  markerStyle: "shield" | "jersey" | "circle";
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

  // fit the tallest possible 2:3 (w:h) pitch box within the available space, centered
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
              <VideoMarker
                style={markerStyle}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                number={p.jersey_number}
                photoUrl={p.photo_url}
                size={markerSize}
              />
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
