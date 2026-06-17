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

  console.log("Starting Manual Donation Product Submission API Test...");

  // 1. Find or create a test seller profile
  console.log("Finding existing seller user...");
  let sellerUser = null;
  
  const { data: existingSellers, error: findError } = await supabase
    .from("users")
    .select("id, email")
    .eq("role", "seller")
    .limit(1);

  if (findError) {
    throw new Error(`Failed to query users: ${findError.message}`);
  }

  let testUserId;
  let testSellerProfileId;
  let createdTestUser = false;

  if (existingSellers && existingSellers.length > 0) {
    testUserId = existingSellers[0].id;
    console.log(`Found existing seller user: ${existingSellers[0].email} (ID: ${testUserId})`);
    
    // Get their profile
    const { data: profile } = await supabase
      .from("seller_profiles")
      .select("id")
      .eq("user_id", testUserId)
      .maybeSingle();
      
    if (profile) {
      testSellerProfileId = profile.id;
    }
  }

  // If no seller user/profile, create one
  if (!testSellerProfileId) {
    console.log("No seller profile found. Creating a temporary test seller user...");
    testUserId = crypto.randomUUID();
    testSellerProfileId = crypto.randomUUID();
    createdTestUser = true;

    const { error: userInsertError } = await supabase.from("users").insert({
      id: testUserId,
      full_name: "Test Donation Seller",
      email: `test.donation.seller.${Date.now()}@ecoeat.local`,
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
      user_id: testUserId,
      business_name: "Test Donation Business",
      business_type: "food_business",
      legal_document_url: "http://example.com/legal.pdf",
      verification_status: "approved",
      created_at: new Date().toISOString(),
    });

    if (profileInsertError) {
      await supabase.from("users").delete().eq("id", testUserId);
      throw new Error(`Failed to create temp seller profile: ${profileInsertError.message}`);
    }
    console.log(`Created temp seller profile with ID: ${testSellerProfileId}`);
  }

  // 2. Call the manual product upload endpoint
  console.log("\n--- Calling POST /api/seller/donations/products ---");
  const formData = new FormData();
  formData.append("title", "Nasi Goreng Kambing");
  formData.append("portionQuantity", "12");
  formData.append("category", "Prepared Meals");
  formData.append("expiryText", "4 hours");
  formData.append("description", "Nasi goreng kambing sisa prasmanan catering, masih sangat layak makan dan bersih.");
  formData.append("userId", testUserId);

  // Append a tiny dummy PNG image file
  const dummyBuffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
  const blob = new Blob([dummyBuffer], { type: "image/png" });
  formData.append("imageFile", blob, "nasi-goreng-kambing.png");

  const response = await fetch("http://localhost:3000/api/seller/donations/products", {
    method: "POST",
    body: formData,
  });

  const status = response.status;
  const result = await response.json();

  console.log(`Response Status: ${status}`);
  console.log("Response JSON:", JSON.stringify(result, null, 2));

  if (status !== 200 || !result.ok) {
    throw new Error(`Product creation failed: ${result.error || "Unknown error"}`);
  }

  const createdProduct = result.product;
  console.log("✔ Product creation API call succeeded.");
  console.log(`Created Product ID: ${createdProduct.id}`);

  // 3. Verify database records
  console.log("\n--- Verifying Supabase Database Records ---");
  const { data: dbProduct, error: queryProdError } = await supabase
    .from("products")
    .select("*")
    .eq("id", createdProduct.id)
    .maybeSingle();

  if (queryProdError) {
    throw new Error(`Database query error for product: ${queryProdError.message}`);
  }

  if (!dbProduct) {
    throw new Error("Verification failed: Product record was not found in 'products' table!");
  }

  console.log("✔ Verified product record exists in 'products' table.");
  console.log(`  Title: ${dbProduct.title}`);
  console.log(`  Stock quantity: ${dbProduct.stock_quantity}`);
  console.log(`  Portion quantity: ${dbProduct.portion_quantity}`);
  console.log(`  Is Donation: ${dbProduct.is_donation}`);
  console.log(`  Expiry date: ${dbProduct.expiry_date}`);

  const { data: dbImage, error: queryImgError } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", createdProduct.id)
    .maybeSingle();

  if (queryImgError) {
    throw new Error(`Database query error for product image: ${queryImgError.message}`);
  }

  if (!dbImage) {
    throw new Error("Verification failed: Product image record was not found in 'product_images' table!");
  }

  console.log("✔ Verified product image record exists in 'product_images' table.");
  console.log(`  Image URL: ${dbImage.image_url}`);
  console.log(`  Is Primary: ${dbImage.is_primary}`);

  // 4. Cleanup test data
  console.log("\n--- Cleaning Up Test Records ---");
  const { error: imgDelError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", createdProduct.id);

  if (imgDelError) {
    console.error(`Warning: Failed to delete test product images: ${imgDelError.message}`);
  }

  const { error: prodDelError } = await supabase
    .from("products")
    .delete()
    .eq("id", createdProduct.id);

  if (prodDelError) {
    console.error(`Warning: Failed to delete test product: ${prodDelError.message}`);
  }

  if (createdTestUser) {
    const { error: profileDelError } = await supabase
      .from("seller_profiles")
      .delete()
      .eq("id", testSellerProfileId);
    if (profileDelError) console.error(`Warning: Failed to delete temp seller profile: ${profileDelError.message}`);

    const { error: userDelError } = await supabase
      .from("users")
      .delete()
      .eq("id", testUserId);
    if (userDelError) console.error(`Warning: Failed to delete temp seller user: ${userDelError.message}`);
  }

  console.log("✔ Cleanup complete.");
  console.log("\n★★★ MANUAL DONATION PRODUCT UPLOAD TEST PASSED SUCCESSFULLY ★★★");
}

main().catch((error) => {
  console.error("\n❌ TEST FAILED:", error.message);
  process.exit(1);
});
