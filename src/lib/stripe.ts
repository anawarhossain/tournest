// src/lib/stripe.ts
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable. Add it to .env.local");
}

// No apiVersion pinned — uses the version configured on the Stripe account/dashboard.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;
