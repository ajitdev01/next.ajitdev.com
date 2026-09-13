"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock, ArrowUpRight } from "lucide-react";

const TARGET_DATE = new Date(
  "2026-09-23T00:00:00+05:30"
).getTime();

const TOTAL_DURATION =
  TARGET_DATE - new Date("2025-01-01T00:00:00+05:30").getTime();

const LINKS = [
  {
    label: "ajitdev.com",
    href: "https://www.ajitdev.com/",
    tag: "Main",
  },
  {
    label: "api.ajitdev.com",
    href: "https://api.ajitdev.com/",
    tag: "API",
  },
  {
    label: "brainzima.com",
    href: "https://www.brainzima.com/",
    tag: "Institute",
  },
  {
    label: "bifindr.com",
    href: "https://bifindr.com/",
    tag: "Tools",
  },
  {
    label: "rexvel.com",
    href: "https://rexvel.com/",
    tag: "RexVel Web Solution",
  },
  {
    label: "Todo App",
    href: "/todo",
    tag: "App",
  },
];

function getTimeLeft() {
  const difference = TARGET_DATE - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      progress: 100,
    };
  }

  const elapsed = TOTAL_DURATION - difference;
  const progress = Math.min(
    100,
    Math.max(0, (elapsed / TOTAL_DURATION) * 100)
  );

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    progress,
  };
}

function TimeBox({
  value,
  label,
  delay = 0,
}: {
  value: number;
  label: string;
  delay?: number;
}) {
  const padded = String(value).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="group relative"
    >
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent opacity-0 blur transition duration-500 group-hover:opacity-100" />

      <div className="relative flex h-20 w-20 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-xl transition duration-300 group-hover:border-white/20 group-hover:bg-white/[0.09] sm:h-28 sm:w-28 md:h-32 md:w-32">
        <div className="relative overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={padded}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
            >
              {padded}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.25em] text-white/40 sm:mt-2 sm:text-[10px] sm:tracking-[0.3em]">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050505] px-4 py-16 text-white sm:px-6">
      {/* Background glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px] sm:h-[600px] sm:w-[600px] sm:blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] translate-x-1/4 translate-y-1/4 rounded-full bg-purple-600/10 blur-[120px]" />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Hero */}
      <div className="relative z-10 flex w-full max-w-5xl flex-1 flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-white/50 backdrop-blur-xl sm:mb-8 sm:px-4 sm:py-2 sm:text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          Something new is coming
          <span className="ml-1 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 sm:h-2 sm:w-2" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Just
          <span className="bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent">
            {" "}
            wait.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-5 max-w-xl px-2 text-sm leading-6 text-white/40 sm:mt-6 sm:text-base sm:leading-7 md:text-lg"
        >
          We&apos;re working behind the scenes.
          <br />
          The next chapter will be ready soon.
        </motion.p>

        <div className="mt-10 flex flex-wrap justify-center gap-2.5 sm:mt-14 sm:gap-4 md:gap-5">
          <TimeBox value={timeLeft.days} label="Days" delay={0.3} />
          <TimeBox value={timeLeft.hours} label="Hours" delay={0.4} />
          <TimeBox value={timeLeft.minutes} label="Minutes" delay={0.5} />
          <TimeBox value={timeLeft.seconds} label="Seconds" delay={0.6} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mx-auto mt-10 w-full max-w-lg px-2 sm:mt-14"
        >
          <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/30 sm:text-[11px]">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              Preparing
            </span>
            <span>September 23, 2026</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${mounted ? timeLeft.progress : 0}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-white/60 via-white to-white/80"
            />
          </div>

          <div className="mt-2 text-right font-mono text-[10px] text-white/30">
            {timeLeft.progress.toFixed(1)}% complete
          </div>
        </motion.div>
      </div>

      {/* Bottom links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="relative z-10 mt-16 w-full max-w-4xl border-t border-white/5 pt-8"
      >
        <div className="mb-5 text-center text-[10px] font-medium uppercase tracking-[0.35em] text-white/25">
          Our Network
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-5">
          {LINKS.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1 + i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative flex flex-col items-start gap-1.5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 transition duration-300 group-hover:opacity-100" />

              <div className="relative flex w-full items-center justify-between">
                <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">
                  {link.tag}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-white/30 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/70" />
              </div>

              <div className="relative flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/20 transition group-hover:bg-emerald-400" />
                <span className="truncate text-xs font-medium text-white/70 transition group-hover:text-white sm:text-sm">
                  {link.label}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        <p className="mt-8 text-center text-[11px] text-white/20 sm:text-xs">
          © {new Date().getFullYear()} Ajit Dev · Stay tuned
        </p>
      </motion.div>
    </main>
  );
}