"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  Building2,
  Smartphone,
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  Search,
  RefreshCw,
  Plus,
  ShieldCheck,
  Printer,
  IndianRupee,
  Receipt,
  X,
  History,
} from "lucide-react";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import Footer from "@/app/components/footer";
import type { PaymentItem } from "@/app/api/payment/list/route";

export default function TestPaymentsHistoryPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "success" | "created" | "failed">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<PaymentItem | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payment/list");
      const data = await res.json();
      if (res.ok && data.success) {
        setPayments(data.payments || []);
      } else {
        throw new Error(data.message || "Failed to load payments history");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching payments list";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Filtered payments
  const filteredPayments = payments.filter((item) => {
    // Status filter
    if (filter === "success" && item.status !== "success" && item.status !== "captured") return false;
    if (filter === "created" && item.status !== "created") return false;
    if (filter === "failed" && item.status !== "failed") return false;

    // Search query
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const customerName = (item.notes?.customerName as string)?.toLowerCase() || "";
    const purpose = (item.notes?.purpose as string)?.toLowerCase() || "";

    return (
      item.id?.toLowerCase().includes(q) ||
      item.orderId?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.contact?.toLowerCase().includes(q) ||
      customerName.includes(q) ||
      purpose.includes(q) ||
      item.amount.toString().includes(q)
    );
  });

  // Analytics totals
  const totalVolume = payments
    .filter((p) => p.status === "success" || p.status === "captured")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const successfulCount = payments.filter(
    (p) => p.status === "success" || p.status === "captured"
  ).length;

  const successRate = payments.length > 0 ? Math.round((successfulCount / payments.length) * 100) : 100;

  const getMethodIcon = (method?: string) => {
    switch (method?.toLowerCase()) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "upi":
        return <Smartphone className="h-4 w-4" />;
      case "netbanking":
        return <Building2 className="h-4 w-4" />;
      case "wallet":
        return <Wallet className="h-4 w-4" />;
      default:
        return <IndianRupee className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-950 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Background Decorative Grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <main className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 w-full max-w-full overflow-x-hidden">
        {/* Navigation & Breadcrumbs */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
          <div className="overflow-x-auto scrollbar-hide py-0.5 max-w-full">
            <Breadcrumbs
              items={[
                { name: "Home", url: "/" },
                { name: "Payments", url: "/payments/self" },
                { name: "Test Payments", url: "/payments/test" },
                { name: "Payment History", url: "/payments/testlist" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/payments/test"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95 whitespace-nowrap"
            >
              <History className="h-3.5 w-3.5 shrink-0" />
              <span>Test System</span>
            </Link>
            <Link
              href="/payments/self"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition active:scale-95 whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              <span>New Payment</span>
            </Link>
          </div>
        </div>

        {/* Hero Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              <div className="relative flex h-11 w-11 sm:h-13 sm:w-13 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-300/80 bg-slate-950 shadow-md shadow-slate-900/10">
                <Image
                  src="/logo.png"
                  alt="AJITDEV Metallic Logo"
                  width={52}
                  height={52}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-slate-700 shadow-2xs mb-0.5 sm:mb-1">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span>Payment History & Activity</span>
                </div>
                <h1 className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight truncate">
                  All Payments History
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 sm:line-clamp-none">
                  Comprehensive history of transactions recorded from Razorpay Gateway & MongoDB Atlas.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchPayments}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer self-start sm:self-center shrink-0"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Records</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="mt-5 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-xs min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 truncate">
                Total Volume
              </span>
              <p className="text-lg sm:text-2xl font-black text-slate-950 flex items-center gap-0.5 truncate">
                <span className="text-xs sm:text-sm font-semibold text-slate-400">₹</span>
                {totalVolume.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-xs min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 truncate">
                Total Transactions
              </span>
              <p className="text-lg sm:text-2xl font-black text-slate-950 truncate">
                {payments.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-xs min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 truncate">
                Verified Rate
              </span>
              <p className="text-lg sm:text-2xl font-black text-emerald-600 truncate">
                {successRate}%
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-xs min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 truncate">
                Gateway Mode
              </span>
              <div className="flex items-center gap-1.5 mt-1 min-w-0">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-xs font-bold text-slate-800 truncate">Razorpay Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between w-full max-w-full">
          {/* Status Tabs with smooth scroll */}
          <div className="w-full sm:w-auto max-w-full overflow-x-auto scrollbar-hide py-0.5">
            <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl bg-slate-200/70 border border-slate-200 min-w-max">
              {[
                { id: "all", label: "All Records", count: payments.length },
                { id: "success", label: "Success", count: successfulCount },
                {
                  id: "created",
                  label: "Created / Pending",
                  count: payments.filter((p) => p.status === "created").length,
                },
                {
                  id: "failed",
                  label: "Failed",
                  count: payments.filter((p) => p.status === "failed").length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id as typeof filter)}
                  className={`rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition active:scale-95 cursor-pointer whitespace-nowrap ${
                    filter === tab.id
                      ? "bg-white text-slate-950 shadow-xs"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/60"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="ml-1 text-[10px] opacity-60">({tab.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, email, amount..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950 shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchPayments}
              className="font-bold underline hover:no-underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && payments.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-3xl border border-slate-200/80 bg-white p-5 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-4 w-1/3 bg-slate-200 rounded-md" />
                  <div className="h-8 w-2/3 bg-slate-200 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-slate-100 rounded" />
                  <div className="h-3 w-4/5 bg-slate-100 rounded" />
                  <div className="h-3 w-1/2 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPayments.length === 0 ? (
          /* Empty state */
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 mb-4">
              <Receipt className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Payments Found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              {search
                ? `No transactions matched your query "${search}". Try searching something else.`
                : "No payments recorded yet in this category. Make a test payment to see it here live."}
            </p>
            <Link
              href="/payments/test"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Make Test Payment</span>
            </Link>
          </div>
        ) : (
          /* ── PAYMENTS CARDS GRID ────────────────────────────────────────── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPayments.map((item) => {
              const isSuccess = item.status === "success" || item.status === "captured";
              const isFailed = item.status === "failed";
              const formattedDate = new Date(item.createdAt).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "medium",
                timeStyle: "short",
              });
              const customerName = (item.notes?.customerName as string) || "Customer";
              const purpose = (item.notes?.purpose as string) || "Services & Consulting";

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-slate-300"
                >
                  {/* Top status & method row */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {/* Method chip */}
                      <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {getMethodIcon(item.method)}
                        <span className="capitalize">{item.method || "Razorpay Gateway"}</span>
                      </div>

                      {/* Status pill */}
                      {isSuccess ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          <span>PAID</span>
                        </span>
                      ) : isFailed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
                          <AlertCircle className="h-3 w-3 text-rose-600" />
                          <span>FAILED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                          <Clock className="h-3 w-3 text-amber-600" />
                          <span>CREATED</span>
                        </span>
                      )}
                    </div>

                    {/* Amount */}
                    <div className="mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Amount
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-slate-950 flex items-center gap-1">
                        <span className="text-lg text-slate-400">₹</span>
                        <span>{item.amount.toLocaleString("en-IN")}</span>
                        <span className="text-[11px] font-semibold text-slate-400 ml-1">
                          {item.currency}
                        </span>
                      </div>
                    </div>

                    {/* Transaction Details Box */}
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2 text-xs text-slate-600">
                      {/* Payment ID */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">Payment ID</span>
                        <div className="flex items-center gap-1 font-mono font-semibold text-slate-800">
                          <span className="truncate max-w-[130px]">{item.id}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.id, `pay-${item.id}`)}
                            title="Copy Payment ID"
                            className="p-1 hover:bg-slate-200 rounded transition text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            {copiedId === `pay-${item.id}` ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Order ID */}
                      {item.orderId && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400">Order ID</span>
                          <div className="flex items-center gap-1 font-mono text-slate-700">
                            <span className="truncate max-w-[130px]">{item.orderId}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(item.orderId!, `ord-${item.orderId}`)}
                              title="Copy Order ID"
                              className="p-1 hover:bg-slate-200 rounded transition text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                              {copiedId === `ord-${item.orderId}` ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Customer / Email */}
                      {(item.email || customerName !== "Customer") && (
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/50">
                          <span className="text-[11px] text-slate-400">Payer</span>
                          <span className="font-medium text-slate-800 truncate max-w-[150px]">
                            {customerName !== "Customer" ? customerName : item.email}
                          </span>
                        </div>
                      )}

                      {/* Phone */}
                      {item.contact && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400">Phone</span>
                          <span className="text-slate-700 font-mono text-[11px]">
                            {item.contact}
                          </span>
                        </div>
                      )}

                      {/* Purpose */}
                      {purpose && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400">Purpose</span>
                          <span className="text-slate-700 truncate max-w-[150px]">
                            {purpose}
                          </span>
                        </div>
                      )}

                      {/* Date */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/50 text-[11px]">
                        <span className="text-slate-400">Date</span>
                        <span className="text-slate-700">{formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Actions */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>HMAC-SHA256</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveReceipt(item)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer group-hover:border-slate-300"
                    >
                      <Receipt className="h-3.5 w-3.5 text-slate-500" />
                      <span>View Receipt</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── MODAL: VIEW & PRINT INDIVIDUAL RECEIPT ─────────────────────────── */}
        {activeReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div
              id="payment-receipt-printable"
              className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              {/* Close Button (no-print) */}
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="no-print absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Receipt Header */}
              <div className="flex items-center justify-between w-full pb-4 mb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5 text-left">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-300 bg-slate-950">
                    <Image
                      src="/logo.png"
                      alt="AJITDEV Logo"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                      priority
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-tight text-slate-950 uppercase">
                      AJITDEV
                    </h3>
                    <p className="text-[10px] text-slate-500">Official Payment Receipt</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    PAID & VERIFIED
                  </span>
                </div>
              </div>

              {/* Amount Display */}
              <div className="my-2 py-2 text-center w-full">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Amount Received
                </span>
                <div className="text-3xl font-extrabold text-slate-950 flex items-center justify-center gap-1">
                  <span className="text-xl text-slate-400">₹</span>
                  <span>{activeReceipt.amount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Receipt Details Box */}
              <div className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2.5 text-xs text-slate-700 mt-2">
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-400 font-medium">Payment ID</span>
                  <span className="font-mono font-semibold text-slate-900 select-all">
                    {activeReceipt.id}
                  </span>
                </div>
                {activeReceipt.orderId && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-400 font-medium">Order ID</span>
                    <span className="font-mono text-slate-800 select-all">
                      {activeReceipt.orderId}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-400 font-medium">Date & Time</span>
                  <span className="font-medium text-slate-800">
                    {new Date(activeReceipt.createdAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                {Boolean(activeReceipt.notes?.customerName) && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-400 font-medium">Payer Name</span>
                    <span className="font-medium text-slate-900">
                      {String(activeReceipt.notes?.customerName)}
                    </span>
                  </div>
                )}
                {activeReceipt.email && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-400 font-medium">Payer Email</span>
                    <span className="font-medium text-slate-900">{activeReceipt.email}</span>
                  </div>
                )}
                {activeReceipt.contact && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-400 font-medium">Phone</span>
                    <span className="font-medium text-slate-900">{activeReceipt.contact}</span>
                  </div>
                )}
                {Boolean(activeReceipt.notes?.purpose) && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-400 font-medium">Purpose</span>
                    <span className="font-medium text-slate-900">
                      {String(activeReceipt.notes?.purpose)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-400 font-medium">Payment Gateway</span>
                  <span className="font-medium text-slate-900">Razorpay (Direct)</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium">Security Verification</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <ShieldCheck className="h-3.5 w-3.5" /> HMAC-SHA256 Validated
                  </span>
                </div>
              </div>

              {/* Receipt Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-center w-full">
                <p className="text-[10px] text-slate-400 leading-tight">
                  This is a verified computer-generated digital receipt issued by AJITDEV.
                  <br />
                  next.ajitdev.com · Powered by Razorpay
                </p>
              </div>

              {/* Modal Buttons (no-print) */}
              <div className="no-print mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-sm cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReceipt(null)}
                  className="inline-flex items-center justify-center px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Minimal Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <Footer theme="light" className="w-full" />
        </div>
      </main>
    </div>
  );
}
