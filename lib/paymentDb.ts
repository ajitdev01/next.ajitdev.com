import { MongoClient, ObjectId } from "mongodb";

export interface PaymentRecord {
  _id?: ObjectId | string;
  orderId: string;
  paymentId?: string;
  signature?: string;
  amount: number;
  amountInPaise: number;
  currency: string;
  status: "created" | "success" | "failed";
  customer?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  verifiedAt?: Date;
  errorMessage?: string;
}

async function getMongoClient(): Promise<MongoClient> {
  const mod = (await import("@/lib/mongodb")) as { default: Promise<MongoClient> };
  return mod.default;
}

/**
 * Record initial payment order creation in MongoDB Atlas
 */
export async function savePaymentOrder(data: {
  orderId: string;
  amount: number;
  amountInPaise: number;
  currency?: string;
  customer?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, unknown>;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.DATABASE_MONGODB_URI) {
      console.warn("DATABASE_MONGODB_URI not configured, skipping MongoDB payment order persistence");
      return { success: true };
    }

    const client = await getMongoClient();
    const db = client.db("ajitdev");
    const collection = db.collection<PaymentRecord>("payments");

    const now = new Date();
    await collection.insertOne({
      orderId: data.orderId,
      amount: data.amount,
      amountInPaise: data.amountInPaise,
      currency: data.currency || "INR",
      status: "created",
      customer: data.customer || {},
      notes: data.notes || {},
      createdAt: now,
      updatedAt: now,
    });

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Database insert error";
    console.error("Failed to record payment order in MongoDB:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Mark payment order as verified and successful
 */
export async function markPaymentSuccess(data: {
  orderId: string;
  paymentId: string;
  signature: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.DATABASE_MONGODB_URI) {
      return { success: true };
    }

    const client = await getMongoClient();
    const db = client.db("ajitdev");
    const collection = db.collection<PaymentRecord>("payments");

    const now = new Date();
    const result = await collection.updateOne(
      { orderId: data.orderId },
      {
        $set: {
          paymentId: data.paymentId,
          signature: data.signature,
          status: "success",
          verifiedAt: now,
          updatedAt: now,
        },
      },
      { upsert: false }
    );

    // If for any reason the order record was not previously saved, upsert it
    if (result.matchedCount === 0) {
      await collection.insertOne({
        orderId: data.orderId,
        paymentId: data.paymentId,
        signature: data.signature,
        amount: 0,
        amountInPaise: 0,
        status: "success",
        currency: "INR",
        createdAt: now,
        verifiedAt: now,
        updatedAt: now,
      });
    }

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Database update error";
    console.error("Failed to update payment status in MongoDB:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Mark payment as failed upon invalid verification or checkout failure
 */
export async function markPaymentFailed(data: {
  orderId: string;
  paymentId?: string;
  errorMessage?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.DATABASE_MONGODB_URI) {
      return { success: true };
    }

    const client = await getMongoClient();
    const db = client.db("ajitdev");
    const collection = db.collection<PaymentRecord>("payments");

    const now = new Date();
    await collection.updateOne(
      { orderId: data.orderId },
      {
        $set: {
          paymentId: data.paymentId,
          status: "failed",
          errorMessage: data.errorMessage || "Verification failed",
          updatedAt: now,
        },
      }
    );

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Database error";
    console.error("Failed to mark payment as failed in MongoDB:", errorMsg);
    return { success: false, error: errorMsg };
  }
}
