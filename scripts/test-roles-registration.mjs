import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

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

function createDummyFile(filename) {
  const transparentPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
    "base64",
  );
  return new File([transparentPng], filename, { type: "image/png" });
}

async function loginApi(email, password) {
  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const result = await response.json();
  return { status: response.status, result };
}

async function main() {
  loadEnvFile(".env");

  const supabaseUrl = assertEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = assertEnv("SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log("Starting Courier & LKS Registration and Login Integration Tests...\n");

  const timestamp = Date.now();
  const courierEmail = `courier.test.${timestamp}@ecoeat.local`;
  const lksEmail = `lks.test.${timestamp}@ecoeat.local`;
  const testPassword = `SecurePass${timestamp}!`;

  let courierUserId = null;
  let lksUserId = null;

  try {
    // ----------------------------------------
    // 1. Courier Registration and Login Test
    // ----------------------------------------
    console.log("=== Step 1: Testing Courier Registration API ===");
    const courierFormData = new FormData();
    courierFormData.append("name", "Test Courier Rider");
    courierFormData.append("email", courierEmail);
    courierFormData.append("password", testPassword);
    courierFormData.append("vehicleType", "Motorcycle");
    courierFormData.append("plateNumber", "B 9999 XYZ");
    courierFormData.append("simDocument", createDummyFile("test-sim.png"));
    courierFormData.append("stnkDocument", createDummyFile("test-stnk.png"));

    const courierRegisterResponse = await fetch("http://localhost:3000/api/courier-registration", {
      method: "POST",
      body: courierFormData,
    });
    const courierRegisterResult = await courierRegisterResponse.json();

    if (!courierRegisterResponse.ok) {
      throw new Error(`Courier registration API failed: ${courierRegisterResult.message}`);
    }

    courierUserId = courierRegisterResult.user.id;
    console.log("✔ Courier registered successfully via API. User ID:", courierUserId);

    // Verify DB
    console.log("Verifying Courier database records...");
    const { data: dbCourierUser, error: dbCourierUserError } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("id", courierUserId)
      .single();

    if (dbCourierUserError || !dbCourierUser) {
      throw new Error(`Courier user not found in database: ${dbCourierUserError?.message}`);
    }
    console.log("✔ User table matches: ", dbCourierUser);

    const { data: dbCourierProfile, error: dbCourierProfileError } = await supabase
      .from("courier_profiles")
      .select("id, vehicle_type, vehicle_plate_number, driver_license_url, vehicle_registration_url")
      .eq("user_id", courierUserId)
      .single();

    if (dbCourierProfileError || !dbCourierProfile) {
      throw new Error(`Courier profile not found in database: ${dbCourierProfileError?.message}`);
    }
    console.log("✔ Courier profile matches: ", dbCourierProfile);

    // Test Login for Courier
    console.log("\nTesting login for registered Courier...");
    const { status: courierLoginStatus, result: courierLoginResult } = await loginApi(courierEmail, testPassword);
    if (courierLoginStatus !== 200 || courierLoginResult.user.role !== "courier") {
      throw new Error(`Courier login failed! Status: ${courierLoginStatus}, Role: ${courierLoginResult.user?.role}`);
    }
    console.log("✔ Courier login successful! Token:", courierLoginResult.token);

    console.log("\n----------------------------------------\n");

    // ----------------------------------------
    // 2. LKS Registration and Login Test
    // ----------------------------------------
    console.log("=== Step 2: Testing LKS Registration API ===");
    const lksFormData = new FormData();
    lksFormData.append("name", "Test LKS PIC");
    lksFormData.append("email", lksEmail);
    lksFormData.append("businessName", "Yayasan EcoEat Lestari");
    lksFormData.append("password", testPassword);
    lksFormData.append("lksType", "Panti Asuhan");
    lksFormData.append("legalPermit", "LKS-TEST-DINSOS/2026");
    lksFormData.append("capacity", "150");
    lksFormData.append("foodStorage", "Chiller & Dry Storage");
    lksFormData.append("legalDocument", createDummyFile("test-sk-kemenkumham.png"));

    const lksRegisterResponse = await fetch("http://localhost:3000/api/lks-registration", {
      method: "POST",
      body: lksFormData,
    });
    const lksRegisterResult = await lksRegisterResponse.json();

    if (!lksRegisterResponse.ok) {
      throw new Error(`LKS registration API failed: ${lksRegisterResult.message}`);
    }

    lksUserId = lksRegisterResult.user.id;
    console.log("✔ LKS registered successfully via API. User ID:", lksUserId);

    // Verify DB
    console.log("Verifying LKS database records...");
    const { data: dbLksUser, error: dbLksUserError } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("id", lksUserId)
      .single();

    if (dbLksUserError || !dbLksUser) {
      throw new Error(`LKS user not found in database: ${dbLksUserError?.message}`);
    }
    console.log("✔ User table matches: ", dbLksUser);

    const { data: dbLksProfile, error: dbLksProfileError } = await supabase
      .from("lks_profiles")
      .select("id, foundation_name, lks_category, legal_permit_number, legal_document_url, beneficiaries_count, storage_type")
      .eq("user_id", lksUserId)
      .single();

    if (dbLksProfileError || !dbLksProfile) {
      throw new Error(`LKS profile not found in database: ${dbLksProfileError?.message}`);
    }
    console.log("✔ LKS profile matches: ", dbLksProfile);

    // Test Login for LKS
    console.log("\nTesting login for registered LKS...");
    const { status: lksLoginStatus, result: lksLoginResult } = await loginApi(lksEmail, testPassword);
    if (lksLoginStatus !== 200 || lksLoginResult.user.role !== "lks") {
      throw new Error(`LKS login failed! Status: ${lksLoginStatus}, Role: ${lksLoginResult.user?.role}`);
    }
    console.log("✔ LKS login successful! Token:", lksLoginResult.token);

    console.log("\n----------------------------------------\n");

  } finally {
    console.log("=== Cleaning Up Database Test Records ===");
    if (courierUserId) {
      console.log(`Cleaning up Courier records for user ID ${courierUserId}...`);
      await supabase.from("courier_profiles").delete().eq("user_id", courierUserId);
      await supabase.from("users").delete().eq("id", courierUserId);
    }
    if (lksUserId) {
      console.log(`Cleaning up LKS records for user ID ${lksUserId}...`);
      await supabase.from("lks_profiles").delete().eq("user_id", lksUserId);
      await supabase.from("users").delete().eq("id", lksUserId);
    }
    console.log("✔ Database cleanup complete.");
  }

  console.log("\n★★★ ALL COURIER AND LKS TESTS PASSED SUCCESSFULLY ★★★");
}

main().catch((error) => {
  console.error("\n❌ TESTS FAILED:", error.message);
  process.exit(1);
});
