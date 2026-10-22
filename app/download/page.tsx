import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import InstallButton from "./InstallButton";
import Footer from "@/app/components/footer";
import { ReplayIntroButton } from "@/components/app-intro-splash";
import { Zap, ShieldCheck, Smartphone, HardDrive, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Install Next App | Fast Web App by Ajit Dev",
  description:
    "Install Next on your phone or desktop for quick access to developer tools, currency converter, weather telemetry, task managers, and REST APIs.",
  alternates: {
    canonical: "https://next.ajitdev.com/download",
  },
};

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Launch",
    desc: "Opens in sub-second from local edge cache",
  },
  {
    icon: Smartphone,
    title: "Full App Window",
    desc: "Clean standalone UI without URL bar clutter",
  },
  {
    icon: ShieldCheck,
    title: "100% Private",
    desc: "Local data sovereignty with zero ad-tracking",
  },
  {
    icon: HardDrive,
    title: "Zero Storage Hassle",
    desc: "No bulky APK or manual Play Store updates",
  },
];

export default function DownloadPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-white dark:bg-black text-black dark:text-white transition-colors">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-20 text-center">
        
        {/* App Icon Container with Ambient Monochrome Shadow (Gol Round) */}
        <div className="relative mb-6">
          <div className="absolute -inset-2 rounded-full bg-black/10 dark:bg-white/10 opacity-70 blur-xl animate-pulse" />
          <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center overflow-hidden rounded-full shadow-2xl border border-neutral-300 dark:border-neutral-700 bg-neutral-950 p-1">
            <Image
              src="/icons/pwa-192.png"
              alt="Next App Icon"
              width={112}
              height={112}
              className="h-full w-full object-contain rounded-full"
              priority
            />
          </div>
        </div>

        {/* Brand & Badge in White & Black */}
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-200">
          <Sparkles className="h-3 w-3 text-neutral-600 dark:text-neutral-400" />
          Official Progressive Web App
        </div>

        {/* App Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-black dark:text-white">
          Next
        </h1>

        <p className="mt-1 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
          Technical Hub & Production Apps by Ajit Dev
        </p>

        {/* Short Value Proposition */}
        <p className="mt-3 max-w-md text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
          Install the official <strong>Next</strong> app directly on your Android, iPhone, or Desktop for one-tap access to productivity suites and developer tools.
        </p>

        {/* Install Button & Guides (White & Black Theme with Shimmer & Bounce Animations) */}
        <div className="mt-8 w-full space-y-3">
          <InstallButton />

          <div className="flex items-center justify-center pt-1">
            <ReplayIntroButton />
          </div>
        </div>

        {/* Feature Highlights Grid in White & Black */}
        <div className="mt-12 grid w-full grid-cols-2 gap-3 text-left">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/60 p-3.5 sm:p-4 shadow-xs transition hover:border-neutral-400 dark:hover:border-neutral-700"
            >
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-black dark:text-white leading-tight">
                {title}
              </h3>
              <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Explore without installing */}
        <p className="mt-8 text-xs text-neutral-500 dark:text-neutral-500">
          Prefer using browser directly?{" "}
          <Link
            href="/"
            className="font-semibold text-black dark:text-white underline underline-offset-4 hover:opacity-75 transition-opacity"
          >
            Explore web version &rarr;
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
