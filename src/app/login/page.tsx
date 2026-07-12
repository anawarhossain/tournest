"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/schemas/auth.schema";
import { signIn } from "@/lib/auth-client";

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || "";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const [serverError, setServerError] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function doLogin(values: LoginInput) {
    setServerError(null);
    const { error } = await signIn.email({ email: values.email, password: values.password });

    if (error) {
      setServerError(error.message || "Invalid email or password.");
      return;
    }

    router.push(returnUrl);
    router.refresh();
  }

  async function handleDemoLogin() {
    setValue("email", DEMO_EMAIL);
    setValue("password", DEMO_PASSWORD);
    setDemoLoading(true);
    setServerError(null);
    const { error } = await signIn.email({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
    setDemoLoading(false);

    if (error) {
      setServerError(
        "Demo account not found yet. Seed it first (see testing guide) or register manually with these credentials."
      );
      return;
    }

    router.push(returnUrl);
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
      <p className="text-slate-500 mb-6 text-sm">Log in to manage and book tour packages.</p>

      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={demoLoading}
        className="w-full mb-4 rounded-xl border-2 border-teal text-teal py-2.5 font-medium hover:bg-teal/5 disabled:opacity-60"
      >
        {demoLoading ? "Logging in…" : "⚡ Demo Login"}
      </button>

      <div className="flex items-center gap-3 my-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit(doLogin)} className="space-y-4" noValidate>
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

        {serverError && <p className="text-sunset text-sm">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-teal text-white py-2.5 font-medium hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Logging in…" : "Login"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500 text-center">
        Don&apos;t have an account?{" "}
        <Link href={`/register?returnUrl=${encodeURIComponent(returnUrl)}`} className="text-teal font-medium">
          Register
        </Link>
      </p>
    </div>
  );
}
