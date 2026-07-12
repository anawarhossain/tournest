import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import PackageCard from "./PackageCard";
import type { IPackage } from "@/types";

interface PackageGridProps {
  packages: IPackage[] | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

export default function PackageGrid({ packages, isLoading, isError, errorMessage }: PackageGridProps) {
  if (isError) {
    return (
      <EmptyState
        title="Couldn't load packages"
        description={errorMessage ?? "Something went wrong. Please try again."}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!packages || packages.length === 0) {
    return (
      <EmptyState
        title="No packages found"
        description="Try adjusting your search or filters to find what you're looking for."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {packages.map((pkg) => (
        <PackageCard key={pkg._id} pkg={pkg} />
      ))}
    </div>
  );
}
