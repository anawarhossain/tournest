import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — TourNest",
  description: "How TourNest collects, uses, and protects your personal information.",
};

const SECTIONS = [
  {
    heading: "Information We Collect",
    body: "When you create an account, we collect your name, email address, and password (securely hashed — we never store it in plain text). When you publish a package, we collect the listing details and any images you upload via Cloudinary. When you book a package, payment is processed directly by Stripe; we only store the payment status and amount, never your card details.",
  },
  {
    heading: "How We Use Your Information",
    body: "We use your information to operate your account, process bookings and payments, show your published packages to other travelers, and send you booking confirmations. If you subscribe to our newsletter, we use your email only to send occasional updates about new packages and offers.",
  },
  {
    heading: "Sharing Your Information",
    body: "Your name is shown publicly next to packages you publish and reviews you write. We share payment information only with Stripe, our payment processor, and image files only with Cloudinary, our media host. We do not sell your personal data to third parties.",
  },
  {
    heading: "Cookies & Sessions",
    body: "We use a session cookie to keep you logged in. This cookie is required for the site to function and is not used for advertising or third-party tracking.",
  },
  {
    heading: "Your Choices",
    body: "You can update your account details at any time, delete packages you've published, and unsubscribe from the newsletter using the link in any newsletter email. To request full account deletion, contact us using the details on our Contact page.",
  },
  {
    heading: "Changes to This Policy",
    body: "We may update this policy from time to time as TourNest grows. We'll post the updated version on this page with a new effective date.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold text-neutral-900">Privacy Policy</h1>
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
