import React from "react";
import Link from "next/link";

interface FooterProps {
  className?: string;
  theme?: "light" | "dark";
  currentApp?: string; // Kept for backwards compatibility
}

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/api", label: "API Hub" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

const SOCIAL_LINKS = [
  {
    href: "https://x.com/ajitdev01",
    label: "X / Twitter",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/ajitdev01/",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    href: "https://github.com/ajitdev01",
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    href: "https://www.ajitdev.com/",
    label: "Portfolio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    href: "/feed.xml",
    label: "RSS Feed",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
      </svg>
    ),
  },
];


export default function Footer({
  className = "",
  theme = "light",
}: FooterProps) {
  const isDark = theme === "dark";

  const rootCls = isDark
    ? "border-white/8 bg-transparent text-white/50"
    : "border-slate-100 bg-transparent text-slate-500";

  const linkCls = isDark
    ? "text-white/50 hover:text-white"
    : "text-slate-500 hover:text-slate-900";

  const dotCls = isDark ? "bg-white/15" : "bg-slate-300";

  const iconBtnCls = isDark
    ? "text-white/40 hover:text-white hover:bg-white/8"
    : "text-slate-400 hover:text-slate-900 hover:bg-slate-100";

  const brandCls = isDark ? "text-white/80" : "text-slate-800";

  return (
    <footer
      className={`relative z-10 w-full border-t transition-colors ${rootCls} ${className}`}
    >
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Top row: brand + social icons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Brand */}
          <Link
            href="/"
            className={`text-sm font-semibold tracking-tight transition-colors ${brandCls}`}
          >
            AJIT❤️AVNI
          </Link>

          {/* Social icons */}
          <div className="flex items-center gap-1">
            {SOCIAL_LINKS.map(({ href, label, icon }) => {
              const isExternal = href.startsWith("http");
              return (
                <a
                  key={href}
                  href={href}
                  aria-label={label}
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${iconBtnCls}`}
                >
                  {icon}
                </a>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className={`my-5 h-px w-full ${dotCls} opacity-60`} />

        {/* Bottom row: nav links + copyright */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Nav links — wraps cleanly on mobile */}
          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-xs font-medium transition-colors ${linkCls}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="shrink-0 text-xs">
            © {new Date().getFullYear()} Ajit Dev
          </p>
        </div>
      </div>
    </footer>
  );
}
