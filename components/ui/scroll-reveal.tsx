"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction: _direction = "up",
  distance: _distance = 16,
  duration = 0.35,
}: ScrollRevealProps) {
  // CLS Fix: Using only opacity transitions instead of positional offsets.
  // Y/X offsets cause Cumulative Layout Shift because the element starts at
  // a displaced position and then shifts to its final position, which is
  // measured as a layout shift by Lighthouse/CrUX.
  // Opacity-only transitions are compositor-friendly with zero CLS impact.

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      style={{ willChange: "opacity", transform: "translateZ(0)" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
