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
  HelpCircle,
  CreditCard,
  Building,
  Smartphone,
  Sparkles,
  History,
  ArrowRight,
  Info,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Test Payment Gateway — AJITDEV",
  description:
    "Test Razorpay payment gateway sandbox. Simulate real-time UPI, card, and NetBanking transactions with instant HMAC verification.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/payments/test",
  },
};

const TEST_CREDENTIALS = [
  {
    channel: "Test Card (Visa)",
    number: "4111 1111 1111 1111",
    expiry: "12/30",
    cvv: "123",
    otp: "123456 or Click Success",
  },
  {
    channel: "Test Card (MasterCard)",
    number: "5123 4567 8901 2346",
    expiry: "10/29",
    cvv: "456",
    otp: "Any 6-digit OTP",
  },
  {
    channel: "Test UPI",
    number: "success@razorpay",
    expiry: "Instant Approval",
    cvv: "N/A",
    otp: "Select 'Success' in Simulator",
  },
];

export default function TestPaymentsSandboxPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 selection:bg-slate-950 selection:text-white w-full max-w-full overflow-x-hidden">
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

      <main className="mx-auto max-w-5xl px-3.5 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16 w-full max-w-full overflow-x-hidden">
        {/* Navigation & Breadcrumbs */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
          <div className="overflow-x-auto scrollbar-hide py-0.5 max-w-full">
            <Breadcrumbs
              items={[
                { name: "Home", url: "/" },
                { name: "Payments", url: "/payments/self" },
                { name: "Test Payment System", url: "/payments/test" },
              ]}
            />
          </div>

          <Link
            href="/payments/testlist"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 transition active:scale-95 w-full sm:w-fit"
          >
            <History className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span>View All Payment History</span>
            <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
          </Link>
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

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-800 shadow-xs backdrop-blur-sm mb-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            <span>Razorpay Sandbox & Simulation Mode</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950">
            Payment System <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Sandbox Test</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Test custom amount payments, signature verification, and database records using simulated Razorpay test mode channels.
          </p>

          {/* Quick link banner to /payments/testlist */}
          <div className="mt-5 mx-auto max-w-md rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Looking for past payments list?</span>
            </div>
            <Link
              href="/payments/testlist"
              className="font-bold underline hover:no-underline text-emerald-900 flex items-center gap-0.5"
            >
              <span>View History</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Main Payment Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center: Payment Form */}
          <div className="lg:col-span-7 xl:col-span-8">
            <PaymentForm />
          </div>

          {/* Right: Sandbox info & Test Cards */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Test Cards Box */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-blue-600" />
                Test Payment Credentials
              </h2>
              <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                Use these official Razorpay sandbox credentials to test transactions without spending real money.
              </p>

              <div className="space-y-3">
                {TEST_CREDENTIALS.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{c.channel}</span>
                    </div>
                    <div className="font-mono text-xs text-slate-800 select-all">
                      {c.number}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                      <span>Expiry: {c.expiry}</span>
                      <span>CVV: {c.cvv}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick history shortcut card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <History className="h-4 w-4 text-emerald-600" />
                Payments History
              </h2>
              <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                Track all completed and created test payments in the dedicated history explorer cards gallery.
              </p>
              <Link
                href="/payments/testlist"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition"
              >
                <span>Open /payments/testlist</span>
                <ArrowRight className="h-3 w-3" />
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
