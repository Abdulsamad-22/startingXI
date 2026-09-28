export const FEATURE_PRICES = {
  template_broadcast: 1500,
  template_stadium: 1500,
  template_elite: 1500,
  video_export: 1500,
} as const;

export type PaidFeature = keyof typeof FEATURE_PRICES;

export const FEATURE_PRODUCT_IDS: Partial<Record<PaidFeature, string>> = {
  template_broadcast: "prod_4b7af3b0ebb042888648",
  template_stadium: "prod_4b7af3b0ebb042888648",
  // add the rest here as you create each product in the Bachs dashboard:
  // template_broadcast: 'prod_...',
  // template_elite: 'prod_...',
  // video_export: 'prod_...',
  // competition_extra_team: 'prod_...',
};

export const FEATURE_LABELS: Record<PaidFeature, string> = {
  template_broadcast: "Broadcast Template",
  template_stadium: "Stadium Template",
  template_elite: "Elite Template",
  video_export: "Animated Video Export",
};
