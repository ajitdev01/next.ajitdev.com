import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context
) => {
  try {
    const { captureServerEvent } = await import("@/lib/posthog-server");
    await captureServerEvent({
      distinctId: "server_runtime",
      event: "$exception",
      properties: {
        $exception_message: err instanceof Error ? err.message : String(err),
        $exception_type: err instanceof Error ? err.name : "ServerError",
        $exception_stack_trace: err instanceof Error ? err.stack : undefined,
        path: request.path,
        method: request.method,
        routerKind: context.routerKind,
        routePath: context.routePath,
        routeType: context.routeType,
      },
    });
  } catch (error) {
    console.error("Failed to forward server exception to PostHog:", error);
  }
};
