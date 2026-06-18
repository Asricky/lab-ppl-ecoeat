export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const getUserId = (req: Request) => req.headers.get('x-user-id');

// 1. [GET] Ambil Saldo Real-Time milik User yang login
export async function GET(request: Request) {
    try {
        const userId = getUserId(request);
        if (!userId || userId === 'undefined') {
            return NextResponse.json({ success: false, error: 'Unauthorized: ID missing' }, { status: 401 });
        }

        const { data: wallet, error } = await supabase
            .from('wallets')
            .select('balance')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return NextResponse.json({ success: true, balance: Number(wallet.balance) }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// 2. [POST] Proses Checkout Potong Saldo Dinamis
export async function POST(request: Request) {
    try {
        const userId = getUserId(request);
        if (!userId || userId === 'undefined') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { cartItems, totalAmount, deliveryAddressId, sellerId, subtotal, deliveryFee, platformFee } = body;

        // Ambil dompet user
        const { data: wallet, error: walletError } = await supabase
            .from('wallets')
            .select('id, balance')
            .eq('user_id', userId)
            .single();

        if (walletError || !wallet) {
            return NextResponse.json({ success: false, error: 'Dompet EcoPay tidak ditemukan.' }, { status: 404 });
        }

        const currentBalance = Number(wallet.balance);
        if (currentBalance < totalAmount) {
            return NextResponse.json({ success: false, error: 'Saldo EcoPay Anda tidak mencukupi!' }, { status: 400 });
        }

        const orderCode = `ECO-${Date.now().toString().slice(-6)}`;

        // Buat data Order baru
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([
                {
                    order_code: orderCode,
                    buyer_id: userId,
                    seller_id: sellerId,
                    order_type: 'purchase',
                    order_status: 'waiting_payment',
                    subtotal: subtotal,
                    delivery_fee: deliveryFee || 0,
                    platform_fee: platformFee || 0,
                    total_amount: totalAmount,
                    total_portions: cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0),
                    delivery_address_id: deliveryAddressId,
                }
            ])
            .select();

        if (orderError || !order) throw orderError;
        const newOrderId = order[0].id;

        // Masukkan Detail Item Makanan Belanjaan
        const orderItemsPayload = cartItems.map((item: any) => ({
            order_id: newOrderId,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            total_price: item.price * item.quantity,
            portion_quantity: item.portion_quantity || 1
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);
        if (itemsError) throw itemsError;

        // Potong Saldo Dompet Supabase
        const updatedBalance = currentBalance - totalAmount;
        const { error: updateWalletError } = await supabase
            .from('wallets')
            .update({ balance: updatedBalance })
            .eq('id', wallet.id);

        if (updateWalletError) throw updateWalletError;

        // Catat Mutasi Transaksi
        await supabase.from('wallet_transactions').insert([
            {
                wallet_id: wallet.id,
                order_id: newOrderId,
                transaction_type: 'debit',
                transaction_status: 'completed',
                amount: totalAmount,
                description: `Pembayaran pesanan EcoEat ${orderCode}`,
            }
        ]);

        return NextResponse.json({
            success: true,
            message: 'Transaksi Berhasil!',
            data: { order_code: orderCode, remaining_balance: updatedBalance }
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// 3. [PUT] Top-up Saldo Wallet User
export async function PUT(request: Request) {
    try {
        const userId = getUserId(request);
        if (!userId || userId === 'undefined') {
            return NextResponse.json({ success: false, error: 'Unauthorized: ID missing' }, { status: 401 });
        }

        const body = await request.json();
        const { amount } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json({ success: false, error: 'Amount must be greater than 0' }, { status: 400 });
        }

        // Ambil wallet user
        const { data: wallet, error: walletError } = await supabase
            .from('wallets')
            .select('id, balance')
            .eq('user_id', userId)
            .single();

        if (walletError || !wallet) {
            // Jika belum ada wallet, buat baru
            const { data: newWallet, error: createError } = await supabase
                .from('wallets')
                .insert([{ user_id: userId, balance: amount }])
                .select()
                .single();
            if (createError) throw createError;
            return NextResponse.json({ success: true, balance: Number(newWallet.balance) }, { status: 200 });
        }

        const newBalance = Number(wallet.balance) + Number(amount);
        const { error: updateError } = await supabase
            .from('wallets')
            .update({ balance: newBalance })
            .eq('id', wallet.id);

        if (updateError) throw updateError;

        // Tambahkan mutasi transaksi topup
        await supabase.from('wallet_transactions').insert([
            {
                wallet_id: wallet.id,
                transaction_type: 'credit',
                transaction_status: 'completed',
                amount: amount,
                description: `Top-up saldo EcoPay`,
            }
        ]);

        return NextResponse.json({ success: true, balance: newBalance }, { status: 200 });
    } catch (error: any) {
        console.error("🚨 PUT checkout top-up error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}