import { siteConfig, rssConfig } from "@/lib/seo/config";

export async function GET() {
  const now = new Date().toUTCString();

  const feedItems = [
    {
      title: "AJITDEV — Technical Hub & Developer Ecosystem Launch",
      link: siteConfig.siteUrl,
      guid: siteConfig.siteUrl,
      pubDate: "Mon, 14 Sep 2026 00:00:00 GMT",
      description:
        "Central developer hub by Ajit Dev showcasing full stack engineering, DevOps automation, cloud architecture, system design, DSA, and modern developer tools.",
    },
    {
      title: "AJITDEV API Hub — Free REST & JSON APIs for Developers",
      link: "https://api.ajitdev.com/",
      guid: "https://api.ajitdev.com/",
      pubDate: "Sun, 13 Sep 2026 00:00:00 GMT",
      description:
        "Comprehensive free developer APIs with public documentation, interactive testing, and zero-auth endpoints hosted at api.ajitdev.com.",
    },
    {
      title: "Todo App — Local-First Task Manager (AjitDev Suite)",
      link: `${siteConfig.siteUrl}/todo`,
      guid: `${siteConfig.siteUrl}/todo`,
      pubDate: "Sat, 12 Sep 2026 00:00:00 GMT",
      description:
        "Ultra-fast, private, local-first task manager with priority filtering, category organization, and complete browser storage privacy.",
    },
    {
      title: "Notes App — Minimal Local-First Notes (AjitDev Suite)",
      link: `${siteConfig.siteUrl}/note`,
      guid: `${siteConfig.siteUrl}/note`,
      pubDate: "Fri, 11 Sep 2026 00:00:00 GMT",
      description:
        "Minimalist, local-first notes application with instant full-text search, categories, and zero cloud tracking.",
    },
    {
      title: "Global Currency Converter — Real-Time ECB Forex & Timeseries Charts",
      link: `${siteConfig.siteUrl}/currency`,
      guid: `${siteConfig.siteUrl}/currency`,
      pubDate: "Tue, 15 Sep 2026 00:00:00 GMT",
      description:
        "Real-time currency converter across 31 world currencies powered by European Central Bank rates with sub-second caching, timeseries SVG charts, and parity matrix.",
    },
    {
      title: "E-comm Store — Next.js 16 & Redux Toolkit E-Commerce",
      link: `${siteConfig.siteUrl}/store`,
      guid: `${siteConfig.siteUrl}/store`,
      pubDate: "Wed, 16 Sep 2026 00:00:00 GMT",
      description:
        "Modern e-commerce platform built with Next.js 16, Redux Toolkit, interactive cart drawer, and celebratory confetti modal.",
    },
    {
      title: "Weather App — Live Atmospheric Conditions & OpenWeather Telemetry",
      link: `${siteConfig.siteUrl}/weather`,
      guid: `${siteConfig.siteUrl}/weather`,
      pubDate: "Thu, 17 Sep 2026 00:00:00 GMT",
      description:
        "Search any city worldwide for real-time temperature, atmospheric pressure, humidity, wind velocity, and sunrise/sunset metrics.",
    },
    {
      title: "AJITDEV Projects & Developer Portfolio Showcase",
      link: `${siteConfig.siteUrl}/projects`,
      guid: `${siteConfig.siteUrl}/projects`,
      pubDate: "Thu, 10 Sep 2026 00:00:00 GMT",
      description:
        "Showcase of production software engineering applications, web tools, and ecosystem projects engineered by Ajit Dev.",
    },
    {
      title: "About Ajit Dev — Full Stack Developer & DevOps Engineer",
      link: `${siteConfig.siteUrl}/about`,
      guid: `${siteConfig.siteUrl}/about`,
      pubDate: "Wed, 09 Sep 2026 00:00:00 GMT",
      description:
        "Verified developer identity, technical competencies in Next.js, TypeScript, Cloud, System Design, and competitive programming achievements.",
    },
  ];

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${rssConfig.title}]]></title>
    <link>${escapeXml(rssConfig.siteUrl)}</link>
    <description><![CDATA[${rssConfig.description}]]></description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${escapeXml(rssConfig.feedUrl)}" rel="self" type="application/rss+xml"/>
    ${feedItems
      .map(
        (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description><![CDATA[${item.description}]]></description>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
