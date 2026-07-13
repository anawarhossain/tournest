"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, IReview } from "@/types";
import type { ReviewInput } from "@/schemas/review.schema";

async function fetchReviews(packageId: string): Promise<IReview[]> {
  const res = await fetch(`/api/reviews/${packageId}`);
  const json: ApiResponse<IReview[]> = await res.json();

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to load reviews.");
  }

  return json.data;
}

export function useReviews(packageId: string) {
  return useQuery({
    queryKey: ["reviews", packageId],
    queryFn: () => fetchReviews(packageId),
    enabled: !!packageId,
  });
}

async function submitReview(packageId: string, input: ReviewInput): Promise<IReview> {
  const res = await fetch(`/api/reviews/${packageId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json: ApiResponse<IReview> = await res.json();

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to submit review.");
  }

  return json.data;
}

export function useCreateReview(packageId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReviewInput) => submitReview(packageId, input),
    onSuccess: () => {
      // New review changes both the review list and the package's averageRating/totalReviews.
      queryClient.invalidateQueries({ queryKey: ["reviews", packageId] });
      queryClient.invalidateQueries({ queryKey: ["packages", "detail", packageId] });
    },
  });
}
