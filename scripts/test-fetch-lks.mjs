async function main() {
  console.log("Testing GET /api/seller/lks endpoint...");
  
  try {
    const response = await fetch("http://localhost:3000/api/seller/lks");
    const status = response.status;
    const result = await response.json();

    console.log(`Response Status: ${status}`);
    if (status !== 200) {
      throw new Error(`Failed with status ${status}: ${result.error || "Unknown error"}`);
    }

    if (!result.lksProfiles || !Array.isArray(result.lksProfiles)) {
      throw new Error("Response is missing lksProfiles array!");
    }

    console.log(`✔ Success! Retrieved ${result.lksProfiles.length} real database LKS profiles.`);
    if (result.lksProfiles.length > 0) {
      console.log("Sample profile in response:", result.lksProfiles[0]);
    } else {
      console.log("Warning: lks_profiles table is empty in the database.");
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

main();
