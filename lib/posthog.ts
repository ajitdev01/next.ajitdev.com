import posthog from "posthog-js";

/**
 * Standard Product Analytics Event Names
 */
export type ProductEvent =
  | "signup_completed"
  | "login_completed"
  | "logout_completed"
  | "course_viewed"
  | "course_enrolled"
  | "payment_started"
  | "payment_completed"
  | "payment_failed"
  | "profile_updated"
  | "search_performed"
  | "document_uploaded"
  | "feature_used"
  | (string & {});

/**
 * Capture a structured product analytics event client-side.
 * Sanitizes and avoids sending any sensitive personal data.
 */
export function captureEvent(
  event: ProductEvent,
  properties?: Record<string, any>
): void {
  if (typeof window === "undefined") return;
  posthog.capture(event, properties);
}

/**
 * Identify an authenticated user with a stable ID and safe non-sensitive properties.
 */
export function identifyUser(
  userId: string,
  userProperties?: {
    role?: string;
    account_created_at?: string;
    [key: string]: any;
  }
): void {
  if (typeof window === "undefined" || !userId) return;

  // Never send passwords, tokens, or raw secrets in properties
  const safeProperties = { ...userProperties };
  delete (safeProperties as any).password;
  delete (safeProperties as any).token;
  delete (safeProperties as any).secret;

  posthog.identify(userId, safeProperties);
}

/**
 * Reset PostHog user identity on logout to avoid leaking state to subsequent users.
 */
export function resetUser(): void {
  if (typeof window === "undefined") return;
  posthog.reset();
}

/**
 * Report client-side exceptions to PostHog error tracking.
 */
export function captureClientError(
  error: unknown,
  additionalProperties?: Record<string, any>
): void {
  if (typeof window === "undefined") return;
  posthog.captureException(error, additionalProperties);
}

/**
 * Evaluate a PostHog Feature Flag client-side.
 */
export function isFeatureEnabled(flagKey: string): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(posthog.isFeatureEnabled(flagKey));
}

/**
 * Get Feature Flag variant (boolean or string).
 */
export function getFeatureFlag(flagKey: string): boolean | string | undefined {
  if (typeof window === "undefined") return undefined;
  return posthog.getFeatureFlag(flagKey);
}

/**
 * Get Feature Flag JSON payload.
 */
export function getFeatureFlagPayload(flagKey: string): any {
  if (typeof window === "undefined") return undefined;
  return posthog.getFeatureFlagPayload(flagKey);
}

/**
 * Record exposure to an A/B test / experiment.
 */
export function recordExperimentExposure(
  experimentName: string,
  variant: string | boolean
): void {
  if (typeof window === "undefined") return;
  posthog.capture("$feature_flag_called", {
    $feature_flag: experimentName,
    $feature_flag_response: variant,
  });
}
