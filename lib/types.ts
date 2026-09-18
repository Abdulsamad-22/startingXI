export const POSITION_GROUPS = [
  "GK",
  "CB",
  "LB",
  "RB",
  "LWB",
  "RWB",
  "DMF",
  "CMF",
  "AMF",
  "LWF",
  "RWF",
  "CF",
] as const;

export type PositionGroup = (typeof POSITION_GROUPS)[number];

export type Team = {
  id: string;
  name: string;
  crest_url: string | null;
  primary_color: string;
  secondary_color: string;
};

export type Player = {
  id: string;
  team_id: string;
  name: string;
  jersey_number: number;
  position_group: PositionGroup | null;
  photo_url: string | null;
};

export const MARKER_STYLES = ["shield", "jersey", "circle"] as const;
export type MarkerStyle = (typeof MARKER_STYLES)[number];

export const DEFAULT_FORMATION_BY_SIZE: Record<number, string> = {
  11: "4-3-3",
  8: "3-3-1",
  9: "3-2-3",
  7: "3-2-1",
  5: "2-1-1",
};

export const DEFAULT_CUSTOMIZATION = {
  pitchPattern: "solid" as const,
  pitchBgColor: "#0E2F21",
  pitchStripeColor: "#123A28",
  pitchLineColor: "rgba(255,255,255,0.25)",
  jerseyColor: "#3CEFA1",
  jerseySleeveColor: "#FFFFFF",
  jerseyCollarColor: "#7A1F1F",
  jerseyNumberColor: "#0E2F21",
  gkJerseyColor: "#D9A521",
  gkNumberColor: "#0E2F21",
};
