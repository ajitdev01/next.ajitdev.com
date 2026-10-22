"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    setInstalled(isStandalone);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setMessage("AjitDev has been installed successfully.");
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );
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
    if (!installPrompt) {
      setShowInstructions(true);
      return;
    }

    try {
      await installPrompt.prompt();

      const choice = await installPrompt.userChoice;

      setMessage(
        choice.outcome === "accepted"
          ? "Installation accepted. Check your home screen or app launcher."
          : "Installation was cancelled. You can try again later."
      );

      setInstallPrompt(null);
    } catch {
      setMessage(
        "The install prompt could not open. Use your browser menu to install the app."
      );
    }
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleInstall}
        disabled={installed}
        className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white
                   transition hover:bg-slate-800 disabled:cursor-not-allowed
                   disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
      >
        {installed ? "App Already Installed" : "Install AjitDev App"}
      </button>

      {message && (
        <p role="status" aria-live="polite" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {message}
        </p>
      )}

      {showInstructions && !installed && (
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-5 text-left text-sm shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-2 font-semibold text-slate-900 dark:text-white">How to install</h2>

          <p className="mb-2 text-slate-600 dark:text-slate-300">
            <strong>Android / Desktop:</strong> Open the browser menu and
            choose Install app or Add to Home Screen, if available.
          </p>

          <p className="text-slate-600 dark:text-slate-300">
            <strong>iPhone / iPad:</strong> Open this website in Safari,
            tap Share, choose Add to Home Screen, and confirm.
          </p>
        </div>
      )}
    </div>
  );
}
