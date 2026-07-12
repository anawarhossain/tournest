"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { ApiResponse, PaginatedPackages, PackageQueryParams } from "@/types";

async function fetchPackages(params: PackageQueryParams): Promise<PaginatedPackages> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") searchParams.set(key, String(value));
  });

  const res = await fetch(`/api/packages?${searchParams.toString()}`);
  const json: ApiResponse<PaginatedPackages> = await res.json();

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to load packages.");
  }

  return json.data;
}

export function usePackages(params: PackageQueryParams) {
  return useQuery({
    queryKey: ["packages", "list", params],
    queryFn: () => fetchPackages(params),
    // Keep showing the previous page's results while the next page loads,
    // instead of flashing back to a loading state (nicer for pagination/filtering).
    placeholderData: keepPreviousData,
  });
}
