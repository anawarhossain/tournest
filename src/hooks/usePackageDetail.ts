"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, IPackage } from "@/types";

async function fetchPackage(id: string): Promise<IPackage> {
  const res = await fetch(`/api/packages/${id}`);
  const json: ApiResponse<IPackage> = await res.json();

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to load this package.");
  }

  return json.data;
}

export function usePackageDetail(id: string) {
  return useQuery({
    queryKey: ["packages", "detail", id],
    queryFn: () => fetchPackage(id),
    enabled: !!id,
  });
}
