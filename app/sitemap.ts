import { FORMATION_GUIDES } from "@/lib/seo/formation";
import { MetadataRoute } from "next";

const BASE_URL = "https://www.startingxi.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
    },

    ...FORMATION_GUIDES.map((g) => ({
      url: `${BASE_URL}/formations/${g.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
