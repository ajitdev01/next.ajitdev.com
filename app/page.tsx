import type { Metadata } from "next";
import { siteConfig, personConfig } from "@/lib/seo/config";
import { buildConnectedGraph, buildWebPageSchema } from "@/lib/seo/schema";
import JsonLd from "@/components/seo/json-ld";
import Hero3DVisualizer from "@/app/components/hero-3d-visualizer";
import EngineeringPillars from "@/app/components/engineering-pillars";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "AJITDEV | Full Stack Development, DevOps, Cloud & APIs",
  description:
    "AJITDEV is the central developer platform by Ajit Dev covering full stack engineering, DevOps, DevSecOps, cloud architecture, system design, DSA, and modern developer tools.",
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  openGraph: {
    title: "AJITDEV | Full Stack Development, DevOps, Cloud & APIs",
    description:
      "Central developer hub by Ajit Dev covering full stack development, DevOps, cloud engineering, system design, DSA, and developer APIs.",
    url: siteConfig.siteUrl,
    type: "website",
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
    <div className="relative min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white antialiased">
      {/* Page JSON-LD */}
      <JsonLd id="homepage-schema-graph" schema={pageSchema} />

      {/* Ambient background glows - GPU friendly lightweight radial gradients */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)] sm:h-[600px] sm:w-[600px]" />
      <div className="pointer-events-none absolute right-10 top-1/2 h-[350px] w-[350px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.05)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute left-10 bottom-1/4 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,transparent_70%)]" />

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

        {/* Genuine Developer Identity Signature & Location Context */}
        <ScrollReveal direction="up" delay={0.1} className="w-full max-w-5xl mt-16">
          <div className="relative z-10 w-full rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {personConfig.name}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {personConfig.jobTitle}
                  </span>
                </div>
                <p className="text-xs text-slate-500 max-w-xl">
                  Full Stack & DevOps Engineer from{" "}
                  <span className="font-semibold text-slate-800">
                    {personConfig.location.addressLocality}, {personConfig.location.addressRegion}, India
                  </span>
                  . Creator of the AJITDEV developer ecosystem, public APIs, and open productivity tools.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <a
                  href="https://x.com/ajitdev01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                >
                  X / Twitter
                </a>
                <a
                  href="https://www.instagram.com/ajitdev01/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                >
                  Instagram
                </a>
                <a
                  href="https://www.ajitdev.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white transition hover:bg-slate-800 shadow-xs"
                >
                  Portfolio
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Minimal clean footer component with ScrollReveal */}
        <ScrollReveal direction="up" delay={0.15} className="w-full max-w-5xl mt-20">
          <Footer theme="light" className="w-full" />
        </ScrollReveal>
      </main>
    </div>
  );
}