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
    href: "https://github.com/ajitdev",
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
            AJI TDEV
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
