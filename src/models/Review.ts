// src/models/Review.ts

import { Schema, model, models, type Document, type Types } from "mongoose";

export interface IReviewDocument extends Document {
  packageId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true, trim: true }, // denormalized for fast render
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// One review per user per package
ReviewSchema.index({ packageId: 1, userId: 1 }, { unique: true });

export const Review = models.Review || model<IReviewDocument>("Review", ReviewSchema);
