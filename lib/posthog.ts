/**
 * PostHog Client Utilities
 *
 * Provides typed helpers for:
 *   - Product Analytics events (captures meaningful business actions)
 *   - User identification / reset
 *   - Error tracking
 *   - Feature Flags & A/B Experiments
 *
 * PRIVACY RULES — enforced throughout:
 *   Never include passwords, OTPs, tokens, API keys, card numbers,
 *   Aadhaar numbers, or any other sensitive personal data in event
 *   properties, identify calls, or error context.
 *
 * Only use these helpers from 'use client' components or browser-only
 * code paths.  The `posthog` instance is initialized once in
 * `instrumentation-client.ts` and is safe to import directly.
 */

import posthog from "posthog-js";

// ─── Typed Event Catalogue ────────────────────────────────────────────────
// Add new event names here as the product grows. Keeping a central catalogue
// prevents typos and makes dashboards / funnels easier to set up.

export type ProductEvent =
  // ── Auth funnel ──────────────────────────────────────
  | "signup_started"
  | "signup_completed"
  | "login_started"
  | "login_completed"
  | "logout_completed"
  // ── Profile ──────────────────────────────────────────
  | "profile_updated"
  // ── Payment funnel ───────────────────────────────────
  | "payment_started"
  | "payment_completed"
  | "payment_failed"
  // ── Course / Content ─────────────────────────────────
  | "course_viewed"
  | "course_enrollment_started"
  | "course_enrolled"
  // ── General product ──────────────────────────────────
  | "search_performed"
  | "document_uploaded"
  | "feature_used"
  // ── Observability ────────────────────────────────────
  | "store_product_viewed"
  | "store_product_added_to_cart"
  | "store_checkout_started"
  | "todo_created"
  | "todo_completed"
  | "currency_converted"
  | "weather_viewed"
  | "note_created"
  | "note_updated"
  | "assistant_query_sent"
  // Allow arbitrary string events while still benefiting from autocomplete
  | (string & {});

// ─── captureEvent ─────────────────────────────────────────────────────────
/**
 * Capture a structured product analytics event client-side.
 *
 * @example
 *   captureEvent('payment_started', { amount: 1000, currency: 'INR' })
 *   captureEvent('course_viewed', { course_id: 'c_abc123', category: 'dev' })
 *
 * @param event      - Event name from the ProductEvent catalogue.
 * @param properties - Safe, non-sensitive metadata.  Never include passwords,
 *                     tokens, card numbers, OTPs, or any secret values.
 */
export function captureEvent(
  event: ProductEvent,
  properties?: Record<string, string | number | boolean | null | undefined>
): void {
  if (typeof window === "undefined") return;
  posthog.capture(event, properties);
}

// ─── identifyUser ────────────────────────────────────────────────────────
/**
 * Identify an authenticated user with their stable ID.
 *
 * Call this AFTER a successful login / session restore so PostHog can
 * associate previous anonymous events with the identified person.
 *
 * @param userId         - The application's stable, non-sensitive user ID
 *                         (e.g. MongoDB ObjectId string or UUID).  Never use
 *                         email, phone, or Aadhaar as the primary distinct ID.
 * @param userProperties - Safe, non-sensitive properties only.
 *                         NEVER include: password, token, secret, card number.
 */
export function identifyUser(
  userId: string,
  userProperties?: {
    role?: string;
    account_created_at?: string;
    plan?: string;
    [key: string]: string | number | boolean | null | undefined;
  }
): void {
  if (typeof window === "undefined" || !userId) return;

  // Sanitise: strip any accidental secret-adjacent keys before sending.
  const safe = { ...userProperties };
  (
    [
      "password",
      "passwd",
      "token",
      "secret",
      "apiKey",
      "api_key",
      "jwt",
      "refreshToken",
      "refresh_token",
      "accessToken",
      "access_token",
      "otp",
      "pin",
      "cvv",
      "card",
      "aadhaar",
      "pan",
    ] as const
  ).forEach((key) => delete (safe as Record<string, unknown>)[key]);

  posthog.identify(userId, safe);
}

// ─── resetUser ───────────────────────────────────────────────────────────
/**
 * Reset PostHog user identity on logout.
 *
 * This is CRITICAL — it prevents identity leakage between different
 * users on the same browser/device.  Always call this on sign-out.
 */
export function resetUser(): void {
  if (typeof window === "undefined") return;
  posthog.reset();
}

// ─── captureClientError ──────────────────────────────────────────────────
/**
 * Report a caught client-side error to PostHog Error Tracking.
 *
 * Uncaught errors and unhandled promise rejections are already forwarded
 * automatically by `instrumentation-client.ts`.  Use this helper for
 * errors your code explicitly catches but still wants to track.
 *
 * @param error                - The caught error object.
 * @param additionalProperties - Safe, non-sensitive context (route, feature name, etc.).
 *                               NEVER include passwords, tokens, or secrets.
 */
export function captureClientError(
  error: unknown,
  additionalProperties?: Record<string, string | number | boolean | null | undefined>
): void {
  if (typeof window === "undefined") return;
  posthog.captureException(error, additionalProperties);
}

// ─── Feature Flags ───────────────────────────────────────────────────────

/**
 * Returns true if a boolean feature flag is enabled for the current user.
 * Returns false when PostHog is not available (SSR, no token, etc.).
 *
 * @example
 *   if (isFeatureEnabled('new-checkout-flow')) { ... }
 */
export function isFeatureEnabled(flagKey: string): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(posthog.isFeatureEnabled(flagKey));
}

/**
 * Returns the current value of a feature flag (boolean or string variant).
 * Returns undefined when PostHog is unavailable.
 *
 * @example
 *   const variant = getFeatureFlag('homepage-hero');
 *   // → 'control' | 'variant_a' | 'variant_b' | true | false | undefined
 */
export function getFeatureFlag(
  flagKey: string
): boolean | string | undefined {
  if (typeof window === "undefined") return undefined;
  return posthog.getFeatureFlag(flagKey);
}

/**
 * Returns the JSON payload attached to a feature flag.
 * Useful for multivariate experiments where the variant carries config data.
 */
export function getFeatureFlagPayload(flagKey: string): unknown {
  if (typeof window === "undefined") return undefined;
  return posthog.getFeatureFlagPayload(flagKey);
}

// ─── A/B Experiments ─────────────────────────────────────────────────────

/**
 * Record that the current user was exposed to an experiment variant.
 *
 * PostHog automatically tracks `$feature_flag_called` when you call
 * `getFeatureFlag()`.  Use this helper only when you need to explicitly
 * record exposure for custom experiment analysis, e.g. deferred renders.
 *
 * @param experimentFlagKey - The feature flag key used for the experiment.
 * @param variant           - The variant the user was shown.
 */
export function recordExperimentExposure(
  experimentFlagKey: string,
  variant: string | boolean
): void {
  if (typeof window === "undefined") return;
  posthog.capture("$feature_flag_called", {
    $feature_flag: experimentFlagKey,
    $feature_flag_response: variant,
  });
}
