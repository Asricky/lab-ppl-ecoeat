import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(path) {
  try {
    const env = readFileSync(path, "utf8");
    for (const line of env.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;
      const key = trimmed.slice(0, separatorIndex);
      const value = trimmed.slice(separatorIndex + 1);
      process.env[key] = value;
    }
  } catch (e) {
    console.error("Warning: Failed to load .env file:", e.message);
  }
}

function assertEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

async function main() {
  loadEnvFile(".env");

  const supabaseUrl = assertEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = assertEnv("SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log("Starting Seller EcoPay Wallet & Withdrawal API Test...");

  // 1. Find or create a test seller
  console.log("Finding existing seller user...");
  const { data: existingSellers, error: findSellerError } = await supabase
    .from("users")
    .select("id, email")
    .eq("role", "seller")
    .limit(1);

  if (findSellerError) {
    throw new Error(`Failed to query seller users: ${findSellerError.message}`);
  }

  let testSellerUserId;
  let testSellerProfileId;
  let createdTempSeller = false;

  if (existingSellers && existingSellers.length > 0) {
    testSellerUserId = existingSellers[0].id;
    console.log(`Found existing seller user: ${existingSellers[0].email} (ID: ${testSellerUserId})`);
    
    const { data: profile } = await supabase
      .from("seller_profiles")
      .select("id")
      .eq("user_id", testSellerUserId)
      .maybeSingle();
      
    if (profile) {
      testSellerProfileId = profile.id;
    }
  }

  if (!testSellerProfileId) {
    console.log("No seller profile found. Creating a temporary test seller user...");
    testSellerUserId = crypto.randomUUID();
    testSellerProfileId = crypto.randomUUID();
    createdTempSeller = true;

    const { error: userInsertError } = await supabase.from("users").insert({
      id: testSellerUserId,
      full_name: "Test Wallet Seller",
      email: `test.wallet.seller.${Date.now()}@ecoeat.local`,
      password_hash: "scrypt:dummy:dummy",
      role: "seller",
      is_verified: true,
      verification_status: "approved",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (userInsertError) {
      throw new Error(`Failed to create temp seller user: ${userInsertError.message}`);
    }

    const { error: profileInsertError } = await supabase.from("seller_profiles").insert({
      id: testSellerProfileId,
      user_id: testSellerUserId,
      business_name: "Test Wallet Business",
      business_type: "food_business",
      legal_document_url: "http://example.com/legal.pdf",
      verification_status: "approved",
      created_at: new Date().toISOString(),
    });

    if (profileInsertError) {
      await supabase.from("users").delete().eq("id", testSellerUserId);
      throw new Error(`Failed to create temp seller profile: ${profileInsertError.message}`);
    }
    console.log(`Created temp seller profile with ID: ${testSellerProfileId}`);
  }

  // Ensure the wallet has at least Rp 150.000 for the test
  let tempWalletResetNeeded = false;
  let originalDbBalance = 0;

  const { data: dbW, error: qWError } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", testSellerUserId)
    .maybeSingle();

  if (dbW) {
    originalDbBalance = Number(dbW.balance);
    if (originalDbBalance < 100000) {
      console.log(`Current wallet balance in DB is low (${originalDbBalance}). Temporarily setting it to 1250000 for verification...`);
      const { error: updErr } = await supabase
        .from("wallets")
        .update({ balance: 1250000 })
        .eq("id", dbW.id);
      if (updErr) throw new Error(`Failed to temporarily adjust balance: ${updErr.message}`);
      tempWalletResetNeeded = true;
    }
  }

  // 2. Call GET /api/seller/wallet endpoint
  console.log("\n--- Calling GET /api/seller/wallet (Find/Create Wallet) ---");
  const getResponse = await fetch(`http://localhost:3000/api/seller/wallet?sellerId=${testSellerUserId}`);
  const getStatus = getResponse.status;
  const getResult = await getResponse.json();

  console.log(`GET Response Status: ${getStatus}`);
  if (getStatus !== 200 || getResult.balance === undefined) {
    throw new Error(`GET wallet failed: ${getResult.error || "Unknown error"}`);
  }

  console.log("✔ GET wallet request succeeded.");
  console.log(`  Initial Balance: Rp ${getResult.balance.toLocaleString("id-ID")}`);
  console.log(`  Escrow Balance: Rp ${getResult.escrowBalance.toLocaleString("id-ID")}`);
  console.log(`  Transactions loaded: ${getResult.transactions.length}`);

  const initialBalance = getResult.balance;

  // 3. Call POST /api/seller/wallet to request a withdrawal of Rp 100.000
  console.log("\n--- Calling POST /api/seller/wallet (Withdraw Rp 100.000) ---");
  const postPayload = {
    sellerId: testSellerUserId,
    amount: 100000,
    bankName: "Bank BCA (**** 8921)",
    accountName: "QA Tester",
    accountNumber: "8921",
  };

  const postResponse = await fetch("http://localhost:3000/api/seller/wallet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postPayload),
  });

  const postStatus = postResponse.status;
  const postResult = await postResponse.json();

  console.log(`POST Response Status: ${postStatus}`);
  if (postStatus !== 200 || !postResult.ok) {
    throw new Error(`POST withdrawal failed: ${postResult.error || "Unknown error"}`);
  }

  const expectedNewBalance = initialBalance - 100000;
  console.log("✔ POST withdrawal request succeeded.");
  console.log(`  Expected Balance: Rp ${expectedNewBalance.toLocaleString("id-ID")}`);
  console.log(`  Returned Balance: Rp ${postResult.balance.toLocaleString("id-ID")}`);

  if (postResult.balance !== expectedNewBalance) {
    throw new Error("Verification failed: Returned balance does not match expected balance!");
  }

  // 4. Verify database records
  console.log("\n--- Verifying Supabase Database Records ---");

  // A. Check wallet table balance
  const { data: dbWallet, error: queryWalletErr } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", testSellerUserId)
    .single();

  if (queryWalletErr || !dbWallet) {
    throw new Error(`Failed to query wallets table: ${queryWalletErr?.message}`);
  }

  console.log("✔ Verified wallet entry exists in 'wallets' table.");
  console.log(`  Database Balance: Rp ${Number(dbWallet.balance).toLocaleString("id-ID")}`);
  if (Number(dbWallet.balance) !== expectedNewBalance) {
    throw new Error("Verification failed: Database balance does not match expected balance!");
  }

  // B. Check withdrawal_requests table
  const { data: dbWithdrawalRequests, error: queryReqErr } = await supabase
    .from("withdrawal_requests")
    .select("*")
    .eq("wallet_id", dbWallet.id)
    .eq("amount", 100000);

  if (queryReqErr || !dbWithdrawalRequests || dbWithdrawalRequests.length === 0) {
    throw new Error(`Failed to find withdrawal request in 'withdrawal_requests': ${queryReqErr?.message}`);
  }

  const withdrawalRequest = dbWithdrawalRequests[0];
  console.log("✔ Verified withdrawal request exists in 'withdrawal_requests' table.");
  console.log(`  Request ID: ${withdrawalRequest.id}`);
  console.log(`  Amount: Rp ${Number(withdrawalRequest.amount).toLocaleString("id-ID")}`);
  console.log(`  Bank Name: ${withdrawalRequest.bank_name}`);
  console.log(`  Status: ${withdrawalRequest.status}`);

  // C. Check wallet_transactions table
  const { data: dbWalletTransactions, error: queryTxErr } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("wallet_id", dbWallet.id)
    .eq("transaction_type", "withdrawal")
    .eq("amount", -100000);

  if (queryTxErr || !dbWalletTransactions || dbWalletTransactions.length === 0) {
    throw new Error(`Failed to find transaction entry in 'wallet_transactions': ${queryTxErr?.message}`);
  }

  const walletTx = dbWalletTransactions[0];
  console.log("✔ Verified transaction entry exists in 'wallet_transactions' table.");
  console.log(`  Transaction ID: ${walletTx.id}`);
  console.log(`  Amount: Rp ${Number(walletTx.amount).toLocaleString("id-ID")}`);
  console.log(`  Type: ${walletTx.transaction_type}`);
  console.log(`  Description: ${walletTx.description}`);

  // 5. Cleanup test data in reverse order of foreign keys
  console.log("\n--- Cleaning Up Test Records ---");

  // Delete matching test transaction log
  const { error: txDelErr } = await supabase
    .from("wallet_transactions")
    .delete()
    .eq("id", walletTx.id);
  if (txDelErr) console.error(`Warning: Failed to delete test wallet transaction: ${txDelErr.message}`);

  // Delete matching test withdrawal request
  const { error: reqDelErr } = await supabase
    .from("withdrawal_requests")
    .delete()
    .eq("id", withdrawalRequest.id);
  if (reqDelErr) console.error(`Warning: Failed to delete test withdrawal request: ${reqDelErr.message}`);

  // Reset wallet balance back to initial (or original pre-test balance)
  const balanceToRestore = tempWalletResetNeeded ? originalDbBalance : initialBalance;
  const { error: resetWalletErr } = await supabase
    .from("wallets")
    .update({ balance: balanceToRestore })
    .eq("id", dbWallet.id);
  if (resetWalletErr) console.error(`Warning: Failed to reset test wallet balance: ${resetWalletErr.message}`);

  // If created temp seller profile and user, delete them
  if (createdTempSeller) {
    // Delete seeded transactions first
    const { error: seedDelErr } = await supabase
      .from("wallet_transactions")
      .delete()
      .eq("wallet_id", dbWallet.id);
    if (seedDelErr) console.error(`Warning: Failed to delete seeded transactions: ${seedDelErr.message}`);

    // Delete wallet
    const { error: walletDelErr } = await supabase
      .from("wallets")
      .delete()
      .eq("id", dbWallet.id);
    if (walletDelErr) console.error(`Warning: Failed to delete temp wallet: ${walletDelErr.message}`);

    // Delete profile
    const { error: profileDelErr } = await supabase
      .from("seller_profiles")
      .delete()
      .eq("id", testSellerProfileId);
    if (profileDelErr) console.error(`Warning: Failed to delete temp profile: ${profileDelErr.message}`);

    // Delete user
    const { error: userDelErr } = await supabase
      .from("users")
      .delete()
      .eq("id", testSellerUserId);
    if (userDelErr) console.error(`Warning: Failed to delete temp user: ${userDelErr.message}`);
  }

  console.log("✔ Cleanup complete.");
  console.log("\n★★★ ECOPAY WALLET & WITHDRAWAL INTEGRATION TEST PASSED SUCCESSFULLY ★★★");
}

main().catch((error) => {
  console.error("\n❌ TEST FAILED:", error.message);
  process.exit(1);
});
