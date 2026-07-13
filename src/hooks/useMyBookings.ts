"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/types";
import type { MyBookingRow } from "@/app/api/bookings/me/route";

async function fetchMyBookings(): Promise<MyBookingRow[]> {
  const res = await fetch("/api/bookings/me");
  const json: ApiResponse<MyBookingRow[]> = await res.json();

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to load your bookings.");
  }

  return json.data;
}

export function useMyBookings() {
  return useQuery({
    queryKey: ["bookings", "mine"],
    queryFn: fetchMyBookings,
  });
}
