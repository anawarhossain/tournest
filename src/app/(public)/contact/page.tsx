"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEnvelope, FaPhone, FaLocationDot } from "react-icons/fa6";
import { contactSchema, type ContactInput } from "@/schemas/contact.schema";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactInput) {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (res.ok && json.success) reset();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-14">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-neutral-900">Contact Us</h1>
        <p className="text-neutral-500 mt-2">Questions, feedback, or partnership ideas — we&apos;d love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Contact info */}
        <div className="md:col-span-2 space-y-5">
          <div className="flex items-start gap-3">
            <FaLocationDot className="mt-1 text-teal shrink-0" size={16} />
            <div>
              <p className="text-sm font-medium text-neutral-900">Address</p>
              <p className="text-sm text-neutral-500">Gulshan Avenue, Dhaka 1212, Bangladesh</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FaPhone className="mt-1 text-teal shrink-0" size={16} />
            <div>
              <p className="text-sm font-medium text-neutral-900">Phone</p>
              <a href="tel:+8801700000000" className="text-sm text-neutral-500 hover:text-teal">
                +880 1700-000000
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FaEnvelope className="mt-1 text-teal shrink-0" size={16} />
            <div>
              <p className="text-sm font-medium text-neutral-900">Email</p>
              <a href="mailto:support@tournest.com" className="text-sm text-neutral-500 hover:text-teal">
                support@tournest.com
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-3">
          {isSubmitSuccessful ? (
            <div className="rounded-xl bg-teal/10 text-teal text-sm px-4 py-4">
              Thanks for reaching out! We&apos;ll get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-neutral-800">Name</label>
                  <input
                    {...register("name")}
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-neutral-800">Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-neutral-800">Subject</label>
                <input
                  {...register("subject")}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-neutral-800">Message</label>
                <textarea
                  {...register("message")}
                  rows={5}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-teal px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
              >
                {isSubmitting ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
