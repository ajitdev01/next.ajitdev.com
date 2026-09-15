// @ts-ignore
import clientPromise from "@/lib/mongodb";

export interface UserRecord {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  googleId?: string | null;
  provider: "google";
  lastLoginAt: Date;
  createdAt: Date;
}

/**
 * Persist or update Google OAuth authenticated user in MongoDB Atlas
 */
export async function syncUserWithAtlas(user: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string | null;
}): Promise<{ success: boolean; user?: any; error?: string }> {
  if (!user.email) {
    return { success: false, error: "Email is required" };
  }

  try {
    if (!process.env.DATABASE_MONGODB_URI) {
      console.warn("DATABASE_MONGODB_URI is not set, skipping Atlas persistence");
      return {
        success: true,
        user: {
          ...user,
          provider: "google",
          lastLoginAt: new Date(),
          createdAt: new Date(),
          storedIn: "memory-fallback",
        },
      };
    }

    const client: any = await (clientPromise as any);
    const db = client.db("ajitdev");
    const usersCollection = db.collection("users");

    const now = new Date();
    const result = await usersCollection.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          name: user.name,
          image: user.image,
          googleId: user.id,
          lastLoginAt: now,
          updatedAt: now,
        },
        $setOnInsert: {
          email: user.email,
          createdAt: now,
          provider: "google",
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    return {
      success: true,
      user: result ? JSON.parse(JSON.stringify(result)) : user,
    };
  } catch (error: any) {
    console.error("Failed to sync user with MongoDB Atlas:", error?.message || error);
    return {
      success: false,
      error: error?.message || "Failed to persist to MongoDB Atlas",
      user: {
        ...user,
        provider: "google",
        lastLoginAt: new Date(),
      },
    };
  }
}
