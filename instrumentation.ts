/**
 * PostHog Server-Side Instrumentation — Next.js `instrumentation.ts`
 *
 * Handles server-side error forwarding to PostHog Error Tracking via
 * the `onRequestError` hook that Next.js calls for every unhandled
 * server error (API routes, Server Actions, RSC rendering failures).
 *
 * PRIVACY: Only safe, non-sensitive metadata is forwarded.
 * Passwords, tokens, request bodies, and credentials are never sent.
 */

import type { Instrumentation } from "next";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Pre-warm server-side PostHog client in Node.js runtime
    const { getPostHogServer } = await import("@/lib/posthog-server");
    getPostHogServer();
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context
) => {
  try {
    const { captureServerEvent } = await import("@/lib/posthog-server");
    await captureServerEvent({
      // 'server_runtime' as distinctId for unattributed server errors.
      // If you have a request-scoped user ID, pass it here instead.
      distinctId: "server_runtime",
      event: "$exception",
      properties: {
        // Standard PostHog error properties
        $exception_message:
          err instanceof Error ? err.message : String(err),
        $exception_type: err instanceof Error ? err.name : "ServerError",
        $exception_stack_trace:
          err instanceof Error ? err.stack : undefined,
        // Request context (safe metadata only — no bodies or credentials)
        path: request.path,
        method: request.method,
        routerKind: context.routerKind,
        routePath: context.routePath,
        routeType: context.routeType,
        $source: "server_instrumentation",
      },
    });
  } catch (captureError) {
    // Never let PostHog forwarding break the server instrumentation hook.
    console.error(
      "[PostHog] Failed to forward server exception to PostHog:",
      captureError
    );
  }
};
