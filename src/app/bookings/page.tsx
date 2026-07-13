"use client";

import Link from "next/link";
import { FaLocationDot } from "react-icons/fa6";
import { useMyBookings } from "@/hooks/useMyBookings";
import EmptyState from "@/components/ui/EmptyState";
import { formatBDT } from "@/lib/utils";
import type { MyBookingRow } from "@/app/api/bookings/me/route";

const STATUS_STYLES: Record<MyBookingRow["status"], string> = {
  paid: "bg-teal/10 text-teal",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-600",
};

function BookingSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border border-neutral-200 p-4 animate-pulse">
      <div className="h-16 w-20 rounded-lg bg-neutral-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 rounded bg-neutral-200" />
        <div className="h-3 w-1/3 rounded bg-neutral-200" />
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const { data: bookings, isLoading, isError, error } = useMyBookings();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">My Bookings</h1>
      <p className="text-neutral-500 text-sm mt-1 mb-8">
        Tour packages you&apos;ve booked and paid for.
      </p>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <BookingSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <EmptyState
          title="Couldn't load your bookings"
          description={
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again."
          }
        />
      )}

      {!isLoading && !isError && bookings && bookings.length === 0 && (
        <EmptyState
          title="No bookings yet"
          description="Once you book a tour package, it will show up here."
          action={
            <Link
              href="/packages"
              className="rounded-xl bg-teal px-4 py-2 text-sm font-medium text-white"
            >
              Explore Packages
            </Link>
          }
        />
      )}

      {!isLoading && bookings && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="flex gap-4 rounded-xl border border-neutral-200 p-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary URL, next/image adds no value here */}
              <img
                src={booking.package?.image}
                alt={booking.package?.title ?? "Package"}
                className="h-16 w-20 rounded-lg object-cover bg-neutral-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={
                        booking.package
                          ? `/packages/${booking.package._id}`
                          : "#"
                      }
                      className="font-semibold text-neutral-900 hover:text-teal truncate block"
                    >
                      {booking.package?.title ?? "Package no longer available"}
                    </Link>
                    {booking.package && (
                      <span className="flex items-center gap-1 text-xs text-neutral-500 mt-1">
                        <FaLocationDot size={10} /> {booking.package.location}
                      </span>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="text-neutral-500">
                    {new Date(booking.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {formatBDT(booking.amount)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
