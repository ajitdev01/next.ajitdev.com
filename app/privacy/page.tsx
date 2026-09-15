import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield, ArrowLeft, Lock, UserCheck, EyeOff, Key,
  Cookie, RefreshCw, Mail, Globe, CheckCircle2, Database, Baby,
} from "lucide-react";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy | AJITDEV",
  description:
    "Privacy Policy for AJITDEV detailing data collection, Google Sign-In / OAuth integration, session handling, user rights, and data protection practices.",
  alternates: { canonical: "https://next.ajitdev.com/privacy" },
  openGraph: {
    title: "Privacy Policy | AJITDEV",
    description:
      "Understand how AJITDEV handles authentication, Google OAuth basic profile data, cookies, and data privacy.",
    url: "https://next.ajitdev.com/privacy",
    type: "website",
  },
};

const SECTIONS = [
  { id: "overview",       label: "Overview & Commitment" },
  { id: "google-auth",    label: "Google Sign-In & OAuth" },
  { id: "direct-data",    label: "Information Collected" },
  { id: "cookies",        label: "Cookies & Sessions" },
  { id: "analytics",      label: "Analytics & Infrastructure" },
  { id: "security",       label: "Data Retention & Security" },
  { id: "rights",         label: "Your Rights & Deletion" },
  { id: "children",       label: "Children's Privacy" },
  { id: "updates",        label: "Policy Updates" },
  { id: "contact",        label: "Contact Us" },
];

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 15, 2026";

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-slate-900 selection:text-white overflow-x-clip">
      {/* Gradient hero backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-50/60 to-transparent" />
      <div
        style={{ contain: "paint" }}
        className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.07)_0%,transparent_70%)]"
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
            <Link href="/terms" className="text-xs font-medium text-slate-500 hover:text-slate-900 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 mb-5">
            <Shield className="h-3.5 w-3.5" />
            Legal &amp; Data Protection
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            How AJITDEV collects, uses, protects, and handles your information when you visit{" "}
            <strong className="font-semibold text-slate-900">next.ajitdev.com</strong> and associated developer tools.
          </p>

          {/* Quick trust badges */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { icon: <EyeOff className="h-3 w-3" />, text: "No password stored" },
              { icon: <Database className="h-3 w-3" />, text: "Minimal data collection" },
              { icon: <Lock className="h-3 w-3" />, text: "TLS 1.3 encrypted" },
              { icon: <Shield className="h-3 w-3" />, text: "No data selling" },
            ].map(({ icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
              >
                {icon}
                {text}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono text-slate-600">
              <RefreshCw className="h-3 w-3 text-slate-400" />
              Updated: <strong className="text-slate-800 ml-1">{lastUpdated}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-mono text-blue-700">
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
            <section id="overview" className="scroll-mt-6 rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-white to-emerald-50/30 p-6 shadow-xs sm:p-8">
              <SectionHeader n={1} icon={<Shield className="h-4 w-4 text-emerald-600" />} title="Overview & Commitment to Privacy" accent="emerald" />
              <p className="text-slate-600">
                AJITDEV is committed to respecting your privacy and safeguarding your personal information. We follow a privacy-first, minimal-collection architecture: we collect only what is strictly necessary to authenticate your identity, operate our developer tools, and maintain system security.{" "}
                <strong className="font-semibold text-slate-900">We do not sell, rent, or monetize your personal data.</strong>
              </p>
            </section>

            {/* 2 */}
            <section id="google-auth" className="scroll-mt-6 rounded-2xl border border-blue-200/70 bg-gradient-to-br from-white to-blue-50/30 p-6 shadow-xs sm:p-8">
              <SectionHeader n={2} icon={<Key className="h-4 w-4 text-blue-600" />} title="Google Sign-In & OAuth 2.0 Integration" accent="blue" />
              <p className="text-slate-600 mb-5">
                Our application offers optional &quot;Sign in with Google&quot; powered by Google OAuth 2.0 and Auth.js. When you authenticate:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: <CheckCircle2 className="h-4 w-4 text-blue-500" />,
                    title: "Information We Receive",
                    desc: "Google securely provides your name, email address, profile picture URL, and unique Google account ID.",
                  },
                  {
                    icon: <EyeOff className="h-4 w-4 text-emerald-600" />,
                    title: "We NEVER See Your Password",
                    desc: "Your credentials are handled exclusively by Google. AJITDEV does not receive, see, or store your Google password.",
                  },
                  {
                    icon: <Key className="h-4 w-4 text-indigo-500" />,
                    title: "Minimal Scopes",
                    desc: (
                      <>
                        We request only standard read-only identity scopes:{" "}
                        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-800">openid</code>,{" "}
                        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-800">profile</code>,{" "}
                        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-800">email</code>.
                        We never request access to Gmail, Drive, or Calendar.
                      </>
                    ),
                  },
                  {
                    icon: <UserCheck className="h-4 w-4 text-purple-500" />,
                    title: "Why We Use It",
                    desc: "To verify your identity, maintain your session, personalize your experience, and associate data with your account.",
                  },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4">
                    <div className="mt-0.5 shrink-0">{icon}</div>
                    <div>
                      <p className="font-semibold text-slate-900 text-xs mb-1">{title}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3 */}
            <section id="direct-data" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              <SectionHeader n={3} icon={<Database className="h-4 w-4 text-slate-600" />} title="Information Collected Directly" />
              <p className="text-slate-600 mb-4">When you interact with our website, you may voluntarily provide:</p>
              <ul className="space-y-3">
                {[
                  ["Contact Inquiries", <>If you submit a message through our <Link href="/contact" className="text-blue-600 underline underline-offset-2 hover:text-blue-800">/contact</Link> page, we collect your name, email address, subject, and message solely to respond to your inquiry.</>],
                  ["Client-Side Tool Data", "Certain productivity tools (Todo, Notes) may store data locally in your browser's localStorage or synced to your authenticated profile if signed in."],
                ].map(([t, d]) => (
                  <li key={String(t)} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                    <CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong className="font-semibold text-slate-900">{t}:</strong>{" "}<span className="text-slate-600">{d}</span></span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 4 */}
            <section id="cookies" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              <SectionHeader n={4} icon={<Cookie className="h-4 w-4 text-amber-500" />} title="Cookies & Session Technologies" />
              <p className="text-slate-600 mb-4">We use strictly necessary cookies and browser storage:</p>
              <div className="space-y-3">
                {[
                  {
                    title: "Session Cookies",
                    desc: "Used by Auth.js to securely store encrypted session tokens when you are logged in.",
                    tags: ["HttpOnly", "Secure", "SameSite=Lax"],
                  },
                  {
                    title: "Local Storage",
                    desc: "Used to store client preferences locally on your device without transmitting to third parties.",
                    tags: ["Client-only"],
                  },
                ].map(({ title, desc, tags }) => (
                  <div key={title} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                    <p className="font-semibold text-slate-900 text-xs mb-1">{title}</p>
                    <p className="text-xs text-slate-600 mb-2">{desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((t) => (
                        <code key={t} className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-mono text-slate-700">
                          {t}
                        </code>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5 */}
            <section id="analytics" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              <SectionHeader n={5} icon={<Globe className="h-4 w-4 text-slate-600" />} title="Analytics & Third-Party Infrastructure" />
              <p className="text-slate-600 mb-4">Our website uses select privacy-conscious tools:</p>
              <ul className="space-y-2.5">
                {[
                  ["Vercel Hosting & Analytics", "Provides DDoS mitigation, edge routing, and aggregate performance telemetry without tracking cross-site user identities."],
                  ["Microsoft Clarity & Google Tag Manager", "Used to collect anonymized UX metrics and diagnostic error signals to improve page responsiveness and usability."],
                ].map(([t, d]) => (
                  <li key={String(t)} className="flex items-start gap-3">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 translate-y-1.5" />
                    <span><strong className="font-semibold text-slate-900">{t}:</strong>{" "}<span className="text-slate-600">{d}</span></span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 6 */}
            <section id="security" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              <SectionHeader n={6} icon={<Lock className="h-4 w-4 text-slate-600" />} title="Data Retention & Security Practices" />
              <p className="text-slate-600 mb-4">We implement industry-standard technical measures:</p>
              <ul className="space-y-2.5">
                {[
                  "All traffic is encrypted using modern TLS 1.3 cryptographic protocols.",
                  "Authentication secrets and database credentials are kept strictly server-side and never exposed to client-side code.",
                  "Account session records are retained only as long as you maintain an active account or session.",
                  "No method of Internet transmission is 100% infallible — we encourage users to maintain secure credentials.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-0.5" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 7 */}
            <section id="rights" className="scroll-mt-6 rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-white to-indigo-50/30 p-6 shadow-xs sm:p-8">
              <SectionHeader n={7} icon={<UserCheck className="h-4 w-4 text-indigo-600" />} title="Your Rights & Data Deletion Requests" accent="indigo" />
              <p className="text-slate-600 mb-4">You retain full control over your personal information:</p>
              <ul className="space-y-3">
                {[
                  ["Access & Portability", "You may request a summary of the data associated with your profile."],
                  ["Data Deletion", "You may request complete deletion of your account, authentication tokens, and any stored application data at any time by contacting us."],
                  ["Revoking Google Permissions", <>You can revoke AJITDEV&apos;s access to your Google account at any time via your{" "}<a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2 hover:text-blue-800">Google Account Security Settings</a>.</>],
                ].map(([t, d]) => (
                  <li key={String(t)} className="flex items-start gap-3 rounded-xl border border-indigo-100/60 bg-white p-3.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span><strong className="font-semibold text-slate-900">{t}:</strong>{" "}<span className="text-slate-600">{d}</span></span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 8 */}
            <section id="children" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              <SectionHeader n={8} icon={<Baby className="h-4 w-4 text-slate-600" />} title="Children's Privacy" />
              <p className="text-slate-600">
                Our website and developer ecosystem are intended for developers and general audiences aged 13 and above. We do not knowingly solicit or collect personal information from children under the age of 13. If you believe a child has provided us with personal information, please contact us immediately so we can remove it.
              </p>
            </section>

            {/* 9 */}
            <section id="updates" className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              <SectionHeader n={9} icon={<RefreshCw className="h-4 w-4 text-slate-600" />} title="Updates to this Privacy Policy" />
              <p className="text-slate-600">
                We may periodically revise this Privacy Policy to reflect architectural updates, regulatory requirements, or feature enhancements. The &quot;Last Updated&quot; date at the top of this document will always reflect the most recent modification. Continued use of our website constitutes your acknowledgement of the updated terms.
              </p>
            </section>

            {/* 10 */}
            <section id="contact" className="scroll-mt-6 rounded-2xl border border-slate-900/10 bg-slate-900 p-6 shadow-xs sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white text-xs font-bold">
                  10
                </div>
                <h2 className="text-base font-bold text-white">Contact Us</h2>
              </div>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                If you have any questions, concerns, or privacy requests regarding this Policy or our Google OAuth integration, reach us through:
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <a
                  href="mailto:support@ajitdev.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/8 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/15 transition"
                >
                  <Mail className="h-3.5 w-3.5 text-blue-400" />
                  support@ajitdev.com
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-400 transition"
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
  accent?: "slate" | "blue" | "indigo" | "emerald";
}) {
  const bg: Record<string, string> = {
    slate:   "bg-slate-100 border-slate-200 text-slate-700",
    blue:    "bg-blue-50 border-blue-200 text-blue-700",
    indigo:  "bg-indigo-50 border-indigo-200 text-indigo-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
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
