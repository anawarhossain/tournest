// src/models/Package.ts

import { Schema, model, models, type Document, type Types } from "mongoose";

export type PackageCategory = "Beach" | "Hill" | "Adventure" | "Cultural";

export interface ISpecifications {
  included: string[];
  excluded: string[];
  itinerary: string[];
}

export interface IPackageDocument extends Document {
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  location: string;
  departureDate: Date;
  duration: string;
  category: PackageCategory;
  images: string[];
  specifications: ISpecifications;
  ownerId: Types.ObjectId;
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const SpecificationsSchema = new Schema<ISpecifications>(
  {
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    itinerary: { type: [String], default: [] },
  },
  { _id: false }
);

const PackageSchema = new Schema<IPackageDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    shortDescription: { type: String, required: true, trim: true, maxlength: 200 },
    fullDescription: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }, // BDT
    location: { type: String, required: true, trim: true },
    departureDate: { type: Date, required: true },
    duration: { type: String, required: true, trim: true }, // e.g. "3 Days 2 Nights"
    category: {
      type: String,
      enum: ["Beach", "Hill", "Adventure", "Cultural"],
      required: true,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => Array.isArray(arr) && arr.length >= 1,
        message: "At least one image is required",
      },
    },
    specifications: { type: SpecificationsSchema, default: () => ({}) },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Supports search + common filters/sorts used on /packages
PackageSchema.index({ title: "text", location: "text", shortDescription: "text" });
PackageSchema.index({ category: 1 });
PackageSchema.index({ price: 1 });
PackageSchema.index({ createdAt: -1 });

export const Package = models.Package || model<IPackageDocument>("Package", PackageSchema);
