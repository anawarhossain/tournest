"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

const FAQS = [
  {
    question: "How do I book a tour package?",
    answer:
      "Browse packages on the Explore page, open the one you like, and click \"Book Now.\" You'll be taken to a secure checkout to complete your one-time payment.",
  },
  {
    question: "Can I publish my own tour package?",
    answer:
      'Yes — create a free account, then use "Add Package" from your dashboard to publish a listing with photos, pricing, and an itinerary.',
  },
  {
    question: "What payment methods are accepted?",
    answer: "Payments are processed securely through Stripe using a credit or debit card.",
  },
  {
    question: "Can I edit or cancel a package I published?",
    answer:
      'Yes — go to "Manage My Packages" to edit the details or delete a listing you own at any time.',
  },
  {
    question: "How are ratings calculated?",
    answer:
      "A package's rating is the average of all star ratings left by travelers who booked and reviewed it — only genuine reviews count.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-neutral-900">Frequently Asked Questions</h2>
        <p className="text-neutral-500 text-sm mt-1">Everything you need to know before your next trip.</p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question} className="rounded-xl border border-neutral-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-medium text-neutral-900 text-sm">{faq.question}</span>
                <FaChevronDown
                  size={14}
                  className={`shrink-0 text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && <div className="px-5 pb-4 text-sm text-neutral-600 leading-relaxed">{faq.answer}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
