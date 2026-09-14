"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Code2,
  Layers,
  ExternalLink,
  Menu,
  X,
  Globe,
  Terminal,
  ArrowRight,
} from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  // Global scroll progress tracking across all pages
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    let prev = false;
    const handleScroll = () => {
      const cur = window.scrollY > 10;
      if (cur !== prev) {
        prev = cur;
        setIsScrolled(cur);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close when clicking outside of the header
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const isProjectsActive = pathname === "/projects";

  return (
    <header
      ref={menuRef}
      role="banner"
      className={`sticky top-0 z-50 w-full transition-colors duration-200 ${
        isScrolled || mobileMenuOpen
          ? "border-b border-slate-200/90 bg-white/98 shadow-xs shadow-slate-200/30"
          : "border-b border-slate-200/60 bg-white/95"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        {/* Left: Brand Logo (NEXT.JS) */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-lg p-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          aria-label="NEXT.JS Home"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-300/80 bg-slate-950 shadow-xs transition-transform duration-300 group-hover:scale-105 group-hover:border-slate-500">
            <Image
              src="/logo.png"
              alt="AJITDEV Metallic Logo"
              width={36}
              height={36}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-base font-black tracking-tight text-slate-950 sm:text-lg">
              NEXT
            </span>
            <span className="relative flex h-2 w-2" title="Operational">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </div>
        </Link>

        {/* Desktop Navigation (Inline) */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-2">
          {/* Projects Link */}
          <Link
            href="/projects"
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 ${
              isProjectsActive
                ? "bg-slate-950 text-white shadow-xs"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Projects</span>
          </Link>

          {/* ajitdev.com Link */}
          <a
            href="https://www.ajitdev.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:text-slate-950 active:scale-95"
          >
            <span>ajitdev.com</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>

          {/* api.ajitdev.com Link */}
          <a
            href="https://api.ajitdev.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-2xs transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 active:scale-95"
          >
            <span>api.ajitdev.com</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/projects"
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition active:scale-95 ${
              isProjectsActive
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Projects</span>
          </Link>

          {/* Animated Dropdown Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 active:scale-90 ${
              mobileMenuOpen
                ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`}
            aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Clean Dropdown Menu (Only Projects, ajitdev.com, api.ajitdev.com) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="overflow-hidden border-b border-slate-200/90 bg-white/95 px-4 py-3 shadow-lg shadow-slate-900/5 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col space-y-1">
              {/* Projects */}
              <Link
                href="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                  isProjectsActive
                    ? "bg-slate-950 text-white font-bold"
                    : "text-slate-800 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="h-4 w-4" />
                  <span>Projects</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 opacity-60" />
              </Link>

              {/* ajitdev.com */}
              <a
                href="https://www.ajitdev.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="h-4 w-4 text-slate-500" />
                  <span>ajitdev.com</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>

              {/* api.ajitdev.com */}
              <a
                href="https://api.ajitdev.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="h-4 w-4 text-purple-600" />
                  <span>api.ajitdev.com</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Scroll Progress Bar across all pages */}
      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-[0_0_10px_rgba(99,102,241,0.6)] z-50 pointer-events-none"
      />
    </header>
  );
}
