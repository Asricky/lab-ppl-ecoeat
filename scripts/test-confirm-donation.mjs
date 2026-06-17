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

  console.log("Starting Confirm Donation Workflow API Test...");

  // 1. Find or create a test seller profile
  console.log("Finding existing seller user...");
  let existingSeller = null;
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
      full_name: "Test Donation Confirmation Seller",
      email: `test.confirmation.seller.${Date.now()}@ecoeat.local`,
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
      business_name: "Test Confirmation Seller Business",
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

  // 2. Find or create a test LKS profile
  console.log("\nFinding existing LKS profile...");
  let testLksProfileId;
  let testLksUserId;
  let createdTempLks = false;

  const { data: existingLks, error: findLksError } = await supabase
    .from("lks_profiles")
    .select("id, user_id, foundation_name")
    .limit(1);

  if (findLksError) {
    throw new Error(`Failed to query LKS profiles: ${findLksError.message}`);
  }

  if (existingLks && existingLks.length > 0) {
    testLksProfileId = existingLks[0].id;
    testLksUserId = existingLks[0].user_id;
    console.log(`Found existing LKS profile: ${existingLks[0].foundation_name} (ID: ${testLksProfileId})`);
  } else {
    console.log("No LKS profile found. Creating a temporary test LKS profile...");
    testLksUserId = crypto.randomUUID();
    testLksProfileId = crypto.randomUUID();
    createdTempLks = true;

    const { error: userInsertError } = await supabase.from("users").insert({
      id: testLksUserId,
      full_name: "Test LKS Foundation",
      email: `test.lks.${Date.now()}@ecoeat.local`,
      password_hash: "scrypt:dummy:dummy",
      role: "lks",
      is_verified: true,
      verification_status: "approved",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (userInsertError) {
      throw new Error(`Failed to create temp LKS user: ${userInsertError.message}`);
    }

    const { error: profileInsertError } = await supabase.from("lks_profiles").insert({
      id: testLksProfileId,
      user_id: testLksUserId,
      foundation_name: "Test LKS Peduli Makanan",
      lks_category: "Sosial & Panti Asuhan",
      storage_type: "Cold Storage & Refrigerator",
      verification_status: "approved",
      created_at: new Date().toISOString(),
    });

    if (profileInsertError) {
      await supabase.from("users").delete().eq("id", testLksUserId);
      throw new Error(`Failed to create temp LKS profile: ${profileInsertError.message}`);
    }
    console.log(`Created temp LKS profile with ID: ${testLksProfileId}`);
  }

  // 3. Find or create a test product
  console.log("\nFinding existing product for donation...");
  let testProductId;
  let createdTempProduct = false;

  const { data: existingProduct, error: findProdError } = await supabase
    .from("products")
    .select("id")
    .limit(1);

  if (findProdError) {
    throw new Error(`Failed to query products: ${findProdError.message}`);
  }

  if (existingProduct && existingProduct.length > 0) {
    testProductId = existingProduct[0].id;
    console.log(`Found existing product: ${testProductId}`);
  } else {
    console.log("No product found. Creating a temporary test product...");
    testProductId = crypto.randomUUID();
    createdTempProduct = true;

    const { error: prodInsertError } = await supabase.from("products").insert({
      id: testProductId,
      seller_profile_id: testSellerProfileId,
      title: "QA Test Food Product",
      description: "Prepared Meals Category",
      price: 0,
      stock_quantity: 10,
      portion_quantity: 10,
      expiry_date: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      is_donation: true,
      status: "active",
      created_at: new Date().toISOString(),
    });

    if (prodInsertError) {
      throw new Error(`Failed to create temp product: ${prodInsertError.message}`);
    }
    console.log(`Created temp product with ID: ${testProductId}`);
  }

  // 4. Call POST /api/donations endpoint to confirm donation
  console.log("\n--- Calling POST /api/donations ---");
  const postPayload = {
    lksId: testLksProfileId,
    productName: "Nasi Box Penyelamat",
    productId: testProductId,
    category: "Prepared Meals",
    expiry: "4 hours",
    quantity: 5,
    weightLabel: "5 porsi",
    sellerId: testSellerUserId,
  };

  const response = await fetch("http://localhost:3000/api/donations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postPayload),
  });

  const postStatus = response.status;
  const postResult = await response.json();

  console.log(`Response Status: ${postStatus}`);
  console.log("Response JSON:", JSON.stringify(postResult, null, 2));

  if (postStatus !== 200 || !postResult.ok) {
    throw new Error(`Donation confirmation failed: ${postResult.error || "Unknown error"}`);
  }

  const createdOrderId = postResult.orderId;
  console.log(`✔ Donation confirmation POST succeeded. Order ID: ${createdOrderId}`);

  // 5. Verify database records
  console.log("\n--- Verifying Supabase Database Records ---");

  // A. Verify orders
  const { data: dbOrder, error: orderQueryError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", createdOrderId)
    .maybeSingle();

  if (orderQueryError) throw new Error(`Orders table query failed: ${orderQueryError.message}`);
  if (!dbOrder) throw new Error(`Verification failed: Order record was not found in 'orders' table!`);
  console.log("✔ Verified order record exists in 'orders' table.");
  console.log(`  Order Code: ${dbOrder.order_code}`);
  console.log(`  Order Type: ${dbOrder.order_type}`);
  console.log(`  Total Portions: ${dbOrder.total_portions}`);
  console.log(`  LKS ID: ${dbOrder.lks_id}`);
  console.log(`  Notes (weight label): ${dbOrder.notes}`);

  // B. Verify order_items
  const { data: dbOrderItem, error: itemQueryError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", createdOrderId)
    .maybeSingle();

  if (itemQueryError) throw new Error(`Order items table query failed: ${itemQueryError.message}`);
  if (!dbOrderItem) throw new Error(`Verification failed: Order item was not found in 'order_items' table!`);
  console.log("✔ Verified order_item record exists in 'order_items' table.");
  console.log(`  Product ID: ${dbOrderItem.product_id}`);
  console.log(`  Quantity: ${dbOrderItem.quantity}`);

  // C. Verify deliveries
  const { data: dbDelivery, error: deliveryQueryError } = await supabase
    .from("deliveries")
    .select("*")
    .eq("order_id", createdOrderId)
    .maybeSingle();

  if (deliveryQueryError) throw new Error(`Deliveries table query failed: ${deliveryQueryError.message}`);
  if (!dbDelivery) throw new Error(`Verification failed: Delivery was not found in 'deliveries' table!`);
  console.log("✔ Verified delivery record exists in 'deliveries' table.");
  console.log(`  Delivery ID: ${dbDelivery.id}`);
  console.log(`  Delivery Status: ${dbDelivery.delivery_status}`);
  console.log(`  Pickup Address: ${dbDelivery.pickup_address}`);
  console.log(`  Destination Address: ${dbDelivery.destination_address}`);

  // D. Verify delivery_tracking_logs
  const { data: dbTrackingLogs, error: trackingQueryError } = await supabase
    .from("delivery_tracking_logs")
    .select("*")
    .eq("delivery_id", dbDelivery.id);

  if (trackingQueryError) throw new Error(`Delivery tracking logs table query failed: ${trackingQueryError.message}`);
  if (!dbTrackingLogs || dbTrackingLogs.length === 0) {
    throw new Error(`Verification failed: No tracking logs found in 'delivery_tracking_logs' table!`);
  }
  console.log("✔ Verified tracking log record exists in 'delivery_tracking_logs' table.");
  console.log(`  Total logs: ${dbTrackingLogs.length}`);
  console.log(`  Status of latest log: ${dbTrackingLogs[0].status}`);
  console.log(`  Coordinates: Lat ${dbTrackingLogs[0].latitude}, Lon ${dbTrackingLogs[0].longitude}`);

  // 6. Test GET endpoint for donations
  console.log("\n--- Calling GET /api/donations ---");
  const getResponse = await fetch(`http://localhost:3000/api/donations?sellerId=${testSellerUserId}`);
  const getStatus = getResponse.status;
  const getResult = await getResponse.json();

  console.log(`GET Response Status: ${getStatus}`);
  if (getStatus !== 200 || !getResult.donations) {
    throw new Error(`Failed to retrieve donations: ${getResult.error || "Unknown error"}`);
  }

  const verifiedDonation = getResult.donations.find(d => d.id === createdOrderId);
  if (!verifiedDonation) {
    throw new Error("Verification failed: The newly created order was not returned by GET /api/donations!");
  }
  console.log("✔ GET /api/donations successfully retrieved the newly created donation.");
  console.log(`  Retrieved product: ${verifiedDonation.productName}`);
  console.log(`  Retrieved recipient: ${verifiedDonation.recipient}`);
  console.log(`  Retrieved courier: ${verifiedDonation.courierName}`);
  console.log(`  Retrieved tracking logs count: ${verifiedDonation.trackingLogs?.length}`);

  // 7. Cleanup test data in reverse order of foreign keys
  console.log("\n--- Cleaning Up Test Records ---");

  // A. Delete tracking logs
  const { error: trackingDelError } = await supabase
    .from("delivery_tracking_logs")
    .delete()
    .eq("delivery_id", dbDelivery.id);
  if (trackingDelError) console.error(`Warning: Failed to delete tracking logs: ${trackingDelError.message}`);

  // B. Delete deliveries
  const { error: deliveryDelError } = await supabase
    .from("deliveries")
    .delete()
    .eq("id", dbDelivery.id);
  if (deliveryDelError) console.error(`Warning: Failed to delete delivery: ${deliveryDelError.message}`);

  // C. Delete order items
  const { error: itemsDelError } = await supabase
    .from("order_items")
    .delete()
    .eq("order_id", createdOrderId);
  if (itemsDelError) console.error(`Warning: Failed to delete order items: ${itemsDelError.message}`);

  // D. Delete order
  const { error: orderDelError } = await supabase
    .from("orders")
    .delete()
    .eq("id", createdOrderId);
  if (orderDelError) console.error(`Warning: Failed to delete order: ${orderDelError.message}`);

  // E. Delete temp product
  if (createdTempProduct) {
    const { error: prodDelError } = await supabase
      .from("products")
      .delete()
      .eq("id", testProductId);
    if (prodDelError) console.error(`Warning: Failed to delete temp product: ${prodDelError.message}`);
  }

  // F. Delete temp LKS profile & user
  if (createdTempLks) {
    const { error: profileDelError } = await supabase
      .from("lks_profiles")
      .delete()
      .eq("id", testLksProfileId);
    if (profileDelError) console.error(`Warning: Failed to delete temp LKS profile: ${profileDelError.message}`);

    const { error: userDelError } = await supabase
      .from("users")
      .delete()
      .eq("id", testLksUserId);
    if (userDelError) console.error(`Warning: Failed to delete temp LKS user: ${userDelError.message}`);
  }

  // G. Delete temp seller profile & user
  if (createdTempSeller) {
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
  }

  console.log("✔ Cleanup complete.");
  console.log("\n★★★ CONFIRM DONATION INTEGRATION TEST PASSED SUCCESSFULLY ★★★");
}

main().catch((error) => {
  console.error("\n❌ TEST FAILED:", error.message);
  process.exit(1);
});
