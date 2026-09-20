import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { markPaymentSuccess, markPaymentFailed } from "@/lib/paymentDb";

export const dynamic = "force-dynamic";

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
    const keySecret = cleanEnv(process.env.RAZORPAY_KEY_SECRET);

    if (!keySecret) {
      console.error("Razorpay Error: RAZORPAY_KEY_SECRET is not configured on server.");
      return NextResponse.json(
        {
          success: false,
          message: "Payment gateway configuration error. Please contact support.",
        },
        { status: 500 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Validate parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing payment verification parameters (order ID, payment ID, or signature).",
        },
        { status: 400 }
      );
    }

    // Verify signature using HMAC SHA256
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Timing-safe signature comparison
    const isAuthentic =
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "utf-8"),
        Buffer.from(razorpay_signature, "utf-8")
      );

    if (!isAuthentic) {
      console.warn(
        `Invalid payment signature for order: ${razorpay_order_id}, payment: ${razorpay_payment_id}`
      );

      // Record failure in database
      await markPaymentFailed({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        errorMessage: "Signature mismatch during verification",
      });

      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed. The payment signature is invalid.",
        },
        { status: 400 }
      );
    }

    // Mark as verified & successful in MongoDB Atlas
    await markPaymentSuccess({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error while verifying payment.";
    console.error("Payment verification server error:", message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while verifying payment.",
      },
      { status: 500 }
    );
  }
}
