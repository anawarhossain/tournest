// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { Package } from "@/models/Package";
import stripe from "@/lib/stripe";
import { getServerSession } from "@/lib/get-server-session";
import { bdtToUsdCents, zodErrorMessage } from "@/lib/utils";
import type { ApiResponse } from "@/types";

const checkoutSchema = z.object({
  packageId: z.string().min(1, "packageId is required"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: zodErrorMessage(parsed.error) },
        { status: 400 }
      );
    }

    const { packageId } = parsed.data;
    if (!mongoose.isValidObjectId(packageId)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid package id." },
        { status: 400 }
      );
    }

    await connectDB();
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Package not found." },
        { status: 404 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    // Stripe/Bangladesh-issued accounts can't charge in BDT — convert to USD for the
    // actual charge, but keep the original BDT amount in metadata for our own records.
    const unitAmountUsdCents = bdtToUsdCents(pkg.price);

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: unitAmountUsdCents,
            product_data: {
              name: pkg.title,
              description: pkg.shortDescription,
              images: pkg.images.slice(0, 1),
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        packageId: pkg._id.toString(),
        userId: session.user.id,
        bdtAmount: String(pkg.price),
      },
      success_url: `${appUrl}/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/packages/${pkg._id.toString()}`,
    });

    if (!checkoutSession.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    return NextResponse.json<ApiResponse<{ url: string }>>({
      success: true,
      data: { url: checkoutSession.url },
    });
  } catch (error) {
    console.error("POST /api/checkout error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to start checkout. Please try again." },
      { status: 500 }
    );
  }
}
