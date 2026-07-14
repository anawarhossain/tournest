// src/app/api/checkout/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Booking } from "@/models/Booking";
import stripe from "@/lib/stripe";
import { getServerSession } from "@/lib/get-server-session";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    const sessionId = request.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Missing session_id." },
        { status: 400 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json<ApiResponse<{ status: string }>>({
        success: true,
        data: { status: checkoutSession.payment_status },
      });
    }

    const { packageId, userId, bdtAmount } = checkoutSession.metadata ?? {};

    // Only the person who started this checkout can reconcile it.
    if (!packageId || !userId || userId !== session.user.id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "This checkout session does not belong to you." },
        { status: 403 }
      );
    }

    const stripePaymentId =
      (typeof checkoutSession.payment_intent === "string" ? checkoutSession.payment_intent : null) ??
      checkoutSession.id;

    await connectDB();

    // The webhook (POST /api/webhooks/stripe) is the primary path that creates this record.
    // This is a client-triggered fallback for local dev, where Stripe can't reach
    // localhost without the Stripe CLI tunnel — so the booking might not exist yet.
    let booking = await Booking.findOne({ stripePaymentId });
    if (!booking) {
      try {
        booking = await Booking.create({
          packageId,
          userId,
          amount: Number(bdtAmount ?? 0),
          stripePaymentId,
          status: "paid",
        });
      } catch (err) {
        // Duplicate key = the webhook created it in the split second before this ran. Fetch it instead.
        if (err instanceof Error && "code" in err && (err as { code?: number }).code === 11000) {
          booking = await Booking.findOne({ stripePaymentId });
        } else {
          throw err;
        }
      }
    }

    return NextResponse.json<ApiResponse<{ status: string; bookingId: string | null }>>({
      success: true,
      data: { status: "paid", bookingId: booking?._id?.toString() ?? null },
    });
  } catch (error) {
    console.error("GET /api/checkout/verify error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to verify checkout session." },
      { status: 500 }
    );
  }
}
