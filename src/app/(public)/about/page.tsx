import type { Metadata } from "next";
import { FaShieldHeart, FaTags, FaUsers, FaMapLocationDot } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "About Us — TourNest",
  description:
    "Learn about TourNest, Bangladesh's platform for discovering and booking tour packages published by fellow travelers.",
};

const VALUES = [
  {
    icon: FaShieldHeart,
    title: "Trust First",
    description: "Every package is published by a registered member and every review comes from a real booking.",
  },
  {
    icon: FaTags,
    title: "Fair Pricing",
    description: "Prices are shown upfront in Taka, set directly by the host — no markups, no hidden fees.",
  },
  {
    icon: FaUsers,
    title: "Community Powered",
    description: "Hosts are everyday travelers and local guides who know their destinations best.",
  },
  {
    icon: FaMapLocationDot,
    title: "Built for Bangladesh",
    description: "From Cox's Bazar's beaches to Sylhet's tea gardens, we focus on trips close to home.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-14">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-neutral-900">About TourNest</h1>
        <p className="text-neutral-500 mt-3 max-w-2xl mx-auto leading-relaxed">
          TourNest is a tour and travel package marketplace built for Bangladesh. We connect travelers with
          tour packages published by fellow members — from weekend beach trips to multi-day cultural tours —
          so planning your next journey takes minutes, not weeks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
        {VALUES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-2xl border border-neutral-200 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal/10 text-teal">
              <Icon size={18} />
            </div>
            <h3 className="mt-4 font-semibold text-neutral-900">{title}</h3>
            <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

      <div className="prose-sm max-w-none text-neutral-600 leading-relaxed space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">Our Story</h2>
        <p>
          TourNest started with a simple observation: Bangladesh has an incredible range of destinations —
          the world&apos;s longest natural sea beach at Cox&apos;s Bazar, the largest mangrove forest at the
          Sundarban, rolling tea estates in Sylhet, and cloud-covered hills in Bandarban — but finding a
          trustworthy, well-organized tour package for any of them meant piecing information together from
          scattered social media posts and word of mouth.
        </p>
        <p>
          We built TourNest to fix that. Any registered member can publish a tour package with real pricing,
          a day-by-day itinerary, and photos, and any traveler can search, filter, and book with a secure
          one-time payment — all reviewed by travelers who actually went.
        </p>
      </div>
    </div>
  );
}
