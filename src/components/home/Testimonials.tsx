"use client";

import { FaStar, FaQuoteLeft } from "react-icons/fa6";
import { useTestimonials } from "@/hooks/useTestimonials";

function TestimonialSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 p-6 animate-pulse">
      <div className="h-4 w-24 rounded bg-neutral-200 mb-3" />
      <div className="h-3 w-full rounded bg-neutral-200 mb-2" />
      <div className="h-3 w-3/4 rounded bg-neutral-200" />
    </div>
  );
}

export default function Testimonials() {
  const { data, isLoading, isError } = useTestimonials();

  if (isError) return null;
  if (!isLoading && data && data.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-neutral-900">What Our Travelers Say</h2>
        <p className="text-neutral-500 text-sm mt-1">Real reviews from real TourNest bookings.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <TestimonialSkeleton key={i} />)
          : data?.map((t) => (
              <div key={t._id} className="rounded-2xl border border-neutral-200 p-6">
                <FaQuoteLeft className="text-teal/30" size={20} />
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed line-clamp-4">{t.comment}</p>
                <div className="mt-4 flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} size={12} className={star <= t.rating ? "text-yellow-400" : "text-neutral-200"} />
                  ))}
                </div>
                <p className="mt-2 text-sm font-semibold text-neutral-900">{t.userName}</p>
                <p className="text-xs text-neutral-400">{t.packageTitle}</p>
              </div>
            ))}
      </div>
    </section>
  );
}
