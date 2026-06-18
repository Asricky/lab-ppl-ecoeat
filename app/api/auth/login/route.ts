export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 🕵️‍♂️ LOG 1: Cetak data yang dikirim dari tombol login frontend
    console.log("============ 🔍 SINKRONISASI AUTH DEBUG ============");
    console.log("1. Email dari Frontend   :", `"${email}"`);
    console.log("2. Password dari Frontend:", `"${password}"`);

    // Ambil data user dari Supabase dengan toleransi .trim()
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.trim())
      .single();

    // Jika data tidak ketemu di Supabase
    if (error || !user) {
      console.log("❌ Hasil: Email TIDAK ditemukan di tabel users Supabase!");
      console.log("====================================================");
      return NextResponse.json({
        success: false,
        error: `Email ${email} tidak terdaftar di Supabase!`
      }, { status: 401 });
    }

    // 🕵️‍♂️ LOG 2: Cetak data asli yang disimpan di dalam database Supabase
    console.log("✅ Hasil: Email DITEMUKAN di Supabase!");
    console.log("3. Password asli di DB   :", `"${user.password_hash}"`);
    console.log("4. Role User di DB       :", user.role);
    console.log("====================================================");

    // Validasi kecocokan string password
    if (user.password_hash !== password) {
      return NextResponse.json({
        success: false,
        error: "Password di database tidak cocok dengan input frontend!"
      }, { status: 401 });
    }

    // Jika lolos semua
    return NextResponse.json({
      success: true,
      message: "Login Berhasil!",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("🚨 Crash pada API Login:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}