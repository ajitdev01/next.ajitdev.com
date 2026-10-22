import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/config";
import {
  buildConnectedGraph,
  buildBreadcrumbSchema,
} from "@/lib/seo/schema";
import JsonLd from "@/components/seo/json-ld";
import Footer from "@/app/components/footer";

const pageUrl = `${siteConfig.siteUrl}/contact`;
const title = "Contact Ajit Dev | Get in Touch";
const description =
  "Contact Ajit Dev (AJITDEV) — Full Stack Developer & DevOps Engineer based in Katihar, Bihar, India. Send a message for collaborations, API support, or project inquiries.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Contact Ajit Dev",
    "Ajit Dev Contact",
    "Hire Full Stack Developer Katihar",
    "Web Developer Katihar",
    "DevOps Engineer Katihar",
    "Ajit Dev Email",
    "AJITDEV Support",
  ],
  alternates: { canonical: pageUrl },
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

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = [
    { name: "Home", url: siteConfig.siteUrl },
    { name: "Contact", url: pageUrl },
  ];

  const contactSchema = buildConnectedGraph([
    {
      "@type": "ContactPage",
      "@id": `${pageUrl}#contactpage`,
      url: pageUrl,
      name: title,
      description,
      inLanguage: "en-US",
      isPartOf: {
        "@id": `${siteConfig.siteUrl}/#website`,
      },
      about: {
        "@id": "https://www.ajitdev.com/#person",
      },
      breadcrumb: {
        "@id": `${pageUrl}#breadcrumb`,
      },
    },
    buildBreadcrumbSchema(breadcrumbs, pageUrl),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased flex flex-col justify-between">
      <JsonLd id="contact-schema-graph" schema={contactSchema} />
      <div className="flex-1">{children}</div>
      <Footer theme="light" />
    </div>
  );
}
