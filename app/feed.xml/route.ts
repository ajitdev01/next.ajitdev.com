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
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
