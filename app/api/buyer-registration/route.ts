import { randomBytes, scrypt as scryptCallback } from "crypto";
import { promisify } from "util";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import {
  DEFAULT_BUYER_USER_FIELDS,
  BUYER_TABLE,
  USER_TABLE,
  type EcoEatUserInsert,
  type BuyerProfileInsert,
  type BuyerRegistrationForm,
  validateBuyerRegistrationForm,
} from "@/lib/buyer-registration";

export const runtime = "nodejs";

const scrypt = promisify(scryptCallback);

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
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to create users and buyer profiles");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function createPasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as BuyerRegistrationForm;

    validateBuyerRegistrationForm(body);

    const supabase = getSupabaseAdminClient();
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    // Hash password
    const passwordHash = await createPasswordHash(body.password);

    const userPayload: EcoEatUserInsert = {
      id: userId,
      full_name: body.name.trim(),
      email: body.email.trim(),
      password_hash: passwordHash,
      role: DEFAULT_BUYER_USER_FIELDS.role,
      avatar_url: DEFAULT_BUYER_USER_FIELDS.avatar_url,
      phone_number: DEFAULT_BUYER_USER_FIELDS.phone_number,
      is_verified: DEFAULT_BUYER_USER_FIELDS.is_verified,
      verification_status: DEFAULT_BUYER_USER_FIELDS.verification_status,
      is_active: DEFAULT_BUYER_USER_FIELDS.is_active,
      suspended_at: DEFAULT_BUYER_USER_FIELDS.suspended_at,
      suspended_reason: DEFAULT_BUYER_USER_FIELDS.suspended_reason,
      suspended_by: DEFAULT_BUYER_USER_FIELDS.suspended_by,
      last_login_at: DEFAULT_BUYER_USER_FIELDS.last_login_at,
      created_at: now,
      updated_at: now,
    };

    const buyerProfilePayload: BuyerProfileInsert = {
      id: crypto.randomUUID(),
      user_id: userId,
      created_at: now,
    };

    // Insert user record
    const { error: userInsertError } = await supabase.from(USER_TABLE).insert(userPayload);

    if (userInsertError) {
      return NextResponse.json({ message: userInsertError.message }, { status: 400 });
    }

    // Insert buyer profile record
    const { error: buyerProfileInsertError } = await supabase
      .from(BUYER_TABLE)
      .insert(buyerProfilePayload);

    if (buyerProfileInsertError) {
      // Rollback inserted user record
      await supabase.from(USER_TABLE).delete().eq("id", userId);

      return NextResponse.json({ message: buyerProfileInsertError.message }, { status: 400 });
    }

    // Simulate JWT token
    const token = "mock-jwt-token-" + Date.now();

    return NextResponse.json({
      user: {
        id: userPayload.id,
        name: userPayload.full_name,
        email: userPayload.email,
      },
      buyerProfile: {
        id: buyerProfilePayload.id,
      },
      token,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed. Please try again.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
