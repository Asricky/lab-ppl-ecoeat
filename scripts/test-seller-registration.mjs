import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(path) {
  const env = readFileSync(path, "utf8");

  for (const line of env.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

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

async function uploadLegalDocument() {
  const formData = new FormData();
  const transparentPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
    "base64",
  );
  const file = new File(
    [transparentPng],
    "seller-license-test.png",
    { type: "image/png" },
  );

  formData.append("file", file);

  const response = await fetch("http://localhost:3000/api/seller-registration/legal-document", {
    method: "POST",
    body: formData,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${result?.message || response.statusText}`);
  }

  if (!result.url) {
    throw new Error("Cloudinary upload did not return a URL");
  }

  return result.url;
}

function createLegalDocumentFile() {
  const transparentPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
    "base64",
  );

  return new File(
    [transparentPng],
    "seller-license-test.png",
    { type: "image/png" },
  );
}

async function registerSellerThroughApp() {
  const timestamp = Date.now();
  const registrationFormData = new FormData();

  registrationFormData.append("name", "Seller Registration Test");
  registrationFormData.append("email", `seller.endpoint.${timestamp}@ecoeat.local`);
  registrationFormData.append("businessName", "EcoEat Test Kitchen");
  registrationFormData.append("password", `SellerTest${timestamp}!`);
  registrationFormData.append("legalDocument", createLegalDocumentFile());

  const response = await fetch("http://localhost:3000/api/seller-registration", {
    method: "POST",
    body: registrationFormData,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Seller registration endpoint failed: ${result?.message || response.statusText}`);
  }

  return result;
}

async function main() {
  loadEnvFile(".env");

  const supabase = createClient(
    assertEnv("NEXT_PUBLIC_SUPABASE_URL"),
    assertEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );

  if (process.argv.includes("--diagnose")) {
    for (const tableName of [
      "users",
      "sellers",
      "seller_profiles",
      "seller_verifications",
      "businesses",
      "profiles",
      "wallets",
      "products",
      "orders",
    ]) {
      const { data, error } = await supabase.from(tableName).select("*").limit(1);

      console.log(JSON.stringify({
        tableName,
        ok: !error,
        data,
        error,
      }, null, 2));
    }

    for (const query of [
      {
        tableName: "users",
        columns: "id,email,full_name,role,created_at",
      },
      {
        tableName: "users",
        columns: "id,email,name,role,password_hash,created_at",
      },
      {
        tableName: "users",
        columns: "id,email,full_name,role,password_hash,created_at",
      },
      {
        tableName: "seller_profiles",
        columns: "id,user_id,business_name,business_type,legal_document_url,verification_status,reviewed_by,reviewed_at,operational_start,operational_end,created_at",
      },
    ]) {
      const { data, error } = await supabase.from(query.tableName).select(query.columns).limit(1);

      console.log(JSON.stringify({
        tableName: query.tableName,
        columns: query.columns,
        ok: !error,
        data,
        error,
      }, null, 2));
    }

    return;
  }

  if (process.argv.includes("--direct")) {
    const timestamp = Date.now();
    const userId = crypto.randomUUID();
    const email = `seller.direct.${timestamp}@ecoeat.local`;
    const legalDocumentUrl = await uploadLegalDocument();

    const { error: userInsertError } = await supabase.from("users").insert({
      id: userId,
      email,
      full_name: "Seller Registration Test",
      role: "seller",
      created_at: new Date().toISOString(),
    });

    if (userInsertError) {
      throw new Error(`Supabase user insert failed: ${userInsertError.message}`);
    }

    const sellerProfile = {
      id: crypto.randomUUID(),
      user_id: userId,
      business_name: "EcoEat Test Kitchen",
      business_type: "food_business",
      legal_document_url: legalDocumentUrl,
      verification_status: "pending",
      reviewed_by: null,
      reviewed_at: null,
      operational_start: null,
      operational_end: null,
      created_at: new Date().toISOString(),
    };

    const { error: sellerInsertError } = await supabase.from("seller_profiles").insert(sellerProfile);

    if (sellerInsertError) {
      throw new Error(`Supabase seller profile insert failed: ${sellerInsertError.message}`);
    }

    console.log(JSON.stringify({
      ok: true,
      mode: "direct",
      userId,
      email,
      legalDocumentUrl,
    }, null, 2));

    return;
  }

  if (process.argv.includes("--auth-basic")) {
    const timestamp = Date.now();
    const email = `seller.auth.basic.${timestamp}@ecoeat.local`;
    const password = `SellerTest${timestamp}!`;
    const { data, error } = await supabase.auth.signUp({ email, password });

    console.log(JSON.stringify({ ok: !error, data, error }, null, 2));

    if (error) {
      throw new Error(`Supabase basic signup failed: ${error.message}`);
    }

    return;
  }

  const result = await registerSellerThroughApp();

  console.log(JSON.stringify({ ok: true, result }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
