import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { randomBytes, scrypt as scryptCallback } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);

function loadEnvFile(path) {
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
}

function assertEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

async function createPasswordHash(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

async function runApiTest(email, password) {
  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const status = response.status;
  const result = await response.json();
  return { status, result };
}

async function main() {
  loadEnvFile(".env");

  const supabaseUrl = assertEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = assertEnv("SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log("Starting Database-Driven Login & Role Detection Test...");

  const timestamp = Date.now();
  const sellerEmail = `test.seller.${timestamp}@ecoeat.local`;
  const buyerEmail = `test.buyer.${timestamp}@ecoeat.local`;
  const password = `LoginTestPass${timestamp}!`;
  
  const sellerUserId = crypto.randomUUID();
  const buyerUserId = crypto.randomUUID();

  // Create password hash
  const passwordHash = await createPasswordHash(password);

  console.log("\n--- Creating Test Accounts ---");
  // 1. Insert Seller User
  console.log(`Inserting seller user: ${sellerEmail}...`);
  const { error: sError } = await supabase.from("users").insert({
    id: sellerUserId,
    full_name: "Test Seller User",
    email: sellerEmail,
    password_hash: passwordHash,
    role: "seller",
    is_verified: true,
    verification_status: "approved",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  if (sError) throw new Error(`Failed to insert seller user: ${sError.message}`);
  console.log("✔ Seller user created.");

  // 2. Insert Buyer User
  console.log(`Inserting buyer user: ${buyerEmail}...`);
  const { error: bError } = await supabase.from("users").insert({
    id: buyerUserId,
    full_name: "Test Buyer User",
    email: buyerEmail,
    password_hash: passwordHash,
    role: "buyer",
    is_verified: true,
    verification_status: "approved",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  if (bError) {
    await supabase.from("users").delete().eq("id", sellerUserId);
    throw new Error(`Failed to insert buyer user: ${bError.message}`);
  }
  console.log("✔ Buyer user created.");

  // Also create wallets to test wallet balance retrieval
  console.log("Creating test wallets...");
  await supabase.from("wallets").insert([
    { id: crypto.randomUUID(), user_id: sellerUserId, balance: 150000 },
    { id: crypto.randomUUID(), user_id: buyerUserId, balance: 250000 }
  ]);
  console.log("✔ Test wallets created.");

  try {
    console.log("\n--- Testing API Login Endpoint ---");
    
    // Test 1: Seller login
    console.log("Testing Seller login...");
    const { status: sStatus, result: sResult } = await runApiTest(sellerEmail, password);
    if (sStatus !== 200 || sResult.user?.role !== "seller") {
      throw new Error(`Seller login test failed! Status: ${sStatus}, Role: ${sResult.user?.role}`);
    }
    console.log("✔ Seller logged in successfully, role detected: 'seller', balance:", sResult.user?.ecoPayBalance);

    // Test 2: Buyer login
    console.log("Testing Buyer login...");
    const { status: bStatus, result: bResult } = await runApiTest(buyerEmail, password);
    if (bStatus !== 200 || bResult.user?.role !== "buyer") {
      throw new Error(`Buyer login test failed! Status: ${bStatus}, Role: ${bResult.user?.role}`);
    }
    console.log("✔ Buyer logged in successfully, role detected: 'buyer', balance:", bResult.user?.ecoPayBalance);

    // Test 3: Incorrect password
    console.log("Testing incorrect password...");
    const { status: badPassStatus, result: badPassResult } = await runApiTest(buyerEmail, "wrong_password");
    if (badPassStatus !== 401) {
      throw new Error(`Incorrect password check failed! Expected 401, got ${badPassStatus}`);
    }
    console.log("✔ Incorrect password test passed with expected 401 error message:", badPassResult.message);

    // Test 4: Incorrect email
    console.log("Testing non-existent email...");
    const { status: badEmailStatus, result: badEmailResult } = await runApiTest("nonexistent@example.com", password);
    if (badEmailStatus !== 401) {
      throw new Error(`Incorrect email check failed! Expected 401, got ${badEmailStatus}`);
    }
    console.log("✔ Non-existent email test passed with expected 401 error message:", badEmailResult.message);

  } finally {
    console.log("\n--- Cleaning Up Test Records ---");
    const { error: wDel } = await supabase.from("wallets").delete().in("user_id", [sellerUserId, buyerUserId]);
    if (wDel) console.error("Warning: Wallet cleanup failed:", wDel.message);
    
    const { error: uDel } = await supabase.from("users").delete().in("id", [sellerUserId, buyerUserId]);
    if (uDel) console.error("Warning: Users cleanup failed:", uDel.message);
    
    console.log("✔ Cleanup complete.");
  }

  console.log("\n★★★ ALL LOGIN TESTS PASSED SUCCESSFULLY ★★★");
}

main().catch((error) => {
  console.error("\n❌ TEST FAILED:", error.message);
  process.exit(1);
});
