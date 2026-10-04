import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/config";
import {
  buildConnectedGraph,
  buildBreadcrumbSchema,
} from "@/lib/seo/schema";
import JsonLd from "@/components/seo/json-ld";
import Footer from "@/app/components/footer";

const pageUrl = `${siteConfig.siteUrl}/projects`;
const title = "AJITDEV Projects | Production Software & Web Applications";
const description =
  "Explore production software applications, local-first web tools, developer APIs, and digital solutions engineered across the AJITDEV ecosystem by Ajit Dev.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "AJITDEV Projects",
    "Ajit Dev Projects",
    "Software Projects",
    "Currency Converter",
    "Forex Rates",
    "Exchange Rate Calculator",
    "Web Application Development",
    "E-comm Store",
    "Todo App",
    "Notes App",
    "Developer APIs",
    "Next.js Projects",
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

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: "Home", url: siteConfig.siteUrl },
    { name: "Projects", url: pageUrl },
  ];

  const projectsSchema = buildConnectedGraph([
    {
      "@type": "CollectionPage",
      "@id": `${pageUrl}#collectionpage`,
      url: pageUrl,
      name: title,
      description,
      inLanguage: "en-US",
      isPartOf: {
        "@id": `${siteConfig.siteUrl}/#website`,
      },
      about: {
        "@id": `${siteConfig.siteUrl}/#person`,
      },
      breadcrumb: {
        "@id": `${pageUrl}#breadcrumb`,
      },
    },
    buildBreadcrumbSchema(breadcrumbs, pageUrl),
    {
      "@type": "ItemList",
      "@id": `${pageUrl}#itemlist`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Global Currency Converter — Real-Time ECB Forex & Charts",
          url: `${siteConfig.siteUrl}/currency`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Razorpay Direct Payment — Gateway Integration",
          url: `${siteConfig.siteUrl}/payments/test`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "E-comm Store — Next.js & Redux Toolkit",
          url: `${siteConfig.siteUrl}/store`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Weather App — Live OpenWeather Geocoding",
          url: `${siteConfig.siteUrl}/weather`,
        },
        {
          "@type": "ListItem",
          position: 5,
          name: "Todo App — Local-First Task Management",
          url: `${siteConfig.siteUrl}/todo`,
        },
        {
          "@type": "ListItem",
          position: 6,
          name: "Notes App — Minimal Local-First Notes",
          url: `${siteConfig.siteUrl}/note`,
        },
        {
          "@type": "ListItem",
          position: 7,
          name: "AJITDEV API Hub",
          url: "https://api.ajitdev.com/",
        },
        {
          "@type": "ListItem",
          position: 8,
          name: "RexVel Web Solution",
          url: "https://rexvel.com/",
        },
        {
          "@type": "ListItem",
          position: 9,
          name: "BiFindr",
          url: "https://bifindr.com/",
        },
        {
          "@type": "ListItem",
          position: 10,
          name: "CollegeSure",
          url: "https://collegesure.brainzima.com/",
        },
      ],
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased flex flex-col justify-between">
      <JsonLd id="projects-schema-graph" schema={projectsSchema} />
      <div className="flex-1">{children}</div>
      <Footer theme="light" />
    </div>
  );
}
