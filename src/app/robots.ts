import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/home", "/sign-in", "/sign-up", "/terms", "/privacy"],
      disallow: ["/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_LINK}/sitemap.xml`,
  };
}
