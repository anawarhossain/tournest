import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export default function CTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      <div className="rounded-3xl bg-gradient-to-br from-teal to-teal-700 px-8 py-14 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Have a Tour to Share?</h2>
        <p className="mt-3 text-white/85 max-w-xl mx-auto">
          Become a host on TourNest — publish your own package and reach travelers looking for their next
          adventure across Bangladesh.
        </p>
        <Link
          href="/items/add"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-teal hover:bg-white/90"
        >
          Add Your Package <FaArrowRight size={13} />
        </Link>
      </div>
    </section>
  );
}
