import { FaShieldHeart, FaTags, FaHeadset, FaStar } from "react-icons/fa6";

const FEATURES = [
  {
    icon: FaShieldHeart,
    title: "Verified Hosts",
    description: "Every package is published by a registered TourNest member, so you know who you're booking with.",
  },
  {
    icon: FaTags,
    title: "Transparent Pricing",
    description: "See the full price upfront in Taka — no hidden fees, no surprises at checkout.",
  },
  {
    icon: FaStar,
    title: "Real Reviews",
    description: "Ratings come only from travelers who actually booked, so you can trust what you read.",
  },
  {
    icon: FaHeadset,
    title: "Easy Booking",
    description: "Secure one-time payment checkout — book your next trip in a couple of clicks.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-neutral-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-neutral-900">Why Choose TourNest</h2>
          <p className="text-neutral-500 text-sm mt-1">
            The easiest way to discover and book tours across Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl bg-white border border-neutral-200 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal/10 text-teal">
                <Icon size={18} />
              </div>
              <h3 className="mt-4 font-semibold text-neutral-900">{title}</h3>
              <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
