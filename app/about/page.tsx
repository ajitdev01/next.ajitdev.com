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
  { label: "Active Building", value: "Since 2024", icon: Rocket, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  { label: "Live Projects", value: "15+", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  { label: "Target SLA", value: "99.9%", icon: Activity, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100" },
  { label: "Open APIs", value: "Public", icon: Globe, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
];

const SKILLS = [
  {
    icon: Code2,
    title: "Full Stack Development",
    desc: "Building end-to-end web apps with Next.js, React 19, TypeScript — SSR, CSR, and local-first architectures.",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind"],
    iconBg: "bg-blue-50 border-blue-100",
    iconColor: "text-blue-600",
    tier: "Primary Production Stack",
  },
  {
    icon: Terminal,
    title: "Backend & API Engineering",
    desc: "Designing REST & JSON APIs with auth, rate limiting, structured error handling, and full documentation.",
    tags: ["Node.js", "REST APIs", "JSON APIs", "Auth"],
    iconBg: "bg-purple-50 border-purple-100",
    iconColor: "text-purple-600",
    tier: "Core Architecture",
  },
  {
    icon: Server,
    title: "DevOps & Cloud Infrastructure",
    desc: "Automated CI/CD pipelines, Docker containers, Linux server ops, and scalable cloud deployments.",
    tags: ["CI/CD", "Docker", "Linux", "Cloud"],
    iconBg: "bg-emerald-50 border-emerald-100",
    iconColor: "text-emerald-600",
    tier: "CI/CD & Containers",
  },
  {
    icon: ShieldCheck,
    title: "DevSecOps & API Security",
    desc: "Application hardening, endpoint defense, automated vulnerability scanning, and user-privacy guarantees.",
    tags: ["API Security", "Privacy First", "TLS 1.3", "CORS"],
    iconBg: "bg-cyan-50 border-cyan-100",
    iconColor: "text-cyan-600",
    tier: "Security Hardening",
  },
  {
    icon: Database,
    title: "System Design & Architecture",
    desc: "HLD & LLD for decoupled microservices, database schemas, cache invalidation strategies, and fault tolerance.",
    tags: ["HLD & LLD", "Distributed", "Database", "Caching"],
    iconBg: "bg-amber-50 border-amber-100",
    iconColor: "text-amber-600",
    tier: "System Design",
  },
  {
    icon: Cpu,
    title: "DSA & Problem Solving",
    desc: "Competitive programming, complexity analysis, and algorithm engineering verified across top coding platforms.",
    tags: ["LeetCode", "Codeforces", "NeetCode", "CodeChef"],
    iconBg: "bg-rose-50 border-rose-100",
    iconColor: "text-rose-600",
    tier: "Competitive Ratings",
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
    desc: "Launched api.ajitdev.com — a free public API hub with edge delivery, high-availability SLA, and HTTP/3 QUIC.",
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

const CODING_PROFILES = [
  "https://github.com/ajitdev01",
  "https://linkedin.com/in/ajitdev01",
  "https://leetcode.com/ajitdev01",
  "https://codeforces.com/profile/ajitdev01",
  "https://www.codechef.com/users/ajitdev01/",
  "https://neetcode.io/user/MoltenJinchuriki774",
];

const PROFILE_LABELS: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  github: {
    label: "GitHub",
    bg: "bg-slate-100 border-slate-300",
    text: "text-slate-900",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  linkedin: {
    label: "LinkedIn",
    bg: "bg-blue-50 border-blue-200/80",
    text: "text-blue-700",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
      </svg>
    ),
  },
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
  facebook: {
    label: "Facebook",
    bg: "bg-indigo-50 border-indigo-200/80",
    text: "text-indigo-700",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  snapchat: {
    label: "Snapchat",
    bg: "bg-amber-50 border-amber-200/80",
    text: "text-amber-800",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12.004 0C7.21 0 5.08 3.513 5.08 5.762c0 .927.42 2.392.796 3.197.108.232.064.444-.128.534-.486.23-1.408.68-1.897 1.545-.443.784-.13 1.884.945 2.05.772.12 1.378-.344 1.73-.706.182-.187.397-.132.485.08.358.875.998 2.078 2.72 2.455.197.043.277.166.232.327-.145.523-.74 1.503-2.185 1.713-.397.058-.62.333-.532.695.145.596 1.156.883 2.115 1.05.176.03.24.137.215.31-.082.56-.23 1.344-.735 1.795-.27.242-.32.49-.158.745.22.348.868.49 1.488.35.438-.1.97-.432 1.564-.432.557 0 1.077.31 1.494.417.65.166 1.332.022 1.57-.333.17-.255.118-.505-.145-.742-.51-.458-.66-1.242-.74-1.802-.025-.174.04-.28.214-.31 1-.17 2.016-.462 2.158-1.066.088-.37-.14-.64-.543-.698-1.44-.207-2.037-1.186-2.182-1.708-.046-.164.034-.287.23-.33 1.725-.378 2.366-1.58 2.724-2.455.088-.212.303-.267.485-.08.352.362.958.826 1.73.706 1.075-.166 1.388-1.266.945-2.05-.49-.865-1.41-1.315-1.897-1.545-.192-.09-.236-.302-.128-.534.376-.805.796-2.27.796-3.197C18.928 3.513 16.798 0 12.004 0z"/>
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

                {/* Engineering Focus Tier */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Focus Discipline</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200/80 px-2.5 py-0.5 text-[10px] font-medium text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {skill.tier}
                  </span>
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

          {/* Semantic Ecosystem Backlinks for Search Crawlers — Zero Visual UI Impact */}
          <div className="sr-only" aria-label="Additional Ecosystem Endpoints">
            <a href="https://collegesure.brainzima.com/" rel="noopener noreferrer">
              CollegeSure — Higher Education Analytics
            </a>
            <a href="https://trybook.in/" rel="noopener noreferrer">
              TryBook — Digital Book Discovery & E-Books
            </a>
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
            {CODING_PROFILES.map((url) => {
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

          {/* Semantic author backlinks & entity interlinks — Zero UI change */}
          <div className="sr-only" aria-label="Author Profiles & Backlinks">
            {personConfig.sameAs.map((url) => (
              <a key={url} href={url} rel="me noopener">
                Ajit Dev ({url})
              </a>
            ))}
          </div>
        </section>
      </ScrollReveal>


    </main>
  );
}
