"use client";

import Link from "next/link";
import {
  CheckSquare,
  FileText,
  Home,
  ArrowUp,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Heart,
  Layers,
} from "lucide-react";

interface FooterProps {
  currentApp?: "todo" | "note" | "home";
  className?: string;
}

export default function Footer({ currentApp, className = "" }: FooterProps) {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navLinks = [
    {
      label: "Todo App",
      href: "/todo",
      icon: CheckSquare,
      active: currentApp === "todo",
      badge: "Tasks",
    },
    {
      label: "Notes App",
      href: "/note",
      icon: FileText,
      active: currentApp === "note",
      badge: "Notes",
    },
    {
      label: "Countdown",
      href: "/",
      icon: Home,
      active: currentApp === "home",
    },
  ];

  const externalLinks = [
    { label: "ajitdev.com", href: "https://www.ajitdev.com/" },
    { label: "api.ajitdev.com", href: "https://api.ajitdev.com/" },
    { label: "brainzima.com", href: "https://www.brainzima.com/" },
    { label: "bifindr.com", href: "https://bifindr.com/" },
  ];

  return (
    <footer
      className={`mt-16 border-t border-slate-200/80 bg-white/95 text-slate-600 backdrop-blur-md antialiased ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-12">
          {/* Col 1: Brand & Privacy guarantee */}
          <div className="space-y-3.5 md:col-span-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight text-slate-900">
                  AjitDev Productivity Suite
                </span>
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Local-First
                </span>
              </div>
            </div>

            <p className="max-w-md text-xs leading-relaxed text-slate-500">
              Clean, ultra-fast productivity tools crafted with a refined white aesthetic.
              Your tasks and notes remain 100% private, stored right inside your browser&apos;s
              localStorage without tracking.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-medium text-slate-700">Offline Ready & Zero Cloud Lock-in</span>
            </div>
          </div>

          {/* Col 2: In-App Switcher / Navigation */}
          <div className="space-y-3 md:col-span-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Apps & Navigation
            </div>
            <div className="flex flex-col gap-1.5">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all touch-manipulation active:scale-[0.99] ${
                      item.active
                        ? "bg-slate-900 text-white shadow-xs font-semibold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-3.5 w-3.5 ${item.active ? "text-white" : "text-slate-400 group-hover:text-slate-900"}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && !item.active && (
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 group-hover:bg-slate-200">
                        {item.badge}
                      </span>
                    )}

                    {item.active && (
                      <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] text-white">
                        Active
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Col 3: Ecosystem Network */}
          <div className="space-y-3 md:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Network & Portfolio
            </div>
            <div className="flex flex-col gap-2 text-xs">
              {externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-1 text-slate-600 hover:text-slate-900 transition touch-manipulation"
                >
                  <span className="font-medium group-hover:underline underline-offset-4">
                    {link.label}
                  </span>
                  <ExternalLink className="h-3 w-3 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-700" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-6 sm:flex-row text-xs text-slate-400 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
            <span>© {new Date().getFullYear()}</span>
            <span className="font-semibold text-slate-700">Ajit Dev</span>
            <span>·</span>
            <span>Built with Next.js & React</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-slate-500">
              Made with <Heart className="h-3 w-3 fill-rose-500 text-rose-500 inline" /> for productivity
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95 touch-manipulation"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 text-slate-400 group-hover:text-slate-700" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
