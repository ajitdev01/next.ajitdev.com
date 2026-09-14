import Link from "next/link";
import {
  Terminal,
  ExternalLink,
  Sparkles,
  Check,
  Code2,
  Server,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import ScrollReveal from "@/components/ui/scroll-reveal";

const API_SERVICES = [
  {
    title: "Free REST & JSON APIs",
    description:
      "Public REST endpoints serving structured JSON responses with CORS enabled. Designed for frontend testing, rapid prototyping, and web applications.",
    category: "REST APIs",
    endpoint: "https://api.ajitdev.com/v1",
    method: "GET",
  },
  {
    title: "Todo & Task Management API",
    description:
      "RESTful API structure matching the AJITDEV Todo App schema. Supports task creation, status updates, priority filtering, and batch exports.",
    category: "Application API",
    endpoint: "https://api.ajitdev.com/v1/todos",
    method: "GET / POST",
  },
  {
    title: "Notes & Document Schema API",
    description:
      "JSON data formats and endpoints modeled on the local-first Notes App for storing organized categories, search tokens, and markdown content.",
    category: "Data Schema",
    endpoint: "https://api.ajitdev.com/v1/notes",
    method: "GET / POST",
  },
  {
    title: "Public Developer Utilities",
    description:
      "Helper endpoints for timestamp formatting, UUID/ID generation, mock data simulation, and JSON payload inspection.",
    category: "Utility APIs",
    endpoint: "https://api.ajitdev.com/v1/utils",
    method: "GET",
  },
];

export default function ApiHubPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "API Hub", url: "/api" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Hero Header */}
      <ScrollReveal direction="up" delay={0.05}>
        <section aria-labelledby="api-hub-title" className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-purple-700 shadow-2xs">
            <Terminal className="h-3.5 w-3.5 text-purple-600" />
            Public Developer Ecosystem
          </div>

          <h1
            id="api-hub-title"
            className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
          >
            AJITDEV API Hub — Free APIs for Developers
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Welcome to the official API hub of the <strong className="text-slate-900">AJITDEV</strong> ecosystem. Engineered by{" "}
            <strong className="text-slate-900">Ajit Dev</strong> to provide free, public, and reliable REST and JSON APIs for developers, frontend prototyping, and API testing.
          </p>

          <div className="pt-2">
            <a
              href="https://api.ajitdev.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition"
            >
              <span>Launch Live API Hub (api.ajitdev.com)</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>
      </ScrollReveal>

      {/* API Categories & Endpoints */}
      <section aria-labelledby="endpoints-title" className="mt-14 space-y-6">
        <ScrollReveal direction="up" delay={0.05}>
          <h2
            id="endpoints-title"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Free REST API Services & Endpoints
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            Zero-friction endpoints with CORS enabled for direct browser testing and backend integrations.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-2">
          {API_SERVICES.map((service, index) => (
            <ScrollReveal
              key={service.title}
              direction="up"
              delay={0.05 + index * 0.08}
              className="h-full"
            >
              <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-md bg-purple-50 border border-purple-100 px-2 py-0.5 font-semibold text-purple-700">
                      {service.category}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-slate-500">
                      {service.method}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200/60 px-3 py-2 text-xs font-mono text-slate-700">
                    <span className="truncate">{service.endpoint}</span>
                    <a
                      href="https://api.ajitdev.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-purple-600 hover:text-purple-800 shrink-0 font-sans font-medium text-[11px]"
                    >
                      Test ↗
                    </a>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Quick Integration Example */}
      <ScrollReveal direction="up" delay={0.1}>
        <section aria-labelledby="example-title" className="mt-14 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <h2 id="example-title" className="text-xl font-bold text-slate-900">
            Quick JavaScript Fetch Example
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Consume free JSON responses directly from client-side React or Next.js applications.
          </p>

          <div className="mt-4 rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-100 overflow-x-auto">
            <pre>
              {`// Fetch from AJITDEV API Hub
const response = await fetch("https://api.ajitdev.com/v1/todos", {
  headers: {
    "Accept": "application/json"
  }
});
const data = await response.json();
console.log(data);`}
            </pre>
          </div>
        </section>
      </ScrollReveal>

      {/* Cross-linking to Suite Applications */}
      <ScrollReveal direction="up" delay={0.12}>
        <section className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 pt-8">
          <div className="text-xs text-slate-500">
            Integrated with production tools:{" "}
            <Link href="/todo" className="font-semibold text-slate-800 hover:underline">
              Todo App
            </Link>{" "}
            and{" "}
            <Link href="/note" className="font-semibold text-slate-800 hover:underline">
              Notes App
            </Link>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            <span>View All AJITDEV Projects</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </ScrollReveal>
    </main>
  );
}
