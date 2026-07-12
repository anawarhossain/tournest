// src/app/api/packages/mine/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Package } from "@/models/Package";
import { Booking } from "@/models/Booking";
import { getServerSession } from "@/lib/get-server-session";
import type { ApiResponse, IPackage } from "@/types";

export interface MyPackageRow extends IPackage {
  bookingsCount: number;
}

// GET /api/packages/mine — only the logged-in user's own packages (requirements §9)
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    await connectDB();

    const packages = await Package.find({ ownerId: session.user.id }).sort({ createdAt: -1 }).lean();

    const packageIds = packages.map((p) => p._id);

    const bookingCounts = await Booking.aggregate<{ _id: string; count: number }>([
      { $match: { packageId: { $in: packageIds }, status: "paid" } },
      { $group: { _id: "$packageId", count: { $sum: 1 } } },
    ]);

    const countMap = new Map(bookingCounts.map((b) => [b._id.toString(), b.count]));

    const rows: MyPackageRow[] = packages.map((p) => ({
      ...(p as unknown as IPackage),
      bookingsCount: countMap.get(p._id.toString()) ?? 0,
    }));

    return NextResponse.json<ApiResponse<MyPackageRow[]>>({ success: true, data: rows });
  } catch (error) {
    console.error("GET /api/packages/mine error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to fetch your packages." },
      { status: 500 }
    );
  }
}
