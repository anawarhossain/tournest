// src/app/api/packages/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Package } from "@/models/Package";
import { packageSchema, packageQuerySchema } from "@/schemas/package.schema";
import { getServerSession } from "@/lib/get-server-session";
import { zodErrorMessage } from "@/lib/utils";
import type { ApiResponse, PaginatedPackages, IPackage } from "@/types";

// GET /api/packages?search=&category=&minPrice=&maxPrice=&location=&sort=&page=&limit=
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const rawParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = packageQuerySchema.safeParse(rawParams);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: zodErrorMessage(parsed.error) },
        { status: 400 }
      );
    }

    const { search, category, minPrice, maxPrice, location, sort, page, limit } = parsed.data;

    const filter: Record<string, any> = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ title: regex }, { location: regex }, { shortDescription: regex }];
    }
    if (category) filter.category = category;
    if (location) filter.location = new RegExp(location, "i");
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 },
      rating: { averageRating: -1 },
    };

    const skip = (page - 1) * limit;

    const [packages, total] = await Promise.all([
      Package.find(filter).sort(sortMap[sort]).skip(skip).limit(limit).lean(),
      Package.countDocuments(filter),
    ]);

    return NextResponse.json<ApiResponse<PaginatedPackages>>({
      success: true,
      data: {
        packages: packages as unknown as IPackage[],
        total,
        page,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error("GET /api/packages error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to fetch packages." },
      { status: 500 }
    );
  }
}

// POST /api/packages — create a package (auth required)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = packageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: zodErrorMessage(parsed.error) },
        { status: 400 }
      );
    }

    await connectDB();

    const created = await Package.create({
      ...parsed.data,
      ownerId: session.user.id,
    });

    return NextResponse.json<ApiResponse<IPackage>>(
      { success: true, data: created.toObject() as unknown as IPackage, message: "Package created." },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/packages error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to create package." },
      { status: 500 }
    );
  }
}
