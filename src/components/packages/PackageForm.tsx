"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { z } from "zod";
import { packageSchema, type PackageInput, packageCategoryEnum } from "@/schemas/package.schema";
import DynamicListInput from "./DynamicListInput";
import ImageUploader from "./ImageUploader";
import type { ApiResponse, IPackage } from "@/types";

// packageSchema uses z.coerce.number()/z.coerce.date(), so the raw form shape
// (before validation) differs from the validated output shape (PackageInput).
type PackageFormInput = z.input<typeof packageSchema>;

interface PackageFormProps {
  mode: "create" | "edit";
  packageId?: string; // required when mode === "edit"
  defaultValues?: Partial<PackageFormInput>;
}

const CATEGORY_OPTIONS = packageCategoryEnum.options; // ["Beach", "Hill", "Adventure", "Cultural"]

const EMPTY_DEFAULTS: PackageFormInput = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  price: 0,
  location: "",
  // Native <input type="date"> needs a "YYYY-MM-DD" string, not a Date object —
  // zod's z.coerce.date() converts this string to a real Date at submit time.
  departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  duration: "",
  category: "Beach",
  images: [],
  specifications: { included: [], excluded: [], itinerary: [] },
};

export default function PackageForm({ mode, packageId, defaultValues }: PackageFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PackageFormInput, unknown, PackageInput>({
    resolver: zodResolver(packageSchema),
    defaultValues: { ...EMPTY_DEFAULTS, ...defaultValues },
  });

  async function onSubmit(values: PackageInput) {
    setServerError(null);

    const url = mode === "create" ? "/api/packages" : `/api/packages/${packageId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json: ApiResponse<IPackage> = await res.json();

      if (!res.ok || !json.success) {
        setServerError(json.message || "Something went wrong. Please try again.");
        return;
      }

      router.push("/items/manage");
      router.refresh();
    } catch {
      setServerError("Network error — please check your connection and try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Basic info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1 text-neutral-800">Title</label>
          <input
            {...register("title")}
            placeholder="e.g. Cox's Bazar 3D2N Package"
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-800">Price (৳ BDT)</label>
          <input
            type="number"
            step="1"
            {...register("price", { valueAsNumber: true })}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-800">Location</label>
          <input
            {...register("location")}
            placeholder="e.g. Cox's Bazar"
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-800">Departure Date</label>
          <input
            type="date"
            {...register("departureDate")}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
          {errors.departureDate && <p className="text-red-500 text-xs mt-1">{errors.departureDate.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-800">Duration</label>
          <input
            {...register("duration")}
            placeholder="e.g. 3 Days 2 Nights"
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
          {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1 text-neutral-800">Category</label>
          <select
            {...register("category")}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm bg-white"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>
      </div>

      {/* Descriptions */}
      <div>
        <label className="block text-sm font-medium mb-1 text-neutral-800">Short Description</label>
        <textarea
          {...register("shortDescription")}
          rows={2}
          placeholder="One or two sentences shown on package cards"
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
        />
        {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-neutral-800">Full Description</label>
        <textarea
          {...register("fullDescription")}
          rows={6}
          placeholder="Full details shown on the package's detail page"
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
        />
        {errors.fullDescription && <p className="text-red-500 text-xs mt-1">{errors.fullDescription.message}</p>}
      </div>

      {/* Images */}
      <Controller
        control={control}
        name="images"
        render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
      />
      {errors.images && <p className="text-red-500 text-xs -mt-4">{errors.images.message as string}</p>}

      {/* Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-neutral-200">
        <Controller
          control={control}
          name="specifications.included"
          render={({ field }) => (
            <DynamicListInput
              label="Included"
              placeholder="e.g. Hotel Stay"
              values={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="specifications.excluded"
          render={({ field }) => (
            <DynamicListInput
              label="Excluded"
              placeholder="e.g. Airfare"
              values={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="specifications.itinerary"
          render={({ field }) => (
            <DynamicListInput
              label="Itinerary (day-wise)"
              placeholder="e.g. Day 1: Arrival & beach walk"
              values={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto rounded-xl bg-teal px-6 py-2.5 font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting
          ? mode === "create"
            ? "Publishing…"
            : "Saving…"
          : mode === "create"
            ? "Publish Package"
            : "Save Changes"}
      </button>
    </form>
  );
}
