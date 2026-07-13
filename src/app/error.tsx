"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FaTriangleExclamation } from "react-icons/fa6";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500 mx-auto">
          <FaTriangleExclamation size={22} />
        </div>
        <h1 className="mt-4 text-xl font-bold text-neutral-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-neutral-500">
          An unexpected error occurred. You can try again, or head back to the homepage.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-teal px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
