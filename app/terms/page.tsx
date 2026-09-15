import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft, CheckCircle2, ShieldAlert, Scale, UserCheck, AlertTriangle, Globe, Mail, Ban, Laptop } from "lucide-react";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Terms of Service | AJITDEV",
  description:
    "Terms of Service governing your use of the AJITDEV developer platform, applications, Google Sign-In authentication, and acceptable use guidelines.",
  alternates: {
    canonical: "https://next.ajitdev.com/terms",
  },
  openGraph: {
    title: "Terms of Service | AJITDEV",
    description:
      "Review the Terms of Service for AJITDEV, including Google OAuth authentication, user responsibilities, and acceptable use.",
    url: "https://next.ajitdev.com/terms",
    type: "website",
  },
};

export default function TermsOfServicePage() {
  const lastUpdated = "September 15, 2026";

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white antialiased overflow-x-clip">
      {/* Ambient background glows */}
      <div
        style={{ contain: "paint" }}
        className="pointer-events-none absolute left-1/2 top-20 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_70%)]"
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
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-2xs mb-4">
            <Scale className="h-3.5 w-3.5 text-indigo-600" />
            <span>User Agreement</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Terms of Service
          </h1>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-2xl">
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of <strong className="font-semibold text-slate-900">https://next.ajitdev.com</strong>, personal productivity applications, public developer APIs, and software services operated by Ajit Dev (&quot;AJITDEV&quot;).
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono">
            <span>Last Updated: <strong className="text-slate-800">{lastUpdated}</strong></span>
            <span>·</span>
            <span>Effective Date: <strong className="text-slate-800">September 15, 2026</strong></span>
          </div>
        </header>

        {/* Document Content */}
        <article className="space-y-10 text-sm text-slate-700 leading-relaxed">
          {/* Section 1: Acceptance of Terms */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                1
              </div>
              <h2>Acceptance of Terms</h2>
            </div>
            <p className="text-slate-600">
              By accessing, browsing, creating an account, or using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>. If you do not agree to these Terms, you must discontinue use of the website immediately.
            </p>
          </section>

          {/* Section 2: Account Registration & Google Sign-In */}
          <section className="rounded-2xl border border-indigo-200/90 bg-gradient-to-b from-white to-indigo-50/20 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                2
              </div>
              <h2>User Accounts &amp; Google Authentication</h2>
            </div>
            <p className="text-slate-600 mb-3">
              To access certain interactive features (such as persistent note taking or task management), you may authenticate using &quot;Sign in with Google&quot; via Google OAuth 2.0:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong className="text-slate-900 font-semibold">Account Security:</strong> You are responsible for safeguarding your Google account credentials. You must notify us immediately if you suspect unauthorized access to your account on our platform.
              </li>
              <li>
                <strong className="text-slate-900 font-semibold">Accurate Identity:</strong> You agree not to impersonate any person or entity, or create accounts using false or misleading identity information.
              </li>
              <li>
                <strong className="text-slate-900 font-semibold">No Password Handling:</strong> AJITDEV uses OAuth 2.0 delegation; we do not store or process your Google password directly.
              </li>
            </ul>
          </section>

          {/* Section 3: Acceptable Use Policy */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                3
              </div>
              <h2>Acceptable Use &amp; Developer Guidelines</h2>
            </div>
            <p className="text-slate-600 mb-3">
              You agree to use our platform and public APIs in good faith for lawful developer, testing, and productivity purposes. You agree <strong className="text-slate-900 font-semibold">NOT</strong> to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>Probe, scan, or test the vulnerability of our system or network without express authorization.</li>
              <li>Launch Denial-of-Service (DoS/DDoS) attacks, flood public API endpoints, or intentionally circumvent rate limits.</li>
              <li>Transmit malware, viruses, worms, or malicious code through contact forms or interactive inputs.</li>
              <li>Scrape, extract, or harvest user data or infrastructure credentials using automated means.</li>
              <li>Interfere with or disrupt the integrity or performance of the website or data hosted therein.</li>
            </ul>
          </section>

          {/* Section 4: Intellectual Property */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                4
              </div>
              <h2>Intellectual Property Rights</h2>
            </div>
            <p className="text-slate-600 mb-3">
              The design, layouts, logos, branding, graphics, source code, and content of AJITDEV are the property of Ajit Dev and are protected by applicable copyright, trademark, and intellectual property laws.
            </p>
            <p className="text-slate-600">
              Open-source components incorporated into the application are subject to their respective open-source licenses (such as MIT). You retain all ownership rights to any notes, tasks, or personal code snippets you produce within our productivity tools.
            </p>
          </section>

          {/* Section 5: Third-Party Services & Links */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                5
              </div>
              <h2>Third-Party Services &amp; External Links</h2>
            </div>
            <p className="text-slate-600">
              Our website integrates with third-party providers (such as Google for OAuth authentication, Vercel for cloud hosting, and Cloudflare for edge routing) and contains links to external developer resources and platforms. We do not control and are not responsible for the availability, content, or privacy practices of third-party platforms. Your interaction with third parties is governed by their respective policies.
            </p>
          </section>

          {/* Section 6: Disclaimer of Warranties */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                6
              </div>
              <h2>Disclaimer of Warranties (&quot;AS-IS&quot;)</h2>
            </div>
            <p className="text-slate-600">
              The website, developer tools, interactive consoles, and APIs are provided on an <strong className="font-semibold text-slate-900">&quot;AS IS&quot;</strong> and <strong className="font-semibold text-slate-900">&quot;AS AVAILABLE&quot;</strong> basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, or uninterrupted availability. While we strive for high uptime and performance, we do not warrant that services will be completely error-free or uninterrupted.
            </p>
          </section>

          {/* Section 7: Limitation of Liability */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                7
              </div>
              <h2>Limitation of Liability</h2>
            </div>
            <p className="text-slate-600">
              To the maximum extent permitted by applicable law, in no event shall AJITDEV, its creator, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages (including loss of profits, data, goodwill, or business interruption) arising out of or in connection with your access to, use of, or inability to use the website or services.
            </p>
          </section>

          {/* Section 8: Service Modifications & Termination */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                8
              </div>
              <h2>Service Modifications &amp; Account Termination</h2>
            </div>
            <p className="text-slate-600 mb-3">
              We reserve the right to modify, update, suspend, or discontinue any feature, tool, or endpoint at our discretion without prior notice.
            </p>
            <p className="text-slate-600">
              We may terminate or suspend your access to authenticated features immediately if you breach these Terms or engage in abusive activity. You may also stop using our services and request account deletion at any time.
            </p>
          </section>

          {/* Section 9: Changes to Terms */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                9
              </div>
              <h2>Modifications to these Terms</h2>
            </div>
            <p className="text-slate-600">
              We reserve the right to revise these Terms periodically. Updates will be published on this page with an updated &quot;Last Updated&quot; date. Your continued access to or use of the website following any changes constitutes your binding agreement to the amended Terms.
            </p>
          </section>

          {/* Section 10: Governing Law & Contact */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-950 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                10
              </div>
              <h2>Governing Law &amp; Contact</h2>
            </div>
            <p className="text-slate-600 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. If you have any inquiries regarding these Terms of Service, please contact us:
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs font-medium">
              <a
                href="mailto:support@ajitdev.com"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 hover:bg-slate-100 hover:text-slate-950 transition"
              >
                <Mail className="h-4 w-4 text-indigo-600" />
                <span>support@ajitdev.com</span>
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-white hover:bg-slate-800 transition"
              >
                <span>Contact Page (/contact)</span>
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
