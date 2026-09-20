"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  RefreshCw,
  Printer,
  Sparkles,
  ArrowRight,
  CreditCard,
  Building2,
  Smartphone,
  Wallet,
} from "lucide-react";
import { fireConfetti } from "@/lib/useConfetti";
import type { RazorpayOptions } from "@/types/razorpay";

type PaymentStatus =
  | "idle"
  | "creating_order"
  | "checkout_open"
  | "verifying"
  | "success"
  | "error";

interface SuccessDetails {
  paymentId: string;
  orderId: string;
  amount: number;
  date: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  purpose?: string;
}

const PRESET_AMOUNTS = [100, 500, 1000, 2500, 5000, 10000];

// Safe script loader for Razorpay Checkout
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (!script) {
      script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    let isDone = false;
    const done = (success: boolean) => {
      if (!isDone) {
        isDone = true;
        resolve(success);
      }
    };

    script.addEventListener("load", () => done(true), { once: true });
    script.addEventListener("error", () => done(false), { once: true });

    // Polling fallback to ensure it never hangs if event was missed
    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      if (window.Razorpay) {
        clearInterval(timer);
        done(true);
      } else if (attempts >= 25) {
        clearInterval(timer);
        done(Boolean(window.Razorpay));
      }
    }, 100);
  });
}

