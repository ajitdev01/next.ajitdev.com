import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import PaymentForm from "@/components/payment-form";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import Footer from "@/app/components/footer";
import {
  ShieldCheck,
  Zap,
  Lock,
  CheckCircle,
  HelpCircle,
  CreditCard,
  Building,
  Smartphone,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Direct Payment — AJITDEV",
  description:
    "Secure payment gateway powered by Razorpay. Pay custom amounts with UPI, Credit/Debit cards, and NetBanking.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/payments/self",
  },
};

const TRUST_FEATURES = [
  {
    icon: Lock,
    title: "Bank-Grade Encryption",
    description: "256-bit TLS encryption with tokenized payment channels.",
  },
  {
    icon: Zap,
    title: "Instant Verification",
    description: "Cryptographic HMAC SHA256 server-side confirmation in real time.",
  },
  {
    icon: ShieldCheck,
    title: "PCI-DSS Compliant",
    description: "Certified Level 1 PCI-DSS compliant Razorpay infrastructure.",
  },
];

const FAQS = [
  {
    q: "Which payment methods are accepted?",
    a: "We support UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit cards (Visa, MasterCard, RuPay, Amex), NetBanking (50+ banks), and popular wallets.",
  },
  {
    q: "Is my card or bank information stored on this website?",
    a: "No. Your sensitive payment details are handled directly by Razorpay's secure servers and are never stored or seen by our application.",
  },
  {
    q: "Will I receive a payment confirmation?",
    a: "Yes! As soon as payment succeeds, you will see a verified receipt on this page that you can print, and Razorpay will also send a confirmation to your email or phone.",
  },
];

export default function SelfPaymentPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 selection:bg-slate-950 selection:text-white">
      {/* Preload Razorpay Checkout */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        id="razorpay-checkout-script"
      />
      {/* Background Decorative Grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <main className="mx-auto max-w-5xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        {/* Navigation & Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { name: "Home", url: "/" },
              { name: "Payments", url: "/payments/self" },
            ]}
          />
        </div>

        {/* Header Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-300/80 bg-slate-950 shadow-md shadow-slate-900/10 transition-transform duration-300 hover:scale-105">
            <Image
              src="/logo.png"
              alt="AJITDEV Metallic Logo"
              width={56}
              height={56}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-sm mb-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>Production-Ready Razorpay Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950">
            Fast, Secure <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Direct Payments</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Enter a custom amount to make a verified payment directly to AJITDEV. Powered by 256-bit encrypted Razorpay checkout.
          </p>
        </div>

        {/* Main Payment Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center: Payment Form */}
          <div className="lg:col-span-7 xl:col-span-8">
            <PaymentForm />
          </div>

          {/* Right: Security info, features & FAQ */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Trust card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Security Standards
              </h2>

              <div className="space-y-4">
                {TRUST_FEATURES.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        <Icon className="h-4 w-4 text-slate-800" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick FAQ card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-blue-600" />
                Frequently Asked
              </h2>

              <div className="space-y-3.5">
                {FAQS.map((faq, i) => (
                  <div key={i} className="text-xs">
                    <p className="font-semibold text-slate-900">{faq.q}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Note */}
            <div className="rounded-2xl border border-slate-200/60 bg-slate-100/70 p-4 text-center">
              <p className="text-xs text-slate-600">
                Need help or custom invoice billing?
              </p>
              <Link
                href="/contact"
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                <span>Contact Support</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <Footer theme="light" className="w-full" />
        </div>
      </main>
    </div>
  );
}
