"use client";

import { Suspense } from "react";
import Link from "next/link";
import { FaCircleCheck } from "react-icons/fa6";

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={null}>
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 text-teal mx-auto">
          <FaCircleCheck size={32} />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mt-5">Booking Confirmed!</h1>
        <p className="text-sm text-neutral-500 mt-2">
          Your payment was successful and your tour package has been booked. A confirmation has been added to
          your bookings.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/bookings"
            className="rounded-xl bg-teal px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            View My Bookings
          </Link>
          <Link
            href="/packages"
            className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Explore More Packages
          </Link>
        </div>
      </div>
    </Suspense>
  );
}
