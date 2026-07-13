// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";
import { contactSchema } from "@/schemas/contact.schema";
import { zodErrorMessage } from "@/lib/utils";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: zodErrorMessage(parsed.error) },
        { status: 400 }
      );
    }

    await connectDB();
    await ContactMessage.create(parsed.data);

    return NextResponse.json<ApiResponse<null>>(
      { success: true, message: "Thanks for reaching out! We'll get back to you soon." },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to send your message. Please try again." },
      { status: 500 }
    );
  }
}
