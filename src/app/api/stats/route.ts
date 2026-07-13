// src/app/api/stats/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Package } from "@/models/Package";
import { Booking } from "@/models/Booking";
import type { ApiResponse } from "@/types";

export interface HomeStats {
  totalPackages: number;
  totalTravelers: number;
  totalDestinations: number;
  avgRating: number;
}

export async function GET() {
  try {
    await connectDB();

    const [totalPackages, distinctTravelers, distinctLocations, ratingAgg] = await Promise.all([
      Package.countDocuments(),
      Booking.distinct("userId", { status: "paid" }),
      Package.distinct("location"),
      Package.aggregate<{ _id: null; avg: number }>([
        { $match: { totalReviews: { $gt: 0 } } },
        { $group: { _id: null, avg: { $avg: "$averageRating" } } },
      ]),
    ]);

    const stats: HomeStats = {
      totalPackages,
      totalTravelers: distinctTravelers.length,
      totalDestinations: distinctLocations.length,
      avgRating: ratingAgg[0] ? Math.round(ratingAgg[0].avg * 10) / 10 : 0,
    };

    return NextResponse.json<ApiResponse<HomeStats>>({ success: true, data: stats });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to fetch stats." },
      { status: 500 }
    );
  }
}
