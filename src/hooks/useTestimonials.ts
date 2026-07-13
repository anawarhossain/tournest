"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/types";
import type { Testimonial } from "@/app/api/reviews/testimonials/route";

async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await fetch("/api/reviews/testimonials");
  const json: ApiResponse<Testimonial[]> = await res.json();

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to load testimonials.");
  }

  return json.data;
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });
}
