import type { Metadata } from "next";
import { siteConfig, personConfig } from "@/lib/seo/config";
import {
  buildConnectedGraph,
  buildWebPageSchema,
  buildBreadcrumbSchema,
  buildPersonSchema,
} from "@/lib/seo/schema";
import JsonLd from "@/components/seo/json-ld";
import Footer from "@/app/components/footer";

const pageUrl = `${siteConfig.siteUrl}/about`;
const title = "About Ajit Dev | Full Stack Developer & Software Engineer";
const description =
  "Learn about Ajit Dev (AJITDEV), a Full Stack Developer and DevOps Engineer based in Katihar, Bihar, India. Explore technical competencies, verified coding profiles, and software projects.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Ajit Dev",
    "AJITDEV",
    "Ajit Dev Software Engineer",
    "Ajit Dev Full Stack Developer",
    "Full Stack Developer in Katihar",
    "Software Developer Bihar",
    "DevOps Engineer Bihar",
    "Cloud Engineer Katihar",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: "profile",
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: "Home", url: siteConfig.siteUrl },
    { name: "About", url: pageUrl },
  ];

  const aboutSchema = buildConnectedGraph([
    {
      "@type": "ProfilePage",
      "@id": `${pageUrl}#profilepage`,
      url: pageUrl,
      name: title,
      description,
      inLanguage: "en-US",
      isPartOf: {
        "@id": `${siteConfig.siteUrl}/#website`,
      },
      mainEntity: {
        "@id": `${siteConfig.siteUrl}/#person`,
      },
      breadcrumb: {
        "@id": `${pageUrl}#breadcrumb`,
      },
    },
    buildBreadcrumbSchema(breadcrumbs, pageUrl),
    buildPersonSchema(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased flex flex-col justify-between">
      <JsonLd id="about-schema-graph" schema={aboutSchema} />
      <div className="flex-1">{children}</div>
      <Footer theme="light" />
    </div>
  );
}
