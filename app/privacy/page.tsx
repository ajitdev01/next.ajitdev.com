import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowLeft, Lock, UserCheck, EyeOff, Key, Cookie, RefreshCw, Mail, Globe, CheckCircle2 } from "lucide-react";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy | AJITDEV",
  description:
    "Privacy Policy for AJITDEV detailing data collection, Google Sign-In / OAuth integration, session handling, user rights, and data protection practices.",
  alternates: {
    canonical: "https://next.ajitdev.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | AJITDEV",
    description:
      "Understand how AJITDEV handles authentication, Google OAuth basic profile data, cookies, and data privacy.",
    url: "https://next.ajitdev.com/privacy",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 15, 2026";

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white antialiased overflow-x-clip">
      {/* Ambient background glows */}
      <div
        style={{ contain: "paint" }}
        className="pointer-events-none absolute left-1/2 top-20 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)]"
      />

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 transition group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header Hero */}
        <header className="mb-10 border-b border-slate-200/80 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700 shadow-2xs mb-4">
            <Shield className="h-3.5 w-3.5 text-blue-600" />
            <span>Legal &amp; Data Protection</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-2xl">
            This Privacy Policy explains how AJITDEV (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), founded and maintained by Ajit Dev, collects, uses, protects, and handles information when you visit <strong className="font-semibold text-slate-900">https://next.ajitdev.com</strong> and its associated developer tools and services.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono">
            <span>Last Updated: <strong className="text-slate-800">{lastUpdated}</strong></span>
            <span>·</span>
            <span>Effective Date: <strong className="text-slate-800">September 15, 2026</strong></span>
          </div>
        </header>

        {/* Document Content */}
        <article className="space-y-10 text-sm text-slate-700 leading-relaxed">
          {/* Section 1: Overview */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                1
              </div>
              <h2>Overview &amp; Commitment to Privacy</h2>
            </div>
            <p className="text-slate-600">
              AJITDEV is committed to respecting your privacy and safeguarding your personal information. We follow a privacy-first, minimal-collection architecture: we collect only what is strictly necessary to authenticate your identity, operate our developer tools, and maintain system security. We do not sell, rent, or monetize your personal data.
            </p>
          </section>

          {/* Section 2: Google Sign-In & OAuth Data Handling */}
          <section className="rounded-2xl border border-blue-200/90 bg-gradient-to-b from-white to-blue-50/20 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                2
              </div>
              <h2>Google Sign-In &amp; OAuth 2.0 Integration</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Our application offers an optional &quot;Sign in with Google&quot; feature powered by Google OAuth 2.0 and Auth.js. When you choose to authenticate using your Google account:
            </p>

            <div className="space-y-3 pl-2 sm:pl-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-semibold">Information We Receive:</strong>
                  <p className="text-slate-600 mt-0.5">
                    Google securely provides your basic profile details, which may include your <span className="font-semibold text-slate-800">name</span>, <span className="font-semibold text-slate-800">email address</span>, <span className="font-semibold text-slate-800">profile picture URL</span>, and <span className="font-semibold text-slate-800">unique Google account ID</span> (subject identifier).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <EyeOff className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-semibold">We NEVER Receive Your Password:</strong>
                  <p className="text-slate-600 mt-0.5">
                    Your authentication credentials (password, passkeys, two-factor codes) are handled exclusively by Google on Google&apos;s secure servers. AJITDEV does <strong className="font-semibold text-slate-900">NOT</strong> receive, see, intercept, or store your Google password.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Key className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-semibold">Minimal Requested Scopes:</strong>
                  <p className="text-slate-600 mt-0.5">
                    We request only standard read-only identity scopes (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-800">openid</code>, <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-800">profile</code>, <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-800">email</code>). We never request access to Google Drive, Gmail, Google Contacts, Google Calendar, or other sensitive Google APIs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <UserCheck className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-semibold">Why We Use This Information:</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600">
                    <li>To verify your identity and authenticate you to the application.</li>
                    <li>To maintain your authenticated session across browser visits.</li>
                    <li>To personalize your experience (e.g., displaying your name and profile avatar).</li>
                    <li>To associate your created application data (e.g., tasks or notes) with your account.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Information Collected Directly */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                3
              </div>
              <h2>Information Collected Directly</h2>
            </div>
            <p className="text-slate-600 mb-3">
              When you interact with our website, you may voluntarily provide information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong className="text-slate-900 font-semibold">Contact Inquiries:</strong> If you submit a message through our Contact page (<Link href="/contact" className="text-blue-600 hover:underline">/contact</Link>), we collect your name, email address, subject, and message content solely to respond to your inquiry.
              </li>
              <li>
                <strong className="text-slate-900 font-semibold">Client-Side Tool Data:</strong> Certain productivity tools (such as the Todo or Note applications) may store user task and note data locally in your browser&apos;s localStorage or synced to your authenticated profile if you are signed in.
              </li>
            </ul>
          </section>

          {/* Section 4: Cookies & Session Technologies */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                4
              </div>
              <h2>Cookies &amp; Session Technologies</h2>
            </div>
            <p className="text-slate-600 mb-3">
              We use strictly necessary cookies and browser storage technologies:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong className="text-slate-900 font-semibold">Session Cookies:</strong> Used by Auth.js to securely store encrypted session tokens when you are logged in, ensuring you remain signed in as you navigate the site. These cookies are marked <code className="rounded bg-slate-100 px-1 py-0.5 text-xs font-mono">HttpOnly</code>, <code className="rounded bg-slate-100 px-1 py-0.5 text-xs font-mono">Secure</code>, and <code className="rounded bg-slate-100 px-1 py-0.5 text-xs font-mono">SameSite=Lax</code> to prevent unauthorized script access and cross-site tampering.
              </li>
              <li>
                <strong className="text-slate-900 font-semibold">Local Storage:</strong> Used to store client preferences (e.g., local drafts or UI toggle states) locally on your device without transmitting them to third parties.
              </li>
            </ul>
          </section>

          {/* Section 5: Analytics & Third-Party Services */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                5
              </div>
              <h2>Analytics &amp; Third-Party Infrastructure</h2>
            </div>
            <p className="text-slate-600 mb-3">
              Our website runs on enterprise cloud infrastructure and uses select privacy-conscious measurement tools:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong className="text-slate-900 font-semibold">Vercel Web Analytics &amp; Hosting:</strong> We host our application on Vercel, which provides DDoS mitigation, edge routing, and aggregate performance telemetry without tracking cross-site user identities.
              </li>
              <li>
                <strong className="text-slate-900 font-semibold">Microsoft Clarity &amp; Google Tag Manager:</strong> Used to collect anonymized user experience metrics and diagnostic error signals to improve page responsiveness and layout usability.
              </li>
            </ul>
          </section>

          {/* Section 6: Data Retention & Security */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                6
              </div>
              <h2>Data Retention &amp; Security Practices</h2>
            </div>
            <p className="text-slate-600 mb-3">
              We implement industry-standard technical measures to safeguard your information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>All traffic between your browser and our servers is encrypted using modern TLS 1.3 cryptographic protocols.</li>
              <li>Authentication session secrets and database credentials are kept strictly server-side and never exposed to client-side code.</li>
              <li>Account session records are retained only as long as you maintain an active account or session.</li>
              <li>While we use robust engineering standards to protect your data, no method of Internet transmission is 100% infallible, and we encourage users to maintain secure credentials.</li>
            </ul>
          </section>

          {/* Section 7: User Rights & Data Deletion */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                7
              </div>
              <h2>Your Rights &amp; Data Deletion Requests</h2>
            </div>
            <p className="text-slate-600 mb-3">
              You retain full control over your personal information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong className="text-slate-900 font-semibold">Access &amp; Portability:</strong> You may request a summary of the data associated with your profile.</li>
              <li><strong className="text-slate-900 font-semibold">Data Deletion:</strong> You may request complete deletion of your account, authentication tokens, and any stored application data at any time by contacting us.</li>
              <li><strong className="text-slate-900 font-semibold">Revoking Google Permissions:</strong> You can revoke AJITDEV&apos;s access to your Google account at any time via your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Account Security Settings</a>.</li>
            </ul>
          </section>

          {/* Section 8: Children's Privacy */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                8
              </div>
              <h2>Children&apos;s Privacy</h2>
            </div>
            <p className="text-slate-600">
              Our website and developer ecosystem are intended for developers, engineering professionals, and general audiences. We do not knowingly solicit or collect personal information from children under the age of 13. If you believe a child has provided us with personal information, please contact us immediately so we can remove it.
            </p>
          </section>

          {/* Section 9: Changes to Privacy Policy */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                9
              </div>
              <h2>Updates to this Privacy Policy</h2>
            </div>
            <p className="text-slate-600">
              We may periodically revise this Privacy Policy to reflect architectural updates, regulatory requirements, or feature enhancements. The &quot;Last Updated&quot; date at the top of this document will always reflect the most recent modification. Continued use of our website constitutes your acknowledgement of the updated terms.
            </p>
          </section>

          {/* Section 10: Contact Us */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                10
              </div>
              <h2>Contact Us</h2>
            </div>
            <p className="text-slate-600 mb-4">
              If you have any questions, concerns, or privacy requests regarding this Privacy Policy or our Google OAuth integration, please contact us through our official channels:
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs font-medium">
              <a
                href="mailto:support@ajitdev.com"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 hover:bg-slate-100 hover:text-slate-950 transition"
              >
                <Mail className="h-4 w-4 text-blue-600" />
                <span>support@ajitdev.com</span>
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-white hover:bg-slate-800 transition"
              >
                <span>Contact Form (/contact)</span>
              </Link>

              <a
                href="https://www.ajitdev.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 hover:bg-slate-100 hover:text-slate-950 transition"
              >
                <Globe className="h-4 w-4 text-emerald-600" />
                <span>ajitdev.com</span>
              </a>
            </div>
          </section>
        </article>

        {/* Minimal Footer */}
        <div className="mt-16">
          <Footer theme="light" className="w-full" />
        </div>
      </main>
    </div>
  );
}
