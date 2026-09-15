"use client";

import { useEffect } from "react";

export default function ClarityAnalytics() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prevent double-injection in dev / fast refresh
    if ((window as any).__clarity_loaded__) return;
    (window as any).__clarity_loaded__ = true;

    const injectClarity = () => {
      (function (c: any, l: Document, a: string, r: string, i: string) {
        c[a] =
          c[a] ||
          function () {
            (c[a].q = c[a].q || []).push(arguments);
          };
        const t = l.createElement(r) as HTMLScriptElement;
        t.async = true;
        t.src = "https://www.clarity.ms/tag/" + i;
        const y = l.getElementsByTagName(r)[0];
        y.parentNode?.insertBefore(t, y);
      })(window, document, "clarity", "script", "yhpaav7itz");
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(injectClarity, { timeout: 3000 });
    } else {
      setTimeout(injectClarity, 1500);
    }
  }, []);

  return null;
}