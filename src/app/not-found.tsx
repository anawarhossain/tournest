import Link from "next/link";
import { FaMapLocationDot } from "react-icons/fa6";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal/10 text-teal mx-auto">
          <FaMapLocationDot size={22} />
        </div>
        <h1 className="mt-4 text-xl font-bold text-neutral-900">Page Not Found</h1>
        <p className="mt-2 text-sm text-neutral-500">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-teal px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Go Home
          </Link>
          <Link
            href="/packages"
            className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Explore Packages
          </Link>
        </div>
      </div>
    </div>
  );
}
