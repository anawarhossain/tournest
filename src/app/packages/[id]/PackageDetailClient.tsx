"use client";

import { useParams } from "next/navigation";
import { FaStar, FaLocationDot, FaClock, FaCircleCheck, FaCircleXmark, FaCalendarDay } from "react-icons/fa6";
import { usePackageDetail } from "@/hooks/usePackageDetail";
import { useReviews } from "@/hooks/useReviews";
import { useCheckout } from "@/hooks/useCheckout";
import { useSession } from "@/lib/auth-client";
import ImageGallery from "@/components/packages/ImageGallery";
import RelatedPackages from "@/components/packages/RelatedPackages";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";
import EmptyState from "@/components/ui/EmptyState";
import { formatBDT } from "@/lib/utils";

export default function PackageDetailClient() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: pkg, isLoading, isError, error } = usePackageDetail(id);
  const { data: reviews, isLoading: reviewsLoading } = useReviews(id);
  const { data: session } = useSession();
  const checkout = useCheckout();

  function handleBookNow() {
    if (!session) {
      window.location.href = `/login?returnUrl=/packages/${id}`;
      return;
    }
    checkout.mutate(id);
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
        <div className="aspect-[16/9] rounded-2xl bg-neutral-200" />
        <div className="h-6 w-1/2 rounded bg-neutral-200 mt-6" />
        <div className="h-4 w-1/3 rounded bg-neutral-200 mt-3" />
      </div>
    );
  }

  if (isError || !pkg) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <EmptyState
          title="Package not found"
          description={error instanceof Error ? error.message : "This package may have been removed."}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <ImageGallery images={pkg.images} title={pkg.title} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <span className="text-xs font-semibold text-teal">{pkg.category}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">{pkg.title}</h1>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5">
              <FaLocationDot className="text-teal" size={13} /> {pkg.location}
            </span>
            <span className="flex items-center gap-1.5">
              <FaClock className="text-teal" size={13} /> {pkg.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <FaCalendarDay className="text-teal" size={13} />
              {new Date(pkg.departureDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <FaStar className="text-yellow-400" size={13} />
              {pkg.averageRating.toFixed(1)} ({pkg.totalReviews} review{pkg.totalReviews === 1 ? "" : "s"})
            </span>
          </div>

          {/* Overview */}
          <section className="mt-8">
            <h2 className="text-lg font-bold text-neutral-900 mb-2">Overview</h2>
            <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">{pkg.fullDescription}</p>
          </section>

          {/* Specifications */}
          <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pkg.specifications.included.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Included</h3>
                <ul className="space-y-1.5">
                  {pkg.specifications.included.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                      <FaCircleCheck className="mt-0.5 text-teal shrink-0" size={13} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pkg.specifications.excluded.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Excluded</h3>
                <ul className="space-y-1.5">
                  {pkg.specifications.excluded.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                      <FaCircleXmark className="mt-0.5 text-red-400 shrink-0" size={13} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {pkg.specifications.itinerary.length > 0 && (
            <section className="mt-8">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Itinerary</h3>
              <ol className="space-y-3">
                {pkg.specifications.itinerary.map((day, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal text-xs font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-neutral-600 pt-0.5">{day}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Reviews */}
          <section className="mt-10 pt-8 border-t border-neutral-200">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">
              Reviews & Ratings
              <span className="ml-2 text-sm font-normal text-neutral-500">
                {pkg.averageRating.toFixed(1)} · {pkg.totalReviews} review{pkg.totalReviews === 1 ? "" : "s"}
              </span>
            </h2>

            {session ? (
              <div className="mb-6">
                <ReviewForm packageId={id} />
              </div>
            ) : (
              <p className="text-sm text-neutral-500 mb-6">
                <a href={`/login?returnUrl=/packages/${id}`} className="text-teal font-medium">
                  Log in
                </a>{" "}
                to write a review.
              </p>
            )}

            <ReviewList reviews={reviews ?? []} isLoading={reviewsLoading} />
          </section>
        </div>

        {/* Booking sidebar */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-neutral-200 p-5">
            <p className="text-xs text-neutral-500">Price per person</p>
            <p className="text-2xl font-bold text-neutral-900">{formatBDT(pkg.price)}</p>

            <button
              type="button"
              onClick={handleBookNow}
              disabled={checkout.isPending}
              className="mt-4 w-full rounded-xl bg-teal py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {checkout.isPending ? "Redirecting to checkout…" : "Book Now"}
            </button>

            {checkout.isError && (
              <p className="mt-3 text-xs text-red-500">
                {checkout.error instanceof Error ? checkout.error.message : "Failed to start checkout."}
              </p>
            )}

            <p className="mt-3 text-xs text-neutral-400">
              Charged in USD (Stripe doesn&apos;t support BDT settlement) — the price above shows the BDT
              equivalent.
            </p>
          </div>
        </div>
      </div>

      <RelatedPackages category={pkg.category} excludeId={pkg._id} />
    </div>
  );
}
