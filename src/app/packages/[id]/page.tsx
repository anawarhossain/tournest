import type { Metadata } from "next";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { Package } from "@/models/Package";
import PackageDetailClient from "./PackageDetailClient";

interface PackageDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PackageDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return { title: "Package Not Found — TourNest" };
  }

  try {
    await connectDB();
    const pkg = await Package.findById(id).lean();

    if (!pkg) {
      return { title: "Package Not Found — TourNest" };
    }

    const title = `${pkg.title} — TourNest`;
    const description = pkg.shortDescription;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: pkg.images?.[0] ? [{ url: pkg.images[0] }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: pkg.images?.[0] ? [pkg.images[0]] : undefined,
      },
    };
  } catch {
    // DB unreachable at build/request time — fall back to a generic title rather than failing the page.
    return { title: "Tour Package — TourNest" };
  }
}

export default function PackageDetailPage() {
  return <PackageDetailClient />;
}
