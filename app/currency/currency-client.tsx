"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { toPng } from "html-to-image";
import {
  ArrowRightLeft,
  Search,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Copy,
  Check,
  RotateCw,
  Star,
  Share2,
  Calendar,
  Info,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  Globe,
  SlidersHorizontal,
  X,
  Zap,
  Download,
  MessageCircle,
  ImageIcon,
  Loader2,
  Send,
  Link2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  supportedCurrencies,
  currencyList,
  popularPairs,
  quickAmountChips,
  getCurrencyInfo,
  formatCurrencyValue,
  type CurrencyInfo,
  type PopularPair,
} from "@/lib/currency-data";

interface HistoryPoint {
  date: string;
  rate: number;
}

interface HistoryStats {
  min: number;
  max: number;
  avg: number;
  current: number;
  change: number;
  changePercent: number;
}

export default function CurrencyClient() {
  // Converter core state
  const [amount, setAmount] = useState<number>(100);
  const [amountInput, setAmountInput] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("INR");

  // Rates data
  const [allRates, setAllRates] = useState<Record<string, number>>({});
  const [currentRate, setCurrentRate] = useState<number>(96.32);
  const [rateDate, setRateDate] = useState<string>("");
  const [isLoadingRate, setIsLoadingRate] = useState<boolean>(true);
  const [rateSource, setRateSource] = useState<string>("frankfurter-ecb");

  // History / Chart state
  const [chartRange, setChartRange] = useState<string>("30d");
  const [historyPoints, setHistoryPoints] = useState<HistoryPoint[]>([]);
  const [historyStats, setHistoryStats] = useState<HistoryStats | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<HistoryPoint | null>(null);

  // Active view tab
  const [activeTab, setActiveTab] = useState<"converter" | "chart" | "matrix">(
    "converter"
  );

  // Currency Selection Dialog
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);
  const [selectorTarget, setSelectorTarget] = useState<"from" | "to">("from");
  const [currencySearch, setCurrencySearch] = useState<string>("");
  const [currencyCategoryFilter, setCurrencyCategoryFilter] =
    useState<string>("all");

  // Screenshot & Share Dialog State
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [screenshotBlob, setScreenshotBlob] = useState<Blob | null>(null);
  const [canNativeShare, setCanNativeShare] = useState<boolean>(false);
  const [isCopiedImage, setIsCopiedImage] = useState<boolean>(false);
  const [isCopiedLink, setIsCopiedLink] = useState<boolean>(false);

  // Favorites
  const [favoritePairs, setFavoritePairs] = useState<PopularPair[]>([
    { from: "USD", to: "INR", label: "USD to INR" },
    { from: "EUR", to: "USD", label: "EUR to USD" },
    { from: "GBP", to: "INR", label: "GBP to INR" },
    { from: "USD", to: "EUR", label: "USD to EUR" },
  ]);

  // Check if browser supports Web Share with Files
  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.canShare === "function") {
      try {
        const testFile = new File([""], "test.png", { type: "image/png" });
        setCanNativeShare(navigator.canShare({ files: [testFile] }));
      } catch {
        setCanNativeShare(false);
      }
    }
  }, []);

  // Load favorites from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ajitdev_fav_currencies");
      if (saved) {
        setFavoritePairs(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Sync URL search params if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlFrom = params.get("from");
      const urlTo = params.get("to");
      const urlAmount = params.get("amount");

      if (urlFrom && supportedCurrencies[urlFrom.toUpperCase()]) {
        setFromCurrency(urlFrom.toUpperCase());
      }
      if (urlTo && supportedCurrencies[urlTo.toUpperCase()]) {
        setToCurrency(urlTo.toUpperCase());
      }
      if (urlAmount && !isNaN(Number(urlAmount)) && Number(urlAmount) > 0) {
        setAmount(Number(urlAmount));
        setAmountInput(urlAmount);
      }
    }
  }, []);

  // Fetch Latest Rates
  const fetchRates = useCallback(
    async (showFeedback = false) => {
      setIsLoadingRate(true);
      try {
        const res = await fetch(`/api/currency/latest?from=${fromCurrency}`);
        if (!res.ok) throw new Error("Failed to fetch rates");
        const data = await res.json();

        if (data.rates) {
          setAllRates(data.rates);
          setRateDate(data.date || new Date().toISOString().split("T")[0]);
          setRateSource(data.source || "frankfurter-ecb");

          if (fromCurrency === toCurrency) {
            setCurrentRate(1);
          } else if (data.rates[toCurrency]) {
            setCurrentRate(data.rates[toCurrency]);
          }

          if (showFeedback) {
            toast.success("Live Rates Updated", {
              description: `European Central Bank benchmark refreshed for ${fromCurrency}.`,
            });
          }
        }
      } catch (err) {
        console.error("Rates fetch error:", err);
        if (showFeedback) {
          toast.info("Using Cached Rates", {
            description: "Live connection was slow, loaded benchmark rates.",
          });
        }
      } finally {
        setIsLoadingRate(false);
      }
    },
    [fromCurrency, toCurrency]
  );

  // Fetch Historical Timeseries for Chart
  const fetchHistory = useCallback(async () => {
    if (fromCurrency === toCurrency) {
      setHistoryPoints([]);
      setHistoryStats(null);
      return;
    }

    setIsLoadingHistory(true);
    try {
      const res = await fetch(
        `/api/currency/history?from=${fromCurrency}&to=${toCurrency}&range=${chartRange}`
      );
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();

      if (data.points && Array.isArray(data.points)) {
        setHistoryPoints(data.points);
        setHistoryStats(data.stats);
      }
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [fromCurrency, toCurrency, chartRange]);

  // Initial and trigger loads
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Handle Amount Input Change
  const handleAmountChange = (val: string) => {
    setAmountInput(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      setAmount(parsed);
    } else if (val === "") {
      setAmount(0);
    }
  };

  // Quick Amount Adders
  const addAmount = (increment: number) => {
    const next = Math.max(0, amount + increment);
    setAmount(next);
    setAmountInput(next.toString());
  };

  // Swap Currencies
  const handleSwap = () => {
    const prevFrom = fromCurrency;
    const prevTo = toCurrency;
    setFromCurrency(prevTo);
    setToCurrency(prevFrom);
    toast.info("Currencies Swapped", {
      description: `Now converting ${prevTo} → ${prevFrom}`,
    });
  };

  // Copy Result to Clipboard
  const handleCopy = () => {
    const converted = amount * currentRate;
    const text = `${formatCurrencyValue(
      amount,
      fromCurrency
    )} ${fromCurrency} = ${formatCurrencyValue(
      converted,
      toCurrency
    )} ${toCurrency} (Rate: 1 ${fromCurrency} = ${currentRate.toFixed(4)} ${toCurrency})`;

    navigator.clipboard.writeText(text);
    toast.success("Result Copied to Clipboard 📋", {
      description: text,
    });
  };

  const conversionShareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/currency?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
      : `https://next.ajitdev.com/currency?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;

  // Copy Direct Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(conversionShareUrl);
    setIsCopiedLink(true);
    setTimeout(() => setIsCopiedLink(false), 2000);
    toast.success("Link Copied! 🔗", {
      description: "Direct conversion link copied to clipboard.",
    });
  };

  // Canvas Fallback Generator in case html-to-image encounters an environment restriction
  const generateCanvasFallback = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      try {
        const fromI = getCurrencyInfo(fromCurrency);
        const toI = getCurrencyInfo(toCurrency);
        const converted = amount * currentRate;
        const inv = currentRate > 0 ? 1 / currentRate : 0;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);

        const dpr = 2;
        const width = 640;
        const height = 360;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // Dark Gradient Background
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "#0b0f19");
        grad.addColorStop(0.5, "#0f172a");
        grad.addColorStop(1, "#090d16");
        ctx.fillStyle = grad;

        const r = 24;
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(width - r, 0);
        ctx.quadraticCurveTo(width, 0, width, r);
        ctx.lineTo(width, height - r);
        ctx.quadraticCurveTo(width, height, width - r, height);
        ctx.lineTo(r, height);
        ctx.quadraticCurveTo(0, height, 0, height - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Top line
        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(`${amount.toFixed(2)} ${fromI.name} =`, 32, 52);

        // ECB badge
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(width - 170, 34, 138, 26);
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText("ECB Benchmark", width - 155, 51);

        // Big converted amount
        ctx.fillStyle = "#facc15"; // Gold
        ctx.font = "900 46px monospace, sans-serif";
        const convertedText = `${toI.symbol}${formatCurrencyValue(converted, toCurrency)}`;
        ctx.fillText(convertedText, 32, 134);

        const textWidth = ctx.measureText(convertedText).width;
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "bold 24px sans-serif";
        ctx.fillText(toI.code, 32 + textWidth + 14, 132);

        // Divider
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(32, 180);
        ctx.lineTo(width - 32, 180);
        ctx.stroke();

        // Rates
        ctx.fillStyle = "#94a3b8";
        ctx.font = "14px sans-serif";
        ctx.fillText(`1 ${fromCurrency} = `, 32, 220);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 15px monospace, sans-serif";
        ctx.fillText(`${currentRate.toFixed(4)} ${toCurrency}`, 110, 220);

        ctx.fillStyle = "#64748b";
        ctx.font = "13px monospace, sans-serif";
        ctx.fillText(`1 ${toCurrency} = ${inv.toFixed(6)} ${fromCurrency}`, 32, 252);

        // Watermark Footer
        ctx.fillStyle = "#475569";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText(
          `⚡ AJITDEV Currency Engine • next.ajitdev.com/currency • ${rateDate || "Live"}`,
          32,
          320
        );

        canvas.toBlob((b) => resolve(b), "image/png");
      } catch {
        resolve(null);
      }
    });
  }, [amount, fromCurrency, toCurrency, currentRate, rateDate]);

  // Main Screenshot & Share Trigger Handler
  const handleShareClick = async () => {
    setIsCapturing(true);
    toast.info("Capturing screenshot card...", { duration: 1500 });

    try {
      let blob: Blob | null = null;
      let dataUrl: string | null = null;

      if (shareCardRef.current) {
        try {
          dataUrl = await toPng(shareCardRef.current, {
            cacheBust: true,
            pixelRatio: 2,
            backgroundColor: "#090d16",
          });
          const res = await fetch(dataUrl);
          blob = await res.blob();
        } catch (captureErr) {
          console.warn("DOM toPng failed, falling back to Canvas renderer:", captureErr);
        }
      }

      // If toPng failed or empty, fallback to high-DPI Canvas
      if (!blob) {
        blob = await generateCanvasFallback();
        if (blob) {
          dataUrl = URL.createObjectURL(blob);
        }
      }

      if (blob && dataUrl) {
        setScreenshotBlob(blob);
        setScreenshotUrl(dataUrl);
        setShareModalOpen(true);
        toast.success("Screenshot Ready to Share! 📸", {
          description: "Choose WhatsApp, download, or copy to share anywhere.",
        });
      } else {
        throw new Error("Screenshot generation failed");
      }
    } catch (err) {
      console.error("Screenshot capture error:", err);
      toast.error("Could not capture screenshot", {
        description: "Copying direct conversion link instead.",
      });
      handleCopyLink();
    } finally {
      setIsCapturing(false);
    }
  };

  // Native Web Share with Image File
  const handleNativeShare = async () => {
    if (!screenshotBlob) return;
    try {
      const file = new File(
        [screenshotBlob],
        `AJITDEV-Exchange-${fromCurrency}-to-${toCurrency}.png`,
        { type: "image/png" }
      );
      const shareUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/currency?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
          : "https://next.ajitdev.com/currency";

      if (navigator.share) {
        await navigator.share({
          title: `${fromCurrency} to ${toCurrency} Exchange Rate`,
          text: `${amount} ${fromCurrency} = ${formatCurrencyValue(
            amount * currentRate,
            toCurrency
          )} ${toCurrency} (Rate: 1 ${fromCurrency} = ${currentRate.toFixed(4)} ${toCurrency})`,
          url: shareUrl,
          files: [file],
        });
        toast.success("Shared successfully! 🚀");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.warn("Native share error:", err);
      }
    }
  };

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    const shareUrl = `${window.location.origin}/currency?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;
    const text = `💱 *Live Currency Exchange Rate*\n\n*${amount} ${fromCurrency} = ${toInfo.symbol}${formatCurrencyValue(
      amount * currentRate,
      toCurrency
    )} ${toCurrency}*\nRate: 1 ${fromCurrency} = ${currentRate.toFixed(4)} ${toCurrency}\n\nCheck live rates here:\n${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Twitter / X Share
  const handleTwitterShare = () => {
    const shareUrl = `${window.location.origin}/currency?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;
    const text = `💱 Live Exchange Rate: ${amount} ${fromCurrency} = ${formatCurrencyValue(
      amount * currentRate,
      toCurrency
    )} ${toCurrency} (1 ${fromCurrency} = ${currentRate.toFixed(4)} ${toCurrency})\n\nConverted via @ajitdev01's Currency Converter:`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  // Telegram Share
  const handleTelegramShare = () => {
    const shareUrl = `${window.location.origin}/currency?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;
    const text = `💱 ${amount} ${fromCurrency} = ${formatCurrencyValue(
      amount * currentRate,
      toCurrency
    )} ${toCurrency} (1 ${fromCurrency} = ${currentRate.toFixed(4)} ${toCurrency})`;
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  // Download Screenshot File
  const handleDownloadImage = () => {
    if (!screenshotUrl) return;
    const a = document.createElement("a");
    a.href = screenshotUrl;
    a.download = `AJITDEV-${fromCurrency}-to-${toCurrency}-${amount}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Screenshot Image Downloaded! 📥", {
      description: `Saved as AJITDEV-${fromCurrency}-to-${toCurrency}.png`,
    });
  };

  // Copy Screenshot Image directly to system clipboard
  const handleCopyImage = async () => {
    if (!screenshotBlob) return;
    try {
      if (typeof window !== "undefined" && window.ClipboardItem && navigator.clipboard) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": screenshotBlob }),
        ]);
        setIsCopiedImage(true);
        setTimeout(() => setIsCopiedImage(false), 2000);
        toast.success("Screenshot Image Copied! 📋", {
          description: "Paste (Ctrl+V) directly into WhatsApp, Telegram, Discord, or Email.",
        });
      } else {
        toast.info("Direct image copy not supported on this browser. Click Download instead!");
      }
    } catch (err) {
      console.warn("Clipboard write image failed:", err);
      toast.info("Could not copy raw image directly. Use Download Image instead!");
    }
  };

  // Toggle Favorite Pair
  const isFavorite = useMemo(() => {
    return favoritePairs.some(
      (p) => p.from === fromCurrency && p.to === toCurrency
    );
  }, [favoritePairs, fromCurrency, toCurrency]);

  const handleToggleFavorite = () => {
    let updated: PopularPair[];
    if (isFavorite) {
      updated = favoritePairs.filter(
        (p) => !(p.from === fromCurrency && p.to === toCurrency)
      );
      toast.info("Removed from Favorites", {
        description: `${fromCurrency} → ${toCurrency} unpinned.`,
      });
    } else {
      updated = [
        ...favoritePairs,
        {
          from: fromCurrency,
          to: toCurrency,
          label: `${fromCurrency} to ${toCurrency}`,
        },
      ];
      toast.success("Added to Favorites ⭐", {
        description: `${fromCurrency} → ${toCurrency} pinned to quick access.`,
      });
    }
    setFavoritePairs(updated);
    try {
      localStorage.setItem("ajitdev_fav_currencies", JSON.stringify(updated));
    } catch {}
  };

  // Open Selector Modal
  const openSelector = (target: "from" | "to") => {
    setSelectorTarget(target);
    setCurrencySearch("");
    setCurrencyCategoryFilter("all");
    setSelectorOpen(true);
  };

  // Select Currency
  const handleSelectCurrency = (code: string) => {
    if (selectorTarget === "from") {
      if (code === toCurrency) {
        setToCurrency(fromCurrency);
      }
      setFromCurrency(code);
    } else {
      if (code === fromCurrency) {
        setFromCurrency(toCurrency);
      }
      setToCurrency(code);
    }
    setSelectorOpen(false);
  };

  // Filtered Currencies for Search Dialog
  const filteredCurrencies = useMemo(() => {
    const q = currencySearch.toLowerCase().trim();
    return currencyList.filter((c) => {
      const matchesText =
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q);

      if (!matchesText) return false;

      if (currencyCategoryFilter === "popular") {
        return ["USD", "INR", "EUR", "GBP", "JPY", "CAD", "AUD", "SGD"].includes(
          c.code
        );
      }
      if (currencyCategoryFilter === "americas") {
        return ["USD", "CAD", "MXN", "BRL"].includes(c.code);
      }
      if (currencyCategoryFilter === "europe") {
        return [
          "EUR",
          "GBP",
          "CHF",
          "SEK",
          "NOK",
          "DKK",
          "PLN",
          "CZK",
          "HUF",
          "RON",
          "ISK",
        ].includes(c.code);
      }
      if (currencyCategoryFilter === "asia") {
        return [
          "INR",
          "JPY",
          "CNY",
          "SGD",
          "HKD",
          "KRW",
          "THB",
          "IDR",
          "MYR",
          "PHP",
          "ILS",
          "TRY",
        ].includes(c.code);
      }

      return true;
    });
  }, [currencySearch, currencyCategoryFilter]);

  // Computed Values
  const fromInfo = getCurrencyInfo(fromCurrency);
  const toInfo = getCurrencyInfo(toCurrency);
  const convertedAmount = amount * currentRate;
  const inverseRate = currentRate > 0 ? 1 / currentRate : 0;

  // Chart SVG Coordinates Computation
  const chartCoordinates = useMemo(() => {
    if (historyPoints.length < 2) return { path: "", area: "", points: [] };

    const width = 800;
    const height = 240;
    const paddingX = 40;
    const paddingY = 30;

    const rates = historyPoints.map((p) => p.rate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const range = max - min || 1;

    const computed = historyPoints.map((p, index) => {
      const x =
        paddingX +
        (index / (historyPoints.length - 1)) * (width - paddingX * 2);
      const y =
        height -
        paddingY -
        ((p.rate - min) / range) * (height - paddingY * 2);
      return { x, y, date: p.date, rate: p.rate };
    });

    const path = computed.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, "");

    const area = `${path} L ${computed[computed.length - 1].x} ${
      height - paddingY
    } L ${computed[0].x} ${height - paddingY} Z`;

    return { path, area, points: computed };
  }, [historyPoints]);

  // Major Currencies Comparison List
  const majorCurrencies = useMemo(() => {
    const targets = [
      "EUR",
      "GBP",
      "INR",
      "JPY",
      "CAD",
      "AUD",
      "CHF",
      "CNY",
      "SGD",
      "NZD",
      "BRL",
      "ZAR",
    ].filter((c) => c !== fromCurrency);

    return targets.map((code) => {
      const info = getCurrencyInfo(code);
      const rate = allRates[code] || 1;
      const converted = amount * rate;
      return {
        ...info,
        rate,
        converted,
      };
    });
  }, [allRates, amount, fromCurrency]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ─── Breadcrumb & Top Bar ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <nav className="flex items-center gap-2 text-slate-500 font-medium">
          <Link
            href="/"
            className="hover:text-slate-900 transition flex items-center gap-1"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Currency Converter</span>
        </nav>

        {/* Live Engine Status Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-3.5 py-1.5 shadow-xs border border-slate-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold tracking-wide text-[11px]">
            Live Frankfurter ECB Data
          </span>
          {rateDate && (
            <span className="text-slate-400 text-[10px] pl-1 border-l border-slate-700">
              {rateDate}
            </span>
          )}
        </div>
      </div>

      {/* ─── Hero Heading ─── */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200/80 px-3.5 py-1 text-xs font-bold text-amber-800">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Real-Time Foreign Exchange Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight">
          Global Currency Converter
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Official mid-market reference exchange rates published by the European
          Central Bank. Zero hidden markups, instant multi-currency parity, and
          interactive historical timeseries.
        </p>
      </div>

      {/* ─── Quick Favorite Pairs Bar ─── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> Popular:
        </span>
        {favoritePairs.map((pair) => {
          const isSelected =
            pair.from === fromCurrency && pair.to === toCurrency;
          const fromF = getCurrencyInfo(pair.from);
          const toF = getCurrencyInfo(pair.to);
          return (
            <button
              key={`${pair.from}-${pair.to}`}
              onClick={() => {
                setFromCurrency(pair.from);
                setToCurrency(pair.to);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span>{fromF.flag}</span>
              <span>{pair.from}</span>
              <span className="text-slate-400">→</span>
              <span>{toF.flag}</span>
              <span>{pair.to}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Tab Switcher ─── */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200/80 shadow-inner">
          <button
            onClick={() => setActiveTab("converter")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "converter"
                ? "bg-white text-slate-950 shadow-md scale-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Converter
          </button>
          <button
            onClick={() => setActiveTab("chart")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "chart"
                ? "bg-white text-slate-950 shadow-md scale-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Historical Chart
          </button>
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "matrix"
                ? "bg-white text-slate-950 shadow-md scale-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Parity Matrix
          </button>
        </div>
      </div>

      {/* ─── Main Converter Card ─── */}
      <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Converter Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Amount Input */}
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Amount to Convert
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                {fromInfo.symbol}
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={amountInput}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="100"
                className="w-full h-14 pl-11 pr-4 rounded-2xl bg-slate-50 border-2 border-slate-200 text-xl sm:text-2xl font-black text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition"
              />
            </div>
            {/* Quick Increment Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickAmountChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => addAmount(chip)}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 transition cursor-pointer"
                >
                  +{chip}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setAmount(100);
                  setAmountInput("100");
                }}
                className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-[11px] font-semibold text-slate-500 transition cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* From Currency Selector */}
          <div className="md:col-span-3 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              From Currency
            </label>
            <button
              type="button"
              onClick={() => openSelector("from")}
              className="w-full h-14 px-4 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-slate-400 flex items-center justify-between text-left transition cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl">{fromInfo.flag}</span>
                <div className="truncate">
                  <div className="font-extrabold text-slate-900 text-base leading-tight">
                    {fromInfo.code}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[130px]">
                    {fromInfo.name}
                  </div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition" />
            </button>
          </div>

          {/* Central Swap Button */}
          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <button
              type="button"
              onClick={handleSwap}
              title="Swap currencies"
              className="h-12 w-12 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
            >
              <ArrowRightLeft className="h-5 w-5 text-amber-300 group-hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>

          {/* To Currency Selector */}
          <div className="md:col-span-3 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              To Currency
            </label>
            <button
              type="button"
              onClick={() => openSelector("to")}
              className="w-full h-14 px-4 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-slate-400 flex items-center justify-between text-left transition cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl">{toInfo.flag}</span>
                <div className="truncate">
                  <div className="font-extrabold text-slate-900 text-base leading-tight">
                    {toInfo.code}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[130px]">
                    {toInfo.name}
                  </div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition" />
            </button>
          </div>
        </div>

        {/* ─── Live Converted Result Display (Captured by Share) ─── */}
        <div
          ref={shareCardRef}
          className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6 sm:p-8 space-y-4 shadow-xl border border-slate-800"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-medium">
              {formatCurrencyValue(amount, fromCurrency)} {fromInfo.name} =
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchRates(true)}
                disabled={isLoadingRate}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition cursor-pointer"
                title="Refresh live rate"
              >
                <RotateCw
                  className={`h-3.5 w-3.5 ${
                    isLoadingRate ? "animate-spin text-amber-400" : ""
                  }`}
                />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  isFavorite
                    ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                    : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <Star
                  className={`h-3 w-3 ${
                    isFavorite ? "fill-amber-400 text-amber-400" : ""
                  }`}
                />
                <span>{isFavorite ? "Favorited" : "Favorite"}</span>
              </button>
            </div>
          </div>

          {/* Large Converted Number */}
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl sm:text-5xl md:text-6xl font-black text-amber-400 tracking-tight font-mono">
              {toInfo.symbol}
              {formatCurrencyValue(convertedAmount, toCurrency)}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-300">
              {toInfo.code}
            </span>
          </div>

          {/* Conversion Formulas */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300">
            <div className="space-y-1">
              <div>
                <span className="text-slate-400">1 {fromCurrency} = </span>
                <span className="font-bold text-white font-mono">
                  {currentRate.toFixed(4)} {toCurrency}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                <span>1 {toCurrency} = </span>
                <span className="font-medium text-slate-300 font-mono">
                  {inverseRate.toFixed(6)} {fromCurrency}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition active:scale-95 cursor-pointer shadow-xs"
              >
                <Copy className="h-3.5 w-3.5 text-amber-400" />
                <span>Copy</span>
              </button>
              <button
                type="button"
                onClick={handleShareClick}
                disabled={isCapturing}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition active:scale-95 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isCapturing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-950" />
                ) : (
                  <Share2 className="h-3.5 w-3.5 text-slate-950" />
                )}
                <span>{isCapturing ? "Capturing..." : "Share"}</span>
              </button>
            </div>
          </div>

          {/* Watermark branding for screenshot aesthetics */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/40 font-mono">
            <span className="flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5 text-amber-400" />
              <span>AJITDEV Currency Engine • ECB Reference</span>
            </span>
            <span>next.ajitdev.com/currency</span>
          </div>
        </div>
      </div>

      {/* ─── Tab Content 1: Historical Timeseries Chart ─── */}
      {activeTab === "chart" && (
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {fromCurrency} to {toCurrency} Historical Exchange Rate
              </h2>
              <p className="text-xs text-slate-500">
                Official European Central Bank reference trend
              </p>
            </div>

            {/* Range Selector */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              {["7d", "30d", "90d", "1y"].map((r) => (
                <button
                  key={r}
                  onClick={() => setChartRange(r)}
                  className={`px-3 py-1 rounded-lg uppercase transition cursor-pointer ${
                    chartRange === r
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Key Stats Bar */}
          {historyStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Period High
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 font-mono">
                  {historyStats.max.toFixed(4)}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Period Low
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 font-mono">
                  {historyStats.min.toFixed(4)}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Period Average
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 font-mono">
                  {historyStats.avg.toFixed(4)}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Net Change
                </div>
                <div
                  className={`text-base sm:text-lg font-black font-mono flex items-center gap-1 ${
                    historyStats.change >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {historyStats.change >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>
                    {historyStats.change >= 0 ? "+" : ""}
                    {historyStats.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SVG Chart Canvas */}
          <div className="relative w-full h-64 bg-slate-950 rounded-2xl overflow-hidden p-2 sm:p-4 border border-slate-800">
            {isLoadingHistory ? (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
                <RotateCw className="h-5 w-5 animate-spin mr-2" />
                Loading timeseries data...
              </div>
            ) : chartCoordinates.points.length > 0 ? (
              <>
                <svg
                  viewBox="0 0 800 240"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                >
                  <defs>
                    <linearGradient
                      id="rateGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line
                    x1="40"
                    y1="60"
                    x2="760"
                    y2="60"
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="40"
                    y1="120"
                    x2="760"
                    y2="120"
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="40"
                    y1="180"
                    x2="760"
                    y2="180"
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                  />

                  {/* Area fill */}
                  <path d={chartCoordinates.area} fill="url(#rateGradient)" />

                  {/* Line stroke */}
                  <path
                    d={chartCoordinates.path}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Hover interactive dots */}
                  {chartCoordinates.points.map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredPoint?.date === pt.date ? "6" : "3"}
                      fill={
                        hoveredPoint?.date === pt.date ? "#ffffff" : "#fbbf24"
                      }
                      stroke="#0f172a"
                      strokeWidth="2"
                      className="transition-all cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(pt)}
                    />
                  ))}
                </svg>

                {/* Hover Tooltip Overlay */}
                {hoveredPoint && (
                  <div className="absolute top-4 left-6 bg-slate-900/95 text-white border border-slate-700 rounded-xl px-3 py-1.5 text-xs shadow-xl backdrop-blur-xs flex items-center gap-2">
                    <span className="text-slate-400">{hoveredPoint.date}:</span>
                    <span className="font-bold text-amber-400 font-mono">
                      1 {fromCurrency} = {hoveredPoint.rate} {toCurrency}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                No timeseries points available for this pair.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Tab Content 2: Multi-Currency Parity Matrix ─── */}
      {activeTab === "matrix" && (
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {fromCurrency} to {toCurrency} Parity Conversion Tables
              </h2>
              <p className="text-xs text-slate-500">
                Instant bilateral calculator matrix for everyday sums
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Table 1: From -> To */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="bg-slate-900 text-white px-4 py-3 font-bold text-xs flex items-center justify-between">
                <span>{fromCurrency} Amount</span>
                <span>{toCurrency} Equivalent</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs font-mono">
                {[1, 5, 10, 25, 50, 100, 250, 500, 1000, 5000].map((val) => (
                  <div
                    key={val}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition"
                  >
                    <span className="font-semibold text-slate-900">
                      {fromInfo.symbol}
                      {val.toLocaleString()} {fromCurrency}
                    </span>
                    <span className="font-bold text-slate-900">
                      {toInfo.symbol}
                      {(val * currentRate).toFixed(2)} {toCurrency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Table 2: To -> From */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="bg-slate-900 text-white px-4 py-3 font-bold text-xs flex items-center justify-between">
                <span>{toCurrency} Amount</span>
                <span>{fromCurrency} Equivalent</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs font-mono">
                {[100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000].map(
                  (val) => (
                    <div
                      key={val}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition"
                    >
                      <span className="font-semibold text-slate-900">
                        {toInfo.symbol}
                        {val.toLocaleString()} {toCurrency}
                      </span>
                      <span className="font-bold text-slate-900">
                        {fromInfo.symbol}
                        {(val * inverseRate).toFixed(2)} {fromCurrency}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Multi-Currency Live Comparison Grid ─── */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 flex items-center gap-2">
              <Globe className="h-5 w-5 text-indigo-600" />
              <span>
                {formatCurrencyValue(amount, fromCurrency)} {fromCurrency} in
                Major World Currencies
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Live mid-market rates across 12 primary foreign exchange benchmarks
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {majorCurrencies.map((c) => (
            <div
              key={c.code}
              onClick={() => {
                setToCurrency(c.code);
                toast.info(`Target currency set to ${c.code}`, {
                  description: `Now converting to ${c.name}`,
                });
              }}
              className="group relative rounded-2xl bg-white border border-slate-200 p-4 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm leading-tight group-hover:text-indigo-600 transition">
                      {c.code}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[120px]">
                      {c.name}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 rounded-md px-1.5 py-0.5">
                  {c.symbol}
                </span>
              </div>

              <div>
                <div className="text-lg sm:text-xl font-black text-slate-900 font-mono">
                  {c.symbol}
                  {formatCurrencyValue(c.converted, c.code)}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  1 {fromCurrency} = {c.rate.toFixed(4)} {c.code}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Institutional Trust & FAQ Section ─── */}
      <div className="rounded-3xl bg-slate-100 border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-950">
              Why AJITDEV Uses Frankfurter API & Native Fetch
            </h3>
            <p className="text-xs text-slate-600">
              Zero SDK bloat, 100% open data directly from the European Central
              Bank
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-2xl bg-white p-4 border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Native Next.js Fetch</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              No bloated npm packages or heavy SDKs. Lightweight, ultra-fast HTTP
              requests with edge-level caching and background revalidation.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-indigo-500" />
              <span>Official ECB Mid-Market Data</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Updated daily around 16:00 CET by the European Central Bank. Provides
              neutral, unbiased benchmark rates without retail bank spreads.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Full Resilience & Fallback</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Built-in graceful fallbacks ensure the converter works smoothly even
              in offline mode, unstable connections, or during upstream API maintenance.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Currency Selection Modal (Dialog) ─── */}
      <Dialog.Root open={selectorOpen} onOpenChange={setSelectorOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-150" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[110] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl overflow-hidden focus:outline-none animate-in fade-in-0 zoom-in-95 duration-150 p-6 border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <Dialog.Title className="text-lg font-bold text-slate-900">
                Select {selectorTarget === "from" ? "Source" : "Target"} Currency
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Search and choose from 31 supported world currencies.
            </Dialog.Description>

            {/* Search Input */}
            <div className="relative pt-4 pb-3">
              <Search className="absolute left-3.5 top-1/2 translate-y-[-10%] h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={currencySearch}
                onChange={(e) => setCurrencySearch(e.target.value)}
                placeholder="Search by code, country, or name..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition"
                autoFocus
              />
            </div>

            {/* Region Filter Chips */}
            <div className="flex items-center gap-1.5 pb-3 overflow-x-auto text-xs scrollbar-none">
              {[
                { id: "all", label: "All (31)" },
                { id: "popular", label: "Popular" },
                { id: "americas", label: "Americas" },
                { id: "europe", label: "Europe" },
                { id: "asia", label: "Asia & Pacific" },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setCurrencyCategoryFilter(chip.id)}
                  className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                    currencyCategoryFilter === chip.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Currencies List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1">
              {filteredCurrencies.map((c) => {
                const isSelected =
                  selectorTarget === "from"
                    ? c.code === fromCurrency
                    : c.code === toCurrency;
                return (
                  <button
                    key={c.code}
                    onClick={() => handleSelectCurrency(c.code)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer text-left ${
                      isSelected ? "bg-amber-50/70" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {c.code}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {c.symbol}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">{c.name}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}

              {filteredCurrencies.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No currencies match &quot;{currencySearch}&quot;.
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ─── Screenshot & Share Destination Modal ─── */}
      <Dialog.Root open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[120] bg-slate-950/75 backdrop-blur-md transition-opacity animate-in fade-in-0 duration-200" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[130] w-[94vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl overflow-hidden focus:outline-none animate-in fade-in-0 zoom-in-95 duration-200 border border-slate-100 max-h-[92vh] flex flex-col">
            {/* Top Rainbow Accent Strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 shrink-0" />

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <div>
                    <Dialog.Title className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
                      Share Exchange Rate Snapshot
                    </Dialog.Title>
                    <Dialog.Description className="text-xs text-slate-500">
                      {fromCurrency} to {toCurrency} conversion rate card
                    </Dialog.Description>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button
                    className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition cursor-pointer active:scale-90"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>

              {/* Screenshot Preview Card */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1 uppercase tracking-wider">
                  <span>📸 Snapshot Card</span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    HD Ready
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-slate-900 bg-slate-950 p-2 shadow-inner flex items-center justify-center min-h-[160px]">
                  {screenshotUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={screenshotUrl}
                      alt="Currency Conversion Screenshot"
                      className="w-full h-auto object-contain max-h-56 mx-auto rounded-xl shadow-xs"
                    />
                  ) : (
                    <div className="h-40 flex items-center justify-center text-xs text-slate-400 gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                      <span>Generating preview...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Copy Feedback Notification Banner */}
              {isCopiedImage && (
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-1 duration-150">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Image Copied!</span> Paste (Ctrl+V) directly into WhatsApp, Telegram, Discord, or Email.
                  </div>
                </div>
              )}
              {isCopiedLink && (
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-1 duration-150">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-bold">Direct Link Copied!</span> Ready to share with your friends.
                  </div>
                </div>
              )}

              {/* Action Buttons Section */}
              <div className="space-y-2.5 pt-1">
                {/* Primary Mobile / Device Share to Apps (if supported) */}
                {canNativeShare && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:brightness-105 text-slate-950 font-black text-xs sm:text-sm transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Share2 className="h-4 w-4 text-slate-950" />
                    <span>Share to Apps (WhatsApp, AirDrop, Nearby...)</span>
                  </button>
                )}

                {/* Hero Copy Snapshot Image Button */}
                <button
                  type="button"
                  onClick={handleCopyImage}
                  className={`w-full py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                    isCopiedImage
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-300 scale-[1.01]"
                      : "bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                  }`}
                >
                  {isCopiedImage ? (
                    <>
                      <Check className="h-4 w-4 text-white animate-bounce" />
                      <span>✓ Snapshot Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 text-amber-300" />
                      <span>Copy Snapshot Image</span>
                      <span className="text-[10px] text-slate-300 font-normal hidden xs:inline">
                        (Paste in chat)
                      </span>
                    </>
                  )}
                </button>

                {/* Channels 4-Button Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="py-2.5 px-2 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.584 1.802.814 2.791.815 3.183 0 5.769-2.586 5.769-5.766.001-3.182-2.585-5.768-5.77-5.768zm0-2c4.288 0 7.769 3.481 7.769 7.768 0 4.288-3.481 7.769-7.769 7.769-1.328 0-2.576-.341-3.666-.938l-4.365 1.144 1.164-4.254c-.655-1.127-1.028-2.434-1.028-3.721 0-4.287 3.481-7.768 7.769-7.768zm3.626 10.974c-.152.428-.883.824-1.229.873-.346.049-.787.072-2.316-.549-1.807-.735-2.973-2.56-3.064-2.679-.091-.121-.734-.977-.734-1.864 0-.886.465-1.323.63-1.492.166-.169.362-.211.482-.211.121 0 .241 0 .346.006.111.006.26.042.392.361.136.327.465 1.134.506 1.217.041.083.069.181.014.289-.055.109-.083.177-.166.273-.083.096-.174.214-.249.288-.083.082-.17.171-.073.337.097.166.432.713.926 1.153.636.566 1.172.741 1.338.824.166.083.264.069.362-.042.098-.111.422-.491.534-.659.113-.168.225-.14.377-.084.151.056.963.454 1.129.537.166.083.276.124.317.194.041.069.041.401-.111.829z" />
                    </svg>
                    <span>WhatsApp</span>
                  </button>

                  {/* Telegram */}
                  <button
                    type="button"
                    onClick={handleTelegramShare}
                    className="py-2.5 px-2 rounded-2xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .36z" />
                    </svg>
                    <span>Telegram</span>
                  </button>

                  {/* 𝕏 Post */}
                  <button
                    type="button"
                    onClick={handleTwitterShare}
                    className="py-2.5 px-2 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs transition border border-slate-800 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span className="font-black text-sm">𝕏</span>
                    <span>Post on 𝕏</span>
                  </button>

                  {/* Download */}
                  <button
                    type="button"
                    onClick={handleDownloadImage}
                    className="py-2.5 px-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Download className="h-4 w-4 text-slate-700 shrink-0" />
                    <span>Save .png</span>
                  </button>
                </div>

                {/* Direct Conversion Link Bar with Integrated Copy Button */}
                <div className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <Link2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-600 truncate font-mono text-[11px] flex-1">
                    {conversionShareUrl}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`shrink-0 py-1.5 px-3 rounded-xl font-bold text-xs transition cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                      isCopiedLink
                        ? "bg-emerald-600 text-white shadow-2xs"
                        : "bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs"
                    }`}
                  >
                    {isCopiedLink ? (
                      <>
                        <Check className="h-3 w-3 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-slate-500" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
