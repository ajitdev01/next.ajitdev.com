"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Terminal,
  Activity,
  Layers,
  Server,
  Database,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Laptop,
  Radio,
  Cpu,
  ChevronRight,
} from "lucide-react";



// ============================================================================
// 2. ECOSYSTEM DOMAINS DATA
// Genuine, verified domains of the AJITDEV ecosystem
// ============================================================================
const ECOSYSTEM_DOMAINS = [
  {
    name: "ajitdev.com",
    tag: "Main Ecosystem",
    description: "Personal portfolio, engineering articles & verified identity",
    href: "https://www.ajitdev.com/",
    status: "Live",
  },
  {
    name: "api.ajitdev.com",
    tag: "API Hub",
    description: "Free public REST & JSON developer endpoints",
    href: "https://api.ajitdev.com/",
    status: "Active",
  },
  {
    name: "brainzima.com",
    tag: "Education",
    description: "EdTech platform & developer learning tools",
    href: "https://www.brainzima.com/",
    status: "Live",
  },
  {
    name: "bifindr.com",
    tag: "Discovery",
    description: "Curated developer & business discovery engine",
    href: "https://bifindr.com/",
    status: "Live",
  },
  {
    name: "rexvel.com",
    tag: "Solutions",
    description: "Web development & bespoke software engineering",
    href: "https://rexvel.com/",
    status: "Live",
  },
  {
    name: "try.ajitdev.com",
    tag: "Sandbox",
    description: "Interactive application previews & developer sandboxes",
    href: "https://try.ajitdev.com/",
    status: "Live",
  },
];

// ============================================================================
// 3. API HEALTH RESPONSE FIELDS (One-by-one 3D Stream)
// ============================================================================
const API_RESPONSE_FIELDS = [
  {
    key: "status",
    value: '"success"',
    badge: "LIVE 🟢",
    badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200/80",
  },
  {
    key: "latency",
    value: '"14ms"',
    badge: "14ms EDGE",
    badgeColor: "text-cyan-700 bg-cyan-50 border-cyan-200/80",
  },
  {
    key: "protocol",
    value: '"HTTP/3 · QUIC"',
    badge: "UDP / QUIC",
    badgeColor: "text-blue-700 bg-blue-50 border-blue-200/80",
  },
  {
    key: "endpoint",
    value: '"https://api.ajitdev.com/v1/health"',
    badge: "PUBLIC API",
    badgeColor: "text-purple-700 bg-purple-50 border-purple-200/80",
  },
  {
    key: "cluster",
    value: '"edge-asia-south1"',
    badge: "BOM-EDGE",
    badgeColor: "text-indigo-700 bg-indigo-50 border-indigo-200/80",
  },
  {
    key: "developer",
    value: '"Ajit Dev"',
    badge: "FOUNDER",
    badgeColor: "text-amber-700 bg-amber-50 border-amber-200/80",
  },
  {
    key: "security",
    value: '"TLS 1.3 · CORS Enabled"',
    badge: "A+ SSL",
    badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200/80",
  },
  {
    key: "uptime",
    value: '"99.98%"',
    badge: "VERIFIED SLA",
    badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200/80",
  },
];

const RAW_API_RESPONSE_JSON = JSON.stringify(
  {
    status: "success",
    latency: "14ms",
    protocol: "HTTP/3 · QUIC",
    endpoint: "https://api.ajitdev.com/v1/health",
    cluster: "edge-asia-south1",
    developer: "Ajit Dev",
    security: "TLS 1.3 · CORS Enabled",
    uptime: "99.98%",
  },
  null,
  2
);

// ============================================================================
// 4. 4-TIER DISTRIBUTED SYSTEM TOPOLOGY CONFIGURATION
// ============================================================================
interface ArchTierConfig {
  tier: number;
  badge: string;
  title: string;
  tech: string;
  subtext: string;
  latency: string;
  cumulativeMs: number;
  protocol: string;
  flowTag: string;
  color: "blue" | "purple" | "emerald" | "amber";
  borderActive: string;
  borderDefault: string;
  bgActive: string;
  bgDefault: string;
  ringActive: string;
  shadowActive: string;
  accentText: string;
  accentBadge: string;
  iconBg: string;
  dotColor: string;
  payload: Record<string, string>;
}

