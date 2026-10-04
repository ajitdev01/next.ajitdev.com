import posthog from "posthog-js";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    defaults: "2026-05-30",
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: ".ph-mask, [data-ph-mask]",
      blockSelector:
        ".ph-no-capture, [data-ph-no-capture], input[type='password'], input[name*='pass'], input[name*='secret'], input[name*='card'], input[name*='cvv']",
    },
  });

  // Forward uncaught errors to PostHog Error Tracking
  window.addEventListener("error", (event) => {
    if (event.error) {
      posthog.captureException(event.error);
    }
  });

  window.addEventListener("unhandledrejection", (event) => {
    if (event.reason) {
      posthog.captureException(event.reason);
    }
  });
}
