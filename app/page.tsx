import type { Metadata } from "next";
import { siteConfig, personConfig } from "@/lib/seo/config";
import { buildConnectedGraph, buildWebPageSchema } from "@/lib/seo/schema";
import JsonLd from "@/components/seo/json-ld";
import Hero3DVisualizer from "@/app/components/hero-3d-visualizer";
import EngineeringPillars from "@/app/components/engineering-pillars";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Ajit Dev's Next.js Projects | Full Stack, DevOps & Cloud",
  description:
    "Explore Ajit Dev's Next.js and React projects, full stack applications, developer APIs, DevOps automation and cloud engineering work.",
  keywords: [
    ...siteConfig.keywords,
  ],
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  openGraph: {
    title: "Ajit Dev's Next.js Projects | Full Stack, DevOps & Cloud",
    description:
      "Explore Ajit Dev's Next.js and React projects, full stack applications, developer APIs, DevOps automation and cloud engineering work.",
    url: siteConfig.siteUrl,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ajit Dev's Next.js Projects | Full Stack, DevOps & Cloud",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajit Dev's Next.js Projects | Full Stack, DevOps & Cloud",
    description: siteConfig.description,
    creator: "@ajitdev01",
    images: ["/twitter-image.png"],
  },
};

import ScrollReveal from "@/components/ui/scroll-reveal";

export default function Home() {
  const pageSchema = buildConnectedGraph([
    buildWebPageSchema({
      name: "AJITDEV — Technical Hub & Developer Ecosystem",
      description: siteConfig.description,
      url: siteConfig.siteUrl,
    }),
  ]);

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white antialiased overflow-x-clip">
      {/* Page JSON-LD */}
      <JsonLd id="homepage-schema-graph" schema={pageSchema} />

      {/* Ambient background glows - GPU friendly lightweight radial gradients isolated from layout */}
      <div
        style={{ contain: "paint" }}
        className="pointer-events-none absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)] sm:h-[600px] sm:w-[600px]"
      />
      <div
        style={{ contain: "paint" }}
        className="pointer-events-none absolute right-10 top-1/2 h-[350px] w-[350px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.05)_0%,transparent_70%)]"
      />
      <div
        style={{ contain: "paint" }}
        className="pointer-events-none absolute left-10 bottom-1/4 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,transparent_70%)]"
      />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-start px-4 py-12 sm:px-6 lg:px-8">
        {/* State-of-the-Art 3D Interactive Hero Visualizer */}
        <Hero3DVisualizer />

        {/* Senior 10-Year UX Interactive Engineering Pillars */}
        <EngineeringPillars />




        {/* Minimal clean footer component with ScrollReveal */}
        <ScrollReveal direction="up" delay={0.15} className="w-full max-w-5xl mt-20">
          <Footer theme="light" className="w-full" />
        </ScrollReveal>
      </main>
    </div>
  );
}