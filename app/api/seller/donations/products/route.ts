import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createHash } from "crypto";

export const runtime = "nodejs";

const CLOUDINARY_UPLOAD_FOLDER = "ecoeat/products";
const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function parseCloudinaryUrl() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;

  if (!cloudinaryUrl) {
    throw new Error("CLOUDINARY_URL is not configured");
  }

  const parsedUrl = new URL(cloudinaryUrl);

  return {
    cloudName: parsedUrl.hostname,
    apiKey: parsedUrl.username,
    apiSecret: parsedUrl.password,
  };
}

async function uploadProductImage(file: File): Promise<string> {
  const { cloudName, apiKey, apiSecret } = parseCloudinaryUrl();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const payload = `folder=${CLOUDINARY_UPLOAD_FOLDER}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(payload).digest("hex");
  
  const cloudinaryFormData = new FormData();
  cloudinaryFormData.append("file", file);
  cloudinaryFormData.append("api_key", apiKey);
  cloudinaryFormData.append("folder", CLOUDINARY_UPLOAD_FOLDER);
  cloudinaryFormData.append("timestamp", timestamp);
  cloudinaryFormData.append("signature", signature);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: cloudinaryFormData,
    }
  );
  
  const uploadResult = await uploadResponse.json();

  if (!uploadResponse.ok || !uploadResult.secure_url) {
    throw new Error(uploadResult?.error?.message || "Gagal mengunggah foto ke Cloudinary");
  }

  return uploadResult.secure_url as string;
}

function parseRelativeExpiry(expiryText: string): Date {
  const cleaned = expiryText.trim().toLowerCase();
  
  const matchNum = cleaned.match(/(\d+)/);
  if (!matchNum) {
    const defaultDate = new Date();
    defaultDate.setHours(defaultDate.getHours() + 2); // Default 2 hours
    return defaultDate;
  }
  const amount = parseInt(matchNum[1], 10);
  const now = new Date();
  
  if (cleaned.includes("day")) {
    now.setDate(now.getDate() + amount);
  } else if (cleaned.includes("week") || cleaned.includes("wk")) {
    now.setDate(now.getDate() + amount * 7);
  } else if (cleaned.includes("hour") || cleaned.includes("hr")) {
    now.setHours(now.getHours() + amount);
  } else if (cleaned.includes("minute") || cleaned.includes("min")) {
    now.setMinutes(now.getMinutes() + amount);
  } else {
    // default/fallback
    now.setHours(now.getHours() + amount);
  }
  return now;
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient();
  let createdProductId: string | null = null;

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const portionQuantityStr = formData.get("portionQuantity") as string;
    const category = formData.get("category") as string;
    const expiryText = formData.get("expiryText") as string;
    const description = (formData.get("description") as string) || "";
    const userId = formData.get("userId") as string;
    const imageFile = formData.get("imageFile") as File | null;

    if (!title || !portionQuantityStr || !category || !expiryText || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const portionQuantity = parseInt(portionQuantityStr, 10);
    if (isNaN(portionQuantity) || portionQuantity <= 0) {
      return NextResponse.json({ error: "Invalid portion quantity" }, { status: 400 });
    }

    // Resolve seller profile id using userId
    const { data: sellerProfile, error: sellerError } = await supabase
      .from("seller_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (sellerError) {
      return NextResponse.json({ error: `Seller profile lookup error: ${sellerError.message}` }, { status: 500 });
    }

    if (!sellerProfile) {
      return NextResponse.json({ error: "Seller profile not found for the logged-in user" }, { status: 404 });
    }

    // Upload product image to Cloudinary
    let imageUrl = DEFAULT_PRODUCT_IMAGE;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadProductImage(imageFile);
    }

    const expiryDate = parseRelativeExpiry(expiryText).toISOString();
    const productId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Insert Product record
    const productPayload = {
      id: productId,
      seller_profile_id: sellerProfile.id,
      title: title.trim(),
      description: description.trim(),
      price: 0,
      original_price: null,
      stock_quantity: portionQuantity,
      portion_quantity: portionQuantity,
      expiry_date: expiryDate,
      is_donation: true,
      target_lks_id: null,
      status: "active",
      created_at: now,
    };

    const { error: productInsertError } = await supabase
      .from("products")
      .insert(productPayload);

    if (productInsertError) {
      return NextResponse.json({ error: `Product insert error: ${productInsertError.message}` }, { status: 500 });
    }

    createdProductId = productId;

    // Insert Product Image record
    const productImagePayload = {
      id: crypto.randomUUID(),
      product_id: productId,
      image_url: imageUrl,
      is_primary: true,
    };

    const { error: imageInsertError } = await supabase
      .from("product_images")
      .insert(productImagePayload);

    if (imageInsertError) {
      // Transactional rollback: Delete the created product if image link insertion fails
      await supabase.from("products").delete().eq("id", productId);
      return NextResponse.json({ error: `Product image insert error: ${imageInsertError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      product: {
        id: productId,
        name: title.trim(),
        image: imageUrl,
        category,
        type: "Donate",
        stock: portionQuantity,
        status: "Active",
        expiry: expiryText,
        expiryDatetime: expiryDate,
        description: description.trim(),
        price: "Free",
      },
    });

  } catch (error) {
    // Cleanup if product was inserted before failure
    if (createdProductId) {
      await supabase.from("products").delete().eq("id", createdProductId);
    }
    const message = error instanceof Error ? error.message : "Error creating donation product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
