// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Booking } from "@/models/Booking";
import stripe from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret." }, { status: 400 });
  }

  // Stripe signature verification requires the exact raw request body.
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const { packageId, userId, bdtAmount } = checkoutSession.metadata ?? {};

    if (!packageId || !userId || !bdtAmount) {
      console.error("Stripe webhook: missing metadata on checkout session", checkoutSession.id);
      return NextResponse.json({ received: true });
    }

    const stripePaymentId =
      (typeof checkoutSession.payment_intent === "string" ? checkoutSession.payment_intent : null) ??
      checkoutSession.id;

    try {
      await connectDB();
      await Booking.create({
        packageId,
        userId,
        amount: Number(bdtAmount),
        stripePaymentId,
        status: "paid",
      });
    } catch (err) {
      // Duplicate key on stripePaymentId = Stripe retried this webhook — already recorded, ignore.
      if (err instanceof Error && "code" in err && (err as { code?: number }).code === 11000) {
        return NextResponse.json({ received: true });
      }
      console.error("Stripe webhook: failed to create booking:", err);
      return NextResponse.json({ error: "Failed to record booking." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
