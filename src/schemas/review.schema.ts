// src/schemas/review.schema.ts
// Used by: ReviewForm.tsx (react-hook-form resolver) AND app/api/reviews/[packageId] route.

import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.coerce
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  comment: z
    .string()
    .trim()
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment must be under 1000 characters"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
