import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

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

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    
    // Fetch all LKS profiles
    const { data: profiles, error: fetchError } = await supabase
      .from("lks_profiles")
      .select("id, foundation_name, lks_category, storage_type")
      .order("created_at", { ascending: false });

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json({
      lksProfiles: profiles || [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil data LKS";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
