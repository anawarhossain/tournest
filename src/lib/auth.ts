import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { mongoClient, mongoDb } from "./mongo-client";

export const auth = betterAuth({
  database: mongodbAdapter(mongoDb, {
    client: mongoClient,
    // usePlural -> "user" becomes "users", matching the collection name in the requirements doc.
    usePlural: true,
  }),

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    // Requirements: email verification is out of scope for this phase.
    requireEmailVerification: false,
    minPasswordLength: 8,
  },

  // Single "User" role app — no admin plugin, no extra roles.
  user: {
    additionalFields: {},
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once per day of activity
  },

  // Must be last — lets better-auth set cookies correctly from Next.js Server Actions/Route Handlers.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
