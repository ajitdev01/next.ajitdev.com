"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __deferredInstallPrompt?: any;
    __pwaInstalled?: boolean;
  }
}

/**
 * PwaRegister Client Component
 * Registers the /sw.js service worker and globally captures the beforeinstallprompt event
 * so that any install button across the app can trigger 1-tap installation immediately.
 */
export default function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      window.__deferredInstallPrompt = e;
      window.dispatchEvent(new CustomEvent("pwa-prompt-ready"));
    };

    const handleAppInstalled = () => {
      window.__pwaInstalled = true;
      window.__deferredInstallPrompt = null;
      window.dispatchEvent(new CustomEvent("pwa-installed"));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    if ("serviceWorker" in navigator) {
      const handleLoad = () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      };

      if (document.readyState === "complete") {
        handleLoad();
      } else {
        window.addEventListener("load", handleLoad);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  return null;
}
