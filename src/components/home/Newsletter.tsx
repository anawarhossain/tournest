"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaPaperPlane } from "react-icons/fa6";
import { newsletterSchema, type NewsletterInput } from "@/schemas/contact.schema";

export default function Newsletter() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema) });

  async function onSubmit(values: NewsletterInput) {
    setSuccessMessage(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSuccessMessage(json.message || "Subscribed!");
        reset();
      }
    } catch {
      // silently ignore — form stays as-is, user can retry
    }
  }

  return (
    <section className="bg-neutral-900 py-16">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-white">Never Miss a Trip</h2>
        <p className="text-neutral-400 text-sm mt-2">
          Subscribe for new tour packages and exclusive offers straight to your inbox.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col sm:flex-row gap-3" noValidate>
          <div className="flex-1">
            <input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className="w-full rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal/50"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1 text-left">{errors.email.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-teal px-6 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            <FaPaperPlane size={13} />
            {isSubmitting ? "Subscribing…" : "Subscribe"}
          </button>
        </form>

        {successMessage && <p className="mt-3 text-sm text-teal-300">{successMessage}</p>}
      </div>
    </section>
  );
}
