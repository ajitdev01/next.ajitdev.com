/**
 * PostHog Server-Side Client — posthog-node singleton
 *
 * Provides server-side analytics, error tracking, logs, and tracing for:
 *   - API routes (app/api routes)
 *   - Server Actions
 *   - Next.js instrumentation hooks (instrumentation.ts)
 *
 * ARCHITECTURE NOTES:
 *   - A global singleton is used so the same client is reused across
 *     requests within a single serverless function invocation.
 *   - For truly per-request instances (e.g. edge runtime), call
 *     `captureServerEvent()` which creates a short-lived client and
 *     flushes immediately.
 *   - `flushAt: 1` and `flushInterval: 0` ensure events are not lost
 *     in serverless environments where processes die between requests.
 *
 * PRIVACY: Never pass passwords, tokens, API keys, card numbers, OTPs,
 * or any sensitive personal data to any function in this file.
 */

import { PostHog } from "posthog-node";

// ─── Singleton ────────────────────────────────────────────────────────────
let _client: PostHog | null = null;

/**
 * Returns the shared posthog-node singleton for long-lived server processes.
 * Returns null when the project token is not configured.
 */
export function getPostHogServer(): PostHog | null {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!token) return null;

  if (!_client) {
    _client = new PostHog(token, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      // Flush immediately — critical for serverless/edge environments.
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return _client;
}

// ─── Per-request helper ──────────────────────────────────────────────────
/**
 * Captures a single server-side event with guaranteed delivery.
 *
 * Creates a short-lived client, sends the event, and shuts down.
 * Suitable for API routes and Server Actions where the process may
 * be recycled between requests.
 *
 * @param distinctId - Stable user ID (from session/cookie).
 *                     Use 'server_runtime' for anonymous server events.
 * @param event      - Event name.
 * @param properties - Safe, non-sensitive event metadata.
 *
 * PRIVACY: Never include passwords, tokens, OTPs, card numbers, or
 * secrets in the properties object.
 */
export async function captureServerEvent({
  distinctId,
  event,
  properties,
}: {
  distinctId: string;
  event: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
}): Promise<void> {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!token) return;

  const client = new PostHog(token, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });

  try {
    client.capture({
      distinctId,
      event,
      properties: {
        ...properties,
        $source: "server",
        $lib: "posthog-node",
      },
    });
  } finally {
    // Always flush/shutdown so events are not lost in serverless envs.
    await client.shutdown();
  }
}

// ─── Server-side error capture ────────────────────────────────────────────
/**
 * Capture a server-side exception into PostHog Error Tracking.
 *
 * @param error       - The error/exception to capture.
 * @param distinctId  - Stable user ID, or 'server_runtime' for anonymous.
 * @param context     - Safe, non-sensitive context (route, method, etc.).
 *
 * PRIVACY: Never include request bodies containing passwords or tokens.
 */
export async function captureServerError(
  error: unknown,
  distinctId: string = "server_runtime",
  context?: Record<string, string | number | boolean | null | undefined>
): Promise<void> {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!token) return;

  const client = new PostHog(token, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });

  try {
    client.captureException(error, distinctId, {
      ...context,
      $source: "server",
    });
  } finally {
    await client.shutdown();
  }
}
