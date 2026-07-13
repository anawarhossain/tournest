"use client";

import { FaStar } from "react-icons/fa6";
import type { IReview } from "@/types";

interface ReviewListProps {
  reviews: IReview[];
  isLoading: boolean;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function ReviewList({ reviews, isLoading }: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-neutral-200 p-4">
            <div className="h-4 w-32 rounded bg-neutral-200 mb-2" />
            <div className="h-3 w-full rounded bg-neutral-200" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return <p className="text-sm text-neutral-500">No reviews yet — be the first to share your experience.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-neutral-800 text-sm">{review.userName}</span>
            <span className="text-xs text-neutral-400">{formatDate(review.createdAt)}</span>
          </div>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={12}
                className={star <= review.rating ? "text-yellow-400" : "text-neutral-200"}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-neutral-600">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
