export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // 1. Cek apakah Variabel .env.local terbaca oleh Next.js Server
    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.json({
            success: false,
            error: "🚨 Kredensial .env.local TIDAK TERBACA oleh server Next.js! Pastikan nama variabelnya sesuai dan server sudah di-restart.",
            debug: { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey }
        }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
        // 2. Tes melakukan query ringan ke tabel users Supabase cloud
        console.log("🔗 Mencoba mengetok pintu database Supabase...");
        const { data, error, status } = await supabase
            .from('users')
            .select('id, email, full_name')
            .eq('email', 'lukas.buyer@ecoeat.com')
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: "🎉 AWESOME! Next.js kamu sudah TERHUBUNG 100% dengan Cloud Supabase!",
            status_code: status,
            connected_user: data
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: "❌ Gagal mengambil data dari Supabase. Koneksi internet terputus atau tabel belum dibuat.",
            details: error.message
        }, { status: 400 });
    }
}