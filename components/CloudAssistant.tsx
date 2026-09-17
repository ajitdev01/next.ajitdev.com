"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud,
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  User,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  MessageSquare,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

const STARTER_QUESTIONS = [
  "Who is Ajit Dev?",
  "What is Ajit's education & CGPA?",
  "How many LeetCode problems solved?",
  "Show me AJITDEV projects",
  "What APIs are available?",
  "What is Ajit's tech stack?",
  "Explain the DevOps & AWS stack",
  "Tell me about next.ajitdev.com",
];

export default function CloudAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "👋 Hi! I'm the **AJITDEV Cloud Assistant**, powered by Gemini and the AJITDEV Developer Ecosystem.\n\nAsk me anything about Ajit Dev's projects, APIs, Next.js architecture, or DevOps stack!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages]);

  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener("open-cloud-assistant", handleOpenEvent);

    if (typeof window !== "undefined" && window.location.hash === "#assistant") {
      setIsOpen(true);
    }

    return () => {
      window.removeEventListener("open-cloud-assistant", handleOpenEvent);
    };
  }, []);

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build conversation history (up to last 6 messages)
      const history = messages
        .filter((m) => m.id !== "welcome")
        .slice(-6)
        .map((m) => ({
          role: (m.role === "user" ? "user" : "model") as "user" | "model",
          text: m.text,
        }));

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        "I'm currently having trouble retrieving that information. Please check back shortly or explore [ajitdev.com](https://www.ajitdev.com).";

      const botMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Assistant send error:", err);
      const errorMessage: Message = {
        id: `assistant-err-${Date.now()}`,
        role: "assistant",
        text: "⚠️ Connection timeout. Please check your network or try again in a few moments.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        text: "Conversation cleared! How can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Helper to format basic markdown (bold, links, code, list items)
  const renderFormattedText = (raw: string) => {
    const lines = raw.split("\n");
    return lines.map((line, idx) => {
      // Bullet list items
      const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
      const cleanLine = isBullet ? line.trim().replace(/^[-*]\s+/, "") : line;

      // Replace markdown links [text](url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = linkRegex.exec(cleanLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(cleanLine.substring(lastIndex, match.index));
        }
        parts.push(
          <a
            key={`${idx}-${match.index}`}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
          >
            {match[1]}
            <ExternalLink className="h-3 w-3 inline shrink-0" />
          </a>
        );
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < cleanLine.length) {
        parts.push(cleanLine.substring(lastIndex));
      }

      // Simple bold formatter
      const formattedContent = parts.map((part, pIdx) => {
        if (typeof part !== "string") return part;
        const boldRegex = /\*\*([^*]+)\*\*/g;
        const subParts: React.ReactNode[] = [];
        let subLast = 0;
        let bMatch: RegExpExecArray | null;

        while ((bMatch = boldRegex.exec(part)) !== null) {
          if (bMatch.index > subLast) {
            subParts.push(part.substring(subLast, bMatch.index));
          }
          subParts.push(
            <strong key={`b-${pIdx}-${bMatch.index}`} className="font-bold text-slate-900">
              {bMatch[1]}
            </strong>
          );
          subLast = bMatch.index + bMatch[0].length;
        }
        if (subLast < part.length) {
          subParts.push(part.substring(subLast));
        }
        return subParts;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
            <div className="flex-1 leading-relaxed text-xs sm:text-sm text-slate-700">
              {formattedContent}
            </div>
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-1 leading-relaxed text-xs sm:text-sm text-slate-700">
          {formattedContent}
        </p>
      );
    });
  };

  return (
    <>
      {/* ─── Floating Trigger Button ─── */}
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              type="button"
              onClick={() => setIsOpen(true)}
              initial={{ scale: 0.8, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 12 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex items-center gap-2.5 rounded-full bg-slate-950 p-2 sm:px-4 sm:py-2.5 text-white shadow-2xl shadow-slate-950/40 border border-slate-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Open AJITDEV Cloud Assistant"
            >
              {/* Outer pulsing glow */}
              <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-40 blur-xs transition group-hover:opacity-75 animate-tilt" />

              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm">
                <Cloud className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-slate-950" />
                </span>
              </div>

              <div className="relative hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1">
                  AJITDEV Assistant
                  <Sparkles className="h-3 w-3 text-amber-400" />
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Ask about Projects & APIs
                </span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Chat Window ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[440px] h-[580px] max-h-[85vh] flex flex-col rounded-3xl bg-white/98 shadow-2xl border border-slate-200/90 backdrop-blur-xl overflow-hidden"
          >
            {/* Window Header */}
            <div className="relative flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-950 text-white select-none">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30">
                  <Bot className="h-5 w-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-slate-950" />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white">
                      AJITDEV Cloud Assistant
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Official AI • Powered by Gemini
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClear}
                  className="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition flex items-center justify-center"
                  title="Clear conversation"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition flex items-center justify-center"
                  title="Close assistant"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`h-7 w-7 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-xs ${
                        isUser
                          ? "bg-slate-900 text-white"
                          : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white"
                      }`}
                    >
                      {isUser ? <User className="h-3.5 w-3.5" /> : <Cloud className="h-3.5 w-3.5" />}
                    </div>

                    <div
                      className={`group relative max-w-[84%] rounded-2xl p-3.5 text-xs sm:text-sm transition shadow-xs ${
                        isUser
                          ? "bg-slate-900 text-white rounded-tr-xs"
                          : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      ) : (
                        <div>
                          {renderFormattedText(msg.text)}

                          {/* Copy button for assistant responses */}
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                            <span>{msg.timestamp}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.text, msg.id)}
                              className="inline-flex items-center gap-1 hover:text-slate-700 transition"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-600" />
                                  <span className="text-emerald-600 font-semibold">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
                    <Cloud className="h-3.5 w-3.5 animate-pulse" />
                  </div>
                  <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs p-3.5 shadow-xs flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starter Question Chips */}
            {messages.length <= 3 && !isLoading && (
              <div className="px-4 py-2 border-t border-slate-100 bg-white/95">
                <div className="flex items-center gap-1 mb-1.5">
                  <Sparkles className="h-3 w-3 text-indigo-600" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Suggested Questions
                  </span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {STARTER_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleSend(q)}
                      className="whitespace-nowrap rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition active:scale-95 shrink-0"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about AJITDEV, APIs, Next.js..."
                disabled={isLoading}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="h-10 w-10 rounded-2xl bg-slate-950 text-white disabled:opacity-40 disabled:hover:scale-100 hover:bg-indigo-600 transition flex items-center justify-center shrink-0 active:scale-95 shadow-xs"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