export default function PaymentForm() {
  const [amount, setAmount] = useState<string>("500");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("Services & Consulting");

  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successDetails, setSuccessDetails] = useState<SuccessDetails | null>(null);

  // Preload Razorpay Checkout script on component mount
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handleAmountChange = (value: string) => {
    // Only allow positive numbers and decimals
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
      setValidationError(null);
      if (errorMessage) setErrorMessage(null);
    }
  };

  const handleSelectPreset = (preset: number) => {
    setAmount(preset.toString());
    setValidationError(null);
    if (errorMessage) setErrorMessage(null);
  };

  const validateInput = (): boolean => {
    const num = Number(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setValidationError("Please enter a valid amount.");
      return false;
    }
    if (num < 1) {
      setValidationError("Minimum payment amount is ₹1.");
      return false;
    }
    if (num > 500000) {
      setValidationError("Maximum payment amount is ₹5,00,000.");
      return false;
    }
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      setValidationError("Please enter a valid email address.");
      return false;
    }
    if (customerPhone && !/^[6-9]\d{9}$/.test(customerPhone.replace(/\D/g, ""))) {
      setValidationError("Please enter a valid 10-digit mobile number.");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInput()) return;

    setErrorMessage(null);
    setStatus("creating_order");

    try {
      // 1. Ensure Razorpay SDK script is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        throw new Error(
          "Razorpay Checkout script could not be loaded. Please check your internet connection and retry."
        );
      }

      // 2. Request order creation from server
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          customer: {
            name: customerName.trim() || undefined,
            email: customerEmail.trim() || undefined,
            contact: customerPhone.trim() || undefined,
          },
          notes: {
            purpose: purpose.trim() || "AJITDEV Custom Payment",
          },
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        throw new Error(
          orderData.message || "Failed to initialize payment order on server."
        );
      }

      // Use absolute HTTPS URL so Razorpay checkout iframe can load the image without mixed-content or relative-path errors
      const logoUrl =
        typeof window !== "undefined" && window.location.protocol === "https:"
          ? `${window.location.origin}/logo.png`
          : "https://next.ajitdev.com/logo.png";

      // 3. Configure Razorpay checkout options
      const options: RazorpayOptions = {
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "AJITDEV",
        description: purpose.trim() || "Secure custom payment",
        image: logoUrl,
        order_id: orderData.orderId,
        handler: async (response) => {
          // 4. Send payment signatures to server for verification
          setStatus("verifying");
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setStatus("success");
              setSuccessDetails({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: Number(amount),
                customerName: customerName.trim() || undefined,
                customerEmail: customerEmail.trim() || undefined,
                customerPhone: customerPhone.trim() || undefined,
                purpose: purpose.trim() || undefined,
                date: new Date().toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  dateStyle: "medium",
                  timeStyle: "short",
                }),
              });
              fireConfetti();
            } else {
              setStatus("error");
              setErrorMessage(
                verifyData.message ||
                  "Payment signature verification failed. Please contact support."
              );
            }
          } catch (err: unknown) {
            setStatus("error");
            const msg = err instanceof Error ? err.message : "An unexpected error occurred during verification.";
            setErrorMessage(msg);
          }
        },
        prefill: {
          name: customerName.trim() || undefined,
          email: customerEmail.trim() || undefined,
          contact: customerPhone.trim() || undefined,
        },
        theme: {
          color: "#020617",
        },
        modal: {
          ondismiss: () => {
            // Revert back to idle if user closed modal before completing
            setStatus((prev) => (prev === "checkout_open" ? "idle" : prev));
          },
        },
      };

      // 5. Open Razorpay Checkout Modal
      const rzp = new window.Razorpay(options);
      rzp.on?.("payment.failed", (response: unknown) => {
        const errorResp = response as { error?: { description?: string } } | undefined;
        setStatus("error");
        setErrorMessage(errorResp?.error?.description || "Payment was declined or cancelled at checkout.");
      });
      setStatus("checkout_open");
      rzp.open();
    } catch (err: unknown) {
      console.error("Payment initiation error:", err);
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Failed to start payment. Please check your credentials or retry.";
      setErrorMessage(msg);
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setErrorMessage(null);
    setValidationError(null);
    setSuccessDetails(null);
  };

  const isProcessing =
    status === "creating_order" ||
    status === "checkout_open" ||
    status === "verifying";

  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {status === "success" && successDetails ? (
          /* ── SUCCESS STATE WITH RECEIPT ─────────────────────────────────── */
          <motion.div
            key="success-card"
            id="payment-receipt-printable"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-emerald-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-emerald-500/5 relative overflow-hidden"
          >
            {/* Top decorative gradient bar (hidden on print) */}
            <div className="no-print absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

            <div className="flex flex-col items-center text-center">
              {/* Receipt Brand Header */}
              <div className="flex items-center justify-between w-full pb-4 mb-3 border-b border-slate-200">
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
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-950 flex items-center justify-center gap-1">
                  <span className="text-xl text-slate-400">₹</span>
                  <span>{successDetails.amount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Receipt metadata box */}
              <div className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-5 text-left space-y-2.5 text-xs text-slate-700 mt-2">
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-400 font-medium">Payment ID</span>
                  <span className="font-mono font-semibold text-slate-900 select-all">
                    {successDetails.paymentId}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-400 font-medium">Order ID</span>
                  <span className="font-mono text-slate-800 select-all">
                    {successDetails.orderId}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-400 font-medium">Date & Time</span>
                  <span className="font-medium text-slate-800">{successDetails.date}</span>
                </div>

                {successDetails.customerName && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-400 font-medium">Payer Name</span>
                    <span className="font-medium text-slate-900">{successDetails.customerName}</span>
                  </div>
                )}
                {successDetails.customerEmail && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-400 font-medium">Payer Email</span>
                    <span className="font-medium text-slate-900">{successDetails.customerEmail}</span>
                  </div>
                )}
                {successDetails.customerPhone && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-400 font-medium">Phone</span>
                    <span className="font-medium text-slate-900">{successDetails.customerPhone}</span>
                  </div>
                )}
                {successDetails.purpose && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-400 font-medium">Purpose</span>
                    <span className="font-medium text-slate-900">{successDetails.purpose}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-400 font-medium">Payment Method</span>
                  <span className="font-medium text-slate-900">Razorpay Gateway</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium">Security Verification</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <ShieldCheck className="h-3.5 w-3.5" /> HMAC-SHA256 Validated
                  </span>
                </div>
              </div>

              {/* Receipt Footer Note */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-center w-full">
                <p className="text-[10px] text-slate-400 leading-tight">
                  This is a verified computer-generated digital receipt issued by AJITDEV.
                  <br />
                  next.ajitdev.com · Powered by Razorpay
                </p>
              </div>

              {/* Action buttons (hidden when printing) */}
              <div className="no-print mt-6 flex flex-col sm:flex-row gap-3 w-full">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
                >
                  <Printer className="h-4 w-4 text-slate-500" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-sm cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Make Another Payment</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── MAIN PAYMENT FORM ─────────────────────────────────────────── */
          <motion.div
            key="payment-form-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden"
          >
            {/* Top subtle highlight */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span>Razorpay Official Integration</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-1.5">
                  Direct Payment
                </h1>
                <p className="text-xs text-slate-500">
                  Securely transfer custom amount to AJITDEV.
                </p>
              </div>

              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-300 bg-slate-950 shadow-xs">
                <Image
                  src="/logo.png"
                  alt="AJITDEV Logo"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs text-rose-800"
              >
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Payment Error</p>
                  <p className="mt-0.5 text-rose-700 leading-relaxed">{errorMessage}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handlePay} className="space-y-5">
              {/* Amount input */}
              <div>
                <label
                  htmlFor="payment-amount"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Enter Amount (INR) <span className="text-rose-500">*</span>
                </label>

                <div className="relative rounded-2xl border border-slate-300 focus-within:border-slate-950 focus-within:ring-2 focus-within:ring-slate-900/10 transition bg-slate-50/40">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <IndianRupee className="h-5 w-5 text-slate-600" />
                  </div>
                  <input
                    id="payment-amount"
                    type="text"
                    inputMode="decimal"
                    disabled={isProcessing}
                    placeholder="e.g. 500"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="block w-full rounded-2xl border-0 bg-transparent py-3.5 pl-11 pr-16 text-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-0 disabled:opacity-50"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-xs font-bold text-slate-400 tracking-wider">
                      INR
                    </span>
                  </div>
                </div>

                {validationError && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {validationError}
                  </p>
                )}

                {/* Preset Chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESET_AMOUNTS.map((preset) => {
                    const isSelected = amount === preset.toString();
                    return (
                      <button
                        key={preset}
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleSelectPreset(preset)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition active:scale-95 disabled:pointer-events-none ${
                          isSelected
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80"
                        }`}
                      >
                        +₹{preset.toLocaleString("en-IN")}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Purpose / Note */}
              <div>
                <label
                  htmlFor="payment-purpose"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Payment Purpose / Note
                </label>
                <input
                  id="payment-purpose"
                  type="text"
                  disabled={isProcessing}
                  placeholder="e.g. Next.js Web Development / Consulting"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition disabled:opacity-50"
                />
              </div>

              {/* Optional customer info for receipt */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Payer Details (Optional for receipt)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="customer-name"
                      className="block text-[11px] font-medium text-slate-600 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      id="customer-name"
                      type="text"
                      disabled={isProcessing}
                      placeholder="Ajit Kumar"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="customer-email"
                      className="block text-[11px] font-medium text-slate-600 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      id="customer-email"
                      type="email"
                      disabled={isProcessing}
                      placeholder="ajit@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="customer-phone"
                    className="block text-[11px] font-medium text-slate-600 mb-1"
                  >
                    Phone / WhatsApp (10 Digits)
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    disabled={isProcessing}
                    placeholder="9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Supported payment channels */}
              <div className="flex items-center justify-between px-1 py-1 text-[11px] text-slate-500">
                <span className="font-medium text-slate-600">Supported:</span>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <Smartphone className="h-3 w-3 text-slate-400" /> UPI / QR
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CreditCard className="h-3 w-3 text-slate-400" /> Cards
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-slate-400" /> NetBanking
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Wallet className="h-3 w-3 text-slate-400" /> Wallets
                  </span>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                id="pay-now-button"
                type="submit"
                disabled={isProcessing || !amount || Number(amount) < 1}
                className="group relative w-full overflow-hidden rounded-2xl bg-slate-950 px-5 py-4 text-sm font-bold text-white shadow-md shadow-slate-950/20 transition-all duration-200 hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center justify-center gap-2">
                  {status === "creating_order" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                      <span>Creating Secure Order...</span>
                    </>
                  ) : status === "checkout_open" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                      <span>Awaiting Razorpay Payment...</span>
                    </>
                  ) : status === "verifying" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                      <span>Verifying Signature...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹{Number(amount || 0).toLocaleString("en-IN")}</span>
                      <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </button>

              {/* Security guarantee note */}
              <div className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-400 pt-1">
                <Lock className="h-3 w-3 text-emerald-600" />
                <span>256-Bit SSL Encrypted · Tamper-proof HMAC Verification</span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
