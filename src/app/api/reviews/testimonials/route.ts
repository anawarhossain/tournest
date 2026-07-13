// src/app/api/reviews/testimonials/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Review } from "@/models/Review";
import "@/models/Package"; // ensures the Package model is registered for populate()
import type { ApiResponse } from "@/types";

export interface Testimonial {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  packageTitle: string;
}

export async function GET() {
  try {
    await connectDB();

    const reviews = await Review.find({ rating: { $gte: 4 } })
      .sort({ rating: -1, createdAt: -1 })
      .limit(6)
      .populate("packageId", "title")
      .lean();

    const testimonials: Testimonial[] = reviews.map((r) => {
      const pkg = r.packageId as unknown as { title?: string } | null;
      return {
        _id: r._id.toString(),
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
        createdAt: (r.createdAt as Date).toISOString(),
        packageTitle: pkg?.title ?? "TourNest Package",
      };
    });

    return NextResponse.json<ApiResponse<Testimonial[]>>({ success: true, data: testimonials });
  } catch (error) {
    console.error("GET /api/reviews/testimonials error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to fetch testimonials." },
      { status: 500 }
    );
  }
}
