"use client";

import { packageCategoryEnum } from "@/schemas/package.schema";

const CATEGORIES = packageCategoryEnum.options;

export interface PackageFiltersValue {
  category: string;
  minPrice: string;
  maxPrice: string;
  location: string;
}

interface PackageFiltersProps {
  value: PackageFiltersValue;
  onChange: (patch: Partial<PackageFiltersValue>) => void;
}

export default function PackageFilters({ value, onChange }: PackageFiltersProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Category</label>
        <select
          value={value.category}
          onChange={(e) => onChange({ category: e.target.value })}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Location</label>
        <input
          type="text"
          value={value.location}
          onChange={(e) => onChange({ location: e.target.value })}
          placeholder="e.g. Sylhet"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Min Price (৳)</label>
        <input
          type="number"
          min={0}
          value={value.minPrice}
          onChange={(e) => onChange({ minPrice: e.target.value })}
          placeholder="0"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Max Price (৳)</label>
        <input
          type="number"
          min={0}
          value={value.maxPrice}
          onChange={(e) => onChange({ maxPrice: e.target.value })}
          placeholder="Any"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}
