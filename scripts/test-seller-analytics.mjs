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

  console.log("Starting Seller Analytics API Endpoint Test...");

  // 1. Find or create a test seller
  console.log("Querying for an existing seller user...");
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
      full_name: "Test Analytics Seller",
      email: `test.analytics.seller.${Date.now()}@ecoeat.local`,
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
      business_name: "Test Analytics Business",
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

  // 2. Query analytics for each timeRange option
  const ranges = ["This Week", "This Month", "This Year", "All Time"];

  for (const timeRange of ranges) {
    console.log(`\n--- Calling GET /api/seller/analytics for Range: "${timeRange}" ---`);
    const response = await fetch(`http://localhost:3000/api/seller/analytics?sellerId=${testSellerUserId}&timeRange=${encodeURIComponent(timeRange)}`);
    const status = response.status;
    const result = await response.json();

    console.log(`Response Status: ${status}`);
    if (status !== 200) {
      throw new Error(`Failed to retrieve analytics for range ${timeRange}: ${result.error || "Unknown error"}`);
    }

    // Verify schema properties
    if (!result.sellerProfile || typeof result.sellerProfile.businessName !== "string") {
      throw new Error("Validation Error: Missing or invalid sellerProfile.businessName in response");
    }
    if (!result.metrics || typeof result.metrics.totalOrders !== "number") {
      throw new Error("Validation Error: Missing or invalid metrics.totalOrders in response");
    }
    if (typeof result.metrics.totalDonationPortions !== "number") {
      throw new Error("Validation Error: Missing or invalid metrics.totalDonationPortions in response");
    }
    if (typeof result.metrics.activeProducts !== "number") {
      throw new Error("Validation Error: Missing or invalid metrics.activeProducts in response");
    }
    if (!Array.isArray(result.chartSeries)) {
      throw new Error("Validation Error: Missing or invalid chartSeries array in response");
    }
    if (!Array.isArray(result.topProducts)) {
      throw new Error("Validation Error: Missing or invalid topProducts array in response");
    }

    console.log("✔ Response schema successfully verified.");
    console.log(`  Seller Business: ${result.sellerProfile.businessName}`);
    console.log(`  Metrics: Orders=${result.metrics.totalOrders}, Saved Portions=${result.metrics.totalDonationPortions}, Active Products=${result.metrics.activeProducts}`);
    console.log(`  Chart series size: ${result.chartSeries.length}`);
    console.log(`  Chart labels: ${result.chartSeries.map(p => p.label).join(", ")}`);
    console.log(`  Top Performing count: ${result.topProducts.length}`);
  }

  // 3. Clean up temp seller if we created it
  if (createdTempSeller) {
    console.log("\n--- Cleaning Up Temp Seller Profile and User ---");
    const { error: profileDelError } = await supabase
      .from("seller_profiles")
      .delete()
      .eq("id", testSellerProfileId);
    if (profileDelError) console.error(`Warning: Failed to delete temp seller profile: ${profileDelError.message}`);

    const { error: userDelError } = await supabase
      .from("users")
      .delete()
      .eq("id", testSellerUserId);
    if (userDelError) console.error(`Warning: Failed to delete temp seller user: ${userDelError.message}`);
    console.log("✔ Cleanup complete.");
  }

  console.log("\n★★★ SELLER ANALYTICS API ENDPOINT TEST PASSED SUCCESSFULLY ★★★");
}

main().catch((error) => {
  console.error("\n❌ TEST FAILED:", error.message);
  process.exit(1);
});
