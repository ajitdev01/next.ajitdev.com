"use client";

import { useConfetti } from "@/lib/useConfetti";

/**
 * Client component that fires a confetti celebration when the user
 * lands on the dashboard after a successful login or sign-up.
 * Renders nothing visible — it's purely a side-effect component.
 */
export default function DashboardConfetti() {
  useConfetti(true);
  return null;
}
