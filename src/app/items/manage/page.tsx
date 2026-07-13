"use client";

import { useState } from "react";
import Link from "next/link";
import { FaEye, FaPen, FaTrash, FaStar } from "react-icons/fa6";
import { useMyPackages } from "@/hooks/useMyPackages";
import { useDeletePackage } from "@/hooks/useDeletePackage";
import ConfirmModal from "@/components/ui/ConfirmModal";
import PackagePerformanceChart from "@/components/packages/PackagePerformanceChart";
import { formatBDT } from "@/lib/utils";
import type { MyPackageRow } from "@/app/api/packages/mine/route";
import { toast } from "@heroui/react";

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="h-12 w-16 rounded-lg bg-neutral-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-40 rounded bg-neutral-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-16 rounded bg-neutral-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-10 rounded bg-neutral-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-10 rounded bg-neutral-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-24 rounded bg-neutral-200" />
      </td>
    </tr>
  );
}

export default function ManagePackagesPage() {
  const { data: packages, isLoading, isError, error } = useMyPackages();
  const deleteMutation = useDeletePackage();
  const [toDelete, setToDelete] = useState<MyPackageRow | null>(null);

  async function confirmDelete() {
    if (!toDelete) return;
    const title = toDelete.title;
    try {
      await deleteMutation.mutateAsync(toDelete._id);
      setToDelete(null);
      toast.success(`"${title}" was deleted.`);
    } catch (err) {
      // Also surfaced inline via deleteMutation.isError below; modal stays open so the user sees it.
      toast.danger(
        err instanceof Error ? err.message : "Failed to delete package.",
      );
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Manage My Packages
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Packages you&apos;ve published on TourNest.
          </p>
        </div>
        <Link
          href="/items/add"
          className="rounded-xl bg-teal px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          + Add Package
        </Link>
      </div>

      {!isLoading && !isError && packages && packages.length > 0 && (
        <div className="mb-8">
          <PackagePerformanceChart packages={packages} />
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-6">
          {error instanceof Error
            ? error.message
            : "Failed to load your packages."}
        </div>
      )}

      {deleteMutation.isError && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-6">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : "Failed to delete package."}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Bookings</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}

            {!isLoading && packages && packages.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-neutral-500"
                >
                  You haven&apos;t published any packages yet.{" "}
                  <Link href="/items/add" className="text-teal font-medium">
                    Add your first one
                  </Link>
                  .
                </td>
              </tr>
            )}

            {!isLoading &&
              packages?.map((pkg) => (
                <tr key={pkg._id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary thumbnail, next/image adds no value here */}
                    <img
                      src={pkg.images[0]}
                      alt={pkg.title}
                      className="h-12 w-16 rounded-lg object-cover bg-neutral-100"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-800 max-w-[220px] truncate">
                    {pkg.title}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {formatBDT(pkg.price)}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {pkg.bookingsCount}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    <span className="inline-flex items-center gap-1">
                      <FaStar className="text-yellow-400" size={12} />
                      {pkg.averageRating.toFixed(1)}
                      <span className="text-neutral-400">
                        ({pkg.totalReviews})
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-neutral-500">
                      <Link
                        href={`/packages/${pkg._id}`}
                        aria-label="View"
                        className="hover:text-teal"
                      >
                        <FaEye size={15} />
                      </Link>
                      <Link
                        href={`/items/edit/${pkg._id}`}
                        aria-label="Edit"
                        className="hover:text-teal"
                      >
                        <FaPen size={14} />
                      </Link>
                      <button
                        type="button"
                        aria-label="Delete"
                        onClick={() => setToDelete(pkg)}
                        className="hover:text-red-500"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!toDelete}
        title="Delete this package?"
        description={`"${toDelete?.title}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
