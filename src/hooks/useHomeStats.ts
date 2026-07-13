"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/types";
import type { HomeStats } from "@/app/api/stats/route";

async function fetchStats(): Promise<HomeStats> {
  const res = await fetch("/api/stats");
  const json: ApiResponse<HomeStats> = await res.json();

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to load stats.");
  }

  return json.data;
}

export function useHomeStats() {
  return useQuery({
    queryKey: ["stats", "home"],
    queryFn: fetchStats,
  });
}
