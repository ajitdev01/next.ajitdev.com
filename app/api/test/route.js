import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    const result = await client
      .db("admin")
      .command({ ping: 1 });

    return Response.json({
      success: true,
      message: "MongoDB connected successfully",
      result,
    });
  } catch (error) {
    console.error("MongoDB Error:", error);

    return Response.json(
      {
        success: false,
        message: "MongoDB connection failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}