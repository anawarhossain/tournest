"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  FaCircleCheck,
  FaTriangleExclamation,
  FaSpinner,
} from "react-icons/fa6";
import type { ApiResponse } from "@/types";

type VerifyState = "verifying" | "confirmed" | "pending" | "error";

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState<VerifyState>(() =>
    sessionId ? "verifying" : "error",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(() =>
    sessionId
      ? null
      : "Missing checkout session — if you just paid, check My Bookings directly.",
  );

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`,
        );
        const json: ApiResponse<{ status: string }> = await res.json();

        if (cancelled) return;

        if (!res.ok || !json.success || !json.data) {
          setState("error");
          setErrorMessage(json.message || "Could not confirm your booking.");
          return;
        }

        if (json.data.status === "paid") {
          setState("confirmed");
          queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
        } else {
          setState("pending");
        }
      } catch {
        if (!cancelled) {
          setState("error");
          setErrorMessage("Network error while confirming your booking.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId, queryClient]);

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      {state === "verifying" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 mx-auto">
            <FaSpinner className="animate-spin" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mt-5">
            Confirming your booking…
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            This only takes a moment.
          </p>
        </>
      )}

      {state === "confirmed" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 text-teal mx-auto">
            <FaCircleCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mt-5">
            Booking Confirmed!
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            Your payment was successful and your tour package has been booked.
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
        </>
      )}

      {state === "pending" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 mx-auto">
            <FaTriangleExclamation size={28} />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mt-5">
            Payment Still Processing
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            We haven&apos;t received confirmation yet. Check My Bookings again
            in a moment.
          </p>
          <Link
            href="/bookings"
            className="mt-6 inline-block rounded-xl bg-teal px-5 py-2.5 text-sm font-medium text-white"
          >
            Check My Bookings
          </Link>
        </>
      )}

      {state === "error" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500 mx-auto">
            <FaTriangleExclamation size={28} />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mt-5">
            Couldn&apos;t Confirm Booking
          </h1>
          <p className="text-sm text-neutral-500 mt-2">{errorMessage}</p>
          <Link
            href="/bookings"
            className="mt-6 inline-block rounded-xl bg-teal px-5 py-2.5 text-sm font-medium text-white"
          >
            Check My Bookings
          </Link>
        </>
      )}
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={null}>
      <BookingSuccessContent />
    </Suspense>
  );
}
