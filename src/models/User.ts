// src/models/User.ts
// Note: better-auth owns the actual auth flow (registration, password hashing, sessions).
// This model mirrors the `users` collection shape so we can populate/reference it
// (e.g. Package.ownerId -> User) from our own Mongoose queries.

import { Schema, model, models, type Document } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash?: string; // managed by better-auth — not written to directly from our code
  image?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false }, // never returned by default queries
    image: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Prevent model overwrite errors in Next.js dev (hot reload re-imports this file)
export const User = models.User || model<IUserDocument>("User", UserSchema);
