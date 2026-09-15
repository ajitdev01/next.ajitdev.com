"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  Globe,
  Zap,
  GitBranch,
  Layers,
  CheckCircle2,
  Star,
  Activity,
  BookOpen,
  Rocket,
} from "lucide-react";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { personConfig } from "@/lib/seo/config";

// ─── Data ───────────────────────────────────────────────────────────────────

const STATS = [
  { label: "Years Building", value: "4+", icon: Rocket, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  { label: "Projects Shipped", value: "20+", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  { label: "API Uptime", value: "99.98%", icon: Activity, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100" },
  { label: "Open APIs", value: "Free", icon: Globe, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
];

const SKILLS = [
  {
    icon: Code2,
    title: "Full Stack Development",
    desc: "Building end-to-end web apps with Next.js, React 19, TypeScript — SSR, CSR, and local-first architectures.",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind"],
    iconBg: "bg-blue-50 border-blue-100",
    iconColor: "text-blue-600",
    accentBar: "from-blue-500 to-blue-400",
    level: 92,
  },
  {
    icon: Terminal,
    title: "Backend & API Engineering",
    desc: "Designing REST & JSON APIs with auth, rate limiting, structured error handling, and full documentation.",
    tags: ["Node.js", "REST APIs", "JSON APIs", "Auth"],
    iconBg: "bg-purple-50 border-purple-100",
    iconColor: "text-purple-600",
    accentBar: "from-purple-500 to-purple-400",
    level: 88,
  },
  {
    icon: Server,
    title: "DevOps & Cloud Infrastructure",
    desc: "Automated CI/CD pipelines, Docker containers, Linux server ops, and scalable cloud deployments.",
    tags: ["CI/CD", "Docker", "Linux", "Cloud"],
    iconBg: "bg-emerald-50 border-emerald-100",
    iconColor: "text-emerald-600",
    accentBar: "from-emerald-500 to-emerald-400",
    level: 82,
  },
  {
    icon: ShieldCheck,
    title: "DevSecOps & API Security",
    desc: "Application hardening, endpoint defense, automated vulnerability scanning, and user-privacy guarantees.",
    tags: ["API Security", "Privacy First", "TLS 1.3", "CORS"],
    iconBg: "bg-cyan-50 border-cyan-100",
    iconColor: "text-cyan-600",
    accentBar: "from-cyan-500 to-cyan-400",
    level: 79,
  },
  {
    icon: Database,
    title: "System Design & Architecture",
    desc: "HLD & LLD for decoupled microservices, database schemas, cache invalidation strategies, and fault tolerance.",
    tags: ["HLD & LLD", "Distributed", "Database", "Caching"],
    iconBg: "bg-amber-50 border-amber-100",
    iconColor: "text-amber-600",
    accentBar: "from-amber-500 to-amber-400",
    level: 85,
  },
  {
    icon: Cpu,
    title: "DSA & Problem Solving",
    desc: "Competitive programming, complexity analysis, and algorithm engineering verified across top coding platforms.",
    tags: ["LeetCode", "Codeforces", "NeetCode", "CodeChef"],
    iconBg: "bg-rose-50 border-rose-100",
    iconColor: "text-rose-600",
    accentBar: "from-rose-500 to-rose-400",
    level: 76,
  },
];

const JOURNEY = [
  {
    year: "2024",
    title: "Started Coding Journey",
    desc: "Began with HTML, CSS, and JavaScript — built first portfolio sites and fell in love with the web.",
    icon: BookOpen,
    color: "bg-blue-500",
  },
  {
    year: "2025",
    title: "Backend & API Building",
    desc: "Dived into Node.js, REST APIs, and databases. Launched first public endpoints under the AJITDEV brand.",
    icon: Terminal,
    color: "bg-purple-500",
  },
  {
    year: "2025",
    title: "Full Stack & DevOps",
    desc: "Mastered Next.js, Docker, CI/CD pipelines. Built and deployed brainzima.com and rexvel.com in production.",
    icon: GitBranch,
    color: "bg-emerald-500",
  },
  {
    year: "2026",
    title: "API Platform & Ecosystem",
    desc: "Launched api.ajitdev.com — a free public API hub with edge delivery, 99.98% uptime, and HTTP/3 QUIC.",
    icon: Zap,
    color: "bg-amber-500",
  },
  {
    year: "2026 →",
    title: "Scaling & Building More",
    desc: "Expanding the AJITDEV ecosystem with new products, open-source tools, and engineering writeups.",
    icon: Rocket,
    color: "bg-rose-500",
  },
];

const ECOSYSTEMS = [
  { name: "ajitdev.com", tag: "Portfolio", href: "https://www.ajitdev.com/", dot: "bg-emerald-400" },
  { name: "api.ajitdev.com", tag: "API Hub", href: "https://api.ajitdev.com/", dot: "bg-blue-400" },
  { name: "brainzima.com", tag: "EdTech", href: "https://www.brainzima.com/", dot: "bg-purple-400" },
  { name: "bifindr.com", tag: "Discovery", href: "https://bifindr.com/", dot: "bg-cyan-400" },
  { name: "rexvel.com", tag: "Dev Agency", href: "https://rexvel.com/", dot: "bg-amber-400" },
  { name: "try.ajitdev.com", tag: "Sandbox", href: "https://try.ajitdev.com/", dot: "bg-rose-400" },
];

const PROFILE_LABELS: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  leetcode: {
    label: "LeetCode",
    bg: "bg-amber-50 border-amber-200/80",
    text: "text-amber-700",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
      </svg>
    ),
  },
  neetcode: {
    label: "NeetCode",
    bg: "bg-green-50 border-green-200/80",
    text: "text-green-700",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  codeforces: {
    label: "Codeforces",
    bg: "bg-blue-50 border-blue-200/80",
    text: "text-blue-700",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M4.5 7.5A1.5 1.5 0 0 1 6 9v10.5A1.5 1.5 0 0 1 4.5 21h-3A1.5 1.5 0 0 1 0 19.5V9A1.5 1.5 0 0 1 1.5 7.5h3zm9-4.5A1.5 1.5 0 0 1 15 4.5v15A1.5 1.5 0 0 1 13.5 21h-3A1.5 1.5 0 0 1 9 19.5v-15A1.5 1.5 0 0 1 10.5 3h3zm9 7.5A1.5 1.5 0 0 1 24 12v7.5A1.5 1.5 0 0 1 22.5 21h-3A1.5 1.5 0 0 1 18 19.5V12a1.5 1.5 0 0 1 1.5-1.5h3z"/>
      </svg>
    ),
  },
  codechef: {
    label: "CodeChef",
    bg: "bg-orange-50 border-orange-200/80",
    text: "text-orange-700",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M11.257.004C5.23-.109 0 4.816 0 10.845c0 3.053 1.267 5.808 3.293 7.767l-.03.03.03.027A10.816 10.816 0 0 0 11.257 22c3.25 0 6.16-1.42 8.187-3.674l-.004-.004.004-.004A10.817 10.817 0 0 0 22 10.845C22 4.816 17.283.117 11.257.004zm-.154 1.853c1.005-.033 2.017.122 2.964.47l-2.964 3.327-2.97-3.327a9.05 9.05 0 0 1 2.97-.47zM6.93 3.167l3.89 4.37H3.4a9.07 9.07 0 0 1 3.53-4.37zm8.24 0a9.066 9.066 0 0 1 3.527 4.37H11.82l3.35-4.37zM2.955 9.39h16.09c.097.472.147.96.147 1.455 0 4.91-3.954 8.892-8.835 8.892S1.52 15.755 1.52 10.845c0-.495.05-.983.147-1.455h1.288z"/>
      </svg>
    ),
  },
  instagram: {
    label: "Instagram",
    bg: "bg-pink-50 border-pink-200/80",
    text: "text-pink-700",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  "x.com": {
    label: "X / Twitter",
    bg: "bg-slate-50 border-slate-200/80",
    text: "text-slate-800",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 5.584zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AboutPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 pb-20">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <ScrollReveal direction="up" delay={0.05}>
        <section aria-labelledby="about-title" className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm mb-8">
          {/* Gradient blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-purple-100/50 blur-3xl" />
          </div>

          <div className="relative p-6 sm:p-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-700 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              Developer Profile · AJITDEV Entity
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-xl text-3xl sm:text-4xl font-black select-none">
                  A
                </div>
                <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 border-2 border-white shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                </span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h1
                  id="about-title"
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight"
                >
                  Ajit Dev
                  <span className="ml-2 text-base sm:text-lg font-semibold text-slate-400">· AJITDEV</span>
                </h1>
                <p className="mt-1.5 text-sm sm:text-base font-medium text-slate-600">
                  Full Stack Developer · Backend Architect · DevOps Engineer
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-rose-500" />
                    Katihar, Bihar, India
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Available for Projects
                  </span>
                  <span className="text-slate-300">·</span>
                  <span>System Design · DSA · DevOps</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-6 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600">
              <strong className="text-slate-900">Ajit Dev</strong> is an independent software engineer and founder of the{" "}
              <strong className="text-slate-900">AJITDEV</strong> ecosystem — a suite of live production platforms spanning developer APIs, EdTech, discovery engines, and software agencies.
              Dedicated to engineering robust web applications, local-first productivity tools, public developer APIs, and scalable distributed architectures
              — all shipped from{" "}
              <span className="font-semibold text-slate-900">Katihar, Bihar, India</span>.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* ── STATS BAR ──────────────────────────────────────────── */}
      <ScrollReveal direction="up" delay={0.08}>
        <section aria-label="Quick stats" className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.4, ease: "easeOut" }}
              className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${stat.bg} ${stat.border}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-black text-slate-900 leading-none">{stat.value}</div>
                <div className="mt-0.5 text-[11px] text-slate-500 leading-tight">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </section>
      </ScrollReveal>

      {/* ── SKILLS GRID ────────────────────────────────────────── */}
      <section aria-labelledby="skills-title" className="mb-12">
        <ScrollReveal direction="up" delay={0.05}>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="h-5 w-5 text-slate-400" />
              <h2 id="skills-title" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Technical Competencies
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-2xl">
              A structured engineering discipline bridging frontend reactivity, distributed backend services, and cloud automation.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((skill, i) => (
            <ScrollReveal key={skill.title} direction="up" delay={0.04 * i} className="h-full">
              <article className="group h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${skill.iconBg}`}>
                  <skill.icon className={`h-5 w-5 ${skill.iconColor}`} />
                </div>

                <h3 className="mt-3.5 text-sm font-bold text-slate-900">{skill.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{skill.desc}</p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Proficiency</span>
                    <span className="text-[10px] font-bold text-slate-600">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${skill.accentBar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.1 * i, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {skill.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── JOURNEY TIMELINE ───────────────────────────────────── */}
      <ScrollReveal direction="up" delay={0.05}>
        <section aria-labelledby="journey-title" className="mb-12 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <GitBranch className="h-5 w-5 text-slate-400" />
            <h2 id="journey-title" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Engineering Journey
            </h2>
          </div>

          <div className="space-y-6">
            {JOURNEY.map((item, i) => (
              <ScrollReveal key={item.year} direction="left" delay={0.06 * i}>
                <div className="flex gap-4 sm:gap-6 items-start">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color} text-white shadow-sm`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                        {item.year}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-500">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ── ECOSYSTEM DOMAINS ──────────────────────────────────── */}
      <ScrollReveal direction="up" delay={0.05}>
        <section aria-labelledby="ecosystem-title" className="mb-12 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-5 w-5 text-slate-400" />
            <h2 id="ecosystem-title" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              AJITDEV Ecosystem
            </h2>
          </div>
          <p className="text-sm text-slate-500 mb-6">Live production platforms built and maintained by Ajit Dev.</p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ECOSYSTEMS.map((eco) => (
              <a
                key={eco.href}
                href={eco.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 text-sm transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${eco.dot}`} />
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800 group-hover:text-slate-950 truncate text-sm">{eco.name}</div>
                    <div className="text-[11px] text-slate-400">{eco.tag}</div>
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-slate-500 transition" />
              </a>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ── CODING PROFILES ────────────────────────────────────── */}
      <ScrollReveal direction="up" delay={0.08}>
        <section aria-labelledby="profiles-title" className="mb-12 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-slate-400" />
            <h2 id="profiles-title" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Verified Coding Profiles
            </h2>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            Official profiles representing the genuine identity of Ajit Dev (AJITDEV).
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {personConfig.sameAs.map((url) => {
              const key = Object.keys(PROFILE_LABELS).find((k) => url.includes(k));
              const config = key
                ? PROFILE_LABELS[key]
                : { label: "Profile", bg: "bg-slate-50 border-slate-200/80", text: "text-slate-700", icon: <ExternalLink className="h-5 w-5" /> };

              return (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col items-start gap-2 rounded-2xl border p-4 text-xs transition hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${config.bg}`}
                >
                  <span className={config.text}>{config.icon}</span>
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Verified ✓</div>
                    <div className={`flex items-center gap-1 font-bold text-sm ${config.text}`}>
                      {config.label}
                      <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      </ScrollReveal>


    </main>
  );
}
