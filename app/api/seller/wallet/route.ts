import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase is not configured properly");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// GET: Retrieve available balance, escrow balance, and transaction history
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId");

    if (!sellerId) {
      return NextResponse.json({ error: "Missing sellerId parameter" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    // 1. Fetch or create seller's wallet
    let { data: wallet, error: walletErr } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", sellerId)
      .maybeSingle();

    if (walletErr) {
      return NextResponse.json({ error: `Wallet query error: ${walletErr.message}` }, { status: 500 });
    }

    const nowStr = new Date().toISOString();

    if (!wallet) {
      // Create a default wallet with a starting balance of Rp 1.250.000
      const newWalletId = crypto.randomUUID();
      const walletPayload = {
        id: newWalletId,
        user_id: sellerId,
        balance: 1250000,
        created_at: nowStr,
      };

      const { data: createdWallet, error: createErr } = await supabase
        .from("wallets")
        .insert(walletPayload)
        .select()
        .single();

      if (createErr) {
        return NextResponse.json({ error: `Failed to create wallet: ${createErr.message}` }, { status: 500 });
      }

      wallet = createdWallet;

      // Seed 5 demo transaction records to match the UI screenshot
      const demoTransactions = [
        {
          id: crypto.randomUUID(),
          wallet_id: newWalletId,
          order_id: null,
          transaction_type: "sale",
          transaction_status: "completed",
          amount: 25000,
          description: "Order #ORD-001",
          created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
        },
        {
          id: crypto.randomUUID(),
          wallet_id: newWalletId,
          order_id: null,
          transaction_type: "refund",
          transaction_status: "completed",
          amount: -60000,
          description: "Order #ORD-9110",
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hrs ago
        },
        {
          id: crypto.randomUUID(),
          wallet_id: newWalletId,
          order_id: null,
          transaction_type: "fee",
          transaction_status: "completed",
          amount: -1500,
          description: "Platform Fee (ORD-001)",
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        },
        {
          id: crypto.randomUUID(),
          wallet_id: newWalletId,
          order_id: null,
          transaction_type: "withdrawal",
          transaction_status: "pending",
          amount: -500000,
          description: "Transfer to Bank BCA",
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        },
        {
          id: crypto.randomUUID(),
          wallet_id: newWalletId,
          order_id: null,
          transaction_type: "escrow_release",
          transaction_status: "completed",
          amount: 45000,
          description: "Order #ORD-005",
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        },
      ];

      const { error: seedErr } = await supabase
        .from("wallet_transactions")
        .insert(demoTransactions);

      if (seedErr) {
        console.error("Warning: Failed to seed default transactions:", seedErr.message);
      }
    }

    // 2. Fetch escrow balance: sum total_amount of orders where seller_id = sellerId and status in paid, processing, shipping, or delivered
    const { data: activeOrders, error: activeOrdersErr } = await supabase
      .from("orders")
      .select("total_amount")
      .eq("seller_id", sellerId)
      .in("order_status", ["processing", "ready_for_delivery", "in_delivery"]);

    if (activeOrdersErr) {
      return NextResponse.json({ error: `Escrow query error: ${activeOrdersErr.message}` }, { status: 500 });
    }

    let escrowBalance = 850000; // default mockup fallback if no active orders
    if (activeOrders && activeOrders.length > 0) {
      escrowBalance = activeOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    }

    // 3. Fetch transaction history
    const { data: dbTransactions, error: txsErr } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("wallet_id", wallet.id)
      .order("created_at", { ascending: false });

    if (txsErr) {
      return NextResponse.json({ error: `Transactions query error: ${txsErr.message}` }, { status: 500 });
    }

    // Format transactions to match frontend expectations
    const formattedTransactions = (dbTransactions || []).map(tx => {
      const typeLabel = tx.transaction_type.charAt(0).toUpperCase() + tx.transaction_type.slice(1);
      const isCredit = Number(tx.amount) >= 0;
      const amountSign = isCredit ? "+" : "-";
      const amountVal = Math.abs(Number(tx.amount));
      const formattedAmount = `${amountSign}Rp ${amountVal.toLocaleString("id-ID")}`;

      const dateObj = new Date(tx.created_at);
      const formattedDate = dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        id: tx.id,
        type: typeLabel === "Escrow_release" ? "Escrow Release" : typeLabel,
        amount: formattedAmount,
        status: tx.transaction_status.charAt(0).toUpperCase() + tx.transaction_status.slice(1),
        date: formattedDate,
        desc: tx.description,
      };
    });

    return NextResponse.json({
      balance: Number(wallet.balance) || 0,
      escrowBalance,
      transactions: formattedTransactions,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil dompet";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Request penarikan/withdrawal
export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient();
  let walletId: string | null = null;
  let originalBalance: number = 0;

  try {
    const body = await request.json();
    const {
      sellerId,
      amount,
      bankName,
      accountName,
      accountNumber,
    } = body;

    if (!sellerId || !amount || !bankName || !accountName || !accountNumber) {
      return NextResponse.json({ error: "Missing required properties" }, { status: 400 });
    }

    const withdrawAmount = parseFloat(String(amount));
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return NextResponse.json({ error: "Jumlah penarikan tidak valid" }, { status: 400 });
    }

    // 1. Fetch wallet to verify balance
    const { data: wallet, error: walletErr } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", sellerId)
      .maybeSingle();

    if (walletErr || !wallet) {
      return NextResponse.json({ error: "Dompet tidak ditemukan atau error" }, { status: 404 });
    }

    walletId = wallet.id;
    originalBalance = Number(wallet.balance);

    if (originalBalance < withdrawAmount) {
      return NextResponse.json({ error: "Saldo Ecopay tidak mencukupi" }, { status: 400 });
    }

    const newBalance = originalBalance - withdrawAmount;
    const nowStr = new Date().toISOString();

    // 2. Update wallet balance
    const { error: updateErr } = await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("id", walletId);

    if (updateErr) {
      return NextResponse.json({ error: `Gagal memperbarui saldo: ${updateErr.message}` }, { status: 500 });
    }

    // 3. Insert withdrawal request
    const requestId = crypto.randomUUID();
    const requestPayload = {
      id: requestId,
      user_id: sellerId,
      wallet_id: walletId,
      amount: withdrawAmount,
      bank_name: bankName,
      account_name: accountName,
      account_number: accountNumber,
      status: "pending",
      created_at: nowStr,
    };

    const { error: requestErr } = await supabase
      .from("withdrawal_requests")
      .insert(requestPayload);

    if (requestErr) {
      // Rollback balance
      await supabase.from("wallets").update({ balance: originalBalance }).eq("id", walletId);
      return NextResponse.json({ error: `Gagal mencatat penarikan: ${requestErr.message}` }, { status: 500 });
    }

    // 4. Insert wallet transaction log
    const transactionId = crypto.randomUUID();
    const transactionPayload = {
      id: transactionId,
      wallet_id: walletId,
      order_id: null,
      transaction_type: "withdrawal",
      transaction_status: "pending",
      amount: -withdrawAmount,
      description: `Transfer to ${bankName}`,
      created_at: nowStr,
    };

    const { error: txErr } = await supabase
      .from("wallet_transactions")
      .insert(transactionPayload);

    if (txErr) {
      // Rollback request and balance
      await supabase.from("withdrawal_requests").delete().eq("id", requestId);
      await supabase.from("wallets").update({ balance: originalBalance }).eq("id", walletId);
      return NextResponse.json({ error: `Gagal mencatat log transaksi: ${txErr.message}` }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      balance: newBalance,
    });

  } catch (error) {
    if (walletId && originalBalance > 0) {
      // Fallback rollback safety
      await supabase.from("wallets").update({ balance: originalBalance }).eq("id", walletId);
    }
    const message = error instanceof Error ? error.message : "Gagal memproses penarikan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
