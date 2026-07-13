"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaStar } from "react-icons/fa6";
import type { z } from "zod";
import { reviewSchema, type ReviewInput } from "@/schemas/review.schema";
import { useCreateReview } from "@/hooks/useReviews";

// reviewSchema uses z.coerce.number() for rating, so the raw form shape differs
// from the validated output shape (ReviewInput) — same pattern as PackageForm.
type ReviewFormInput = z.input<typeof reviewSchema>;

interface ReviewFormProps {
  packageId: string;
}

export default function ReviewForm({ packageId }: ReviewFormProps) {
  const createReview = useCreateReview(packageId);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewFormInput, unknown, ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: "" },
  });

  async function onSubmit(values: ReviewInput) {
    try {
      await createReview.mutateAsync(values);
      reset({ rating: 5, comment: "" });
      setSubmitted(true);
    } catch {
      // surfaced via createReview.isError below
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-teal/10 text-teal text-sm px-4 py-3">
        Thanks for your review! It now appears below.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
      <div>
        <label className="block text-sm font-medium mb-1 text-neutral-800">Your Rating</label>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => field.onChange(star)}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  className="p-0.5"
                >
                  <FaStar size={22} className={star <= (field.value as number) ? "text-yellow-400" : "text-neutral-200"} />
                </button>
              ))}
            </div>
          )}
        />
        {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-neutral-800">Your Review</label>
        <textarea
          {...register("comment")}
          rows={3}
          placeholder="Share your experience with this tour…"
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
        />
        {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>}
      </div>

      {createReview.isError && (
        <p className="text-red-500 text-sm">
          {createReview.error instanceof Error ? createReview.error.message : "Failed to submit review."}
        </p>
      )}

      <button
        type="submit"
        disabled={createReview.isPending}
        className="rounded-xl bg-teal px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {createReview.isPending ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
