export const dynamic = 'force-dynamic';

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured properly in env variables.");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

// GET: Retrieve buyer profile + wallet
export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized: User ID missing' }, { status: 401 });
    }

    const supabase = getSupabaseClient();
    
    // Fetch user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, full_name, email, role, phone_number, avatar_url')
      .eq('id', userId)
      .maybeSingle();

    if (userError) throw userError;
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Fetch wallet details
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        balance: wallet ? wallet.balance : 0
      }
    });

  } catch (error: any) {
    console.error("🚨 GET profile error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Update buyer profile
export async function PUT(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized: User ID missing' }, { status: 401 });
    }

    const body = await request.json();
    const { full_name, phone_number, avatar_url } = body;

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('users')
      .update({
        full_name,
        phone_number,
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error("🚨 PUT profile error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
