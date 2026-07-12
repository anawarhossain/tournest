// src/app/api/upload/route.ts
// Requirements §8/§10: images are uploaded via a Cloudinary widget/API, not raw URL paste.
// Pattern: this route signs the upload request; the browser then uploads the file(s)
// directly to Cloudinary using that signature (file bytes never pass through our server).

import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "@/lib/get-server-session";
import type { ApiResponse } from "@/types";

export async function POST() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Authentication required." },
      { status: 401 }
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "tournest/packages";

  // Only sign the params we intend to send — Cloudinary rejects the signature
  // if the client later sends unsigned params that weren't part of it.
  const paramsToSign = { timestamp, folder };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string
  );

  return NextResponse.json<
    ApiResponse<{
      signature: string;
      timestamp: number;
      folder: string;
      apiKey: string;
      cloudName: string;
    }>
  >({
    success: true,
    data: {
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY as string,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
    },
  });
}
