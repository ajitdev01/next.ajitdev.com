import type { Metadata } from "next";
import Link from "next/link";
import {
  Scale, ArrowLeft, ShieldCheck, UserCheck, Ban,
  Globe, Mail, Laptop, AlertTriangle, FileText, RefreshCw,
} from "lucide-react";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Terms of Service | AJITDEV",
  description:
    "Terms of Service governing your use of the AJITDEV developer platform, applications, Google Sign-In authentication, and acceptable use guidelines.",
  alternates: { canonical: "https://next.ajitdev.com/terms" },
  openGraph: {
    title: "Terms of Service | AJITDEV",
    description:
      "Review the Terms of Service for AJITDEV, including Google OAuth authentication, user responsibilities, and acceptable use.",
    url: "https://next.ajitdev.com/terms",
    type: "website",
  },
};

const SECTIONS = [
  { id: "acceptance",      label: "Acceptance of Terms" },
  { id: "accounts",        label: "Accounts & Google Auth" },
  { id: "acceptable-use",  label: "Acceptable Use" },
  { id: "ip",              label: "Intellectual Property" },
  { id: "third-party",     label: "Third-Party Services" },
  { id: "disclaimer",      label: "Disclaimer" },
  { id: "liability",       label: "Limitation of Liability" },
  { id: "modifications",   label: "Service Modifications" },
  { id: "changes",         label: "Changes to Terms" },
  { id: "contact",         label: "Governing Law & Contact" },
];

