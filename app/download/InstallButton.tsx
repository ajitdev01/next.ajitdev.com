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
  ChevronDown,
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
  const [showInstructions, setShowInstructions] = useState(false);
  const [message, setMessage] = useState("");
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect Standalone / PWA already installed
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    setInstalled(isStandalone);

    // Device detection
    const ua = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setMessage("Next App has been installed successfully!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function handleInstall() {
    if (isIOS) {
      setShowInstructions((prev) => !prev);
      return;
    }

    if (!installPrompt) {
      setShowInstructions(true);
      return;
    }

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;

      if (choice.outcome === "accepted") {
        setMessage("Installation accepted! Check your Home Screen for 'Next'.");
      } else {
        setMessage("Installation was cancelled. You can try again anytime.");
      }

      setInstallPrompt(null);
    } catch {
      setMessage(
        "Could not launch native installer. Follow the manual guide below."
      );
      setShowInstructions(true);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Primary CTA Button — Pure Black & White Theme with Shimmer & Micro-Animations */}
      {installed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-6 py-4 text-black dark:text-white font-semibold text-sm sm:text-base shadow-sm"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>Next App is Installed on this Device</span>
        </motion.div>
      ) : (
        <motion.button
          type="button"
          onClick={handleInstall}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Install Next App on your device"
          className="group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl bg-black p-4 sm:px-6 sm:py-4.5 text-white shadow-2xl shadow-black/30 border border-neutral-800 transition-all duration-300 hover:shadow-black/50 dark:bg-white dark:text-black dark:border-neutral-200 dark:shadow-white/10 focus:outline-none focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20"
        >
          {/* Continuous Shimmer Light Beam Effect across Button */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-black/15 to-transparent" />

          {/* Left Icon with Animated Bounce */}
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white border border-neutral-800 dark:bg-neutral-100 dark:text-black dark:border-neutral-300 shadow-inner">
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <Download className="h-5 w-5" />
            </motion.div>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2 font-black text-base sm:text-lg tracking-tight leading-tight">
              <span>Install Next App</span>
              <Sparkles className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-600 animate-pulse" />
            </div>
            <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-600 font-medium truncate">
              {isIOS
                ? "Tap for Safari iPhone Guide"
                : "Add to Home Screen • Instant Setup"}
            </p>
          </div>

          {/* Right Phone Icon Badge */}
          <div className="shrink-0 flex items-center justify-center rounded-xl bg-neutral-900 p-2.5 text-neutral-300 border border-neutral-800 dark:bg-neutral-100 dark:text-neutral-700 dark:border-neutral-300 transition-transform duration-300 group-hover:rotate-6">
            <Smartphone className="h-4 w-4" />
          </div>
        </motion.button>
      )}

      {/* Status Feedback Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          aria-live="polite"
          className="flex items-center justify-center gap-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 text-center"
        >
          <Info className="h-4 w-4 text-neutral-500 shrink-0" />
          <span>{message}</span>
        </motion.div>
      )}

      {/* Manual Installation Instruction Sheet (White & Black Theme) */}
      <AnimatePresence>
        {(showInstructions || isIOS) && !installed && (
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
                How to Install
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 rounded-full">
                {isIOS ? "iOS Safari" : "Chrome / Edge"}
              </span>
            </div>

            {/* iOS Steps */}
            {isIOS ? (
              <div className="mt-3.5 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs">
                    1
                  </span>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Open this page in <strong>Safari</strong> and tap the{" "}
                    <span className="inline-flex items-center gap-1 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 font-semibold text-black dark:text-white">
                      <Share className="h-3 w-3" /> Share
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
                      <PlusSquare className="h-3 w-3" /> Add to Home Screen
                    </span>
                    .
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs">
                    3
                  </span>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Confirm the app title is <strong>Next</strong>, then tap{" "}
                    <strong>Add</strong> at top right.
                  </p>
                </div>
              </div>
            ) : (
              /* Android / Desktop Steps */
              <div className="mt-3.5 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs">
                    1
                  </span>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Tap the browser menu icon{" "}
                    <strong className="font-semibold text-black dark:text-white">
                      (⋮ or ⋯)
                    </strong>{" "}
                    at the top right corner.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs">
                    2
                  </span>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Select{" "}
                    <strong className="font-semibold text-black dark:text-white">
                      Install app
                    </strong>{" "}
                    or{" "}
                    <strong className="font-semibold text-black dark:text-white">
                      Add to Home screen
                    </strong>
                    .
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs">
                    3
                  </span>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Confirm the prompt — <strong>Next</strong> will be installed
                    directly to your home screen!
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
