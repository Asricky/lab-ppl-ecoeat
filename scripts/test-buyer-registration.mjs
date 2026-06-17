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

async function main() {
  loadEnvFile(".env");

  const supabaseUrl = assertEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = assertEnv("SUPABASE_SERVICE_ROLE_KEY");

  // Admin client to allow inserts/deletes bypassing RLS if necessary
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log("Starting Buyer Registration Test...");

  const timestamp = Date.now();
  const testEmail = `buyer.test.${timestamp}@ecoeat.local`;
  const testName = "Buyer Registration Auto Test";
  const testPassword = `BuyerPass${timestamp}!`;
  
  // 1. Direct DB Verification Test
  console.log("\n--- Step 1: Running Direct Database Verification Test ---");
  const userId = crypto.randomUUID();
  const profileId = crypto.randomUUID();
  const now = new Date().toISOString();
  const passwordHash = await createPasswordHash(testPassword);

  const testUserPayload = {
    id: userId,
    full_name: testName,
    email: testEmail,
    password_hash: passwordHash,
    role: "buyer",
    avatar_url: null,
    phone_number: null,
    is_verified: true,
    verification_status: "approved",
    is_active: true,
    created_at: now,
    updated_at: now,
  };

  const testProfilePayload = {
    id: profileId,
    user_id: userId,
    created_at: now,
  };

  // Insert user
  console.log(`Inserting test user to 'users' table with email: ${testEmail}...`);
  const { error: userError } = await supabase.from("users").insert(testUserPayload);
  if (userError) {
    throw new Error(`Direct user insert failed: ${userError.message}`);
  }
  console.log("✔ Test user inserted successfully.");

  // Insert profile
  console.log(`Inserting test profile to 'buyer_profiles' table...`);
  const { error: profileError } = await supabase.from("buyer_profiles").insert(testProfilePayload);
  if (profileError) {
    // Rollback user
    await supabase.from("users").delete().eq("id", userId);
    throw new Error(`Direct buyer profile insert failed: ${profileError.message}`);
  }
  console.log("✔ Test buyer profile inserted successfully.");

  // Verify retrieval
  console.log("Verifying data existence via SELECT...");
  const { data: userData, error: userSelectError } = await supabase
    .from("users")
    .select("id, email, role")
    .eq("id", userId)
    .single();

  if (userSelectError || !userData) {
    throw new Error(`Failed to retrieve test user: ${userSelectError?.message}`);
  }

  const { data: profileData, error: profileSelectError } = await supabase
    .from("buyer_profiles")
    .select("id, user_id")
    .eq("id", profileId)
    .single();

  if (profileSelectError || !profileData) {
    throw new Error(`Failed to retrieve test buyer profile: ${profileSelectError?.message}`);
  }

  console.log("✔ Select validation passed:");
  console.log("  User:", userData);
  console.log("  Profile:", profileData);

  // Clean up
  console.log("Cleaning up test records...");
  await supabase.from("buyer_profiles").delete().eq("id", profileId);
  await supabase.from("users").delete().eq("id", userId);
  console.log("✔ Cleanup complete.");

  // 2. API Endpoint Verification Test (Conditional on server running)
  if (process.argv.includes("--api")) {
    console.log("\n--- Step 2: Running API Route Integration Test ---");
    const apiEmail = `buyer.api.${timestamp}@ecoeat.local`;
    const apiPayload = {
      name: "Buyer API Auto Test",
      email: apiEmail,
      password: testPassword,
    };

    console.log(`Calling POST http://localhost:3000/api/buyer-registration...`);
    const response = await fetch("http://localhost:3000/api/buyer-registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apiPayload),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(`API returned error code ${response.status}: ${result?.message}`);
    }

    console.log("✔ API response successful!");
    console.log("API Response User:", result.user);
    console.log("API Response Profile:", result.buyerProfile);

    // Verify DB insertion by API
    console.log("Verifying DB records created by the API...");
    const { data: apiUser, error: apiUserError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", apiEmail)
      .single();

    if (apiUserError || !apiUser) {
      throw new Error(`API user records not found in database: ${apiUserError?.message}`);
    }

    const { data: apiProfile, error: apiProfileError } = await supabase
      .from("buyer_profiles")
      .select("id, user_id")
      .eq("user_id", apiUser.id)
      .single();

    if (apiProfileError || !apiProfile) {
      throw new Error(`API profile record not found in database: ${apiProfileError?.message}`);
    }

    console.log("✔ API DB verification passed!");

    // Clean up API test user and profile
    console.log("Cleaning up API test records...");
    await supabase.from("buyer_profiles").delete().eq("id", apiProfile.id);
    await supabase.from("users").delete().eq("id", apiUser.id);
    console.log("✔ Cleanup complete.");
  }

  console.log("\n★★★ ALL TESTS PASSED SUCCESSFULLY ★★★");
}

main().catch((error) => {
  console.error("\n❌ TEST FAILED:", error.message);
  process.exit(1);
});
