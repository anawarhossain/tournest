"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { usePackages } from "@/hooks/usePackages";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import PackageGrid from "@/components/packages/PackageGrid";
import PackageFilters, { type PackageFiltersValue } from "@/components/packages/PackageFilters";
import Pagination from "@/components/ui/Pagination";
import type { PackageCategory, PackageQueryParams } from "@/types";

const PAGE_SIZE = 12;

export default function PackagesExploreClient() {
  return (
    <Suspense fallback={null}>
      <ExplorePackagesContent />
    </Suspense>
  );
}

function ExplorePackagesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [filters, setFilters] = useState<PackageFiltersValue>({
    category: searchParams.get("category") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    location: searchParams.get("location") ?? "",
  });

  const sort = searchParams.get("sort") ?? "newest";
  const page = Number(searchParams.get("page") ?? "1");

  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const debouncedFilters = useDebouncedValue(filters, 400);

  // Push debounced search/filter values into the URL (single source of truth for the query).
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch) params.set("search", debouncedSearch);
    else params.delete("search");

    if (debouncedFilters.category) params.set("category", debouncedFilters.category);
    else params.delete("category");

    if (debouncedFilters.location) params.set("location", debouncedFilters.location);
    else params.delete("location");

    if (debouncedFilters.minPrice) params.set("minPrice", debouncedFilters.minPrice);
    else params.delete("minPrice");

    if (debouncedFilters.maxPrice) params.set("maxPrice", debouncedFilters.maxPrice);
    else params.delete("maxPrice");

    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, debouncedFilters]);

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  }

  const queryParams: PackageQueryParams = {
    search: searchParams.get("search") ?? undefined,
    category: (searchParams.get("category") as PackageCategory | null) ?? undefined,
    location: searchParams.get("location") ?? undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    sort: sort as PackageQueryParams["sort"],
    page,
    limit: PAGE_SIZE,
  };

  const { data, isLoading, isError, error } = usePackages(queryParams);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Explore Packages</h1>
        <p className="text-neutral-500 text-sm mt-1">
          {data ? `${data.total} tour package${data.total === 1 ? "" : "s"} found` : "Find your next trip"}
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-5">
        <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title or location…"
          className="w-full rounded-xl border border-neutral-300 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30"
        />
      </div>

      {/* Filters + Sort */}
      <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-8">
        <div className="flex-1">
          <PackageFilters value={filters} onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))} />
        </div>
        <div className="lg:w-48">
          <label className="block text-xs font-medium text-neutral-500 mb-1">Sort by</label>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <PackageGrid
        packages={data?.packages}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
      />

      {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={handlePageChange} />}
    </div>
  );
}
