import Link from "next/link";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import { formatBDT } from "@/lib/utils";
import type { IPackage } from "@/types";

interface PackageCardProps {
  pkg: IPackage;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="aspect-4/3 bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary URL, next/image adds no value here */}
        <img src={pkg.images[0]} alt={pkg.title} className="h-full w-full object-cover" />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-teal">{pkg.category}</span>
        <h3 className="mt-1 font-semibold text-neutral-900 line-clamp-1">{pkg.title}</h3>
        <p className="mt-1 text-sm text-neutral-500 line-clamp-2 flex-1">{pkg.shortDescription}</p>

        <div className="mt-3 flex items-center justify-between text-sm text-neutral-500">
          <span className="flex items-center gap-1">
            <FaLocationDot size={12} className="text-neutral-400" />
            {pkg.location}
          </span>
          <span className="flex items-center gap-1">
            <FaStar size={12} className="text-yellow-400" />
            {pkg.averageRating.toFixed(1)}
            <span className="text-neutral-400">({pkg.totalReviews})</span>
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-neutral-900">{formatBDT(pkg.price)}</span>
          <Link
            href={`/packages/${pkg._id}`}
            className="rounded-lg bg-teal px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
