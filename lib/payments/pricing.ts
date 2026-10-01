export const FEATURE_PRICES = {
  template_broadcast: 1000,
  template_stadium: 1500,
  template_elite: 1500,
  video_export: 3000,
  competition_extra_team: 5000,
} as const;

export type PaidFeature = keyof typeof FEATURE_PRICES;

export const FEATURE_PRODUCT_IDS: Partial<Record<PaidFeature, string>> = {
  template_broadcast: "prod_af57bd9713824601b850",
  template_stadium: "prod_2ff974cc6ec8410d93b7",
  template_elite: "prod_380054f1921f441e9cd7",
  video_export: "prod_3ba9e53290d04dc899c6",
  competition_extra_team: "prod_29bb79df4f81401a8033",
};

export const FEATURE_LABELS: Record<PaidFeature, string> = {
  template_broadcast: "Broadcast Template",
  template_stadium: "Stadium Template",
  template_elite: "Elite Template",
  video_export: "Animated Video Export",
  competition_extra_team: "Additional Team Slot",
};

export const FEATURE_TO_TEMPLATE_ID: Partial<Record<PaidFeature, string>> = {
  template_broadcast: "broadcast",
  template_stadium: "stadium",
  template_elite: "elite",
  competition_extra_team: "extra_team",
};
