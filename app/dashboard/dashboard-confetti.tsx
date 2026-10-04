"use client";

import { useEffect } from "react";
import { useConfetti } from "@/lib/useConfetti";
import { identifyUser, captureEvent } from "@/lib/posthog";

interface DashboardConfettiProps {
  userId?: string;
  role?: string;
}

/**
 * Client component that fires a confetti celebration and syncs PostHog user identity
 * when an authenticated member visits the dashboard.
 */
export default function DashboardConfetti({ userId, role }: DashboardConfettiProps) {
  useConfetti(true);

  useEffect(() => {
    if (userId) {
      identifyUser(userId, {
        role: role || "member",
      });
      captureEvent("login_completed", {
        role: role || "member",
        destination: "dashboard",
      });
    }
  }, [userId, role]);

  return null;
}
