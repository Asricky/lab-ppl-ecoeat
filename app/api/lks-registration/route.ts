import { randomBytes, scrypt as scryptCallback } from "crypto";
import { promisify } from "util";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import {
  DEFAULT_LKS_PROFILE_FIELDS,
  DEFAULT_LKS_USER_FIELDS,
  LKS_TABLE,
  USER_TABLE,
  type EcoEatUserInsert,
  type LksProfileInsert,
  type LksRegistrationForm,
  validateLksRegistrationForm,
} from "@/lib/lks-registration";

export const runtime = "nodejs";

const scrypt = promisify(scryptCallback);
const CLOUDINARY_UPLOAD_FOLDER = "ecoeat/lks-documents";

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to create users and lks profiles");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

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

async function createPasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

async function uploadToCloudinary(file: File) {
  const { cloudName, apiKey, apiSecret } = parseCloudinaryUrl();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const payload = `folder=${CLOUDINARY_UPLOAD_FOLDER}&timestamp=${timestamp}${apiSecret}`;
  const { createHash } = await import("crypto");
  const signature = createHash("sha1").update(payload).digest("hex");
  const cloudinaryFormData = new FormData();

  cloudinaryFormData.append("file", file);
  cloudinaryFormData.append("api_key", apiKey);
  cloudinaryFormData.append("folder", CLOUDINARY_UPLOAD_FOLDER);
  cloudinaryFormData.append("timestamp", timestamp);
  cloudinaryFormData.append("signature", signature);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: cloudinaryFormData,
    },
  );
  const uploadResult = await uploadResponse.json();

  if (!uploadResponse.ok || !uploadResult.secure_url) {
    throw new Error(uploadResult?.error?.message || "Failed to upload document to Cloudinary");
  }

  return uploadResult.secure_url as string;
}

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  try {
    const requestFormData = await request.formData();
    const legalDocument = requestFormData.get("legalDocument");

    const lksRegistrationForm: LksRegistrationForm = {
      name: getStringField(requestFormData, "name"),
      email: getStringField(requestFormData, "email"),
      businessName: getStringField(requestFormData, "businessName"),
      password: getStringField(requestFormData, "password"),
      lksType: getStringField(requestFormData, "lksType"),
      legalPermit: getStringField(requestFormData, "legalPermit"),
      capacity: getStringField(requestFormData, "capacity"),
      foodStorage: getStringField(requestFormData, "foodStorage"),
    };

    if (!(legalDocument instanceof File)) {
      return NextResponse.json(
        { message: "Legal document file is required" },
        { status: 400 },
      );
    }

    validateLksRegistrationForm(lksRegistrationForm, legalDocument);

    const supabase = getSupabaseAdminClient();
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Upload file to Cloudinary
    const legalDocumentUrl = await uploadToCloudinary(legalDocument);

    const userPayload: EcoEatUserInsert = {
      id: userId,
      full_name: lksRegistrationForm.name.trim(),
      email: lksRegistrationForm.email.trim(),
      password_hash: await createPasswordHash(lksRegistrationForm.password),
      role: DEFAULT_LKS_USER_FIELDS.role,
      avatar_url: DEFAULT_LKS_USER_FIELDS.avatar_url,
      phone_number: DEFAULT_LKS_USER_FIELDS.phone_number,
      is_verified: DEFAULT_LKS_USER_FIELDS.is_verified,
      verification_status: DEFAULT_LKS_USER_FIELDS.verification_status,
      is_active: DEFAULT_LKS_USER_FIELDS.is_active,
      suspended_at: DEFAULT_LKS_USER_FIELDS.suspended_at,
      suspended_reason: DEFAULT_LKS_USER_FIELDS.suspended_reason,
      suspended_by: DEFAULT_LKS_USER_FIELDS.suspended_by,
      last_login_at: DEFAULT_LKS_USER_FIELDS.last_login_at,
      created_at: now,
      updated_at: now,
    };

    const capacityNum = parseInt(lksRegistrationForm.capacity, 10);
    const lksProfilePayload: LksProfileInsert = {
      id: crypto.randomUUID(),
      user_id: userId,
      foundation_name: lksRegistrationForm.businessName.trim(),
      lks_category: lksRegistrationForm.lksType,
      legal_permit_number: lksRegistrationForm.legalPermit.trim(),
      legal_document_url: legalDocumentUrl,
      storage_type: lksRegistrationForm.foodStorage,
      storage_capacity: null, // nullable integer as per db schema
      beneficiaries_count: isNaN(capacityNum) ? null : capacityNum,
      verification_status: DEFAULT_LKS_PROFILE_FIELDS.verification_status,
      reviewed_by: DEFAULT_LKS_PROFILE_FIELDS.reviewed_by,
      reviewed_at: DEFAULT_LKS_PROFILE_FIELDS.reviewed_at,
      created_at: now,
    };

    // Insert user record
    const { error: userInsertError } = await supabase.from(USER_TABLE).insert(userPayload);
    if (userInsertError) {
      return NextResponse.json({ message: userInsertError.message }, { status: 400 });
    }

    // Insert lks profile record
    const { error: lksProfileInsertError } = await supabase
      .from(LKS_TABLE)
      .insert(lksProfilePayload);

    if (lksProfileInsertError) {
      // Rollback user creation
      await supabase.from(USER_TABLE).delete().eq("id", userId);
      return NextResponse.json({ message: lksProfileInsertError.message }, { status: 400 });
    }

    // Simulate JWT token
    const token = "mock-jwt-token-" + Date.now();

    return NextResponse.json({
      user: {
        id: userPayload.id,
        name: userPayload.full_name,
        email: userPayload.email,
        role: "lks",
      },
      lksProfile: {
        id: lksProfilePayload.id,
        verificationStatus: lksProfilePayload.verification_status,
      },
      token,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed. Please try again.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
