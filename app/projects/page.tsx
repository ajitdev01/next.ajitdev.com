"use client";

import Link from "next/link";
import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as HoverCard from "@radix-ui/react-hover-card";
import * as Separator from "@radix-ui/react-separator";
import {
  ArrowUpRight,
  Sparkles,
  CheckSquare,
  FileText,
  Code2,
  Compass,
  Lock,
  ExternalLink,
  ArrowRight,
  Zap,
  Globe,
  ShoppingBag,
  CloudSun,
  Bot,
} from "lucide-react";

const TAG_ICONS: Record<string, React.ReactNode> = {
  "AI Assistant": <Bot className="h-3.5 w-3.5" />,
  "E-Commerce": <ShoppingBag className="h-3.5 w-3.5" />,
  Weather: <CloudSun className="h-3.5 w-3.5" />,
  Productivity: <CheckSquare className="h-3.5 w-3.5" />,
  Authentication: <Lock className="h-3.5 w-3.5" />,
  "Developer Tools": <Code2 className="h-3.5 w-3.5" />,
  Playground: <Compass className="h-3.5 w-3.5" />,
  Solutions: <Globe className="h-3.5 w-3.5" />,
  Discovery: <Zap className="h-3.5 w-3.5" />,
  Education: <FileText className="h-3.5 w-3.5" />,
};

const TAG_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "AI Assistant": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" },
  "E-Commerce": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
  Weather: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", dot: "bg-sky-500" },
  Productivity: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  Authentication: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  "Developer Tools": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  Playground: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  Solutions: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", dot: "bg-sky-500" },
  Discovery: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
  Education: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", dot: "bg-pink-500" },
};

