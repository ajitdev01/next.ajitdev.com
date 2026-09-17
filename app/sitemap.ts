import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Primary ─────────────────────────────────────────────
    {
      url: siteConfig.siteUrl,
      changeFrequency: "weekly",
      priority: 1.0,
    },

    // ── Core public sections ────────────────────────────────
    {
      url: `${siteConfig.siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.siteUrl}/projects`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.siteUrl}/api`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // ── Live apps ───────────────────────────────────────────
    {
      url: `${siteConfig.siteUrl}/store`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.siteUrl}/weather`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.siteUrl}/todo`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.siteUrl}/note`,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // ── Legal / compliance ──────────────────────────────────
    {
      url: `${siteConfig.siteUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.siteUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}

