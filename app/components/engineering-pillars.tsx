"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Server,
  Terminal,
  Database,
  Cpu,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  Search,
  X,
  ArrowUpRight,
  Activity,
  Layers,
} from "lucide-react";

type CategoryFilter = "all" | "apps" | "cloud" | "core";

interface PillarItem {
  id: string;
  category: "apps" | "cloud" | "core";
  categoryLabel: string;
  badge: string;
  title: string;
  description: string;
  icon: typeof Code2;
  iconColor: string;
  iconBg: string;
  highlights: string[];
  primaryAction?: {
    label: string;
    href: string;
    external?: boolean;
  };
  secondaryAction?: {
    label: string;
    href: string;
    external?: boolean;
  };
  customSnippet?: {
    endpoint: string;
  };
  profileBadges?: Array<{
    name: string;
    href: string;
    color: string;
  }>;
}

const PILLARS: PillarItem[] = [
  {
    id: "full-stack",
    category: "apps",
    categoryLabel: "Web Applications",
    badge: "Next.js 16 · React 19",
    title: "Full Stack Development",
    description:
      "Modern web applications built with Next.js, React, TypeScript, and Node.js. Featuring reactive state architectures, local-first data layers, and clean UI design systems.",
    icon: Code2,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50 border-blue-100",
    highlights: [
      "Local-First Architecture & Storage",
      "Server Actions & SSR Pipelines",
      "End-to-End TypeScript Safety",
    ],
    primaryAction: {
      label: "Todo App (Tasks)",
      href: "/todo",
    },
    secondaryAction: {
      label: "Notes App (Notes)",
      href: "/note",
    },
  },
  {
    id: "devops",
    category: "cloud",
    categoryLabel: "Cloud & DevOps",
    badge: "CI/CD · Docker · Linux",
    title: "DevOps & Cloud Infrastructure",
    description:
      "Automated CI/CD pipelines, Docker container workflows, Linux server management, cloud security automation, and scalable deployments.",
    icon: Server,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50 border-emerald-100",
    highlights: [
      "Automated CI/CD Workflows",
      "Immutable Docker Containers",
      "Zero-Downtime Deployments",
    ],
    primaryAction: {
      label: "View Projects on ajitdev.com",
      href: "https://www.ajitdev.com/",
      external: true,
    },
    secondaryAction: {
      label: "All Projects Showcase",
      href: "/projects",
    },
  },
  {
    id: "api-hub",
    category: "cloud",
    categoryLabel: "Developer APIs",
    badge: "Public REST & JSON APIs",
    title: "AJITDEV API Hub",
    description:
      "Free REST and JSON APIs for developers. Comprehensive endpoint documentation, live testing, and developer utilities hosted on the dedicated API subdomain.",
    icon: Terminal,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50 border-purple-100",
    highlights: [
      "Free Public REST Endpoints",
      "Zero-Auth CORS-Enabled APIs",
      "Interactive Testing Console",
    ],
    customSnippet: {
      endpoint: "https://api.ajitdev.com/v1",
    },
    primaryAction: {
      label: "Explore api.ajitdev.com",
      href: "https://api.ajitdev.com/",
      external: true,
    },
    secondaryAction: {
      label: "API Documentation",
      href: "/api",
    },
  },
  {
    id: "system-design",
    category: "core",
    categoryLabel: "Architecture",
    badge: "Distributed Systems",
    title: "System Design & Backend Engineering",
    description:
      "Architectural principles for scalable distributed systems, database design, API rate-limiting, authentication protocols, and fault-tolerant backend services.",
    icon: Database,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50 border-amber-100",
    highlights: [
      "High & Low Level Design (HLD/LLD)",
      "Distributed Caching & Microservices",
      "Database Modeling & Normalization",
    ],
    primaryAction: {
      label: "Scalable Backend Architectures",
      href: "/projects",
    },
    secondaryAction: {
      label: "Technical Profile",
      href: "/about",
    },
  },
  {
    id: "dsa",
    category: "core",
    categoryLabel: "Algorithms",
    badge: "Competitive Programming",
    title: "DSA & Problem Solving",
    description:
      "Data structures, algorithmic analysis, and competitive programming verified across leading competitive platforms.",
    icon: Cpu,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50 border-rose-100",
    highlights: [
      "Complexity & Performance Optimization",
      "Dynamic Programming & Graph Theory",
      "Verified Competitive Ratings",
    ],
    profileBadges: [
      {
        name: "LeetCode",
        href: "https://leetcode.com/u/ajitdev01/",
        color: "text-amber-600 hover:text-amber-700 bg-amber-50/70 border-amber-200/70",
      },
      {
        name: "Codeforces",
        href: "https://codeforces.com/profile/ajitdev01",
        color: "text-blue-600 hover:text-blue-700 bg-blue-50/70 border-blue-200/70",
      },
      {
        name: "NeetCode",
        href: "https://neetcode.io/user/MoltenJinchuriki774",
        color: "text-emerald-600 hover:text-emerald-700 bg-emerald-50/70 border-emerald-200/70",
      },
      {
        name: "CodeChef",
        href: "https://www.codechef.com/users/ajitdev01",
        color: "text-amber-800 hover:text-amber-900 bg-amber-50/80 border-amber-300/70",
      },
    ],
  },
  {
    id: "privacy",
    category: "apps",
    categoryLabel: "User Sovereignty",
    badge: "Privacy & Zero Tracking",
    title: "Local-First & Privacy First",
    description:
      "Production web applications that respect user sovereignty. Offline capabilities, zero vendor lock-in, and private browser storage architecture.",
    icon: ShieldCheck,
    iconColor: "text-cyan-600",
    iconBg: "bg-cyan-50 border-cyan-100",
    highlights: [
      "100% Client-Side Browser Storage",
      "Zero Cloud Tracking or Lock-in",
      "Complete Data Export & Portability",
    ],
    primaryAction: {
      label: "Try Notes App (Local-First)",
      href: "/note",
    },
    secondaryAction: {
      label: "Try Todo App (Offline)",
      href: "/todo",
    },
  },
];