const PROJECTS = [
  {
    title: "AJITDEV Cloud Assistant",
    subtitle: "Gemini Agentic AI Assistant",
    description: "Production-grade AI Assistant powered by Google GenAI and Gemini models. Features deep contextual knowledge of the AJITDEV ecosystem, real-time responses, and multi-turn technical dialogues.",
    href: "#assistant",
    tag: "AI Assistant",
    badge: "Live on next.ajitdev.com",
    external: false,
    featured: true,
    tech: ["Next.js 16", "@google/genai", "Gemini Flash", "TypeScript", "Tailwind CSS"],
    details: "Server-side Google GenAI SDK integration with multi-model resilience, real-time system prompt grounding, and interactive drawer UI.",
  },
  {
    title: "E-comm Store",
    subtitle: "Next.js & Redux Toolkit Storefront",
    description: "Modern e-commerce platform built with Next.js and Redux Toolkit. Features product catalog browsing, category filters, interactive cart drawer, quantity controls, and celebratory confetti checkout modal.",
    href: "/store",
    tag: "E-Commerce",
    badge: "Live on next.ajitdev.com",
    external: false,
    featured: true,
    tech: ["Next.js 16", "Redux Toolkit", "TypeScript", "Tailwind CSS", "Canvas Confetti"],
    details: "Full client-side Redux cart store with persistent state, real-time totals calculation, and celebratory confetti modal.",
  },
  {
    title: "Weather App",
    subtitle: "Real-Time OpenWeather Forecasts",
    description: "Live weather application powered by OpenWeatherMap APIs. Features instant multi-city geocoding resolution, live weather conditions, atmospheric telemetry (humidity, pressure, wind), and Celsius/Fahrenheit units.",
    href: "/weather",
    tag: "Weather",
    badge: "Live on next.ajitdev.com",
    external: false,
    featured: true,
    tech: ["Next.js 16", "OpenWeatherMap API", "Geocoding API", "React 19", "Tailwind CSS"],
    details: "Direct coordinate resolution, atmospheric telemetry cards, and a crisp high-contrast white aesthetic.",
  },
  {
    title: "Todo App",
    subtitle: "Local-First Task Manager",
    description: "A fast, distraction-free productivity app with offline local storage, priority categorizing, and complete data sovereignty. Built with React 19, Next.js 16, and TypeScript.",
    href: "/todo",
    tag: "Productivity",
    badge: "Live on next.ajitdev.com",
    external: false,
    featured: true,
    tech: ["Next.js 16", "React 19", "TypeScript", "Local-First"],
    details: "Zero backend, full local-first architecture. Your tasks never leave your device.",
  },
  {
    title: "Notes App",
    subtitle: "Minimal Private Notes",
    description: "Ultra-clean, local-first notes application with category organization, real-time search, color accents, and full JSON backup and restore capabilities.",
    href: "/note",
    tag: "Productivity",
    badge: "Live on next.ajitdev.com",
    external: false,
    featured: true,
    tech: ["Next.js 16", "Tailwind CSS", "Framer Motion", "Offline Storage"],
    details: "Real-time search, color-coded categories, and one-click JSON export/import.",
  },
  {
    title: "Google OAuth Login",
    subtitle: "Auth.js v5 Integration",
    description: "Production-ready Google OAuth 2.0 sign-in page powered by Auth.js (NextAuth v5). Features a live session modal, graceful error handling, and a protected dashboard redirect.",
    href: "/login/google",
    tag: "Authentication",
    badge: "Live on next.ajitdev.com",
    external: false,
    featured: true,
    tech: ["Next.js 16", "Auth.js v5", "Google OAuth 2.0", "Server Actions"],
    details: "JWE-encrypted sessions, server actions, and a post-auth modal with session data.",
  },
  {
    title: "NextAuth Session Demo",
    subtitle: "Full Auth.js Flow",
    description: "Demonstrates the full Auth.js authentication flow: sign-in with Google, encrypted JWT session management, protected route guard, and server-side session verification.",
    href: "/login/nextauth",
    tag: "Authentication",
    badge: "Live on next.ajitdev.com",
    external: false,
    featured: false,
    tech: ["NextAuth v5", "JWT Sessions", "Protected Routes", "TypeScript"],
    details: "End-to-end SSR session lifecycle with server-side guard and redirect on auth failure.",
  },
  {
    title: "AJITDEV API Hub",
    subtitle: "Developer API Ecosystem",
    description: "The dedicated developer API ecosystem providing free REST and JSON APIs, live interactive endpoint testing, comprehensive documentation, and developer resources.",
    href: "https://api.ajitdev.com/",
    tag: "Developer Tools",
    badge: "api.ajitdev.com",
    external: true,
    featured: false,
    tech: ["REST APIs", "JSON APIs", "API Docs", "Public Endpoints"],
    details: "Fully documented public APIs with live Playground for instant testing.",
  },
  {
    title: "Interactive Playground",
    subtitle: "Browser Sandbox",
    description: "Browser testing environment and interactive web sandbox for testing developer tools, experimental components, and web APIs.",
    href: "https://try.ajitdev.com/",
    tag: "Playground",
    badge: "try.ajitdev.com",
    external: true,
    featured: false,
    tech: ["Web Sandbox", "Client Tools", "Interactive Testing"],
    details: "Instant browser-based execution for snippets, UI experiments, and API calls.",
  },
  {
    title: "RexVel Web Solution",
    subtitle: "Digital Agency",
    description: "Modern digital solutions, responsive web engineering, and custom application development studio.",
    href: "https://rexvel.com/",
    tag: "Solutions",
    badge: "rexvel.com",
    external: true,
    featured: false,
    tech: ["Full Stack", "Web Development", "UI/UX Architecture"],
    details: "End-to-end digital product design and delivery studio.",
  },
  {
    title: "BiFindr",
    subtitle: "Discovery Platform",
    description: "Discovery platform and developer utility hub for finding business intelligence, technical tools, and digital solutions.",
    href: "https://bifindr.com/",
    tag: "Discovery",
    badge: "bifindr.com",
    external: true,
    featured: false,
    tech: ["Search Tools", "Data Discovery", "Web Utility"],
    details: "Intelligent search and discovery across developer tools and digital assets.",
  },
  {
    title: "CollegeSure",
    subtitle: "Education Analytics",
    description: "Higher education analytics and college guidance portal designed to help students evaluate academic institutions and degree programs.",
    href: "https://collegesure.brainzima.com/",
    tag: "Education",
    badge: "collegesure.brainzima.com",
    external: true,
    featured: false,
    tech: ["Education Portal", "Analytics", "College Discovery"],
    details: "Structured data-driven insights to guide higher education decisions.",
  },
  {
    title: "Brainzima",
    subtitle: "E-Learning Platform",
    description: "Educational platform providing learning resources, computer science training, and structured tech tutorials.",
    href: "https://www.brainzima.com/",
    tag: "Education",
    badge: "brainzima.com",
    external: true,
    featured: false,
    tech: ["Tech Education", "E-Learning", "Student Resources"],
    details: "Curated CS curriculum and hands-on project-based learning tracks.",
  },
];

const ALL_TABS = ["All", ...Array.from(new Set(PROJECTS.map((p) => p.tag)))];

function TechChip({ label }: { label: string }) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className="inline-flex cursor-default items-center rounded-md border border-slate-200/70 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-white hover:text-slate-800">
            {label}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={5}
            className="z-50 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-[11px] font-medium text-slate-100 shadow-xl"
          >
            {label}
            <Tooltip.Arrow className="fill-slate-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

