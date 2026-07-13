"use client";

import { useQuery } from "@tanstack/react-query";
import PackageCard from "./PackageCard";
import type { ApiResponse, IPackage, PaginatedPackages, PackageCategory } from "@/types";

interface RelatedPackagesProps {
  category: PackageCategory;
  excludeId: string;
}

async function fetchRelated(category: PackageCategory): Promise<IPackage[]> {
  const params = new URLSearchParams({ category, limit: "5", sort: "rating" });
  const res = await fetch(`/api/packages?${params.toString()}`);
  const json: ApiResponse<PaginatedPackages> = await res.json();

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to load related packages.");
  }

  return json.data.packages;
}

export default function RelatedPackages({ category, excludeId }: RelatedPackagesProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["packages", "related", category, excludeId],
    queryFn: () => fetchRelated(category),
  });

  const related = (data ?? []).filter((p) => p._id !== excludeId).slice(0, 4);

  if (isLoading || related.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="text-xl font-bold text-neutral-900 mb-5">Related Packages</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((pkg) => (
          <PackageCard key={pkg._id} pkg={pkg} />
        ))}
      </div>
    </section>
  );
}
