"use client";

import { useMutation } from "@tanstack/react-query";
import type { ApiResponse } from "@/types";

async function startCheckout(packageId: string): Promise<string> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ packageId }),
  });
  const json: ApiResponse<{ url: string }> = await res.json();

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to start checkout.");
  }

  return json.data.url;
}

export function useCheckout() {
  return useMutation({
    mutationFn: startCheckout,
    onSuccess: (url) => {
      window.location.href = url;
    },
  });
}
