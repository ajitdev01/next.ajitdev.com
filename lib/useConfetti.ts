"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

/**
 * Fires a celebratory confetti burst from both sides of the screen.
 * Duration: ~2.5 seconds of continuous particle bursts.
 */
export function fireConfetti() {
  const duration = 5 * 500; // 2.5 seconds
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Burst from the left side
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });

    // Burst from the right side
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

/**
 * React hook that fires confetti once on mount (controlled by a trigger boolean).
 * @param shouldFire - If true, confetti fires on mount. Defaults to true.
 */
export function useConfetti(shouldFire: boolean = true) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (shouldFire && !hasFired.current) {
      hasFired.current = true;
      // Small delay so the page has time to render first
      const timeout = setTimeout(() => {
        fireConfetti();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [shouldFire]);
}