export default function EngineeringPillars() {
  const [activeTab, setActiveTab] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleCopyEndpoint = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  const filteredPillars = useMemo(() => {
    return PILLARS.filter((item) => {
      const matchesTab = activeTab === "all" || item.category === activeTab;
      if (!matchesTab) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inTitle = item.title.toLowerCase().includes(q);
      const inDesc = item.description.toLowerCase().includes(q);
      const inBadge = item.badge.toLowerCase().includes(q);
      const inHighlights = item.highlights.some((h) => h.toLowerCase().includes(q));
      const inProfiles = item.profileBadges?.some((p) => p.name.toLowerCase().includes(q));

      return inTitle || inDesc || inBadge || inHighlights || Boolean(inProfiles);
    });
  }, [activeTab, searchQuery]);

  const tabs: Array<{ id: CategoryFilter; label: string; count: number }> = [
    { id: "all", label: "All Engineering Pillars", count: PILLARS.length },
    {
      id: "apps",
      label: "Web & Productivity",
      count: PILLARS.filter((p) => p.category === "apps").length,
    },
    {
      id: "cloud",
      label: "DevOps & APIs",
      count: PILLARS.filter((p) => p.category === "cloud").length,
    },
    {
      id: "core",
      label: "Architecture & DSA",
      count: PILLARS.filter((p) => p.category === "core").length,
    },
  ];

  return (
    <section
      id="pillars"
      aria-labelledby="hub-heading"
      className="relative z-10 mt-16 w-full max-w-5xl border-t border-slate-200/80 pt-16 scroll-mt-10"
    >
      {/* Header Section with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          Developer Knowledge & Engineering Hub
        </div>

        <h2
          id="hub-heading"
          className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
        >
          Core Engineering Pillars & Architecture
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          A unified engineering platform founded by{" "}
          <strong className="font-semibold text-slate-900">Ajit Dev</strong>,
          spanning modern full-stack web applications, automated DevOps pipelines, public developer APIs, system architecture, and algorithmic problem solving.
        </p>
      </motion.div>

      {/* Senior UX Controls: Category Filter Tabs & Instant Filter Search */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="mt-10 flex flex-col items-center gap-4"
      >
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 touch-manipulation active:scale-95 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`ml-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-mono ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Filter Search Bar */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pillars, technologies, or topics..."
            className="w-full rounded-xl border border-slate-200/90 bg-white pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 shadow-2xs transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600"
              title="Clear search"
              aria-label="Clear search query"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Empty State when search returns no match */}
      {filteredPillars.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-200 bg-white/70 p-8 text-center">
          <p className="text-sm font-medium text-slate-700">
            No engineering pillars match &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveTab("all");
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Pillars Grid */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredPillars.map((pillar, index) => {
            const Icon = pillar.icon;

            return (
              <motion.article
                key={pillar.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.05, 0.25),
                  ease: "easeOut",
                }}
                style={{ willChange: "opacity", transform: "translateZ(0)" }}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition duration-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/40"
              >
                <div>
                  {/* Top Header: Category & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border shadow-2xs ${pillar.iconBg} ${pillar.iconColor} transition-transform group-hover:scale-105`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="rounded-full bg-slate-50 border border-slate-200/70 px-2.5 py-1 text-[10px] font-semibold text-slate-600 font-mono tracking-tight">
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-5 text-lg font-bold text-slate-900 tracking-tight group-hover:text-slate-950">
                    {pillar.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {pillar.description}
                  </p>

                  {/* Highlights Checklist */}
                  <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-600">
                    {pillar.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Interactive Code Snippet for API Hub */}
                  {pillar.customSnippet && (
                    <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50/50 p-2.5">
                      <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-purple-900">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-purple-700 shrink-0">GET</span>
                          <span className="truncate text-slate-600 font-normal">
                            {pillar.customSnippet.endpoint}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyEndpoint(
                              pillar.customSnippet?.endpoint || ""
                            )
                          }
                          className="shrink-0 inline-flex items-center gap-1 rounded-md bg-white border border-purple-200 px-2 py-0.5 text-[10px] font-semibold text-purple-700 shadow-2xs hover:bg-purple-100 active:scale-95 transition"
                          title="Copy Endpoint"
                        >
                          {copiedSnippet ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-purple-700 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Live · Zero Auth · CORS Enabled</span>
                      </div>
                    </div>
                  )}

                  {/* Profile Badges for DSA */}
                  {pillar.profileBadges && (
                    <div className="mt-4 grid grid-cols-2 gap-1.5 pt-2">
                      {pillar.profileBadges.map((badge) => (
                        <a
                          key={badge.name}
                          href={badge.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${badge.color}`}
                        >
                          <span>{badge.name}</span>
                          <ArrowUpRight className="h-3 w-3 opacity-60" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions Bar */}
                {(pillar.primaryAction || pillar.secondaryAction) && (
                  <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                    {pillar.primaryAction &&
                      (pillar.primaryAction.external ? (
                        <a
                          href={pillar.primaryAction.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 active:scale-95"
                        >
                          <span>{pillar.primaryAction.label}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <Link
                          href={pillar.primaryAction.href}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 active:scale-95"
                        >
                          <span>{pillar.primaryAction.label}</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      ))}

                    {pillar.secondaryAction &&
                      (pillar.secondaryAction.external ? (
                        <a
                          href={pillar.secondaryAction.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                        >
                          <span>{pillar.secondaryAction.label}</span>
                          <ExternalLink className="h-3 w-3 text-slate-400" />
                        </a>
                      ) : (
                        <Link
                          href={pillar.secondaryAction.href}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                        >
                          <span>{pillar.secondaryAction.label}</span>
                          <ArrowRight className="h-3 w-3 text-slate-400" />
                        </Link>
                      ))}
                  </div>
                )}
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
