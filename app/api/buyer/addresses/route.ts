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

// 1. [READ] Ambil semua daftar alamat milik buyer
export async function GET(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized: User ID missing' }, { status: 401 });
        }

        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('user_addresses')
            .select('*')
            .eq('user_id', userId)
            .order('is_default', { ascending: false });

        if (error) throw error;
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: any) {
        console.error("🚨 GET addresses error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// 2. [CREATE] Tambah alamat baru
export async function POST(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized: User ID missing' }, { status: 401 });
        }

        const body = await request.json();
        const supabase = getSupabaseClient();

        // Jika alamat baru di-set sebagai default, ubah alamat lama menjadi false dulu
        if (body.is_default) {
            await supabase
                .from('user_addresses')
                .update({ is_default: false })
                .eq('user_id', userId);
        }

        const { data, error } = await supabase
            .from('user_addresses')
            .insert([
                {
                    user_id: userId,
                    label: body.label,
                    recipient_name: body.recipient_name,
                    phone_number: body.phone_number,
                    address: body.address,
                    district: body.district,
                    city: body.city,
                    province: body.province,
                    postal_code: body.postal_code,
                    latitude: body.latitude || null,
                    longitude: body.longitude || null,
                    is_default: body.is_default || false,
                }
            ])
            .select();

        if (error) throw error;
        return NextResponse.json({ success: true, data: data[0] }, { status: 201 });
    } catch (error: any) {
        console.error("🚨 POST addresses error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// 3. [UPDATE] Edit alamat yang sudah ada
export async function PUT(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized: User ID missing' }, { status: 401 });
        }

        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: 'Address ID is required' }, { status: 400 });
        }

        const supabase = getSupabaseClient();

        // Jika alamat ini diubah menjadi default, matikan default pada alamat lain
        if (updateData.is_default) {
            await supabase
                .from('user_addresses')
                .update({ is_default: false })
                .eq('user_id', userId);
        }

        const { data, error } = await supabase
            .from('user_addresses')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', userId)
            .select();

        if (error) throw error;
        return NextResponse.json({ success: true, data: data[0] }, { status: 200 });
    } catch (error: any) {
        console.error("🚨 PUT addresses error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// 4. [DELETE] Hapus alamat berdasarkan ID
export async function DELETE(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized: User ID missing' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'Address ID is required' }, { status: 400 });
        }

        const supabase = getSupabaseClient();
        const { error } = await supabase
            .from('user_addresses')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;
        return NextResponse.json({ success: true, message: 'Alamat berhasil dihapus' }, { status: 200 });
    } catch (error: any) {
        console.error("🚨 DELETE addresses error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
