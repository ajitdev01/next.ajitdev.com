import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getAllPayments } from "@/lib/paymentDb";

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

export interface PaymentItem {
  id: string;
  orderId?: string;
  amount: number;
  currency: string;
  status: "success" | "created" | "failed" | "captured" | "authorized" | "refunded";
  method?: string;
  vpa?: string;
  cardLast4?: string;
  cardNetwork?: string;
  email?: string;
  contact?: string;
  notes?: Record<string, unknown>;
  createdAt: string;
  source: "mongodb" | "razorpay" | "both";
}

export async function GET() {
  try {
    const keyId = cleanEnv(process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
    const keySecret = cleanEnv(process.env.RAZORPAY_KEY_SECRET);

    console.log(
      `[Razorpay List Diagnostics] RAZORPAY_KEY_ID exists: ${Boolean(keyId)}, RAZORPAY_KEY_SECRET exists: ${Boolean(keySecret)}`
    );

    // 1. Fetch from MongoDB
    const dbPayments = await getAllPayments(50);

    // 2. Fetch directly from Razorpay API if credentials exist
    let razorpayPayments: Array<{
      id: string;
      order_id?: string;
      amount: number;
      currency?: string;
      status?: string;
      method?: string;
      vpa?: string;
      card?: { last4?: string; network?: string };
      email?: string;
      contact?: string;
      notes?: Record<string, unknown>;
      created_at: number;
    }> = [];

    if (keyId && keySecret) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });
        const res = (await razorpay.payments.all({ count: 50 })) as {
          items?: Array<{
            id: string;
            order_id?: string;
            amount: number;
            currency?: string;
            status?: string;
            method?: string;
            vpa?: string;
            card?: { last4?: string; network?: string };
            email?: string;
            contact?: string;
            notes?: Record<string, unknown>;
            created_at: number;
          }>;
        };
        razorpayPayments = res.items || [];
      } catch (err: unknown) {
        console.warn("Could not fetch payments list from Razorpay API:", err);
      }
    }

    // 3. Merge & Deduplicate by payment ID or order ID
    const mergedMap = new Map<string, PaymentItem>();

    // First populate from Razorpay API
    for (const rzp of razorpayPayments) {
      const amountInINR = rzp.amount ? rzp.amount / 100 : 0;
      const statusNormalized =
        rzp.status === "captured" || rzp.status === "authorized"
          ? "success"
          : rzp.status === "failed"
          ? "failed"
          : "created";

      mergedMap.set(rzp.id, {
        id: rzp.id,
        orderId: rzp.order_id,
        amount: amountInINR,
        currency: rzp.currency || "INR",
        status: statusNormalized,
        method: rzp.method,
        vpa: rzp.vpa,
        cardLast4: rzp.card?.last4,
        cardNetwork: rzp.card?.network,
        email: rzp.email,
        contact: rzp.contact,
        notes: rzp.notes,
        createdAt: new Date(rzp.created_at * 1000).toISOString(),
        source: "razorpay",
      });
    }

    // Merge in MongoDB records (providing extra metadata like custom notes, payer details)
    for (const db of dbPayments) {
      const existingKey = db.paymentId || db.orderId;
      if (existingKey && mergedMap.has(existingKey)) {
        const existing = mergedMap.get(existingKey)!;
        existing.source = "both";
        if (db.customer?.name && !existing.notes?.customerName) {
          existing.notes = { ...existing.notes, customerName: db.customer.name };
        }
      } else {
        const uniqueKey = db.paymentId || db.orderId;
        mergedMap.set(uniqueKey, {
          id: db.paymentId || db.orderId,
          orderId: db.orderId,
          amount: db.amount,
          currency: db.currency || "INR",
          status: db.status,
          email: db.customer?.email,
          contact: db.customer?.contact,
          notes: {
            ...db.notes,
            customerName: db.customer?.name,
          },
          createdAt: db.createdAt ? new Date(db.createdAt).toISOString() : new Date().toISOString(),
          source: "mongodb",
        });
      }
    }

    const paymentsList = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      count: paymentsList.length,
      payments: paymentsList,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load payments";
    console.error("GET /api/payment/list error:", msg);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve payments history.",
      },
      { status: 500 }
    );
  }
}
