import type { NextConfig } from "next";
import { withPostHogConfig } from "@posthog/nextjs-config";

// ── PostHog Source Maps (Error Tracking) ──────────────────────────────────
// `withPostHogConfig` uploads source maps to PostHog during production builds
// so stack traces in the Error Tracking dashboard resolve to readable source
// locations (e.g. `app/dashboard/page.tsx:42`) instead of minified bundles.
//
// Required build-time environment variables (set in Vercel / CI):
//   POSTHOG_PERSONAL_API_KEY   — PostHog Personal API Key (Settings → User)
//   POSTHOG_PROJECT_ID         — PostHog Project ID       (Settings → Project)
//   NEXT_PUBLIC_POSTHOG_HOST   — PostHog host (default: https://us.i.posthog.com)
//
// If these variables are absent (local dev, preview without token) the build
// succeeds without source map upload — tracking still works normally.

const baseNextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Google profile photos (OAuth avatar)
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        // GitHub avatars (future-proof)
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        // Atlas Store – Fake Store API product images
        protocol: "https",
        hostname: "fakestoreapi.com",
        pathname: "/img/**",
      },
      {
        // Atlas Store – DummyJSON CDN product images
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/product-images/**",
      },
      {
        // Unsplash CDN images
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        // Unsplash direct
        protocol: "https",
        hostname: "unsplash.com",
        pathname: "/**",
      },
    ],
  },

  // Required for PostHog reverse proxy rewrites to work correctly without
  // Next.js adding a trailing slash redirect that breaks the proxy rules.
  skipTrailingSlashRedirect: true,

  async rewrites() {
    return [
      // ── PostHog Reverse Proxy ──────────────────────────────────────────
      // Routes PostHog API/asset requests through this domain's edge network.
      //
      // Benefits:
      //   1. Bypasses most ad-blockers (requests look like first-party traffic)
      //   2. Improves event delivery reliability in production
      //   3. Reduces analytics discrepancies
      //
      // The SDK is initialised with `api_host: '/ingest'` in
      // instrumentation-client.ts which maps to these routes.
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
};

// ── Conditional source-map upload via withPostHogConfig ───────────────────
// Only wrap with `withPostHogConfig` in production deployment environments
// (e.g. Vercel CI where VERCEL === "1") or when explicitly requested via
// POSTHOG_UPLOAD_SOURCEMAPS="true". This keeps local development builds fast,
// prevents network upload timeouts locally, while guaranteeing production
// builds upload source maps securely with deleteAfterUpload enabled.
const posthogPersonalApiKey = process.env.POSTHOG_PERSONAL_API_KEY;
const posthogProjectId = process.env.POSTHOG_PROJECT_ID;
const shouldUploadSourcemaps = Boolean(
  (process.env.POSTHOG_UPLOAD_SOURCEMAPS === "true" ||
    process.env.VERCEL === "1") &&
    posthogPersonalApiKey &&
    posthogProjectId
);

let nextConfig: NextConfig;

if (shouldUploadSourcemaps && posthogPersonalApiKey && posthogProjectId) {
  nextConfig = withPostHogConfig(baseNextConfig, {
    personalApiKey: posthogPersonalApiKey,
    projectId: posthogProjectId,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    sourcemaps: {
      enabled: true,
      // Delete source maps from the build output after upload so they are
      // not publicly accessible via the production CDN.
      deleteAfterUpload: true,
    },
  });
} else {
  nextConfig = baseNextConfig;
}

export default nextConfig;
