"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { registerSchema, type RegisterInput } from "@/schemas/auth.schema";
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    setServerError(null);
    const { error } = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError(error.message || "Registration failed. Please try again.");
      return;
    }

    router.push(returnUrl);
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Create an account</h1>
      <p className="text-slate-500 mb-6 text-sm">Join TourNest to publish and book tour packages.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input {...register("name")} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          {errors.name && <p className="text-sunset text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" {...register("email")} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          {errors.email && <p className="text-sunset text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" {...register("password")} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          {errors.password && <p className="text-sunset text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
          />
          {errors.confirmPassword && <p className="text-sunset text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {serverError && <p className="text-sunset text-sm">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-teal text-white py-2.5 font-medium hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Creating account…" : "Register"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500 text-center">
        Already have an account?{" "}
        <Link href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} className="text-teal font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}
