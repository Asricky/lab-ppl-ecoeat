import { randomBytes, scrypt as scryptCallback } from "crypto";
import { promisify } from "util";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import {
  DEFAULT_COURIER_PROFILE_FIELDS,
  DEFAULT_COURIER_USER_FIELDS,
  COURIER_TABLE,
  USER_TABLE,
  type EcoEatUserInsert,
  type CourierProfileInsert,
  type CourierRegistrationForm,
  validateCourierRegistrationForm,
} from "@/lib/courier-registration";

export const runtime = "nodejs";

const scrypt = promisify(scryptCallback);
const CLOUDINARY_UPLOAD_FOLDER = "ecoeat/courier-licenses";

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
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to create users and courier profiles");
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
    const simFile = requestFormData.get("simDocument");
    const stnkFile = requestFormData.get("stnkDocument");

    const courierRegistrationForm: CourierRegistrationForm = {
      name: getStringField(requestFormData, "name"),
      email: getStringField(requestFormData, "email"),
      password: getStringField(requestFormData, "password"),
      vehicleType: getStringField(requestFormData, "vehicleType"),
      plateNumber: getStringField(requestFormData, "plateNumber"),
    };

    if (!(simFile instanceof File) || !(stnkFile instanceof File)) {
      return NextResponse.json(
        { message: "Driver License and Vehicle Registration files are required" },
        { status: 400 },
      );
    }

    validateCourierRegistrationForm(courierRegistrationForm, simFile, stnkFile);

    const supabase = getSupabaseAdminClient();
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Upload files to Cloudinary
    const driverLicenseUrl = await uploadToCloudinary(simFile);
    const vehicleRegistrationUrl = await uploadToCloudinary(stnkFile);

    const userPayload: EcoEatUserInsert = {
      id: userId,
      full_name: courierRegistrationForm.name.trim(),
      email: courierRegistrationForm.email.trim(),
      password_hash: await createPasswordHash(courierRegistrationForm.password),
      role: DEFAULT_COURIER_USER_FIELDS.role,
      avatar_url: DEFAULT_COURIER_USER_FIELDS.avatar_url,
      phone_number: DEFAULT_COURIER_USER_FIELDS.phone_number,
      is_verified: DEFAULT_COURIER_USER_FIELDS.is_verified,
      verification_status: DEFAULT_COURIER_USER_FIELDS.verification_status,
      is_active: DEFAULT_COURIER_USER_FIELDS.is_active,
      suspended_at: DEFAULT_COURIER_USER_FIELDS.suspended_at,
      suspended_reason: DEFAULT_COURIER_USER_FIELDS.suspended_reason,
      suspended_by: DEFAULT_COURIER_USER_FIELDS.suspended_by,
      last_login_at: DEFAULT_COURIER_USER_FIELDS.last_login_at,
      created_at: now,
      updated_at: now,
    };

    const courierProfilePayload: CourierProfileInsert = {
      id: crypto.randomUUID(),
      user_id: userId,
      vehicle_type: courierRegistrationForm.vehicleType,
      vehicle_plate_number: courierRegistrationForm.plateNumber.trim(),
      driver_license_url: driverLicenseUrl,
      vehicle_registration_url: vehicleRegistrationUrl,
      verification_status: DEFAULT_COURIER_PROFILE_FIELDS.verification_status,
      reviewed_by: DEFAULT_COURIER_PROFILE_FIELDS.reviewed_by,
      reviewed_at: DEFAULT_COURIER_PROFILE_FIELDS.reviewed_at,
      created_at: now,
    };

    // Insert user record
    const { error: userInsertError } = await supabase.from(USER_TABLE).insert(userPayload);
    if (userInsertError) {
      return NextResponse.json({ message: userInsertError.message }, { status: 400 });
    }

    // Insert courier profile record
    const { error: courierProfileInsertError } = await supabase
      .from(COURIER_TABLE)
      .insert(courierProfilePayload);

    if (courierProfileInsertError) {
      // Rollback user creation
      await supabase.from(USER_TABLE).delete().eq("id", userId);
      return NextResponse.json({ message: courierProfileInsertError.message }, { status: 400 });
    }

    // Simulate JWT token
    const token = "mock-jwt-token-" + Date.now();

    return NextResponse.json({
      user: {
        id: userPayload.id,
        name: userPayload.full_name,
        email: userPayload.email,
        role: "courier",
      },
      courierProfile: {
        id: courierProfilePayload.id,
        verificationStatus: courierProfilePayload.verification_status,
      },
      token,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed. Please try again.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
