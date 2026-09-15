import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Rate limiting: simple in-memory store (per-IP, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function getRealIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function esc(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: NextRequest) {
  try {
    // ── Rate limit ────────────────────────────────────────────
    const ip = getRealIP(req);
    const now = Date.now();
    const rl = rateLimitMap.get(ip);
    if (rl) {
      if (now < rl.resetAt) {
        if (rl.count >= RATE_LIMIT) {
          return NextResponse.json(
            { success: false, message: "Too many requests. Please try again later." },
            { status: 429 }
          );
        }
        rl.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    }

    // ── Validate ──────────────────────────────────────────────
    const body = await req.json();
    const { name, email, subject, message } = body as {
      name: string; email: string; subject: string; message: string;
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, message: "Name, email, and message are required." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    if (message.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    // ── Transporter ───────────────────────────────────────────
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });

    const submittedAt = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    // ════════════════════════════════════════════════════════════
    // EMAIL 1 — Owner notification (dark header, clean fields)
    // ════════════════════════════════════════════════════════════
    const ownerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>New Contact Message</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f1f5f9;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:580px;">

      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);border-radius:16px 16px 0 0;padding:32px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <div style="display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:999px;padding:5px 14px;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px;">
                ● &nbsp;AJITDEV · Contact Form
              </div>
              <div style="font-size:24px;font-weight:800;color:#ffffff;line-height:1.3;margin-bottom:6px;">
                📬 New message from ${esc(name)}
              </div>
              <div style="font-size:14px;color:#94a3b8;">
                Submitted via <a href="https://next.ajitdev.com/contact" style="color:#60a5fa;text-decoration:none;">next.ajitdev.com/contact</a>
              </div>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Body -->
      <tr><td style="background:#ffffff;padding:32px 36px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">

        <!-- Fields grid -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td width="50%" style="padding-right:8px;padding-bottom:16px;vertical-align:top;">
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;margin-bottom:5px;">From</div>
              <div style="font-size:15px;font-weight:700;color:#0f172a;">${esc(name)}</div>
            </td>
            <td width="50%" style="padding-left:8px;padding-bottom:16px;vertical-align:top;">
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;margin-bottom:5px;">Email</div>
              <div style="font-size:14px;font-weight:600;"><a href="mailto:${esc(email)}" style="color:#3b82f6;text-decoration:none;">${esc(email)}</a></div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-bottom:4px;">
              <div style="height:1px;background:#f1f5f9;margin-bottom:16px;"></div>
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;margin-bottom:5px;">Subject</div>
              <div style="font-size:14px;font-weight:600;color:#1e293b;">${esc(subject || "— No subject —")}</div>
            </td>
          </tr>
        </table>

        <!-- Message -->
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;margin-bottom:10px;">Message</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px 22px;border-left:3px solid #3b82f6;">
            <div style="font-size:14px;line-height:1.75;color:#334155;white-space:pre-wrap;">${esc(message)}</div>
          </td></tr>
        </table>

        <!-- Reply button -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
          <tr>
            <td>
              <a href="mailto:${esc(email)}?subject=Re%3A%20${encodeURIComponent(subject || "Your message")}"
                style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:10px;font-size:14px;font-weight:700;letter-spacing:0.01em;">
                ↩ &nbsp;Reply to ${esc(name)}
              </a>
            </td>
          </tr>
        </table>

      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:20px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:12px;color:#94a3b8;">
              Received on <strong style="color:#64748b;">${submittedAt} IST</strong>
            </td>
            <td align="right" style="font-size:12px;color:#94a3b8;">
              <a href="https://next.ajitdev.com" style="color:#3b82f6;text-decoration:none;font-weight:600;">AJITDEV</a>
            </td>
          </tr>
        </table>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

    // ════════════════════════════════════════════════════════════
    // EMAIL 2 — Sender confirmation (warm, branded)
    // ════════════════════════════════════════════════════════════
    const senderHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Thanks for reaching out!</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f1f5f9;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:580px;">

      <!-- Hero Header -->
      <tr><td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%);border-radius:16px 16px 0 0;padding:40px 36px;text-align:center;">
        <!-- Avatar -->
        <table align="center" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
          <tr><td style="background:linear-gradient(135deg,#334155,#1e293b);width:64px;height:64px;border-radius:16px;text-align:center;vertical-align:middle;border:2px solid rgba(255,255,255,0.12);">
            <span style="font-size:30px;font-weight:900;color:#ffffff;line-height:64px;">A</span>
          </td></tr>
        </table>
        <div style="font-size:28px;font-weight:800;color:#ffffff;margin-bottom:8px;">
          Thanks, ${esc(name)}! 🎉
        </div>
        <div style="font-size:15px;color:#94a3b8;line-height:1.6;max-width:400px;margin:0 auto;">
          Your message reached me — I&apos;ll reply personally within 24 hours.
        </div>
      </td></tr>

      <!-- Confirmation banner -->
      <tr><td style="background:#dcfce7;border-left:1px solid #bbf7d0;border-right:1px solid #bbf7d0;padding:16px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="24" style="vertical-align:middle;padding-right:12px;">
              <div style="width:24px;height:24px;background:#22c55e;border-radius:50%;text-align:center;line-height:24px;font-size:13px;color:#fff;font-weight:700;">✓</div>
            </td>
            <td style="vertical-align:middle;">
              <div style="font-size:13px;font-weight:700;color:#166534;">Message delivered to Ajit Dev&apos;s inbox</div>
              <div style="font-size:12px;color:#15803d;margin-top:2px;">Expect a reply at <strong>${esc(email)}</strong></div>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Body -->
      <tr><td style="background:#ffffff;padding:32px 36px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">

        <!-- What happens next -->
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;margin-bottom:16px;">What happens next</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          ${[
            ["📥", "Message received", "Your message is in my inbox right now."],
            ["⚡", "Reviewed personally", "I read every message — no bots, no templates."],
            ["✉️", "Reply incoming", "You'll hear back within 24h, usually much faster."],
          ].map(([icon, title, desc]) => `
          <tr>
            <td width="40" style="vertical-align:top;padding-bottom:14px;">
              <div style="width:32px;height:32px;background:#f1f5f9;border-radius:8px;text-align:center;line-height:32px;font-size:16px;">${icon}</div>
            </td>
            <td style="vertical-align:top;padding-left:12px;padding-bottom:14px;">
              <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:2px;">${title}</div>
              <div style="font-size:12px;color:#64748b;line-height:1.5;">${desc}</div>
            </td>
          </tr>`).join("")}
        </table>

        <!-- Message preview -->
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;margin-bottom:10px;">Your message</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr><td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;border-left:3px solid #e2e8f0;">
            <div style="font-size:13px;line-height:1.7;color:#64748b;white-space:pre-wrap;font-style:italic;">&ldquo;${esc(message)}&rdquo;</div>
          </td></tr>
        </table>

        <!-- CTA buttons -->
        <div style="height:1px;background:#f1f5f9;margin-bottom:24px;"></div>
        <div style="font-size:13px;color:#64748b;margin-bottom:16px;">While you wait, explore what I&apos;ve built:</div>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right:10px;">
              <a href="https://next.ajitdev.com/projects"
                style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:11px 22px;border-radius:10px;font-size:13px;font-weight:700;">
                View Projects
              </a>
            </td>
            <td>
              <a href="https://api.ajitdev.com/"
                style="display:inline-block;background:#ffffff;color:#0f172a;text-decoration:none;padding:11px 22px;border-radius:10px;font-size:13px;font-weight:700;border:1px solid #e2e8f0;">
                Free APIs
              </a>
            </td>
          </tr>
        </table>

      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:20px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:12px;color:#94a3b8;line-height:1.6;">
              This is an automated confirmation — please do not reply.<br/>
              Sent by <strong style="color:#64748b;">Ajit Dev</strong> ·
              <a href="https://next.ajitdev.com" style="color:#3b82f6;text-decoration:none;">next.ajitdev.com</a>
            </td>
          </tr>
        </table>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

    // ── Send both ─────────────────────────────────────────────
    await Promise.all([
      transporter.sendMail({
        from: `"AJITDEV Contact" <${process.env.GMAIL_USER}>`,
        to: process.env.CONTACT_RECEIVER_EMAIL,
        replyTo: email,
        subject: `📬 New Contact: ${subject || name} — ajitdev.com`,
        html: ownerHtml,
      }),
      transporter.sendMail({
        from: `"Ajit Dev" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Thanks for reaching out, ${name}! 🎉`,
        html: senderHtml,
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Message sent! Check your inbox for a confirmation email.",
    });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
