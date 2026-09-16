import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Internal Next.js build assets
          "/_next/",

          // Session-protected dashboard (redirects unauthenticated users)
          "/dashboard",

          // Authentication flows — not useful for search indexing
          "/login/",

          // NextAuth.js internal API routes (callbacks, CSRF, session)
          "/api/auth/",

          // Internal API endpoints (not public-facing documentation)
          "/api/test",
          "/api/contact",
        ],
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl,
  };
}