const ARCH_TIERS: ArchTierConfig[] = [
  {
    tier: 1,
    badge: "Tier 1",
    title: "Client Tier",
    tech: "Next.js 16 SPA",
    subtext: "Local-First UI · 1ms",
    latency: "1ms",
    cumulativeMs: 1,
    protocol: "HTTP/3 · QUIC",
    flowTag: "Client SPA Dispatch",
    color: "blue",
    borderActive: "border-blue-500",
    borderDefault: "border-slate-200/90",
    bgActive: "bg-blue-50/50",
    bgDefault: "bg-white/90",
    ringActive: "ring-2 ring-blue-500/25",
    shadowActive: "shadow-[0_12px_30px_-6px_rgba(59,130,246,0.22)]",
    accentText: "text-blue-600",
    accentBadge: "bg-blue-100/90 text-blue-700 border-blue-200/80",
    iconBg: "bg-blue-50 text-blue-600 border-blue-100",
    dotColor: "bg-blue-500",
    payload: {
      action: "CLIENT_DISPATCH",
      layer: "Browser Client (Chromium / V8)",
      framework: "Next.js 16 SPA · Turbopack",
      stateManagement: "Local-First Optimistic UI",
      outboundProtocol: "HTTP/3 QUIC · 0-RTT",
      targetEndpoint: "https://api.ajitdev.com/v1/health",
      dispatchLatency: "1ms (Instant UI Update)",
    },
  },
  {
    tier: 2,
    badge: "Tier 2",
    title: "Edge Gateway",
    tech: "Cloudflare & DNS",
    subtext: "TLS 1.3 / CORS · 4ms",
    latency: "4ms",
    cumulativeMs: 4,
    protocol: "TLS 1.3 / BGP Anycast",
    flowTag: "Cloudflare Edge Handshake",
    color: "purple",
    borderActive: "border-purple-500",
    borderDefault: "border-slate-200/90",
    bgActive: "bg-purple-50/50",
    bgDefault: "bg-white/90",
    ringActive: "ring-2 ring-purple-500/25",
    shadowActive: "shadow-[0_12px_30px_-6px_rgba(168,85,247,0.22)]",
    accentText: "text-purple-600",
    accentBadge: "bg-purple-100/90 text-purple-700 border-purple-200/80",
    iconBg: "bg-purple-50 text-purple-600 border-purple-100",
    dotColor: "bg-purple-500",
    payload: {
      action: "EDGE_ROUTING",
      network: "Cloudflare Anycast Global PoP",
      popCluster: "BOM-01 (Asia-South1)",
      sslCipher: "TLS_AES_256_GCM_SHA384",
      securityAudit: "DDoS Mitigation & WAF Passed",
      corsPolicy: "ALLOW origin *.ajitdev.com",
      transitLatency: "4ms (Cumulative: +3ms hop)",
    },
  },
  {
    tier: 3,
    badge: "Tier 3",
    title: "API Services",
    tech: "api.ajitdev.com",
    subtext: "Node / REST API · 8ms",
    latency: "8ms",
    cumulativeMs: 8,
    protocol: "Node.js v22 / Express",
    flowTag: "Node REST Execution",
    color: "emerald",
    borderActive: "border-emerald-500",
    borderDefault: "border-slate-200/90",
    bgActive: "bg-emerald-50/50",
    bgDefault: "bg-white/90",
    ringActive: "ring-2 ring-emerald-500/25",
    shadowActive: "shadow-[0_12px_30px_-6px_rgba(16,185,129,0.22)]",
    accentText: "text-emerald-600",
    accentBadge: "bg-emerald-100/90 text-emerald-700 border-emerald-200/80",
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    dotColor: "bg-emerald-500",
    payload: {
      action: "REST_EXECUTION",
      serviceDomain: "api.ajitdev.com",
      runtimeEnv: "Node.js 22 LTS / Express Core",
      workerThread: "cluster-worker-03 (Memory: 42MB)",
      routeController: "HealthController#liveCheck",
      responseFormat: "application/json; charset=utf-8",
      executionLatency: "8ms (Cumulative: +4ms hop)",
    },
  },
  {
    tier: 4,
    badge: "Tier 4",
    title: "Storage Tier",
    tech: "MongoDB Atlas",
    subtext: "Replicated & Safe · 12ms",
    latency: "12ms",
    cumulativeMs: 12,
    protocol: "BSON / WiredTiger",
    flowTag: "MongoDB Cluster Sync",
    color: "amber",
    borderActive: "border-amber-500",
    borderDefault: "border-slate-200/90",
    bgActive: "bg-amber-50/50",
    bgDefault: "bg-white/90",
    ringActive: "ring-2 ring-amber-500/25",
    shadowActive: "shadow-[0_12px_30px_-6px_rgba(245,158,11,0.22)]",
    accentText: "text-amber-600",
    accentBadge: "bg-amber-100/90 text-amber-700 border-amber-200/80",
    iconBg: "bg-amber-50 text-amber-600 border-amber-100",
    dotColor: "bg-amber-500",
    payload: {
      action: "STORAGE_SYNC",
      databaseProvider: "MongoDB Atlas Dedicated Cluster",
      clusterName: "atlas-asia-south1-primary",
      storageEngine: "WiredTiger (AES-256 Encrypted)",
      replicaHealth: "3/3 Nodes Synced (Primary + 2 Secondary)",
      writeConcern: "majority (Replicated & Safe)",
      storageLatency: "12ms (Cumulative: +4ms hop)",
    },
  },
];

