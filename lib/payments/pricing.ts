export const FEATURE_PRICES = {
  template_broadcast: 150000,
  template_stadium: 150000,
  template_elite: 150000,
  video_export: 150000,
} as const;

export type PaidFeature = keyof typeof FEATURE_PRICES;

export const FEATURE_LABELS: Record<PaidFeature, string> = {
  template_broadcast: "Broadcast Template",
  template_stadium: "Stadium Template",
  template_elite: "Elite Template",
  video_export: "Animated Video Export",
};
