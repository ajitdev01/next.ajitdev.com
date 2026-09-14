"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Home,
  CheckCircle2,
  Compass,
  ArrowUpRight,
  RefreshCw,
  Search,
  Sparkles,
  Terminal,
  AlertTriangle,
} from "lucide-react";

const QUICK_LINKS = [
  {
    title: "Home",
    desc: "Return to the main countdown and projects showcase",
    href: "/",
    tag: "Main",
  },
  {
    title: "Todo App",
    desc: "Manage tasks, dates, and priorities with LocalStorage",
    href: "/todo",
    tag: "App",
  },
  {
    title: "Notes App",
    desc: "Personal thoughts, notes & ideas saved in LocalStorage",
    href: "/note",
    tag: "App",
  },
  {
    title: "ajitdev.com",
    desc: "Portfolio, software projects, and articles",
    href: "https://www.ajitdev.com/",
    tag: "Portfolio",
    external: true,
  },
  {
    title: "api.ajitdev.com",
    desc: "Explore public API services and documentation",
    href: "https://api.ajitdev.com/",
    tag: "API",
    external: true,
  },
];

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-[#05070d] text-white flex flex-col justify-between selection:bg-white/20 selection:text-white">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-[120px] rounded-full" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 mx-auto w-full max-w-5xl px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-xs font-medium text-white/60 hover:text-white transition-colors tracking-tight"
        >
          next.ajitdev.com
        </Link>
        <Link
          href="/todo"
          className="text-xs font-medium text-white/40 hover:text-white transition-colors"
        >
          Todo App
        </Link>
      </header>

      {/* Clean Centered Content */}
      <main className="relative z-10 mx-auto w-full max-w-md px-6 text-center my-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="space-y-4"
        >
          {/* Subtle 404 pill */}
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs text-white/50 backdrop-blur-md">
            404
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Page not found
          </h1>

          <p className="text-sm text-white/50 leading-relaxed max-w-xs mx-auto">
            Sorry, we couldn’t find the page you were looking for. It might have been moved or removed.
          </p>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-white px-4 text-xs font-medium text-slate-950 shadow-xs hover:bg-slate-100 transition-colors"
            >
              <Home className="mr-1.5 h-3.5 w-3.5" />
              Return home
            </Link>

            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-white/10 bg-transparent px-3.5 text-xs font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Go back
            </button>
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 mx-auto w-full max-w-5xl px-6 py-6 text-center text-[11px] text-white/20">
        next.ajitdev.com
      </footer>
    </div>
  );
}