export default function TermsOfServicePage() {
  const lastUpdated = "September 15, 2026";

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-slate-900 selection:text-white overflow-x-clip">
      {/* Gradient hero backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-indigo-50/60 to-transparent" />
      <div
        style={{ contain: "paint" }}
        className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.07)_0%,transparent_70%)]"
      />

      {/* Top nav bar */}
      <div className="relative z-10 border-b border-slate-200/70 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 transition group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/privacy" className="text-xs font-medium text-slate-500 hover:text-slate-900 transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 mb-5">
            <Scale className="h-3.5 w-3.5" />
            User Agreement
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            These Terms govern your access to{" "}
            <strong className="font-semibold text-slate-900">next.ajitdev.com</strong>,
            personal productivity applications, developer APIs, and services operated by Ajit Dev.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono text-slate-600">
              <RefreshCw className="h-3 w-3 text-slate-400" />
              Updated: <strong className="text-slate-800 ml-1">{lastUpdated}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-mono text-indigo-700">
              <FileText className="h-3 w-3" />
              Effective: <strong className="ml-1">September 15, 2026</strong>
            </span>
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Sticky sidebar TOC */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Contents
              </p>
              <nav className="flex flex-col gap-0.5">
                {SECTIONS.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-600">
                      {i + 1}
                    </span>
                    {s.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Article */}
          <article className="min-w-0 flex-1 space-y-6 text-sm leading-relaxed text-slate-700">

            {/* 1 */}
            <section id="acceptance" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              <SectionHeader n={1} icon={<ShieldCheck className="h-4 w-4 text-slate-600" />} title="Acceptance of Terms" />
              <p className="text-slate-600">
                By accessing, browsing, creating an account, or using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our{" "}
                <Link href="/privacy" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800">Privacy Policy</Link>.
                If you do not agree to these Terms, you must discontinue use of the website immediately.
              </p>
            </section>

            {/* 2 */}
            <section id="accounts" className="scroll-mt-6 rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-white to-indigo-50/30 p-6 shadow-xs sm:p-8">
              <SectionHeader n={2} icon={<UserCheck className="h-4 w-4 text-indigo-600" />} title="User Accounts & Google Authentication" accent="indigo" />
              <p className="text-slate-600 mb-4">
                To access interactive features, you may authenticate using &quot;Sign in with Google&quot; via Google OAuth 2.0:
              </p>
              <ul className="space-y-3">
                {[
                  ["Account Security", "You are responsible for safeguarding your Google account credentials and must notify us immediately if you suspect unauthorized access."],
                  ["Accurate Identity", "You agree not to impersonate any person or entity, or create accounts using false or misleading identity information."],
                  ["No Password Handling", "AJITDEV uses OAuth 2.0 delegation — we do not store or process your Google password directly."],
                ].map(([t, d]) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400 translate-y-1.5" />
                    <span><strong className="font-semibold text-slate-900">{t}:</strong> {d}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 3 */}
            <section id="acceptable-use" className="scroll-mt-6 rounded-2xl border border-red-200/60 bg-red-50/20 p-6 shadow-xs sm:p-8">
              <SectionHeader n={3} icon={<Ban className="h-4 w-4 text-red-500" />} title="Acceptable Use & Developer Guidelines" accent="red" />
              <p className="text-slate-600 mb-4">
                You agree to use our platform and public APIs in good faith. You agree <strong className="text-slate-900">NOT</strong> to:
              </p>
              <ul className="space-y-2.5">
                {[
                  "Probe, scan, or test the vulnerability of our system or network without express authorization.",
                  "Launch Denial-of-Service (DoS/DDoS) attacks, flood public API endpoints, or intentionally circumvent rate limits.",
                  "Transmit malware, viruses, worms, or malicious code through contact forms or interactive inputs.",
                  "Scrape, extract, or harvest user data or infrastructure credentials using automated means.",
                  "Interfere with or disrupt the integrity or performance of the website or data hosted therein.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-400 mt-0.5" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 4 */}
            <section id="ip" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              <SectionHeader n={4} icon={<Laptop className="h-4 w-4 text-slate-600" />} title="Intellectual Property Rights" />
              <p className="text-slate-600 mb-3">
                The design, layouts, logos, branding, graphics, source code, and content of AJITDEV are the property of Ajit Dev and are protected by applicable copyright, trademark, and intellectual property laws.
              </p>
              <p className="text-slate-600">
                Open-source components are subject to their respective licenses (e.g., MIT). You retain all ownership rights to any notes, tasks, or personal code snippets you produce within our productivity tools.
              </p>
            </section>

            {/* 5 */}
            <section id="third-party" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              <SectionHeader n={5} icon={<Globe className="h-4 w-4 text-emerald-600" />} title="Third-Party Services & External Links" />
              <p className="text-slate-600">
                Our website integrates with third-party providers (Google OAuth, Vercel, Cloudflare) and contains links to external developer resources. We do not control and are not responsible for the availability, content, or privacy practices of third-party platforms. Your interaction with third parties is governed by their respective policies.
              </p>
            </section>

            {/* 6 */}
            <section id="disclaimer" className="scroll-mt-6 rounded-2xl border border-amber-200/60 bg-amber-50/20 p-6 shadow-xs sm:p-8">
              <SectionHeader n={6} icon={<AlertTriangle className="h-4 w-4 text-amber-500" />} title='Disclaimer of Warranties ("AS-IS")' accent="amber" />
              <p className="text-slate-600">
                The website, developer tools, and APIs are provided on an{" "}
                <strong className="font-semibold text-slate-900">&quot;AS IS&quot;</strong> and{" "}
                <strong className="font-semibold text-slate-900">&quot;AS AVAILABLE&quot;</strong>{" "}
                basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or uninterrupted availability. While we strive for high uptime, we do not warrant that services will be completely error-free.
              </p>
            </section>

            {/* 7 */}
            <section id="liability" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              <SectionHeader n={7} icon={<Scale className="h-4 w-4 text-slate-600" />} title="Limitation of Liability" />
              <p className="text-slate-600">
                To the maximum extent permitted by applicable law, in no event shall AJITDEV, its creator, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages (including loss of profits, data, goodwill, or business interruption) arising out of or in connection with your use of, or inability to use, the website or services.
              </p>
            </section>

            {/* 8 */}
            <section id="modifications" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              <SectionHeader n={8} icon={<RefreshCw className="h-4 w-4 text-slate-600" />} title="Service Modifications & Account Termination" />
              <p className="text-slate-600 mb-3">
                We reserve the right to modify, update, suspend, or discontinue any feature, tool, or endpoint at our discretion without prior notice.
              </p>
              <p className="text-slate-600">
                We may terminate or suspend your access to authenticated features immediately if you breach these Terms or engage in abusive activity. You may also stop using our services and request account deletion at any time.
              </p>
            </section>

            {/* 9 */}
            <section id="changes" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              <SectionHeader n={9} icon={<FileText className="h-4 w-4 text-slate-600" />} title="Modifications to these Terms" />
              <p className="text-slate-600">
                We reserve the right to revise these Terms periodically. Updates will be published on this page with an updated &quot;Last Updated&quot; date. Your continued access to or use of the website following any changes constitutes your binding agreement to the amended Terms.
              </p>
            </section>

            {/* 10 */}
            <section id="contact" className="scroll-mt-6 rounded-2xl border border-slate-900/10 bg-slate-900 p-6 shadow-xs sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white text-xs font-bold">
                  10
                </div>
                <h2 className="text-base font-bold text-white">Governing Law & Contact</h2>
              </div>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                These Terms shall be governed by the laws of India. If you have any inquiries, please contact us through one of our official channels:
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <a
                  href="mailto:support@ajitdev.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/8 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/15 transition"
                >
                  <Mail className="h-3.5 w-3.5 text-indigo-400" />
                  support@ajitdev.com
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-400 transition"
                >
                  Contact Form
                </Link>
                <a
                  href="https://www.ajitdev.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/8 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/15 transition"
                >
                  <Globe className="h-3.5 w-3.5 text-emerald-400" />
                  ajitdev.com
                </a>
              </div>
            </section>

          </article>
        </div>

        <div className="mt-16">
          <Footer theme="light" className="w-full" />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  n, icon, title, accent = "slate",
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  accent?: "slate" | "indigo" | "red" | "amber";
}) {
  const bg: Record<string, string> = {
    slate: "bg-slate-100 border-slate-200 text-slate-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
    red: "bg-red-50 border-red-200 text-red-600",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
  };
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold shrink-0 ${bg[accent]}`}>
        {n}
      </div>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-base font-bold text-slate-950">{title}</h2>
      </div>
    </div>
  );
}
