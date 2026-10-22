"use client";

import { useEffect } from "react";

/**
 * PwaRegister Client Component
 * Registers the /sw.js service worker on window load to enable Progressive Web App (PWA)
 * detection, offline caching, and installability.
 */
export default function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const handleLoad = () => {
        navigator.serviceWorker
          .register("/sw.js")
          .catch(() => {
            // Silently swallow errors in restrictive sandbox environments
          });
      };

      if (document.readyState === "complete") {
        handleLoad();
      } else {
        window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
      }
    }
  }, []);

  return null;
}
