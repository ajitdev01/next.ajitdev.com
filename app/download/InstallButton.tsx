"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Share,
  PlusSquare,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Info,
  Loader2,
  MoreVertical,
  ArrowUpRight,
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if running as standalone PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true ||
      window.__pwaInstalled === true;

    setInstalled(isStandalone);

    // Device detection
    const ua = navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(ua);
    const isDroid = /android/.test(ua);
    setIsIOS(isApple);
    setIsAndroid(isDroid);

    // Retrieve pre-captured prompt from window if already available
    if (window.__deferredInstallPrompt) {
      setInstallPrompt(window.__deferredInstallPrompt);
    }

    const handlePromptReady = () => {
      if (window.__deferredInstallPrompt) {
        setInstallPrompt(window.__deferredInstallPrompt);
      }
    };

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      window.__deferredInstallPrompt = event as BeforeInstallPromptEvent;
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      window.__deferredInstallPrompt = null;
      window.__pwaInstalled = true;
      setStatusMessage("Next App installed successfully! You can now open it from your Home Screen.");
    };

    window.addEventListener("pwa-prompt-ready", handlePromptReady);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("pwa-prompt-ready", handlePromptReady);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Primary Single-Tap PWA Install Trigger
  async function handleInstallClick() {
    setStatusMessage("");

    // Subtle mobile tactile vibration
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(45);
      }
    } catch (_) {}

    // 1. iOS Safari (Apple blocks programmatic prompt, show guided flow)
    if (isIOS) {
      setShowGuide(true);
      setStatusMessage("Follow the 3 quick steps below to add Next to your iPhone home screen.");
      return;
    }

    // 2. Check for captured native install prompt
    let prompt = installPrompt || window.__deferredInstallPrompt;

    // If not ready on first tick, retry briefly (Chrome evaluating PWA manifest)
    if (!prompt) {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      prompt = installPrompt || window.__deferredInstallPrompt;
      setLoading(false);
    }

    // 3. Android / Chromium with native prompt available
    if (prompt) {
      setLoading(true);
      try {
        await prompt.prompt();
        const choice = await prompt.userChoice;

        if (choice.outcome === "accepted") {
          setStatusMessage("Installation accepted! Next is now downloading to your Home Screen.");
          setInstalled(true);
          setInstallPrompt(null);
          window.__deferredInstallPrompt = null;
        } else {
          setStatusMessage("Installation was cancelled. Tap again whenever you're ready.");
        }
      } catch (err) {
        console.error("Install prompt error:", err);
        setShowGuide(true);
      } finally {
        setLoading(false);
      }
      return;
    }

    // 4. In-App Browser Detection (e.g. WhatsApp, Instagram, Telegram)
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isInApp = /FBAN|FBAV|Instagram|WhatsApp|Line|Twitter|Snapchat|LinkedIn/i.test(ua);
    if (isInApp) {
      setStatusMessage("⚠️ Tap the 3 dots (⋮) at top right and select 'Open in Chrome' to install Next with 1 tap!");
      setShowGuide(true);
      return;
    }

    // 5. Fallback Guide for Chrome / Android if prompt already handled
    setShowGuide(true);
    setStatusMessage("Tap the 3 dots (⋮) menu in Chrome and select 'Install app' or 'Add to Home screen'.");
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Installed State */}
      {installed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 p-6 text-black dark:text-white shadow-sm"
        >
          <div className="flex items-center gap-2 font-bold text-base">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <span>Next App is Installed</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center max-w-xs">
            Open &ldquo;Next&rdquo; directly from your phone&apos;s Home Screen or App Drawer.
          </p>
          <a
            href="/"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-md"
          >
            Launch Next App &rarr;
          </a>
        </motion.div>
      ) : (
        /* Single-Tap Install Button (White & Black Theme) */
        <motion.button
          type="button"
          onClick={handleInstallClick}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Install Next App on your device"
          className="group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl bg-black p-4 sm:px-6 sm:py-4.5 text-white shadow-2xl shadow-black/30 border border-neutral-800 transition-all duration-300 hover:shadow-black/50 dark:bg-white dark:text-black dark:border-neutral-200 dark:shadow-white/10 focus:outline-none focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 disabled:opacity-75 disabled:cursor-wait"
        >
          {/* Continuous Shimmer Light Beam Effect across Button */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-black/15 to-transparent" />

          {/* Left Icon with Animated Bounce */}
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white border border-neutral-800 dark:bg-neutral-100 dark:text-black dark:border-neutral-300 shadow-inner">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              >
                <Download className="h-5 w-5" />
              </motion.div>
            )}
          </div>

          {/* Text Content */}
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2 font-black text-base sm:text-lg tracking-tight leading-tight">
              <span>{loading ? "Opening Installer..." : "Install Next App"}</span>
              <Sparkles className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-600 animate-pulse" />
            </div>
            <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-600 font-medium truncate">
              {isIOS
                ? "iPhone & iPad • Add to Home Screen"
                : "Single Tap Install • Standalone PWA"}
            </p>
          </div>

          {/* Right Phone Icon Badge */}
          <div className="shrink-0 flex items-center justify-center rounded-xl bg-neutral-900 p-2.5 text-neutral-300 border border-neutral-800 dark:bg-neutral-100 dark:text-neutral-700 dark:border-neutral-300 transition-transform duration-300 group-hover:rotate-6">
            <Smartphone className="h-4 w-4" />
          </div>
        </motion.button>
      )}

      {/* Status Feedback Message */}
      {statusMessage && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          aria-live="polite"
          className="flex items-center justify-center gap-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-3 text-xs font-medium text-neutral-800 dark:text-neutral-200 text-center shadow-xs"
        >
          <Info className="h-4 w-4 text-neutral-600 dark:text-neutral-300 shrink-0" />
          <span>{statusMessage}</span>
        </motion.div>
      )}

      {/* PWA Mobile Guided Sheet (When Safari on iOS, or if browser requires menu install) */}
      <AnimatePresence>
        {(showGuide || isIOS) && !installed && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5 text-left shadow-xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-sm font-bold text-black dark:text-white flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-neutral-900 dark:text-white" />
                {isIOS ? "How to Install on iPhone / iPad" : "Add Next App to Mobile"}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 rounded-full">
                {isIOS ? "iOS Safari" : "Chrome / Android"}
              </span>
            </div>

            {/* iOS Instructions */}
            {isIOS ? (
              <div className="mt-3.5 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs">
                    1
                  </span>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    In Safari, tap the{" "}
                    <span className="inline-flex items-center gap-1 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 font-semibold text-black dark:text-white">
                      <Share className="h-3 w-3 text-blue-500" /> Share
                    </span>{" "}
                    button in the bottom bar.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs">
                    2
                  </span>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Scroll down and tap{" "}
                    <span className="inline-flex items-center gap-1 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 font-semibold text-black dark:text-white">
                      <PlusSquare className="h-3 w-3 text-emerald-500" /> Add to Home Screen
                    </span>
                    .
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs">
                    3
                  </span>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Confirm name is <strong>Next</strong>, then tap{" "}
                    <strong>Add</strong> at top right. Next is now on your home screen!
                  </p>
                </div>
              </div>
            ) : (
              /* Android / Chrome Instructions */
              <div className="mt-3.5 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs">
                    1
                  </span>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Tap the browser menu{" "}
                    <span className="inline-flex items-center gap-1 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 font-semibold text-black dark:text-white">
                      <MoreVertical className="h-3 w-3" /> Menu
                    </span>{" "}
                    at the top right.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs">
                    2
                  </span>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Tap{" "}
                    <strong className="font-semibold text-black dark:text-white">
                      &ldquo;Install App&rdquo;
                    </strong>{" "}
                    or{" "}
                    <strong className="font-semibold text-black dark:text-white">
                      &ldquo;Add to Home screen&rdquo;
                    </strong>
                    .
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs">
                    3
                  </span>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Tap <strong>Install</strong> &mdash; <strong>Next</strong> will be installed as a standalone app!
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
