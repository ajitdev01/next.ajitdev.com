"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, Play } from "lucide-react";

interface AppIntroSplashProps {
  /** Forced manual trigger for previewing */
  forcePlay?: boolean;
  onFinish?: () => void;
  /** Duration in seconds (4-8 sec range, default 5.5s) */
  duration?: number;
}

/**
 * Synthesizes a futuristic, cinematic startup sound using native Web Audio API.
 * Always Sound ON — rich sub-bass foundation + sci-fi energy swell + harmonic chime.
 */
function playCinematicSound() {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    const resumeAudio = () => {
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
    };

    resumeAudio();

    // Unlock on immediate user gesture if browser suspended initial autoplay
    if (ctx.state === "suspended") {
      const unlock = () => {
        resumeAudio();
        window.removeEventListener("click", unlock);
        window.removeEventListener("touchstart", unlock);
      };
      window.addEventListener("click", unlock, { once: true });
      window.addEventListener("touchstart", unlock, { once: true });
    }

    const now = ctx.currentTime;

    // 1. Deep Sub-Bass Rumble (Foundation)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(45, now);
    subOsc.frequency.exponentialRampToValueAtTime(68, now + 2.2);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 4.8);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.35, now + 0.8);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 5.0);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 5.2);

    // 2. Futuristic Energy Swell (Pad / Filtered Riser)
    const swellOsc = ctx.createOscillator();
    const swellGain = ctx.createGain();
    const swellFilter = ctx.createBiquadFilter();

    swellOsc.type = "sawtooth";
    swellOsc.frequency.setValueAtTime(110, now + 0.5);
    swellOsc.frequency.exponentialRampToValueAtTime(220, now + 2.4);

    swellFilter.type = "lowpass";
    swellFilter.frequency.setValueAtTime(280, now + 0.5);
    swellFilter.frequency.exponentialRampToValueAtTime(2600, now + 2.6);

    swellGain.gain.setValueAtTime(0.001, now + 0.5);
    swellGain.gain.linearRampToValueAtTime(0.14, now + 2.2);
    swellGain.gain.exponentialRampToValueAtTime(0.001, now + 4.8);

    swellOsc.connect(swellFilter);
    swellFilter.connect(swellGain);
    swellGain.connect(ctx.destination);
    swellOsc.start(now + 0.5);
    swellOsc.stop(now + 5.0);

    // 3. Shimmer High-End Chime (Harmonic Brilliance at Reveal)
    [440, 659.25, 880, 1318.5].forEach((freq, idx) => {
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      const chimeTime = now + 1.8 + idx * 0.14;

      chimeOsc.type = "sine";
      chimeOsc.frequency.setValueAtTime(freq, chimeTime);

      chimeGain.gain.setValueAtTime(0.001, chimeTime);
      chimeGain.gain.linearRampToValueAtTime(0.06, chimeTime + 0.08);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, chimeTime + 1.9);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(chimeTime);
      chimeOsc.stop(chimeTime + 2.1);
    });
  } catch {
    // Silent fallback if Web Audio is unsupported
  }
}