// ============================================================================
// 5. 3D HERO COMPONENT
// ============================================================================
export default function Hero3DVisualizer() {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cachedRect = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const isInteracting = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const updateRect = () => {
    if (containerRef.current) {
      const r = containerRef.current.getBoundingClientRect();
      cachedRect.current = { left: r.left, top: r.top, width: r.width, height: r.height };
    }
  };

  useEffect(() => {
    updateRect();
    window.addEventListener("resize", updateRect, { passive: true });
    window.addEventListener("scroll", updateRect, { passive: true });
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, []);

  // Motion values for smooth 3D mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Highly responsive, jitter-free spring physics
  const springConfig = { damping: 28, stiffness: 95, mass: 0.55 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  // Continuous gentle ambient gyro on mobile when not actively swiped
  useEffect(() => {
    if (!isMobile) return;
    let animId: number;
    let t = 0;
    const gyroLoop = () => {
      if (!isInteracting.current) {
        t += 0.016;
        mouseX.set(Math.sin(t) * 0.16);
        mouseY.set(Math.cos(t * 0.7) * 0.12);
      }
      animId = requestAnimationFrame(gyroLoop);
    };
    animId = requestAnimationFrame(gyroLoop);
    return () => cancelAnimationFrame(animId);
  }, [isMobile, mouseX, mouseY]);

  const handleMouseEnter = () => {
    updateRect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cachedRect.current) updateRect();
    const rect = cachedRect.current;
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleTouchStart = () => {
    isInteracting.current = true;
    updateRect();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      if (!cachedRect.current) updateRect();
      const rect = cachedRect.current;
      if (!rect) return;
      const x = (touch.clientX - rect.left) / rect.width - 0.5;
      const y = (touch.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(Math.max(-0.6, Math.min(0.6, x * 1.2)));
      mouseY.set(Math.max(-0.6, Math.min(0.6, y * 1.2)));
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleTouchEnd = () => {
    isInteracting.current = false;
    mouseX.set(0);
    mouseY.set(0);
  };

  // Interactive Console State
  const [activeConsoleTab, setActiveConsoleTab] = useState<"api" | "cicd" | "arch">("api");
  const [apiSimRunning, setApiSimRunning] = useState(false);
  const [streamedIndex, setStreamedIndex] = useState<number>(API_RESPONSE_FIELDS.length);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  // Mac Window Control States (Red = Close, Yellow = Minimize, Green = Maximize)
  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // System Topology Simulator State
  const [archStep, setArchStep] = useState<number>(4); // 0 = idle, 1 = Tier 1, 2 = Tier 2, 3 = Tier 3, 4 = Tier 4, 5 = completed
  const [archRunning, setArchRunning] = useState(false);
  const [archAutoPlay, setArchAutoPlay] = useState(false);
  const [selectedArchTier, setSelectedArchTier] = useState<number>(1);
  const [archLatencyMs, setArchLatencyMs] = useState<number>(14);
  const archTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  // Clear pending arch timeouts
  const clearArchTimeouts = () => {
    archTimeoutRef.current.forEach((t) => clearTimeout(t));
    archTimeoutRef.current = [];
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
      clearArchTimeouts();
    };
  }, []);

  // CI/CD Simulator State
  const [cicdStep, setCicdStep] = useState(4);
  const [cicdRunning, setCicdRunning] = useState(false);

  // Trigger simulated live API fetch with One-by-One 3D streaming animation
  const runApiTest = () => {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    setApiSimRunning(true);
    setIsStreaming(true);
    setStreamedIndex(0);

    // Simulated DNS + TLS connection handshake (~160ms)
    setTimeout(() => {
      setApiSimRunning(false);
      let currentIdx = 0;

      streamTimerRef.current = setInterval(() => {
        currentIdx++;
        setStreamedIndex(currentIdx);
        if (currentIdx >= API_RESPONSE_FIELDS.length) {
          if (streamTimerRef.current) clearInterval(streamTimerRef.current);
          setIsStreaming(false);
        }
      }, 100); // 100ms between each field for smooth 3D sequential generation
    }, 160);
  };

  // Trigger simulated CI/CD pipeline
  const runPipeline = () => {
    setCicdRunning(true);
    setCicdStep(0);
    const intervals = [500, 1100, 1900, 2600];
    intervals.forEach((delay, idx) => {
      setTimeout(() => {
        setCicdStep(idx + 1);
        if (idx === 3) setCicdRunning(false);
      }, delay);
    });
  };

  // Trigger simulated System Topology request flow
  const runArchSimulation = () => {
    clearArchTimeouts();
    setArchRunning(true);
    setArchStep(1);
    setSelectedArchTier(1);
    setArchLatencyMs(1);

    const t2 = setTimeout(() => {
      setArchStep(2);
      setSelectedArchTier(2);
      setArchLatencyMs(4);
    }, 600);

    const t3 = setTimeout(() => {
      setArchStep(3);
      setSelectedArchTier(3);
      setArchLatencyMs(8);
    }, 1250);

    const t4 = setTimeout(() => {
      setArchStep(4);
      setSelectedArchTier(4);
      setArchLatencyMs(12);
    }, 1900);

    const t5 = setTimeout(() => {
      setArchStep(5);
      setArchLatencyMs(14);
      setArchRunning(false);
    }, 2600);

    archTimeoutRef.current = [t2, t3, t4, t5];
  };

  const resetArchSimulation = () => {
    clearArchTimeouts();
    setArchRunning(false);
    setArchStep(0);
    setSelectedArchTier(1);
    setArchLatencyMs(0);
  };

  // Auto-play loop effect
  useEffect(() => {
    let loopTimer: NodeJS.Timeout;
    if (archAutoPlay && !archRunning) {
      loopTimer = setTimeout(() => {
        runArchSimulation();
      }, 1500);
    }
    return () => clearTimeout(loopTimer);
  }, [archAutoPlay, archRunning]);

  const handleCopyCode = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative flex w-full max-w-6xl flex-col items-center justify-center pt-8 pb-16 [perspective:1400px]"
    >


      {/* Iridescent Glow Lights in 3D Space (GPU lightweight radial gradients) */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-[350px] w-[350px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-10 -left-20 h-[350px] w-[350px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,transparent_70%)]" />

      {/* Main 3D Depth Typography Headline (GPU-Accelerated Aurora Color Animation) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-20 text-center px-4 will-change-transform"
      >
        {/* Ambient Chromatic Glow Bloom behind headline */}
        <div className="pointer-events-none absolute -inset-x-8 -inset-y-4 -z-10 mx-auto max-w-xl rounded-full bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-pink-500/15 blur-2xl opacity-80" />

        <motion.h1
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl md:text-4xl lg:text-[44px] leading-tight select-none"
        >
          <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-950 bg-clip-text text-transparent">
            Architecting the{" "}
          </span>
          <span className="inline-block bg-gradient-to-r from-blue-600 via-indigo-500 via-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent font-black animate-aurora drop-shadow-[0_2px_16px_rgba(99,102,241,0.22)]">
            Future of Web & Cloud.
          </span>
        </motion.h1>
      </motion.div>

      {/* ====================================================================== */}
      {/* 3D PERSPECTIVE INTERACTIVE DEVELOPER CONSOLE STAGE                     */}
      {/* ====================================================================== */}
      <AnimatePresence mode="wait">
        {!isClosed ? (
          <motion.div
            key="3d-console-stage"
            style={{
              rotateX: isMaximized ? 0 : rotateX,
              rotateY: isMaximized ? 0 : rotateY,
              transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`relative z-10 mt-8 sm:mt-10 w-full transition-all duration-300 ${isMaximized ? "max-w-5xl" : "max-w-4xl"} px-2 sm:px-4 will-change-transform`}
          >
            {/* Ambient Specular Glass Reflection Layer */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-xl pointer-events-none" />

            {/* 3D FLOATING SATELLITES (Hidden when minimized) */}
            {!isMinimized && (
              <>
                {/* 3D FLOATING SATELLITE 1: Top-Right (Tech Stack Micro-Chip) */}
                <motion.div
                  animate={{ y: [-4, 4, -4], rotate: [-1, 1, -1] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transform: "translateZ(65px)" }}
                  className="pointer-events-none absolute -top-4 -right-1 z-30 flex items-center gap-1.5 rounded-xl border border-blue-200/90 bg-white/95 px-2.5 py-1.5 shadow-md sm:-top-8 sm:-right-4 sm:gap-3 sm:rounded-2xl sm:p-3 sm:shadow-lg will-change-transform"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 sm:h-9 sm:w-9 sm:rounded-xl">
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-900 sm:text-[11px]">Next.js 16</div>
                    <div className="hidden text-[10px] text-slate-500 sm:block">Turbopack · React 19</div>
                  </div>
                </motion.div>

                {/* 3D FLOATING SATELLITE 2: Bottom-Left (Local-First Micro-Chip) */}
                <motion.div
                  animate={{ y: [4, -4, 4], rotate: [1, -1, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  style={{ transform: "translateZ(55px)" }}
                  className="pointer-events-none absolute -bottom-4 -left-1 z-30 flex items-center gap-1.5 rounded-xl border border-emerald-200/90 bg-white/95 px-2.5 py-1.5 shadow-md sm:-bottom-7 sm:-left-4 sm:gap-3 sm:rounded-2xl sm:p-3 sm:shadow-lg will-change-transform"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 sm:h-9 sm:w-9 sm:rounded-xl">
                    <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-900 sm:text-[11px]">100% Private</div>
                    <div className="hidden text-[10px] text-slate-500 sm:block">Zero cloud lock-in</div>
                  </div>
                </motion.div>

                {/* 3D FLOATING SATELLITE 3: Bottom-Right (Latency Micro-Chip) */}
                <motion.div
                  animate={{ y: [-4, 4, -4], rotate: [-1.2, 1.2, -1.2] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  style={{ transform: "translateZ(75px)" }}
                  className="pointer-events-none absolute -bottom-4 right-8 z-30 flex items-center gap-1.5 rounded-xl border border-purple-200/90 bg-white/95 px-2.5 py-1.5 shadow-md sm:-bottom-8 sm:-right-2 sm:gap-3 sm:rounded-2xl sm:p-3 sm:shadow-lg will-change-transform"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-100 sm:h-9 sm:w-9 sm:rounded-xl">
                    <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-900 sm:text-[11px]">14ms Edge</div>
                    <div className="hidden text-[10px] text-slate-500 sm:block">Global DNS · Zero-Auth</div>
                  </div>
                </motion.div>
              </>
            )}

            {/* ==================================================================== */}
            {/* CENTRAL 3D CONSOLE CONTAINER                                         */}
            {/* ==================================================================== */}
            <div
              style={{ transform: "translateZ(25px)" }}
              className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-300/30 will-change-transform"
            >
              {/* 3D Moving Light Sheen on Glass */}
              <motion.div
                animate={{ x: ["-100%", "250%"] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatDelay: 2.5,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute inset-0 z-20 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent will-change-transform"
              />

              {/* Mac-Style Header Bar with Interactive Red, Yellow, Green Buttons */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-200/80 bg-slate-50/80 px-4 py-3 gap-2">
                <div className="group/dots flex items-center gap-2">
                  {/* RED: Close / Remove 3D from Page */}
                  <button
                    type="button"
                    onClick={() => setIsClosed(true)}
                    title="Close 3D Console (Remove from page)"
                    aria-label="Close 3D Console"
                    className="group/btn flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 hover:bg-rose-600 transition shadow-2xs focus:outline-none cursor-pointer"
                  >
                    <span className="opacity-0 group-hover/dots:opacity-100 text-[8px] font-bold text-rose-950 transition-opacity leading-none select-none">
                      ✕
                    </span>
                  </button>

                  {/* YELLOW: Minimize / Collapse Console Body */}
                  <button
                    type="button"
                    onClick={() => setIsMinimized((prev) => !prev)}
                    title={isMinimized ? "Expand Console" : "Minimize Console"}
                    aria-label={isMinimized ? "Expand Console" : "Minimize Console"}
                    className="group/btn flex h-3 w-3 items-center justify-center rounded-full bg-amber-400 hover:bg-amber-500 transition shadow-2xs focus:outline-none cursor-pointer"
                  >
                    <span className="opacity-0 group-hover/dots:opacity-100 text-[9px] font-bold text-amber-950 transition-opacity leading-none select-none">
                      −
                    </span>
                  </button>

                  {/* GREEN: Maximize / Restore Console Width */}
                  <button
                    type="button"
                    onClick={() => setIsMaximized((prev) => !prev)}
                    title={isMaximized ? "Restore Size" : "Maximize Console Width"}
                    aria-label={isMaximized ? "Restore Size" : "Maximize Console Width"}
                    className="group/btn flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 transition shadow-2xs focus:outline-none cursor-pointer"
                  >
                    <span className="opacity-0 group-hover/dots:opacity-100 text-[7px] font-bold text-emerald-950 transition-opacity leading-none select-none">
                      {isMaximized ? "⤡" : "⤢"}
                    </span>
                  </button>

                  <span className="ml-2 font-mono text-[11px] font-semibold text-slate-600 hidden sm:inline">
                    ajitdev-cluster // production-edge // v2.4.0
                    {isMinimized && (
                      <span className="ml-2 rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-semibold font-sans">
                        Minimized · Click yellow dot to expand
                      </span>
                    )}
                  </span>
                </div>

                {/* Live Operational Status */}
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                    Operational · 99.98% Uptime
                  </span>
                </div>
              </div>

              {/* Collapsible Console Body (Controlled by Yellow button) */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    {/* Interactive Console Navigation Tabs */}
                    <div className="flex items-center border-b border-slate-200/80 bg-white/60 px-4 py-2 overflow-x-auto">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveConsoleTab("api")}
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${activeConsoleTab === "api"
                            ? "bg-slate-900 text-white shadow-xs"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                          <Terminal className="h-3.5 w-3.5" />
                          <span>REST API Console</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveConsoleTab("cicd")}
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${activeConsoleTab === "cicd"
                            ? "bg-slate-900 text-white shadow-xs"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                          <Server className="h-3.5 w-3.5" />
                          <span>CI/CD Pipeline</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveConsoleTab("arch")}
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${activeConsoleTab === "arch"
                            ? "bg-slate-900 text-white shadow-xs"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                          <Layers className="h-3.5 w-3.5" />
                          <span>System Topology</span>
                        </button>
                      </div>
                    </div>

                    {/* Console Body Tab Views */}
                    <div className="p-4 sm:p-6">
                      {/* VIEW 1: REST API CONSOLE */}
                      {activeConsoleTab === "api" && (
                        <div className="space-y-4 font-mono text-xs">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
                            <div className="flex items-center gap-2 truncate">
                              <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                GET
                              </span>
                              <span className="font-semibold text-slate-800 truncate">
                                https://api.ajitdev.com/v1/health
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={runApiTest}
                                disabled={apiSimRunning}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                              >
                                {apiSimRunning ? (
                                  <>
                                    <Activity className="h-3.5 w-3.5 animate-spin" />
                                    <span>Fetching...</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-3.5 w-3.5 fill-current" />
                                    <span>Send Request</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopyCode("curl -X GET https://api.ajitdev.com/v1/health")}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-slate-100"
                                title="Copy cURL"
                              >
                                {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Pure White Theme JSON Response Terminal / Stream */}
                          <div className="rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-5 text-slate-800 shadow-sm overflow-hidden">
                            <div className="flex flex-nowrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-[11px]">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="flex h-2 w-2 relative shrink-0">
                                  <span
                                    className={`absolute inline-flex h-full w-full rounded-full ${isStreaming || apiSimRunning
                                      ? "animate-ping bg-blue-400 opacity-80"
                                      : "bg-emerald-400"
                                      }`}
                                  />
                                  <span
                                    className={`relative inline-flex rounded-full h-2 w-2 ${isStreaming || apiSimRunning
                                      ? "bg-blue-500"
                                      : "bg-emerald-500"
                                      }`}
                                  />
                                </span>
                                <span className="font-semibold text-slate-700 truncate">
                                  {apiSimRunning ? (
                                    <span className="text-amber-600">DNS &amp; TLS...</span>
                                  ) : isStreaming ? (
                                    <span className="text-blue-600">
                                      <span className="hidden sm:inline">Streaming JSON Chunks </span>
                                      <span className="sm:hidden">Streaming </span>
                                      ({streamedIndex}/{API_RESPONSE_FIELDS.length})
                                    </span>
                                  ) : (
                                    <span className="text-slate-800 font-semibold">Live JSON Response Stream</span>
                                  )}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="rounded-full bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700 whitespace-nowrap">
                                  <span className="hidden sm:inline">Status </span>200 OK
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyCode(RAW_API_RESPONSE_JSON)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition shadow-2xs"
                                  title="Copy JSON Payload"
                                >
                                  {copiedCode ? (
                                    <>
                                      <Check className="h-3 w-3 text-emerald-600" />
                                      <span className="hidden sm:inline text-emerald-600">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" />
                                      <span className="hidden sm:inline">Copy JSON</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Authentic JSON Content Window (Pure White & Slate-50) */}
                            <div className="mt-3 overflow-x-hidden select-text font-mono text-[11px] sm:text-[13px] leading-relaxed bg-slate-50/70 rounded-xl p-2.5 sm:p-4 border border-slate-200/70">
                              {/* Line 01: Opening Brace */}
                              <div className="flex items-center py-0.5 px-1 sm:px-2 text-slate-600 font-mono">
                                <span className="select-none text-[10px] sm:text-[11px] text-slate-400 w-5 sm:w-6 shrink-0 text-right pr-1 sm:pr-2">01</span>
                                <span className="text-slate-400 select-none pl-1 pr-2">{" "}</span>
                                <span className="text-slate-900 font-bold">&#123;</span>
                                <span className="ml-3 text-[10px] text-slate-400 font-normal select-none hidden sm:inline">// 200 OK · application/json · HTTP/3 QUIC</span>
                              </div>

                              {/* Streamed Fields: generated one by one with authentic JSON syntax */}
                              <div className="space-y-0.5 my-0.5">
                                {API_RESPONSE_FIELDS.slice(0, streamedIndex).map((field, idx) => (
                                  <motion.div
                                    key={field.key}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      duration: 0.2,
                                      ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="group flex flex-nowrap items-center justify-between gap-2 rounded-md py-0.5 px-1 sm:px-2 hover:bg-slate-100/80 transition-colors"
                                  >
                                    <div className="flex items-center min-w-0 font-mono overflow-hidden">
                                      <span className="select-none text-[10px] sm:text-[11px] text-slate-400 w-5 sm:w-6 shrink-0 text-right pr-1 sm:pr-2">
                                        {String(idx + 2).padStart(2, "0")}
                                      </span>
                                      <span className="text-slate-400 select-none pl-1 pr-1 sm:pr-2">{"  "}</span>
                                      <span className="text-sky-700 font-semibold shrink-0">
                                        &quot;{field.key}&quot;
                                      </span>
                                      <span className="text-slate-400 select-none">:&nbsp;</span>
                                      <span className="text-emerald-700 font-medium truncate">
                                        {field.value}
                                      </span>
                                      {idx < API_RESPONSE_FIELDS.length - 1 && (
                                        <span className="text-slate-400 select-none shrink-0">,</span>
                                      )}
                                    </div>

                                    <span
                                      className={`hidden sm:inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] font-semibold tracking-wider shrink-0 uppercase transition-opacity ${field.badgeColor}`}
                                    >
                                      {field.badge}
                                    </span>
                                  </motion.div>
                                ))}
                              </div>

                              {/* Active streaming chunk cursor */}
                              {isStreaming && streamedIndex < API_RESPONSE_FIELDS.length && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="flex items-center py-0.5 px-1 sm:px-2 text-xs text-blue-600 bg-blue-50/70 rounded font-mono"
                                >
                                  <span className="select-none text-[10px] sm:text-[11px] text-slate-400 w-5 sm:w-6 shrink-0 text-right pr-1 sm:pr-2">
                                    {String(streamedIndex + 2).padStart(2, "0")}
                                  </span>
                                  <span className="text-slate-400 select-none pl-1 pr-1 sm:pr-2">{"  "}</span>
                                  <span className="flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping shrink-0" />
                                    <span className="font-semibold animate-pulse truncate">
                                      ▋ chunk #{streamedIndex + 1}...
                                    </span>
                                  </span>
                                </motion.div>
                              )}

                              {/* Closing Brace */}
                              {streamedIndex >= API_RESPONSE_FIELDS.length && (
                                <motion.div
                                  initial={{ opacity: 0, y: 2 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex items-center justify-between py-0.5 px-1 sm:px-2 text-slate-600 font-mono"
                                >
                                  <div className="flex items-center">
                                    <span className="select-none text-[10px] sm:text-[11px] text-slate-400 w-5 sm:w-6 shrink-0 text-right pr-1 sm:pr-2">
                                      {String(API_RESPONSE_FIELDS.length + 2).padStart(2, "0")}
                                    </span>
                                    <span className="text-slate-400 select-none pl-1 pr-2">{" "}</span>
                                    <span className="text-slate-900 font-bold">&#125;</span>
                                  </div>
                                  <span className="text-[10px] sm:text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                                    <Check className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-emerald-600" />
                                    <span className="hidden sm:inline">Full stream generated (8/8 chunks)</span>
                                    <span className="sm:hidden">8/8 done ✓</span>
                                  </span>
                                </motion.div>
                              )}
                            </div>

                            {/* Telemetry Footer */}
                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-nowrap items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-500 font-mono">
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <span className="whitespace-nowrap"><strong className="text-slate-700 font-semibold">HTTP/3</strong> · QUIC</span>
                                <span className="text-slate-300">·</span>
                                <span className="whitespace-nowrap"><strong className="text-slate-700 font-semibold">14ms</strong></span>
                                <span className="hidden sm:inline text-slate-300">·</span>
                                <span className="hidden sm:inline whitespace-nowrap"><strong className="text-slate-700 font-semibold">BOM-EDGE</strong></span>
                              </div>

                              <button
                                type="button"
                                onClick={runApiTest}
                                disabled={isStreaming || apiSimRunning}
                                className="inline-flex items-center gap-1 sm:gap-1.5 text-blue-600 hover:text-blue-700 transition font-semibold disabled:opacity-50 text-[10px] sm:text-xs shrink-0"
                              >
                                <RotateCcw className={`h-3 sm:h-3.5 w-3 sm:w-3.5 ${isStreaming || apiSimRunning ? "animate-spin" : ""}`} />
                                <span>Replay</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* VIEW 2: CI/CD PIPELINE */}
                      {activeConsoleTab === "cicd" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xs font-bold text-slate-900">
                                GitHub Actions CI/CD · Automated Deployment Matrix
                              </h3>
                              <p className="text-[11px] text-slate-500">
                                Multi-stage linting, typechecking, containerization, and edge distribution
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={runPipeline}
                              disabled={cicdRunning}
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                            >
                              <RotateCcw className={`h-3.5 w-3.5 ${cicdRunning ? "animate-spin" : ""}`} />
                              <span>Rerun Workflow</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-4 font-mono text-xs">
                            {/* Step 1 */}
                            <div
                              className={`rounded-xl border p-3 transition ${cicdStep >= 1
                                ? "border-emerald-200 bg-emerald-50/50 text-emerald-950"
                                : "border-slate-200 bg-slate-50 opacity-40"
                                }`}
                            >
                              <div className="flex items-center justify-between text-[10px] text-slate-500">
                                <span>Step 1</span>
                                {cicdStep >= 1 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                              </div>
                              <div className="mt-1 font-bold text-slate-900">Git Push (main)</div>
                              <div className="text-[10px] text-slate-500">Commit sync (0.3s)</div>
                            </div>

                            {/* Step 2 */}
                            <div
                              className={`rounded-xl border p-3 transition ${cicdStep >= 2
                                ? "border-emerald-200 bg-emerald-50/50 text-emerald-950"
                                : "border-slate-200 bg-slate-50 opacity-40"
                                }`}
                            >
                              <div className="flex items-center justify-between text-[10px] text-slate-500">
                                <span>Step 2</span>
                                {cicdStep >= 2 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                              </div>
                              <div className="mt-1 font-bold text-slate-900">TypeScript & Lint</div>
                              <div className="text-[10px] text-slate-500">0 Errors (1.2s)</div>
                            </div>

                            {/* Step 3 */}
                            <div
                              className={`rounded-xl border p-3 transition ${cicdStep >= 3
                                ? "border-emerald-200 bg-emerald-50/50 text-emerald-950"
                                : "border-slate-200 bg-slate-50 opacity-40"
                                }`}
                            >
                              <div className="flex items-center justify-between text-[10px] text-slate-500">
                                <span>Step 3</span>
                                {cicdStep >= 3 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                              </div>
                              <div className="mt-1 font-bold text-slate-900">Docker Image</div>
                              <div className="text-[10px] text-slate-500">Cached layers (2.8s)</div>
                            </div>

                            {/* Step 4 */}
                            <div
                              className={`rounded-xl border p-3 transition ${cicdStep >= 4
                                ? "border-emerald-200 bg-emerald-50/50 text-emerald-950"
                                : "border-slate-200 bg-slate-50 opacity-40"
                                }`}
                            >
                              <div className="flex items-center justify-between text-[10px] text-slate-500">
                                <span>Step 4</span>
                                {cicdStep >= 4 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                              </div>
                              <div className="mt-1 font-bold text-slate-900">Edge Rollout</div>
                              <div className="text-[10px] text-slate-500">Global DNS (0.7s)</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* VIEW 3: SYSTEM TOPOLOGY */}
                      {activeConsoleTab === "arch" && (
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div>
                              <h3 className="text-xs font-bold text-slate-900">
                                Distributed Edge Architecture & Data Flow
                              </h3>
                              <p className="text-[11px] text-slate-500">
                                End-to-end request routing from client SPA through Cloudflare Edge, REST API, to MongoDB cluster
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={runArchSimulation}
                              disabled={archRunning}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                            >
                              {archRunning ? (
                                <>
                                  <Activity className="h-3.5 w-3.5 animate-spin" />
                                  <span>Simulating Flow...</span>
                                </>
                              ) : (
                                <>
                                  <Play className="h-3.5 w-3.5 fill-current" />
                                  <span>Simulate Data Flow</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 font-mono text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                              {/* Tier 1: Client Tier */}
                              <div
                                className={`relative rounded-xl border p-3.5 transition-all duration-300 ${archStep >= 1
                                  ? "border-blue-300 bg-white shadow-sm ring-2 ring-blue-500/20"
                                  : "border-slate-200 bg-white/70 opacity-40"
                                  }`}
                              >
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="text-blue-600 font-bold uppercase tracking-wider">Tier 1</span>
                                  {archStep >= 1 && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />}
                                </div>
                                <div className="mt-2 text-xs font-bold text-slate-900">Client Tier</div>
                                <div className="text-[11px] font-semibold text-blue-700 mt-0.5">Next.js 16 SPA</div>
                                <div className="text-[10px] text-slate-500 mt-1">Local-First UI · 1ms</div>
                              </div>

                              {/* Tier 2: Edge Gateway */}
                              <div
                                className={`relative rounded-xl border p-3.5 transition-all duration-300 ${archStep >= 2
                                  ? "border-purple-300 bg-white shadow-sm ring-2 ring-purple-500/20"
                                  : "border-slate-200 bg-white/70 opacity-40"
                                  }`}
                              >
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="text-purple-600 font-bold uppercase tracking-wider">Tier 2</span>
                                  {archStep >= 2 && <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />}
                                </div>
                                <div className="mt-2 text-xs font-bold text-slate-900">Edge Gateway</div>
                                <div className="text-[11px] font-semibold text-purple-700 mt-0.5">Cloudflare & DNS</div>
                                <div className="text-[10px] text-slate-500 mt-1">TLS 1.3 / CORS · 4ms</div>
                              </div>

                              {/* Tier 3: API Services */}
                              <div
                                className={`relative rounded-xl border p-3.5 transition-all duration-300 ${archStep >= 3
                                  ? "border-emerald-300 bg-white shadow-sm ring-2 ring-emerald-500/20"
                                  : "border-slate-200 bg-white/70 opacity-40"
                                  }`}
                              >
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="text-emerald-600 font-bold uppercase tracking-wider">Tier 3</span>
                                  {archStep >= 3 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                                </div>
                                <div className="mt-2 text-xs font-bold text-slate-900">API Services</div>
                                <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">api.ajitdev.com</div>
                                <div className="text-[10px] text-slate-500 mt-1">Node / REST API · 8ms</div>
                              </div>

                              {/* Tier 4: Storage Tier */}
                              <div
                                className={`relative rounded-xl border p-3.5 transition-all duration-300 ${archStep >= 4
                                  ? "border-amber-300 bg-white shadow-sm ring-2 ring-amber-500/20"
                                  : "border-slate-200 bg-white/70 opacity-40"
                                  }`}
                              >
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="text-amber-600 font-bold uppercase tracking-wider">Tier 4</span>
                                  {archStep >= 4 && <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />}
                                </div>
                                <div className="mt-2 text-xs font-bold text-slate-900">Storage Tier</div>
                                <div className="text-[11px] font-semibold text-amber-700 mt-0.5">MongoDB Atlas</div>
                                <div className="text-[10px] text-slate-500 mt-1">Replicated & Safe · 12ms</div>
                              </div>
                            </div>

                            {/* Flow Trace Status Bar */}
                            <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                              <div className="flex items-center gap-2">
                                <span className="flex h-2 w-2 relative">
                                  <span
                                    className={`absolute inline-flex h-full w-full rounded-full ${archRunning ? "animate-ping bg-blue-400 opacity-80" : "bg-emerald-400"
                                      }`}
                                  />
                                  <span
                                    className={`relative inline-flex rounded-full h-2 w-2 ${archRunning ? "bg-blue-500" : "bg-emerald-500"
                                      }`}
                                  />
                                </span>
                                <span>
                                  {archRunning ? (
                                    <span className="text-blue-600 font-semibold animate-pulse">
                                      Routing packet through Tier {archStep}/4:{" "}
                                      {archStep === 1
                                        ? "Client SPA Dispatch"
                                        : archStep === 2
                                          ? "Cloudflare Edge Handshake"
                                          : archStep === 3
                                            ? "Node REST Service Execution"
                                            : "MongoDB Cluster Sync"}
                                      ...
                                    </span>
                                  ) : archStep === 4 ? (
                                    <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                                      End-to-End Pipeline Verified: 14ms Total Round-Trip Latency
                                    </span>
                                  ) : (
                                    <span>Architecture Ready · Click &quot;Simulate Data Flow&quot;</span>
                                  )}
                                </span>
                              </div>

                              <div className="text-[10px] text-slate-400">
                                Stateless Edge · 0ms Cold Starts · SSL A+
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="3d-console-closed-state"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 mt-10 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white/80 p-6 sm:p-8 text-center shadow-xs max-w-md w-full backdrop-blur-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shadow-2xs">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">3D Interactive Console Closed</h3>
              <p className="text-xs text-slate-500 mt-1">
                You closed the 3D developer stage using the red window control.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsClosed(false);
                setIsMinimized(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition active:scale-95 cursor-pointer mt-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restore 3D Console</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================================== */}
      {/* ECOSYSTEM DOMAINS 3D SHOWCASE CARDS                                   */}
      {/* ====================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-20 mt-16 w-full max-w-5xl border-t border-slate-200/80 pt-10"
      >
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Verified AJITDEV Ecosystem Network
            </h2>
            <p className="text-xs text-slate-500">
              Genuine domains and engineering infrastructure owned & maintained by Ajit Dev
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Globe className="h-3.5 w-3.5 text-blue-600" />
            <span>6 Global Endpoints</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEM_DOMAINS.map((domain) => (
            <a
              key={domain.name}
              href={domain.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-xs transition duration-300 hover:border-slate-300 hover:shadow-md hover:scale-[1.02] active:scale-98"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 font-mono">
                    {domain.tag}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{domain.status}</span>
                  </div>
                </div>

                <div className="mt-3 font-mono text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {domain.name}
                </div>

                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {domain.description}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-slate-700 transition">
                <span>Visit Domain</span>
                <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
