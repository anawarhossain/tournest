import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — TourNest",
  description: "The terms that govern your use of TourNest.",
};

const SECTIONS = [
  {
    heading: "1. Accounts",
    body: "You must register an account to publish a package, book a package, or leave a review. You're responsible for keeping your login credentials secure and for all activity under your account.",
  },
  {
    heading: "2. Publishing Packages",
    body: "You may publish tour packages you are authorized to sell. You are responsible for the accuracy of the price, itinerary, and description you provide. You may edit or delete your own packages at any time from Manage My Packages. TourNest does not verify or guarantee the quality of any package published by a member.",
  },
  {
    heading: "3. Booking & Payment",
    body: "Bookings are one-time payments processed securely through Stripe. Once a payment is confirmed, a booking record is created under your account. Refunds and cancellations are handled directly between the traveler and the package host, unless otherwise required by law.",
  },
  {
    heading: "4. Reviews",
    body: "You may leave one review per package. Reviews should reflect your genuine experience. TourNest may remove reviews that are abusive, fraudulent, or unrelated to the package.",
  },
  {
    heading: "5. Prohibited Use",
    body: "You agree not to publish false or misleading listings, upload content you don't have rights to, or use the platform for any unlawful purpose.",
  },
  {
    heading: "6. Limitation of Liability",
    body: "TourNest is a platform connecting travelers and hosts. We are not a party to the actual tour service and are not liable for the conduct of hosts, the quality of tours, or events during travel.",
  },
  {
    heading: "7. Changes to These Terms",
    body: "We may revise these terms as TourNest evolves. Continued use of the platform after changes are posted means you accept the updated terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold text-neutral-900">Terms &amp; Conditions</h1>
      <p className="text-sm text-neutral-400 mt-2">Last updated: July 2026</p>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">{section.heading}</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
