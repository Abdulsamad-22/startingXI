import { FORMATION_GUIDES } from "@/lib/seo/formation";
import { MetadataRoute } from "next";

const BASE_URL = "https://www.startingxi.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL },
    { url: `${BASE_URL}/formations` },
    { url: `${BASE_URL}/competitions` },
    ...FORMATION_GUIDES.map((guide) => ({
      url: `${BASE_URL}/formations/${guide.slug}`,
    })),
  ];
}
