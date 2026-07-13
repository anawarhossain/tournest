// src/app/api/newsletter/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Subscriber } from "@/models/Subscriber";
import { newsletterSchema } from "@/schemas/contact.schema";
import { zodErrorMessage } from "@/lib/utils";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: zodErrorMessage(parsed.error) },
        { status: 400 }
      );
    }

    await connectDB();

    try {
      await Subscriber.create({ email: parsed.data.email });
    } catch (err) {
      // Already subscribed — treat as success, no need to surface an error for this.
      if (err instanceof Error && "code" in err && (err as { code?: number }).code === 11000) {
        return NextResponse.json<ApiResponse<null>>({
          success: true,
          message: "You're already subscribed!",
        });
      }
      throw err;
    }

    return NextResponse.json<ApiResponse<null>>(
      { success: true, message: "Subscribed! Thanks for joining." },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/newsletter error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
