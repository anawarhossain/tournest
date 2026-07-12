// src/models/Booking.ts

import { Schema, model, models, type Document, type Types } from "mongoose";

export type BookingStatus = "pending" | "paid" | "failed";

export interface IBookingDocument extends Document {
  packageId: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  stripePaymentId: string;
  status: BookingStatus;
  createdAt: Date;
}

const BookingSchema = new Schema<IBookingDocument>(
  {
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    stripePaymentId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Powers GET /api/bookings/me and "Bookings per package" chart on /items/manage
BookingSchema.index({ userId: 1, createdAt: -1 });

export const Booking = models.Booking || model<IBookingDocument>("Booking", BookingSchema);
