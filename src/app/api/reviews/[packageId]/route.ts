// src/app/api/reviews/[packageId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { Package } from "@/models/Package";
import { Review } from "@/models/Review";
import { reviewSchema } from "@/schemas/review.schema";
import { getServerSession } from "@/lib/get-server-session";
import { zodErrorMessage } from "@/lib/utils";
import type { ApiResponse, IReview } from "@/types";

type RouteParams = { params: Promise<{ packageId: string }> };

// GET /api/reviews/:packageId — public
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { packageId } = await params;

    if (!mongoose.isValidObjectId(packageId)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid package id." },
        { status: 400 }
      );
    }

    await connectDB();
    const reviews = await Review.find({ packageId }).sort({ createdAt: -1 }).lean();

    return NextResponse.json<ApiResponse<IReview[]>>({
      success: true,
      data: reviews as unknown as IReview[],
    });
  } catch (error) {
    console.error("GET /api/reviews/:packageId error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}

// POST /api/reviews/:packageId — auth required, one review per user per package
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { packageId } = await params;

    if (!mongoose.isValidObjectId(packageId)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid package id." },
        { status: 400 }
      );
    }

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: zodErrorMessage(parsed.error) },
        { status: 400 }
      );
    }

    await connectDB();

    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Package not found." },
        { status: 404 }
      );
    }

    let review;
    try {
      review = await Review.create({
        packageId,
        userId: session.user.id,
        userName: session.user.name,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
      });
    } catch (err) {
      // Duplicate key error from the { packageId, userId } unique index.
      if (err instanceof Error && "code" in err && (err as { code?: number }).code === 11000) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, message: "You have already reviewed this package." },
          { status: 409 }
        );
      }
      throw err;
    }

    // Recalculate the package's averageRating / totalReviews from all reviews.
    const stats = await Review.aggregate<{ _id: null; avg: number; count: number }>([
      { $match: { packageId: pkg._id } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    pkg.averageRating = stats[0] ? Math.round(stats[0].avg * 10) / 10 : 0;
    pkg.totalReviews = stats[0]?.count ?? 0;
    await pkg.save();

    return NextResponse.json<ApiResponse<IReview>>(
      { success: true, data: review.toObject() as unknown as IReview, message: "Review submitted." },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reviews/:packageId error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to submit review." },
      { status: 500 }
    );
  }
}
