import { GoogleGenAI } from "@google/genai";
import {
  AJITDEV_ASSISTANT_PROMPT,
  getFallbackResponse,
} from "@/lib/assistant/system-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanKey(val?: string): string {
  if (!val) return "";
  let k = val.trim();
  if (
    (k.startsWith('"') && k.endsWith('"')) ||
    (k.startsWith("'") && k.endsWith("'"))
  ) {
    k = k.slice(1, -1).trim();
  }
  return k;
}

// Extract and pool all available Gemini API keys from environment
function getApiKeys(): string[] {
  const candidates = [
    cleanKey(process.env.GEMINI_API_KEY),
    cleanKey(process.env.GEMINI_API_KEY2),
  ];
  return Array.from(new Set(candidates.filter((k) => Boolean(k) && k.length > 5)));
}

// Global request counter for load balancing between keys
let requestCounter = 0;

// Verified list of modern models supported on @google/genai for these keys
const CANDIDATE_MODELS = [
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-flash-latest",
  "gemini-3.1-pro-preview",
  "gemini-pro-latest",
];

const ENHANCED_SYSTEM_INSTRUCTION = `${AJITDEV_ASSISTANT_PROMPT}

=========================================================
RESPONSE EXCELLENCE & BEHAVIORAL DIRECTIVES:
=========================================================
1. Superior Answer Quality: Deliver well-researched, articulate, and well-structured answers using clean markdown formatting (bold headers, bullet points, numbered steps, and tables where helpful).
2. Code & Technical Depth: When providing code or technical answers (e.g. Next.js 16, React 19, TypeScript, Node.js, Express, AWS, Docker, Kubernetes, MongoDB, DSA, System Design), write clean, modern, production-grade code with explanatory notes.
3. Natural Language Adaptability: If the user addresses you in Hindi, Hinglish, or English, mirror their language seamlessly and naturally with courtesy and warmth.
4. Ecosystem Grounding: You represent Ajit Dev and the AJITDEV ecosystem. Mention relevant live resources when appropriate:
   - Next.js Projects & Apps: https://next.ajitdev.com
   - API Playground & Documentation: https://api.ajitdev.com
   - Developer Sandbox: https://try.ajitdev.com
   - Main Portfolio: https://www.ajitdev.com
   - GitHub: https://github.com/ajitdev01
5. Integrity & Security: Never invent credentials, never disclose secret API keys, tokens, or environment files.
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return Response.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const cleanMessage = message.trim();
    const apiKeys = getApiKeys();

    if (apiKeys.length === 0) {
      console.warn(
        "[AJITDEV Assistant] No Gemini API keys found in environment, falling back to local knowledge engine."
      );
      const fallbackReply = getFallbackResponse(cleanMessage);
      return Response.json({
        success: true,
        reply: fallbackReply,
        source: "local-grounding",
      });
    }

    // Build multi-turn conversational contents
    let contents: any = cleanMessage;
    if (Array.isArray(history) && history.length > 0) {
      const formattedHistory = history
        .filter((h: any) => h && typeof h.text === "string" && h.text.trim())
        .slice(-8)
        .map((h: any) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: String(h.text) }],
        }));

      contents = [
        ...formattedHistory,
        {
          role: "user",
          parts: [{ text: cleanMessage }],
        },
      ];
    }

    // Distribute load between Key 1 and Key 2 round-robin, and fallback to the other key on failure
    const keysToTry = [...apiKeys];
    if (keysToTry.length > 1) {
      const startIndex = requestCounter % keysToTry.length;
      requestCounter = (requestCounter + 1) % 1000000;
      const rotated = [
        ...keysToTry.slice(startIndex),
        ...keysToTry.slice(0, startIndex),
      ];
      keysToTry.splice(0, keysToTry.length, ...rotated);
    }

    let replyText: string | null = null;
    let usedModel: string | null = null;
    let usedKeyIndex = -1;
    let lastError: any = null;

    // Outer loop: Try all available keys
    for (let kIdx = 0; kIdx < keysToTry.length; kIdx++) {
      const currentKey = keysToTry[kIdx];
      const client = new GoogleGenAI({ apiKey: currentKey });

      // Inner loop: Try candidate models
      for (const model of CANDIDATE_MODELS) {
        try {
          const response = await client.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction: ENHANCED_SYSTEM_INSTRUCTION,
              temperature: 0.7,
            },
          });

          if (response && response.text && response.text.trim()) {
            replyText = response.text.trim();
            usedModel = model;
            usedKeyIndex = kIdx + 1;
            break;
          }
        } catch (err: any) {
          lastError = err;
          const errMsg = err?.message || String(err);
          console.warn(
            `[AJITDEV Assistant] Key #${kIdx + 1} with model "${model}" failed:`,
            errMsg
          );

          // If key is invalid or quota is completely exhausted for this key, switch to the other key immediately
          const isKeyExhausted =
            err?.status === "RESOURCE_EXHAUSTED" ||
            errMsg.includes("quota") ||
            errMsg.includes("API key not valid") ||
            errMsg.includes("PERMISSION_DENIED");

          if (isKeyExhausted) {
            console.warn(
              `[AJITDEV Assistant] Key #${kIdx + 1} exhausted/blocked. Switching to fallback key...`
            );
            break; // Break inner model loop to try the next key
          }
        }
      }

      if (replyText) {
        break; // Successfully got response
      }
    }

    // If both keys or all models failed (e.g. temporary Google network outage), fallback to deterministic knowledge engine
    if (!replyText) {
      console.warn(
        "[AJITDEV Assistant] All Gemini models/keys exhausted. Activating resilient local grounding fallback.",
        lastError
      );
      replyText = getFallbackResponse(cleanMessage);
      return Response.json({
        success: true,
        reply: replyText,
        source: "local-grounding-fallback",
      });
    }

    return Response.json({
      success: true,
      reply: replyText,
      model: usedModel,
      keyIndex: usedKeyIndex,
    });
  } catch (error: any) {
    console.error("[AJITDEV Assistant Global Error]:", error);

    return Response.json(
      {
        success: false,
        error: "AI assistant is temporarily unavailable. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}
