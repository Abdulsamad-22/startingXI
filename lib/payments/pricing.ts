export const FEATURE_PRICES = {
  template_broadcast: 1500,
  template_stadium: 1500,
  template_elite: 1500,
  video_export: 3000,
} as const;

export type PaidFeature = keyof typeof FEATURE_PRICES;

export const FEATURE_PRODUCT_IDS: Partial<Record<PaidFeature, string>> = {
  template_broadcast: "prod_9675090c156e4b26a62c",
  template_stadium: "prod_4b7af3b0ebb042888648",
  template_elite: "prod_269ebdf07cd440d8b1f2",
  video_export: "prod_6e371d6e8360494cae8f",
  // competition_extra_team: 'prod_...',
};

export const FEATURE_LABELS: Record<PaidFeature, string> = {
  template_broadcast: "Broadcast Template",
  template_stadium: "Stadium Template",
  template_elite: "Elite Template",
  video_export: "Animated Video Export",
};

export const FEATURE_TO_TEMPLATE_ID: Partial<Record<PaidFeature, string>> = {
  template_broadcast: "broadcast",
  template_stadium: "stadium",
  template_elite: "elite",
};
