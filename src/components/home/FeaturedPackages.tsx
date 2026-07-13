"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import PackageCard from "@/components/packages/PackageCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import type { ApiResponse, PaginatedPackages, IPackage } from "@/types";

async function fetchFeatured(): Promise<IPackage[]> {
  const params = new URLSearchParams({ sort: "rating", limit: "8" });
  const res = await fetch(`/api/packages?${params.toString()}`);
  const json: ApiResponse<PaginatedPackages> = await res.json();

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to load featured packages.");
  }

  return json.data.packages;
}

export default function FeaturedPackages() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["packages", "featured"],
    queryFn: fetchFeatured,
  });

  if (isError) return null;
  if (!isLoading && data && data.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Featured Packages</h2>
          <p className="text-neutral-500 text-sm mt-1">Our travelers&apos; favorite tours, hand-picked for you.</p>
        </div>
        <Link href="/packages" className="hidden sm:block text-sm font-medium text-teal hover:opacity-80">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : data?.map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)}
      </div>
    </section>
  );
}
