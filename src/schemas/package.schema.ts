// src/schemas/package.schema.ts
// Used by: PackageForm.tsx (react-hook-form resolver) AND app/api/packages route handlers.

import { z } from "zod";

export const specificationsSchema = z.object({
  included: z.array(z.string().trim().min(1)).default([]),
  excluded: z.array(z.string().trim().min(1)).default([]),
  itinerary: z.array(z.string().trim().min(1)).default([]),
});

export const packageCategoryEnum = z.enum(["Beach", "Hill", "Adventure", "Cultural"]);

export const packageSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(120),
  shortDescription: z.string().trim().min(10, "Short description must be at least 10 characters").max(200),
  fullDescription: z.string().trim().min(30, "Full description must be at least 30 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  location: z.string().trim().min(2, "Location is required"),
  departureDate: z.coerce.date().refine((d) => d > new Date(), {
    message: "Departure date must be in the future",
  }),
  duration: z.string().trim().min(2, "Duration is required"), // e.g. "3 Days 2 Nights"
  category: packageCategoryEnum,
  images: z.array(z.string().url("Each image must be a valid URL")).min(1, "At least one image is required"),
  specifications: specificationsSchema,
});

// PATCH allows partial updates
export const packageUpdateSchema = packageSchema.partial();

// Query params for GET /api/packages (?search=&category=&minPrice=&maxPrice=&location=&sort=&page=)
export const packageQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: packageCategoryEnum.optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  location: z.string().trim().optional(),
  sort: z.enum(["price_asc", "price_desc", "newest", "rating"]).default("newest"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(48).default(12),
});

export type PackageInput = z.infer<typeof packageSchema>;
export type PackageUpdateInput = z.infer<typeof packageUpdateSchema>;
export type PackageQueryInput = z.infer<typeof packageQuerySchema>;
