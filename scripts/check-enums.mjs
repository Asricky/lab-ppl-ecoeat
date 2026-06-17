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

async function main() {
  loadEnvFile(".env");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log("Querying wallet_transactions table to see existing statuses...");
  const { data: txsData, error: txsError } = await supabase
    .from("wallet_transactions")
    .select("transaction_status")
    .limit(500);
    
  if (txsError) {
    console.error("Error querying wallet_transactions:", txsError.message);
  } else {
    const statuses = new Set((txsData || []).map(t => t.transaction_status));
    console.log("Existing wallet_transactions statuses in DB:", Array.from(statuses));
  }
}

main();
