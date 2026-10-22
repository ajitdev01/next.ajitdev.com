import type { Metadata } from "next";
import InstallButton from "./InstallButton";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Install AjitDev App | Next.js Projects",
  description:
    "Install AjitDev on your device for quick access to projects, developer tools and web applications.",
  alternates: {
    canonical: "https://next.ajitdev.com/download",
  },
};

export default function DownloadPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-1 flex-col items-center justify-center gap-5 px-6 py-16 text-center">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-900 text-3xl font-extrabold text-white shadow-xl dark:bg-white dark:text-slate-900"
          aria-label="AjitDev app logo"
        >
          AD
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          AJIT DEV
        </p>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          Install AjitDev on Your Device
        </h1>

        <p className="max-w-xl text-base text-slate-600 dark:text-slate-300">
          Get an app-like experience with quick access to Next.js projects,
          developer tools and applications from Ajit Dev.
        </p>

        <InstallButton />

        <p className="text-xs text-slate-500 dark:text-slate-400">
          No APK required. Installation availability depends on your browser
          and device.
        </p>
      </main>
      <Footer />
    </div>
  );
}
