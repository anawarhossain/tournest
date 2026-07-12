"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/types";
import type { MyPackageRow } from "@/app/api/packages/mine/route";

async function fetchMyPackages(): Promise<MyPackageRow[]> {
  const res = await fetch("/api/packages/mine");
  const json: ApiResponse<MyPackageRow[]> = await res.json();

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to load your packages.");
  }

  return json.data;
}

export function useMyPackages() {
  return useQuery({
    queryKey: ["packages", "mine"],
    queryFn: fetchMyPackages,
  });
}
