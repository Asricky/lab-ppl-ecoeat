import { scrypt as scryptCallback } from "crypto";
import { promisify } from "util";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to retrieve users");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const parts = hash.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") {
    return false; // unsupported/invalid format
  }
  const [, salt, storedKey] = parts;
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return derivedKey.toString("hex") === storedKey;
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    // Query user by email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, full_name, role, password_hash")
      .eq("email", email.trim())
      .maybeSingle();

    if (userError) {
      return NextResponse.json({ message: userError.message }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ message: "Email atau password salah!" }, { status: 401 });
    }

    // Verify Password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Email atau password salah!" }, { status: 401 });
    }

    // Fetch Wallet balance
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle();

    const balance = wallet ? wallet.balance : 0;

    const token = "mock-jwt-token-" + Date.now();

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        ecoPayBalance: balance,
      },
      token,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed. Please try again.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
