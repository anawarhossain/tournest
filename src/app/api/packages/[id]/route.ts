// src/app/api/packages/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { Package } from "@/models/Package";
import { packageUpdateSchema } from "@/schemas/package.schema";
import { getServerSession } from "@/lib/get-server-session";
import { zodErrorMessage } from "@/lib/utils";
import type { ApiResponse, IPackage } from "@/types";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/packages/:id — public
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid package id." },
        { status: 400 }
      );
    }

    await connectDB();
    const pkg = await Package.findById(id).lean();

    if (!pkg) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Package not found." },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<IPackage>>({ success: true, data: pkg as unknown as IPackage });
  } catch (error) {
    console.error("GET /api/packages/:id error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to fetch package." },
      { status: 500 }
    );
  }
}

// PATCH /api/packages/:id — owner only
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
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
    const parsed = packageUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: zodErrorMessage(parsed.error) },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await Package.findById(id);
    if (!existing) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Package not found." },
        { status: 404 }
      );
    }

    // Ownership check — requirements §2: only the owner may edit their package.
    if (existing.ownerId.toString() !== session.user.id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "You do not have permission to edit this package." },
        { status: 403 }
      );
    }

    Object.assign(existing, parsed.data);
    const updated = await existing.save();

    return NextResponse.json<ApiResponse<IPackage>>({
      success: true,
      data: updated.toObject() as unknown as IPackage,
      message: "Package updated.",
    });
  } catch (error) {
    console.error("PATCH /api/packages/:id error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to update package." },
      { status: 500 }
    );
  }
}

// DELETE /api/packages/:id — owner only
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
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

    await connectDB();

    const existing = await Package.findById(id);
    if (!existing) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Package not found." },
        { status: 404 }
      );
    }

    // Ownership re-verified server-side (requirements §9), never trust the client.
    if (existing.ownerId.toString() !== session.user.id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "You do not have permission to delete this package." },
        { status: 403 }
      );
    }

    await existing.deleteOne();

    return NextResponse.json<ApiResponse<null>>({ success: true, message: "Package deleted." });
  } catch (error) {
    console.error("DELETE /api/packages/:id error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to delete package." },
      { status: 500 }
    );
  }
}
