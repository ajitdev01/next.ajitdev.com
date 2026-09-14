import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/config";
import {
  buildConnectedGraph,
  buildWebPageSchema,
  buildBreadcrumbSchema,
  buildSoftwareApplicationSchema,
} from "@/lib/seo/schema";
import JsonLd from "@/components/seo/json-ld";

const pageUrl = `${siteConfig.siteUrl}/note`;
const title = "Notes App — Minimal Local-First Notes | AjitDev Suite";
const description =
  "Clean, ultra-fast, local-first notes application with category organization, instant search, and complete browser-storage privacy. Engineered by Ajit Dev.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "notes app",
    "local-first notes",
    "private notes app",
    "productivity suite",
    "markdown notes",
    "ajit dev",
    "AJITDEV suite",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@ajitdev01",
    images: ["/opengraph-image"],
  },
};

import Footer from "@/app/components/footer";

export default function NoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: "Home", url: siteConfig.siteUrl },
    { name: "Notes App", url: pageUrl },
  ];

  const noteSchema = buildConnectedGraph([
    buildWebPageSchema({
      name: title,
      description,
      url: pageUrl,
      breadcrumbs,
    }),
    buildBreadcrumbSchema(breadcrumbs, pageUrl),
    buildSoftwareApplicationSchema({
      name: "Notes App — AjitDev Productivity Suite",
      description,
      url: pageUrl,
      applicationCategory: "ProductivityApplication",
      features: [
        "Local-First Offline Storage",
        "Category Organization & Filtering",
        "Instant Full-Text Search",
        "Color Coding & Custom Themes",
        "Zero Cloud Lock-in and 100% Privacy",
      ],
    }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased flex flex-col justify-between">
      <JsonLd id="note-schema-graph" schema={noteSchema} />
      <div className="flex-1">{children}</div>
      <Footer theme="light" />
    </div>
  );
}
