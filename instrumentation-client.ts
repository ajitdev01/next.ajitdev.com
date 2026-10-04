/**
 * PostHog Client Instrumentation — Next.js 15.3+ official approach.
 *
 * Runs exactly ONCE before the application becomes interactive.
 * All PostHog features — Web Analytics, Session Replay, Error Tracking,
 * Heatmaps, Feature Flags, Experiments, Logs, Tracing — are enabled by
 * default via the PostHog project settings or the SDK's remote config.
 *
 * PRIVACY RULES (enforced here and in session_recording options):
 *   - Passwords, OTPs, API keys, tokens, payment fields → always masked/blocked
 *   - No sensitive data is sent as event properties
 */

import posthog from "posthog-js";

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
    // ── Core endpoint ─────────────────────────────────────────────────
    // Points to the reverse proxy defined in next.config.ts so requests
    // bypass ad-blockers and cannot be attributed to posthog.com directly.
    api_host: "/ingest",

    // The actual PostHog host — required when using a reverse proxy so
    // the SDK can construct correct UI links inside the dashboard.
    ui_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",

    // ── SDK defaults snapshot (2026-05-30) ────────────────────────────
    // Opts into: history_change pageviews, split_storage, debounced
    // persistence writes, detect_google_search_app, refined rageclick.
    defaults: "2026-05-30",

    // ── Web Analytics & Pageviews ──────────────────────────────────────
    // 'history_change': capture initial pageview + every SPA navigation.
    // UTM params, referrers, entry/exit pages, sessions, etc. are all
    // collected automatically by the SDK once pageviews are captured.
    capture_pageview: "history_change",

    // Also capture pageleave events (bounce rate, session duration).
    capture_pageleave: true,

    // ── Referrer & Campaign params ────────────────────────────────────
    save_referrer: true,
    save_campaign_params: true, // utm_source, utm_medium, utm_campaign, utm_term, utm_content

    // ── Autocapture (clicks, rage-clicks, UI interactions) ────────────
    // Enabled by default; the SDK + remote config control which elements
    // are captured. We rely on class-based opt-out for sensitive areas.
    autocapture: true,

    // ── Heatmaps ─────────────────────────────────────────────────────
    // Enabled via project settings; the SDK reads remote config.
    // Explicit opt-in here ensures it is on regardless of remote config.
    capture_heatmaps: true,

    // ── Dead-click detection ─────────────────────────────────────────
    capture_dead_clicks: true,

    // ── RUM / Core Web Vitals (LCP, INP, CLS) ────────────────────────
    // undefined → falls back to remote configuration (project setting).
    // Explicitly set to ensure it's always on.
    capture_performance: {
      web_vitals: true,
      network_timing: true,
    },

    // ── Error Tracking ────────────────────────────────────────────────
    // Automatically captures uncaught exceptions and unhandled rejections.
    capture_exceptions: true,

    // ── Tracing headers ──────────────────────────────────────────────
    // Injects X-POSTHOG-DISTINCT-ID, X-POSTHOG-SESSION-ID, and
    // X-POSTHOG-WINDOW-ID on all same-origin API requests so backend
    // logs and PostHog events can be correlated by session/user.
    tracing_headers: [
      typeof window !== "undefined" ? window.location.hostname : "",
    ].filter(Boolean),

    // ── Logs ─────────────────────────────────────────────────────────
    // PostHog browser logs capture is controlled by the project's remote
    // config. The 'logs' config key may be set to enforce it client-side.
    // No additional explicit configuration needed here.

    // ── Session Replay ────────────────────────────────────────────────
    // Enabled via project settings; the SDK lazy-loads the recorder.
    session_recording: {
      // Mask ALL input values by default (the safest posture).
      maskAllInputs: true,

      // Additional CSS selector-based masking for rendered sensitive text
      // (e.g. masked card PAN displayed on screen, OTP fields styled as
      // divs, etc.)
      maskTextSelector: [
        ".ph-mask",
        "[data-ph-mask]",
        "[data-sensitive]",
        "[data-private]",
        ".sensitive-field",
      ].join(", "),

      // Block these elements entirely — their subtree is replaced with a
      // placeholder rectangle in the recording.
      blockSelector: [
        ".ph-no-capture",
        "[data-ph-no-capture]",
        // Password and secret inputs
        "input[type='password']",
        "input[name*='password']",
        "input[name*='passwd']",
        "input[name*='pass']",
        // OTP / PIN fields
        "input[name*='otp']",
        "input[name*='pin']",
        "input[name*='code']",
        "input[autocomplete='one-time-code']",
        // Payment fields
        "input[name*='card']",
        "input[name*='cvv']",
        "input[name*='cvc']",
        "input[name*='expiry']",
        "input[name*='expiration']",
        // Secrets / API keys
        "input[name*='secret']",
        "input[name*='apikey']",
        "input[name*='api_key']",
        "input[name*='token']",
        // Aadhaar / identity numbers
        "input[name*='aadhaar']",
        "input[name*='pan']",
      ].join(", "),

      // Ignore class — inputs with this class are not recorded at all.
      ignoreClass: "ph-ignore-input",
    },

    // ── Person profiles ───────────────────────────────────────────────
    // 'identified_only': only create person profiles after posthog.identify().
    // Keeps anonymous traffic cheap on the free tier.
    person_profiles: "identified_only",

    // ── Scroll properties (engagement metrics) ────────────────────────
    // Tracks how far down the page users scroll — useful for engagement.
    disable_scroll_properties: false,
  });
}
