"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/types";

async function deletePackage(id: string): Promise<void> {
  const res = await fetch(`/api/packages/${id}`, { method: "DELETE" });
  const json: ApiResponse<null> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to delete package.");
  }
}

export function useDeletePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages", "mine"] });
    },
  });
}
