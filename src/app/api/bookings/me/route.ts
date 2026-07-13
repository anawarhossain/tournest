// src/app/api/bookings/me/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Booking } from "@/models/Booking";
import "@/models/Package"; // ensures the Package model is registered for populate()
import { getServerSession } from "@/lib/get-server-session";
import type { ApiResponse } from "@/types";

export interface MyBookingRow {
  _id: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  createdAt: string;
  package: {
    _id: string;
    title: string;
    image: string;
    location: string;
  } | null;
}

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

    const bookings = await Booking.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .populate("packageId", "title images location")
      .lean();

    const rows: MyBookingRow[] = bookings.map((b) => {
      const pkg = b.packageId as any;
      return {
        _id: b._id.toString(),
        amount: b.amount,
        status: b.status,
        createdAt: (b.createdAt as Date).toISOString(),
        package:
          pkg && typeof pkg === "object"
            ? {
                _id: pkg._id.toString(),
                title: pkg.title,
                image: pkg.images?.[0] ?? "",
                location: pkg.location,
              }
            : null,
      };
    });

    return NextResponse.json<ApiResponse<MyBookingRow[]>>({ success: true, data: rows });
  } catch (error) {
    console.error("GET /api/bookings/me error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to fetch your bookings." },
      { status: 500 }
    );
  }
}
