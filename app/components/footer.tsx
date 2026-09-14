import React from "react";
import Link from "next/link";

interface FooterProps {
  className?: string;
  theme?: "light" | "dark";
  currentApp?: string; // Kept for backwards compatibility
}

export default function Footer({
  className = "",
  theme = "light",
}: FooterProps) {
  const isDark = theme === "dark";

  const containerBorder = isDark
    ? "border-white/10 text-white/40"
    : "border-slate-200/80 text-slate-500";

  const linkColor = isDark
    ? "text-white/50 hover:text-white"
    : "text-slate-500 hover:text-slate-900";

  const separatorColor = isDark ? "text-white/20" : "text-slate-300";

  return (
    <footer
      className={`relative z-10 w-full border-t pt-8 pb-10 text-center text-xs transition-colors ${containerBorder} ${className}`}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="font-normal tracking-normal">
          © {new Date().getFullYear()} AJITDEV · Engineered by Ajit Dev
        </p>

        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs"
        >
          <Link
            href="/about"
            className={`transition-colors font-medium ${linkColor}`}
          >
            About
          </Link>
          <span className={separatorColor} aria-hidden="true">
            ·
          </span>
          <Link
            href="/projects"
            className={`transition-colors font-medium ${linkColor}`}
          >
            Projects
          </Link>
          <span className={separatorColor} aria-hidden="true">
            ·
          </span>
          <Link
            href="/api"
            className={`transition-colors font-medium ${linkColor}`}
          >
            API Hub
          </Link>
          <span className={separatorColor} aria-hidden="true">
            ·
          </span>
          <a
            href="https://www.ajitdev.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors font-medium ${linkColor}`}
          >
            AJIT Dev
          </a>
          <span className={separatorColor} aria-hidden="true">
            ·
          </span>
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors font-medium ${linkColor}`}
          >
            RSS Feed
          </a>
        </nav>
      </div>
    </footer>
  );
}