type Project = (typeof PROJECTS)[0];

function ProjectCard({ project }: { project: Project }) {
  const colors = TAG_COLORS[project.tag] ?? TAG_COLORS["Solutions"];
  const icon = TAG_ICONS[project.tag];

  const cardInner = (
    <HoverCard.Root openDelay={350} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60 cursor-pointer">
          {project.featured && (
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.05),transparent_60%)]" />
          )}

          <div>
            <div className="flex items-start justify-between gap-3">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${colors.bg} ${colors.text} ${colors.border}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                {icon}
                {project.tag}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400 group-hover:text-slate-600 transition-colors shrink-0">
                {project.badge}
                {project.external ? (
                  <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                ) : (
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                )}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600 leading-tight">
                {project.title}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-slate-500">{project.subtitle}</p>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-600">{project.description}</p>
          </div>

          <div className="mt-5">
            <Separator.Root className="mb-4 h-px bg-slate-100" />
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <TechChip key={t} label={t} />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-end">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5">
                {project.external ? "Visit site" : project.href === "#assistant" ? "Chat with AI" : "Open project"}
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </article>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          side="top"
          align="start"
          sideOffset={8}
          className="z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/60"
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${colors.border} ${colors.bg} ${colors.text}`}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{project.title}</p>
              <p className="text-xs text-slate-500">{project.subtitle}</p>
            </div>
          </div>
          <Separator.Root className="my-3 h-px bg-slate-100" />
          <p className="text-xs leading-relaxed text-slate-600">{project.details}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {project.tech.map((t) => (
              <span key={t} className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${colors.bg} ${colors.border} ${colors.text}`}>
                {t}
              </span>
            ))}
          </div>
          <HoverCard.Arrow className="fill-white drop-shadow-sm" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );

  if (project.href === "#assistant") {
    return (
      <button
        type="button"
        onClick={() => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("open-cloud-assistant"));
          }
        }}
        className="block h-full w-full text-left cursor-pointer focus:outline-none"
      >
        {cardInner}
      </button>
    );
  }

  if (project.external) {
    return (
      <a href={project.href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardInner}
      </a>
    );
  }
  return (
    <Link href={project.href} className="block h-full">
      {cardInner}
    </Link>
  );
}

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All" ? PROJECTS : PROJECTS.filter((p) => p.tag === activeTab);

  const counts: Record<string, number> = { All: PROJECTS.length };
  PROJECTS.forEach((p) => { counts[p.tag] = (counts[p.tag] ?? 0) + 1; });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Hero */}
      <section aria-labelledby="projects-heading" className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          Production Engineering Showcase
        </div>

        <h1 id="projects-heading" className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
          AJITDEV Projects &amp;{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Software Applications
          </span>
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          A curated showcase of live production apps, authentication demos, developer APIs, and digital tools engineered by{" "}
          <strong className="text-slate-900">Ajit Dev</strong>.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {PROJECTS.filter((p) => !p.external).length} live on this domain
          </span>
          <Separator.Root orientation="vertical" className="h-4 w-px bg-slate-200" />
          <span className="flex items-center gap-1.5">
            <ExternalLink className="h-3 w-3" />
            {PROJECTS.filter((p) => p.external).length} external sites
          </span>
          <Separator.Root orientation="vertical" className="h-4 w-px bg-slate-200" />
          <span>{PROJECTS.length} total projects</span>
        </div>
      </section>

      {/* Radix Tabs */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="mt-10">
        <div className="sticky top-0 z-20 -mx-4 bg-slate-50/90 px-4 pb-4 pt-2 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <Tabs.List aria-label="Filter projects by category" className="flex flex-wrap gap-2">
            {ALL_TABS.map((tab) => (
              <Tabs.Trigger
                key={tab}
                value={tab}
                className={[
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
                  activeTab === tab
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900",
                ].join(" ")}
              >
                {tab !== "All" && TAG_ICONS[tab]}
                {tab}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${activeTab === tab ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                  {counts[tab] ?? 0}
                </span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </div>

        {ALL_TABS.map((tab) => (
          <Tabs.Content key={tab} value={tab} className="mt-2 outline-none">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center text-slate-400">
                <Compass className="mb-3 h-10 w-10 opacity-30" />
                <p className="text-sm font-medium">No projects in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {filtered.map((project) => (
                  <ProjectCard key={project.href} project={project} />
                ))}
              </div>
            )}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </main>
  );
}

