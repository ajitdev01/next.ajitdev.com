import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { savePaymentOrder } from "@/lib/paymentDb";

export const dynamic = "force-dynamic";

// Enforce reasonable boundaries for custom amounts
const MIN_AMOUNT_INR = 1;
const MAX_AMOUNT_INR = 500000;

function cleanEnv(val?: string): string {
  if (!val) return "";
  let clean = val.trim();
  if (
    (clean.startsWith('"') && clean.endsWith('"')) ||
    (clean.startsWith("'") && clean.endsWith("'"))
  ) {
    clean = clean.slice(1, -1).trim();
  }
  return clean;
}

export async function POST(req: NextRequest) {
  try {
    const keyId = cleanEnv(process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
    const keySecret = cleanEnv(process.env.RAZORPAY_KEY_SECRET);

    console.log(
      `[Razorpay Server Diagnostics] RAZORPAY_KEY_ID exists: ${Boolean(keyId)}, RAZORPAY_KEY_SECRET exists: ${Boolean(keySecret)}`
    );

    // 1. Verify Razorpay credentials exist on the server
    if (!keyId || !keySecret) {
      console.error(
        `Razorpay Error: Missing credentials. KEY_ID: ${Boolean(keyId)}, KEY_SECRET: ${Boolean(keySecret)}`
      );
      return NextResponse.json(
        {
          success: false,
          message: "Payment gateway is currently not configured. Please configure environment variables in Vercel.",
        },
        { status: 500 }
      );
    }

    // 2. Parse & Validate request body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { amount, customer, notes } = body;
    const parsedAmount = Number(amount);

    // 3. Strict server-side amount validation
    if (typeof amount === "undefined" || amount === null || isNaN(parsedAmount)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid payment amount." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount < MIN_AMOUNT_INR) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum payment amount is ₹${MIN_AMOUNT_INR}.`,
        },
        { status: 400 }
      );
    }

    if (parsedAmount > MAX_AMOUNT_INR) {
      return NextResponse.json(
        {
          success: false,
          message: `Maximum payment amount is ₹${MAX_AMOUNT_INR.toLocaleString("en-IN")}.`,
        },
        { status: 400 }
      );
    }

    // 4. Convert INR to paise (1 INR = 100 paise)
    const amountInPaise = Math.round(parsedAmount * 100);

    // 5. Initialize Razorpay client with server credentials
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const receiptId = `rcpt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    // 6. Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: receiptId,
      notes: {
        source: "payments/self",
        ...(notes && typeof notes === "object" ? notes : {}),
      },
    });

    // 7. Persist order in MongoDB Atlas (if configured)
    await savePaymentOrder({
      orderId: order.id,
      amount: parsedAmount,
      amountInPaise,
      currency: "INR",
      customer: customer || {},
      notes: order.notes,
    });

    // 8. Return response (keyId is safe to share with client for checkout modal)
    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency || "INR",
      keyId: keyId,
    });
  } catch (error: unknown) {
    const errorObj = error as { message?: string; error?: { description?: string } } | undefined;
    const message =
      errorObj?.error?.description ||
      errorObj?.message ||
      "Failed to initialize payment order. Please try again.";
    console.error("Razorpay order creation error:", message);
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