export default function AppIntroSplash({
  forcePlay = false,
  onFinish,
  duration = 5.5,
}: AppIntroSplashProps) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"ignite" | "reveal" | "glow" | "complete">(
    "ignite"
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const finishIntro = useCallback(() => {
    setVisible(false);
    try {
      sessionStorage.setItem("next_pwa_intro_viewed", "true");
    } catch (_) {}
    onFinish?.();
  }, [onFinish]);

  // Determine if intro should play on launch — STRICTLY PWA ONLY
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (forcePlay) {
      setVisible(true);
      return;
    }

    // Comprehensive detection for installed PWA standalone mode
    const isStandalonePWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true ||
      document.referrer.startsWith("android-app://") ||
      window.location.search.includes("source=pwa") ||
      window.location.search.includes("utm_source=pwa");

    const alreadyShownInPwa = sessionStorage.getItem("next_pwa_intro_viewed");

    // STRICTLY PWA ONLY: Plays ONLY when launched as installed PWA app
    if (isStandalonePWA && !alreadyShownInPwa) {
      setVisible(true);
    }

    const handleReplay = () => {
      setProgress(0);
      setPhase("ignite");
      setVisible(true);
    };

    window.addEventListener("replay-app-intro", handleReplay);
    return () => window.removeEventListener("replay-app-intro", handleReplay);
  }, [forcePlay]);

  // Timer & Progress Animation Loop with ALWAYS SOUND ON
  useEffect(() => {
    if (!visible) return;

    // Trigger cinematic sound immediately on intro launch
    playCinematicSound();

    const startTime = Date.now();
    const totalMs = duration * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / totalMs) * 100);
      setProgress(pct);

      if (pct > 25 && pct <= 60) {
        setPhase("reveal");
      } else if (pct > 60 && pct < 90) {
        setPhase("glow");
      } else if (pct >= 90) {
        setPhase("complete");
      }

      if (elapsed >= totalMs) {
        clearInterval(interval);
        finishIntro();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [visible, duration, finishIntro]);

  // Cosmic Starfield Particle Canvas Background
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle setup: Starfield warping inward
    const numParticles = 90;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width - width / 2,
      y: Math.random() * height - height / 2,
      z: Math.random() * width,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
    }));

    const render = () => {
      ctx.fillStyle = "rgba(5, 5, 8, 0.28)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.z -= 3.5;
        if (p.z <= 0) {
          p.z = width;
          p.x = Math.random() * width - width / 2;
          p.y = Math.random() * height - height / 2;
        }

        const k = 140 / p.z;
        const px = p.x * k + cx;
        const py = p.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const sz = Math.max(0.6, (1 - p.z / width) * 2.8);
          ctx.beginPath();
          ctx.arc(px, py, sz, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * (1 - p.z / width)})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="next-app-intro-splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between overflow-hidden bg-[#050508] select-none text-white"
          style={{ touchAction: "none" }}
        >
          {/* Canvas Starfield Warp Background */}
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
          />

          {/* Ambient Radial Spotlight */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [0.8, 1.25, 1.1],
                opacity: [0.25, 0.65, 0.45],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-[380px] w-[380px] sm:h-[540px] sm:w-[540px] rounded-full bg-gradient-to-tr from-white/10 via-neutral-100/5 to-transparent blur-3xl"
            />
          </div>

          {/* Top spacer (Clean uninterrupted view — Skip button removed) */}
          <div className="relative z-20 w-full max-w-4xl px-6 pt-8 sm:px-8 sm:pt-10 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ duration: 1.2 }}
              className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 font-mono"
            >
              Next Mobile &bull; PWA
            </motion.div>
          </div>

          {/* Centerpiece: Cinematic NEXT Logo Animation */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center">
            {/* Glowing Concentric Halo Rings */}
            <div className="relative flex items-center justify-center">
              {/* Outer Energy Ring */}
              <motion.div
                initial={{ scale: 0.4, opacity: 0, rotate: 0 }}
                animate={{
                  scale: [0.6, 1.35, 1.2],
                  opacity: [0, 0.8, 0.4],
                  rotate: 360,
                }}
                transition={{ duration: 5, ease: "easeOut" }}
                className="absolute h-48 w-48 sm:h-64 sm:w-64 rounded-full border border-white/20 border-dashed"
              />

              {/* Inner Shockwave Pulse Ring */}
              <motion.div
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{
                  scale: [0.3, 1.1, 1.0],
                  opacity: [0, 0.9, 0.2],
                }}
                transition={{ duration: 3.2, ease: "easeOut", delay: 0.4 }}
                className="absolute h-40 w-40 sm:h-52 sm:w-52 rounded-full border border-white/30"
              />

              {/* Next App Logo Container with Holographic Shimmer */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0, y: 20 }}
                animate={{
                  scale: [0.3, 1.08, 1],
                  opacity: [0, 1, 1],
                  y: [20, -4, 0],
                }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center overflow-hidden rounded-full bg-black/90 p-3 shadow-[0_0_50px_rgba(255,255,255,0.25)] border border-white/30 backdrop-blur-xl"
              >
                {/* Continuous Laser Shimmer Beam Sweep */}
                <motion.div
                  initial={{ x: "-150%" }}
                  animate={{ x: "180%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.2,
                    ease: "easeInOut",
                    delay: 0.8,
                  }}
                  className="pointer-events-none absolute inset-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-xs"
                />

                <Image
                  src="/icons/pwa-192.png"
                  alt="Next Logo Emblem"
                  width={144}
                  height={144}
                  className="h-full w-full object-contain filter drop-shadow-[0_0_16px_rgba(255,255,255,0.4)]"
                  priority
                />
              </motion.div>
            </div>

            {/* Title: NEXT with Expanding Letter Spacing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
              className="mt-6 flex flex-col items-center"
            >
              <motion.h1
                initial={{ letterSpacing: "0.45em" }}
                animate={{ letterSpacing: "0.22em" }}
                transition={{ duration: 3.5, ease: "easeOut" }}
                className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400 tracking-[0.22em] uppercase drop-shadow-[0_2px_20px_rgba(255,255,255,0.3)] ml-2"
              >
                Next
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.28em] text-neutral-400"
              >
                Engineering &amp; Developer Platform
              </motion.p>

              {/* Status pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 2.0 }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-neutral-300"
              >
                <Sparkles className="h-3 w-3 text-white animate-pulse" />
                <span>
                  {phase === "ignite" && "Initializing Core..."}
                  {phase === "reveal" && "Loading Workspaces..."}
                  {phase === "glow" && "Ready to Launch"}
                  {phase === "complete" && "Welcome"}
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Progress Bar & Loading Indicator */}
          <div className="relative z-20 w-full max-w-md px-6 pb-8 sm:px-8 sm:pb-10">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2">
              <span>AJITDEV v2.5</span>
              <span>{Math.round(progress)}%</span>
            </div>

            {/* Glowing Track */}
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-neutral-400 via-white to-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Small helper button to replay the intro anytime from UI
 */
export function ReplayIntroButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("replay-app-intro"));
      }}
      className={`inline-flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-black dark:text-white transition hover:bg-neutral-200 dark:hover:bg-neutral-800 ${className}`}
      aria-label="Replay App Opening Video Intro"
    >
      <Play className="h-3.5 w-3.5 fill-current" />
      <span>Play Logo Intro (Video)</span>
    </button>
  );
}
