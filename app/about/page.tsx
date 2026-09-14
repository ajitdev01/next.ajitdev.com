import Link from "next/link";
import {
  Code2,
  Server,
  Terminal,
  Database,
  Cpu,
  ShieldCheck,
  ExternalLink,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { siteConfig, personConfig } from "@/lib/seo/config";

export default function AboutPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero / Profile Header */}
      <ScrollReveal direction="up" delay={0.05}>
        <section aria-labelledby="about-title" className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            Developer Profile & Entity Architecture
          </div>

          <h1
            id="about-title"
            className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
          >
            About Ajit Dev — Full Stack Developer & Software Engineer
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Ajit Dev (brand entity: <strong className="text-slate-900">AJITDEV</strong>) is a Full Stack Developer, backend architect, and DevOps engineer based in{" "}
            <span className="font-semibold text-slate-900">Katihar, Bihar, India</span>. Dedicated to engineering robust web applications, local-first productivity tools, public developer APIs, and scalable distributed architectures.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <MapPin className="h-4 w-4 text-rose-500" />
              <span>Katihar, Bihar, India</span>
            </div>
            <span>·</span>
            <span>Full Stack Development</span>
            <span>·</span>
            <span>DevOps Automation</span>
            <span>·</span>
            <span>System Design & DSA</span>
          </div>
        </section>
      </ScrollReveal>

      {/* Engineering Focus & Competencies Grid */}
      <section aria-labelledby="competencies-title" className="mt-14 space-y-6">
        <ScrollReveal direction="up" delay={0.05}>
          <h2
            id="competencies-title"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Technical Competencies & Core Clusters
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            A structured engineering discipline bridging frontend reactivity, distributed backend services, and cloud automation.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-4">
          {/* 1. Full Stack Development */}
          <ScrollReveal direction="up" delay={0.05} className="h-full">
            <article className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                Full Stack Development
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Proficient in Next.js, React, TypeScript, and modern JavaScript. Engineering responsive client interfaces, SSR pipelines, and local-first offline architectures.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="rounded-md bg-slate-100 px-2 py-0.5">Next.js 16</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5">React 19</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5">TypeScript</span>
              </div>
            </article>
          </ScrollReveal>

          {/* 2. Backend & API Architecture */}
          <ScrollReveal direction="up" delay={0.1} className="h-full">
            <article className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                Backend & API Engineering
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Designing scalable REST and JSON APIs with resilient authentication, rate-limiting, error handling, and structured documentation.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="rounded-md bg-slate-100 px-2 py-0.5">REST APIs</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5">JSON APIs</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5">Node.js</span>
              </div>
            </article>
          </ScrollReveal>

          {/* 3. DevOps & Cloud */}
          <ScrollReveal direction="up" delay={0.15} className="h-full">
            <article className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Server className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                DevOps & Cloud Infrastructure
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Automated CI/CD pipelines, containerized deployments with Docker, Linux server configurations, and scalable cloud hosting.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="rounded-md bg-slate-100 px-2 py-0.5">CI/CD</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5">Docker</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5">Linux</span>
              </div>
            </article>
          </ScrollReveal>

          {/* 4. DevSecOps & Security */}
          <ScrollReveal direction="up" delay={0.2} className="h-full">
            <article className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                DevSecOps & API Security
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Prioritizing application security, secure data storage, API endpoint defense, automated vulnerability scanning, and user privacy guarantees.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="rounded-md bg-slate-100 px-2 py-0.5">API Security</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5">Privacy First</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5">Cloud Security</span>
              </div>
            </article>
          </ScrollReveal>

          {/* 5. System Design */}
          <ScrollReveal direction="up" delay={0.25} className="h-full">
            <article className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                System Design & Architecture
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                High-level (HLD) and low-level design (LLD) focused on decoupled microservices, database schemas, cache invalidation, and fault tolerance.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="rounded-md bg-slate-100 px-2 py-0.5">HLD & LLD</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5">Distributed</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5">Database</span>
              </div>
            </article>
          </ScrollReveal>

          {/* 6. DSA & Problem Solving */}
          <ScrollReveal direction="up" delay={0.3} className="h-full">
            <article className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                DSA & Problem Solving
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Continuous practice in algorithms, complexity analysis, and competitive programming verified across leading developer platforms.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="rounded-md bg-slate-100 px-2 py-0.5">LeetCode</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5">Codeforces</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5">NeetCode</span>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </section>

      {/* Verified Developer Profiles (Entity Disambiguation) */}
      <ScrollReveal direction="up" delay={0.1}>
        <section aria-labelledby="profiles-title" className="mt-14 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <h2 id="profiles-title" className="text-xl font-bold text-slate-900">
            Verified Developer & Coding Profiles
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Official profiles representing the genuine identity of Ajit Dev (AJITDEV).
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {personConfig.sameAs.map((url) => {
              let label = "Profile";
              if (url.includes("leetcode")) label = "LeetCode";
              else if (url.includes("neetcode")) label = "NeetCode";
              else if (url.includes("codeforces")) label = "Codeforces";
              else if (url.includes("codechef")) label = "CodeChef";
              else if (url.includes("instagram")) label = "Instagram";
              else if (url.includes("x.com")) label = "X / Twitter";

              return (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-start gap-1 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs transition hover:border-slate-300 hover:bg-slate-100"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Verified
                  </span>
                  <span className="font-semibold text-slate-800 group-hover:text-slate-950 flex items-center gap-1">
                    {label}
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      {/* Internal Navigation to Projects & API Hub */}
      <ScrollReveal direction="up" delay={0.15}>
        <section className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 pt-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition"
          >
            <span>Explore AJITDEV Projects</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="/api"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition"
          >
            <span>View Free Developer APIs</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </ScrollReveal>
    </main>
  );
}
