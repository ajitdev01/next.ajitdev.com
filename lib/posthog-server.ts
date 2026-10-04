import { PostHog } from "posthog-node";

let posthogNodeClient: PostHog | null = null;

/**
 * Returns a singleton instance of PostHog for server-side operations.
 */
export function getPostHogServer(): PostHog | null {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!token) return null;

  if (!posthogNodeClient) {
    posthogNodeClient = new PostHog(token, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogNodeClient;
}

/**
 * Captures an event server-side in API routes or Server Actions.
 * Guarantees flush/shutdown so events are not dropped in serverless environments.
 */
export async function captureServerEvent({
  distinctId,
  event,
  properties,
}: {
  distinctId: string;
  event: string;
  properties?: Record<string, any>;
}): Promise<void> {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!token) return;

  const client = new PostHog(token, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
  });

  try {
    client.capture({
      distinctId,
      event,
      properties: {
        ...properties,
        $source: "server",
      },
    });
  } finally {
    await client.shutdown();
  }
}
