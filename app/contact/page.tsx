"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  MapPin,
  Clock,
  ArrowLeft,
  Zap,
  MessageSquare,
  User,
  AtSign,
  FileText,
  ExternalLink,
  Globe,
  ChevronDown,
  Check,
  X,
  Sparkles,
  CornerDownLeft,
} from "lucide-react";
import * as RadixSelect from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";
import Breadcrumbs from "@/components/seo/breadcrumbs";

// ─── Types ───────────────────────────────────────────────────────────────────
type Status = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ─── Info cards ──────────────────────────────────────────────────────────────
const INFO_CARDS = [
  {
    icon: Mail,
    label: "Email",
    value: "support@ajitdev.com",
    sub: "Direct inbox",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-100",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Katihar, Bihar",
    sub: "India — IST (UTC+5:30)",
    color: "text-rose-600",
    bg: "bg-rose-50 border-rose-100",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "< 24 hours",
    sub: "Usually much faster",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-100",
  },
  {
    icon: Globe,
    label: "Open to",
    value: "Collaborations",
    sub: "Projects · APIs · Freelance",
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-100",
  },
];

const SUBJECTS = [
  "Project Collaboration",
  "API Support",
  "Freelance Inquiry",
  "Bug Report",
  "General Question",
  "Other",
];

// ─── Radix Label Field Component ──────────────────────────────────────────────
function FormField({
  id,
  label,
  icon: Icon,
  required,
  badge,
  children,
  error,
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  required?: boolean;
  badge?: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="group/field space-y-2">
      <div className="flex items-center justify-between">
        <Label.Root
          htmlFor={id}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 tracking-wide select-none cursor-pointer transition-colors group-focus-within/field:text-slate-950"
        >
          <Icon className="h-3.5 w-3.5 text-slate-400 group-focus-within/field:text-slate-900 transition-colors" />
          <span>{label}</span>
          {required && (
            <span className="text-rose-500 font-bold ml-0.5" title="Required field">
              *
            </span>
          )}
        </Label.Root>
        {badge && (
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-0.5"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMsg, setServerMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address";
    if (!form.message.trim()) errs.message = "Message is required";
    else if (form.message.trim().length < 10)
      errs.message = "Message must be at least 10 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setServerMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setServerMsg(data.message);
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setServerMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setServerMsg("Network error. Check your connection and try again.");
    }
  };

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Contact", url: "/contact" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 pb-20">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm mb-10"
      >
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-purple-100/40 blur-3xl" />
        </div>

        <div className="relative p-6 sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-700 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Available · Response within 24h
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight mb-3">
            Let&apos;s Build Something
            <span className="block text-slate-400 font-semibold text-xl sm:text-2xl mt-1">
              Together — Get In Touch
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed mb-6">
            Whether you have a project idea, need API support, want to collaborate, or just want to say hello — I read every message and reply personally.
          </p>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INFO_CARDS.map((card) => (
              <div
                key={card.label}
                className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${card.bg}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{card.label}</div>
                  <div className="text-xs font-bold text-slate-800 leading-tight truncate">{card.value}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{card.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── MAIN GRID ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

        {/* ── LEFT: FORM ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
          className="lg:col-span-3"
        >
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="h-5 w-5 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-900">Send a Message</h2>
            </div>

            {/* Success state */}
            <AnimatePresence>
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50 p-4"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-emerald-800">Message sent! 🎉</p>
                    <p className="text-xs text-emerald-700 mt-0.5">{serverMsg}</p>
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200/80 bg-rose-50 p-4"
                >
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-rose-800">Failed to send</p>
                    <p className="text-xs text-rose-700 mt-0.5">{serverMsg}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              className="space-y-6"
              noValidate
            >
              {/* Name + Email row */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Your Name */}
                <FormField
                  id="contact-name"
                  label="Your Name"
                  icon={User}
                  required
                  error={errors.name}
                >
                  <div className="relative flex items-center">
                    <div className="pointer-events-none absolute left-3.5 flex items-center text-slate-400 transition-colors group-focus-within/field:text-slate-900">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Ajit Kumar"
                      value={form.name}
                      onChange={set("name")}
                      disabled={status === "loading"}
                      autoComplete="name"
                      maxLength={80}
                      className={`h-12 w-full rounded-xl border bg-slate-50/50 pl-10 pr-9 text-sm font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all duration-200 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 disabled:opacity-60 disabled:cursor-not-allowed ${
                        errors.name
                          ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10"
                          : "border-slate-200"
                      }`}
                    />
                    {form.name && (
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, name: "" }))}
                        className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                        tabIndex={-1}
                        aria-label="Clear name input"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </FormField>

                {/* Email Address */}
                <FormField
                  id="contact-email"
                  label="Email Address"
                  icon={AtSign}
                  required
                  badge={
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
                      ? "✓ Valid format"
                      : undefined
                  }
                  error={errors.email}
                >
                  <div className="relative flex items-center">
                    <div className="pointer-events-none absolute left-3.5 flex items-center text-slate-400 transition-colors group-focus-within/field:text-slate-900">
                      <AtSign className="h-4 w-4" />
                    </div>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={set("email")}
                      disabled={status === "loading"}
                      autoComplete="email"
                      maxLength={120}
                      className={`h-12 w-full rounded-xl border bg-slate-50/50 pl-10 pr-10 text-sm font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all duration-200 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 disabled:opacity-60 disabled:cursor-not-allowed ${
                        errors.email
                          ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10"
                          : "border-slate-200"
                      }`}
                    />
                    <div className="absolute right-3 flex items-center gap-1">
                      {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 animate-in fade-in" />
                      )}
                      {form.email && (
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, email: "" }))}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                          tabIndex={-1}
                          aria-label="Clear email input"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </FormField>
              </div>

              {/* Subject — Radix UI Select */}
              <FormField
                id="contact-subject"
                label="Subject"
                icon={FileText}
                badge={form.subject ? "Selected" : "Optional"}
              >
                <div className="space-y-2">
                  <RadixSelect.Root
                    value={form.subject}
                    onValueChange={(val) => setForm((f) => ({ ...f, subject: val }))}
                    disabled={status === "loading"}
                  >
                    <RadixSelect.Trigger
                      id="contact-subject"
                      className="group flex h-12 w-full items-center justify-between gap-2.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-900 shadow-xs transition-all duration-200 hover:border-slate-300 hover:bg-white focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-900/5 data-[placeholder]:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="h-4 w-4 text-slate-400 group-focus-within:text-slate-900 shrink-0" />
                        <RadixSelect.Value placeholder="Select a topic (optional)" />
                      </div>
                      <RadixSelect.Icon asChild>
                        <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0" />
                      </RadixSelect.Icon>
                    </RadixSelect.Trigger>

                    <RadixSelect.Portal>
                      <RadixSelect.Content
                        position="popper"
                        sideOffset={6}
                        className="z-[999] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-slate-900/5 animate-in fade-in-0 zoom-in-95"
                      >
                        <RadixSelect.Viewport className="p-1.5">
                          {SUBJECTS.map((s) => (
                            <RadixSelect.Item
                              key={s}
                              value={s}
                              className="relative flex cursor-pointer select-none items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 outline-none transition-colors data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900 data-[state=checked]:bg-slate-900 data-[state=checked]:text-white"
                            >
                              <RadixSelect.ItemText>{s}</RadixSelect.ItemText>
                              <RadixSelect.ItemIndicator>
                                <Check className="h-4 w-4 text-white shrink-0" />
                              </RadixSelect.ItemIndicator>
                            </RadixSelect.Item>
                          ))}
                        </RadixSelect.Viewport>
                      </RadixSelect.Content>
                    </RadixSelect.Portal>
                  </RadixSelect.Root>

                  {/* Quick Pick Topic Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[11px] font-medium text-slate-400 mr-1">Quick pick:</span>
                    {SUBJECTS.map((s) => {
                      const isSelected = form.subject === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, subject: isSelected ? "" : s }))}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150 ${
                            isSelected
                              ? "bg-slate-900 text-white shadow-xs scale-[1.02]"
                              : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </FormField>

              {/* Message */}
              <FormField
                id="contact-message"
                label="Message"
                icon={MessageSquare}
                required
                badge={`${form.message.length} / 2000`}
                error={errors.message}
              >
                <div className="space-y-2">
                  <div className="relative">
                    <textarea
                      id="contact-message"
                      placeholder="Tell me about your project, idea, question, or timeline..."
                      value={form.message}
                      onChange={set("message")}
                      rows={5}
                      maxLength={2000}
                      disabled={status === "loading"}
                      className={`w-full rounded-xl border bg-slate-50/50 p-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal leading-relaxed resize-y min-h-[130px] transition-all duration-200 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 disabled:opacity-60 disabled:cursor-not-allowed ${
                        errors.message
                          ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10"
                          : "border-slate-200"
                      }`}
                    />
                    {/* Live character progress bar indicator */}
                    <div className="h-1 w-full bg-slate-100 rounded-b-xl overflow-hidden -mt-2">
                      <div
                        className={`h-full transition-all duration-300 ${
                          form.message.length > 1800
                            ? "bg-rose-500"
                            : form.message.length > 500
                            ? "bg-emerald-500"
                            : form.message.length > 0
                            ? "bg-slate-900"
                            : "bg-transparent"
                        }`}
                        style={{ width: `${Math.min(100, (form.message.length / 2000) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Message starter prompts */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-medium text-slate-400 mr-0.5 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-amber-500" />
                      Starter ideas:
                    </span>
                    {[
                      "I'd like to collaborate on a new project...",
                      "Need help integrating api.ajitdev.com...",
                      "Looking to hire for freelance development...",
                    ].map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            message: f.message ? `${f.message}\n${prompt}` : prompt,
                          }))
                        }
                        className="text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-md px-2 py-0.5 transition-colors text-left"
                      >
                        + &ldquo;{prompt.slice(0, 26)}...&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              </FormField>

              {/* Submit Button */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  id="contact-submit"
                  disabled={status === "loading"}
                  className="group relative w-full flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-150 hover:bg-slate-800 hover:shadow-md active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending your message...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      <span>Send Message</span>
                      <span className="hidden sm:inline-block text-slate-400 text-xs font-normal ml-1">
                        — reply within 24h
                      </span>
                      <span className="hidden md:inline-flex items-center gap-0.5 ml-auto text-[10px] text-slate-400 border border-slate-700/80 rounded px-1.5 py-0.5">
                        <CornerDownLeft className="h-3 w-3" />
                        <span>Ctrl + Enter</span>
                      </span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-400">
                  🔒 Your information is secure. A confirmation copy will be sent to your email.
                </p>
              </div>
            </form>
          </div>
        </motion.div>

        {/* ── RIGHT: SIDEBAR ─────────────────────────────────── */}
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
          className="lg:col-span-2 space-y-4"
        >
          {/* What to expect */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              What happens next
            </h3>
            <ol className="space-y-4">
              {[
                { step: "01", title: "I get your message", desc: "Delivered instantly to my inbox with all your details." },
                { step: "02", title: "You get confirmed", desc: "A confirmation email lands in your inbox right away." },
                { step: "03", title: "I reply personally", desc: "I read every message and reply within 24 hours." },
              ].map((item) => (
                <li key={item.step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-600">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{item.title}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Quick links */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-400" />
              Quick links
            </h3>
            <div className="space-y-2">
              {[
                { label: "View Projects", href: "/projects", icon: ArrowLeft },
                { label: "Free APIs", href: "/api", icon: Zap },
                { label: "About Ajit Dev", href: "/about", icon: User },
                { label: "api.ajitdev.com", href: "https://api.ajitdev.com/", icon: ExternalLink, external: true },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-2.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white hover:shadow-sm group"
                >
                  <span>{link.label}</span>
                  <link.icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition" />
                </Link>
              ))}
            </div>
          </div>

          {/* Privacy note */}
          <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-700">🔒 Privacy:</span> Your information is only used to reply to your message. It is never shared, sold, or stored beyond the email exchange.
            </p>
          </div>
        </motion.aside>
      </div>
    </main>
  );
}
