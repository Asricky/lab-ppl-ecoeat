import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { validateSellerLegalDocument } from "@/lib/seller-registration";

export const runtime = "nodejs";

const CLOUDINARY_UPLOAD_FOLDER = "ecoeat/seller-legal-documents";

function parseCloudinaryUrl() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;

  if (!cloudinaryUrl) {
    throw new Error("CLOUDINARY_URL is not configured");
  }

  const parsedUrl = new URL(cloudinaryUrl);

  return {
    cloudName: parsedUrl.hostname,
    apiKey: parsedUrl.username,
    apiSecret: parsedUrl.password,
  };
}

function createCloudinarySignature(params: Record<string, string>, apiSecret: string) {
  const payload = Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

export async function POST(request: Request) {
  try {
    const requestFormData = await request.formData();
    const file = requestFormData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Legal document file is required" }, { status: 400 });
    }

    validateSellerLegalDocument(file);

    const { cloudName, apiKey, apiSecret } = parseCloudinaryUrl();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signedParams = {
      folder: CLOUDINARY_UPLOAD_FOLDER,
      timestamp,
    };
    const signature = createCloudinarySignature(signedParams, apiSecret);
    const cloudinaryFormData = new FormData();

    cloudinaryFormData.append("file", file);
    cloudinaryFormData.append("api_key", apiKey);
    cloudinaryFormData.append("folder", signedParams.folder);
    cloudinaryFormData.append("timestamp", signedParams.timestamp);
    cloudinaryFormData.append("signature", signature);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      },
    );

    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok) {
      return NextResponse.json(
        { message: uploadResult?.error?.message || "Failed to upload legal document" },
        { status: uploadResponse.status },
      );
    }

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload legal document";

    return NextResponse.json({ message }, { status: 500 });
  }
}
