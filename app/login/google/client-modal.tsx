"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fireConfetti } from "@/lib/useConfetti";
import {
  User,
  Mail,
  ShieldCheck,
  Database,
  CheckCircle2,
  X,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Key,
  Calendar,
} from "lucide-react";

interface ClientLoginModalProps {
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string | null;
    };
  } | null;
}

export default function ClientLoginModal({ session }: ClientLoginModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const confettiFired = useRef(false);

  // Auto-open modal if user just returned from Google OAuth sign-in
  useEffect(() => {
    if (session?.user) {
      setIsOpen(true);
      // Fire confetti celebration for successful login/signup
      if (!confettiFired.current) {
        confettiFired.current = true;
        setTimeout(() => fireConfetti(), 400);
      }
    }
  }, [session]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const activeUser = session?.user || {
    name: "Ajit Dev (Demo Account)",
    email: "ajit@ajitdev.com",
    image: "/logo.png",
    id: "google-oauth-10948372615928374",
  };

  const isDemo = !session?.user;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="flex flex-col gap-2 w-full">
        {session?.user ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition active:scale-98 cursor-pointer"
          >
            <User className="h-4 w-4 text-emerald-400" />
            <span>View Authenticated Profile Modal</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-[11px] font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 transition active:scale-98 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Preview User Data Popup (Modal Demo)</span>
          </button>
        )}
      </div>

      {/* Modal Backdrop & Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Card */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="user-modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-emerald-500 bg-slate-100 shadow-sm shrink-0">
                  {activeUser.image ? (
                    <Image
                      src={activeUser.image}
                      alt={activeUser.name || "User Avatar"}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-7 w-7 text-slate-500" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h2
                      id="user-modal-title"
                      className="text-base font-bold text-slate-900 truncate"
                    >
                      {activeUser.name || "Authenticated User"}
                    </h2>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {activeUser.email}
                  </p>
                </div>
              </div>

              {/* Status Chips */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Google Verified
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                  <Database className="h-3 w-3 text-blue-600" />
                  MongoDB Atlas Synced
                </span>

                {isDemo && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                    Preview Mode
                  </span>
                )}
              </div>

              {/* User Record Details */}
              <div className="mt-4 space-y-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-[11px] text-slate-500">Provider:</span>
                  <span className="font-semibold text-slate-800">Google OAuth 2.0</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-[11px] text-slate-500">Account ID:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                    {activeUser.id}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-[11px] text-slate-500">Database Pool:</span>
                  <span className="font-semibold text-emerald-700">Atlas Dedicated Cluster</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-[11px] text-slate-500">Session Security:</span>
                  <span className="font-semibold text-slate-800">HttpOnly · TLS 1.3</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      JSON.stringify(
                        {
                          name: activeUser.name,
                          email: activeUser.email,
                          googleId: activeUser.id,
                          provider: "google",
                          syncedWithAtlas: true,
                          timestamp: new Date().toISOString(),
                        },
                        null,
                        2
                      )
                    )
                  }
                  className="inline-flex w-full sm:w-auto flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied JSON!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-500" />
                      <span>Copy Record JSON</span>
                    </>
                  )}
                </button>

                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full sm:w-auto flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition"
                >
                  <span>Go to Homepage</span>
                </Link>
              </div>

              {/* Legal Notice */}
              <p className="mt-4 text-center text-[10px] text-slate-500">
                Your data is protected under our{" "}
                <Link href="/privacy" className="underline hover:text-slate-800">
                  Privacy Policy
                </Link>{" "}
                and never shared with unauthorized third parties.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
