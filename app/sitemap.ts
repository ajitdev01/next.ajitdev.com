import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  return [
    // ── Primary ─────────────────────────────────────────────
    {
      url: siteConfig.siteUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
      images: [`${siteConfig.siteUrl}/og-image.png`],
    },

    // ── Core public sections ────────────────────────────────
    {
      url: `${siteConfig.siteUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
      images: [`${siteConfig.siteUrl}/og-image.png`],
    },
    {
      url: `${siteConfig.siteUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
      images: [`${siteConfig.siteUrl}/og-image.png`],
    },
    {
      url: `${siteConfig.siteUrl}/api`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.siteUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // ── Live apps ───────────────────────────────────────────
    {
      url: `${siteConfig.siteUrl}/store`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.siteUrl}/weather`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.siteUrl}/currency`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.siteUrl}/todo`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.siteUrl}/note`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // ── Legal / compliance ──────────────────────────────────
    {
      url: `${siteConfig.siteUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.siteUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}

