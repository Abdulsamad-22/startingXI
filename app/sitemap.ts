import { FORMATION_GUIDES } from "@/lib/seo/formation";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://startingxi.xyz",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },

    ...FORMATION_GUIDES.map((g) => ({
      url: `https://www.startingxi.xyz/formations/${g.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
