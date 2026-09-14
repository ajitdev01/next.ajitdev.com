import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/config";
import {
  buildConnectedGraph,
  buildWebPageSchema,
  buildBreadcrumbSchema,
} from "@/lib/seo/schema";
import JsonLd from "@/components/seo/json-ld";
import Footer from "@/app/components/footer";

const pageUrl = `${siteConfig.siteUrl}/api`;
const title = "AJITDEV API Hub | Free APIs for Developers, REST & JSON Docs";
const description =
  "Explore free developer APIs, public REST endpoints, JSON APIs, and interactive documentation across the AJITDEV API Hub engineered by Ajit Dev.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "AJITDEV API Hub",
    "AJITDEV APIs",
    "Free APIs",
    "Free APIs for Developers",
    "Free Developer APIs",
    "Free REST APIs",
    "Free JSON APIs",
    "Public APIs",
    "Developer APIs",
    "REST API Documentation",
    "API Documentation",
    "API Reference",
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

export default function ApiHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: "Home", url: siteConfig.siteUrl },
    { name: "API Hub", url: pageUrl },
  ];

  const apiSchema = buildConnectedGraph([
    buildWebPageSchema({
      name: title,
      description,
      url: pageUrl,
      breadcrumbs,
    }),
    buildBreadcrumbSchema(breadcrumbs, pageUrl),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased flex flex-col justify-between">
      <JsonLd id="api-schema-graph" schema={apiSchema} />
      <div className="flex-1">{children}</div>
      <Footer theme="light" />
    </div>
  );
}
