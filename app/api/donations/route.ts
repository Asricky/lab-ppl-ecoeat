import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase is not configured properly");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// GET: Retrieve detailed donation list for a specific seller
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId");

    if (!sellerId) {
      return NextResponse.json({ error: "Missing sellerId parameter" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    // 1. Fetch orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("seller_id", sellerId)
      .eq("order_type", "donation")
      .order("ordered_at", { ascending: false });

    if (ordersError) {
      return NextResponse.json({ error: `Orders query failed: ${ordersError.message}` }, { status: 500 });
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({ donations: [] });
    }

    const orderIds = orders.map((o) => o.id);
    const lksIds = orders.map((o) => o.lks_id).filter(Boolean);

    // 2. Fetch order_items
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);

    if (itemsError) {
      return NextResponse.json({ error: `Order items query failed: ${itemsError.message}` }, { status: 500 });
    }

    const productIds = orderItems.map((oi) => oi.product_id).filter(Boolean);

    // 3. Fetch products
    let products = [];
    if (productIds.length > 0) {
      const { data: prods, error: prodsError } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);
      if (prodsError) {
        return NextResponse.json({ error: `Products query failed: ${prodsError.message}` }, { status: 500 });
      }
      products = prods || [];
    }

    // 4. Fetch product_images (primary)
    let productImages = [];
    if (productIds.length > 0) {
      const { data: imgs, error: imgsError } = await supabase
        .from("product_images")
        .select("*")
        .in("product_id", productIds)
        .eq("is_primary", true);
      if (imgsError) {
        return NextResponse.json({ error: `Product images query failed: ${imgsError.message}` }, { status: 500 });
      }
      productImages = imgs || [];
    }

    // 5. Fetch lks_profiles
    let lksProfiles = [];
    if (lksIds.length > 0) {
      const { data: profiles, error: lksError } = await supabase
        .from("lks_profiles")
        .select("*")
        .in("id", lksIds);
      if (lksError) {
        return NextResponse.json({ error: `LKS profiles query failed: ${lksError.message}` }, { status: 500 });
      }
      lksProfiles = profiles || [];
    }

    // 6. Fetch deliveries
    const { data: deliveries, error: delError } = await supabase
      .from("deliveries")
      .select("*")
      .in("order_id", orderIds);

    if (delError) {
      return NextResponse.json({ error: `Deliveries query failed: ${delError.message}` }, { status: 500 });
    }

    const deliveryIds = deliveries.map((d) => d.id);
    const courierIds = deliveries.map((d) => d.courier_id).filter(Boolean);

    // 7. Fetch delivery_tracking_logs
    let trackingLogs = [];
    if (deliveryIds.length > 0) {
      const { data: logs, error: logsError } = await supabase
        .from("delivery_tracking_logs")
        .select("*")
        .in("delivery_id", deliveryIds)
        .order("created_at", { ascending: true });
      if (logsError) {
        return NextResponse.json({ error: `Tracking logs query failed: ${logsError.message}` }, { status: 500 });
      }
      trackingLogs = logs || [];
    }

    // 8. Fetch users (courier details)
    let couriers: any[] = [];
    if (courierIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, full_name, avatar_url, phone_number")
        .in("id", courierIds);
      if (usersError) {
        return NextResponse.json({ error: `Courier users query failed: ${usersError.message}` }, { status: 500 });
      }
      couriers = users || [];
    }

    // 9. Assemble detailed donations response
    const donations = orders.map((order) => {
      const items = orderItems.filter((oi) => oi.order_id === order.id);
      const firstItem = items[0];
      const product = firstItem ? products.find((p) => p.id === firstItem.product_id) : null;
      const img = product ? productImages.find((i) => i.product_id === product.id) : null;
      const lks = lksProfiles.find((l) => l.id === order.lks_id);
      const delivery = deliveries.find((d) => d.order_id === order.id);
      const logs = delivery ? trackingLogs.filter((log) => log.delivery_id === delivery.id) : [];
      const courier = delivery ? couriers.find((c) => c.id === delivery.courier_id) : null;

      // Map DB values to frontend visual expectations
      return {
        id: order.id,
        orderCode: order.order_code,
        productName: product?.title || order.notes || "Donasi Makanan",
        category: product?.description || "Prepared Meals", // category/type
        expiry: product?.expiry_date ? new Date(product.expiry_date).toLocaleString("id-ID") : "4 hours",
        weight: `${order.total_portions} porsi`,
        portions: order.total_portions,
        recipient: lks?.foundation_name || "LKS Penerima",
        recipientCategory: lks?.lks_category || "Sosial",
        recipientStorage: lks?.storage_type || "Dry Storage",
        recipientImage: "https://images.unsplash.com/photo-1574314050516-e56593a1fa06?w=400&q=80",
        date: order.ordered_at ? new Date(order.ordered_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "Hari ini",
        status: order.order_status === "completed" ? "Delivered" : "Scheduled",
        image: img?.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
        
        // Delivery Details for Tracking
        deliveryId: delivery?.id,
        deliveryStatus: delivery?.delivery_status || "available_for_courier",
        distanceKm: delivery?.distance_km ? parseFloat(String(delivery.distance_km)) : 1.5,
        estimatedArrival: delivery?.estimated_arrival_time,
        courierName: courier?.full_name || "Menunggu Kurir",
        courierAvatar: courier?.avatar_url,
        courierPhone: courier?.phone_number,
        trackingLogs: logs.map((log) => ({
          status: log.status,
          notes: log.notes,
          time: new Date(log.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          latitude: log.latitude,
          longitude: log.longitude,
        })),
      };
    });

    return NextResponse.json({ donations });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memproses permintaan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Process donation order + delivery records transactionally
export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient();
  let createdOrderId: string | null = null;

  try {
    const body = await request.json();
    const {
      lksId,
      productName,
      productId,
      category,
      expiry,
      quantity,
      weightLabel,
      sellerId,
    } = body;

    if (!lksId || !productName || !productId || !quantity || !sellerId) {
      return NextResponse.json({ error: "Missing required properties" }, { status: 400 });
    }

    const orderId = crypto.randomUUID();
    const orderCode = `DON-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    // 1. Insert into orders table
    const orderPayload = {
      id: orderId,
      order_code: orderCode,
      buyer_id: null,
      seller_id: sellerId,
      courier_id: null,
      lks_id: lksId,
      order_type: "donation",
      order_status: "waiting_payment", // initial default order_status
      subtotal: 0,
      delivery_fee: 0,
      platform_fee: 0,
      total_amount: 0,
      total_portions: parseInt(quantity, 10),
      delivery_address_id: null,
      notes: weightLabel,
      ordered_at: now,
      completed_at: null,
    };

    const { error: orderInsertError } = await supabase
      .from("orders")
      .insert(orderPayload);

    if (orderInsertError) {
      return NextResponse.json({ error: `Order insert error: ${orderInsertError.message}` }, { status: 500 });
    }

    createdOrderId = orderId;

    // 2. Insert into order_items table
    const orderItemPayload = {
      id: crypto.randomUUID(),
      order_id: orderId,
      product_id: productId,
      quantity: parseInt(quantity, 10),
      price: 0,
      total_price: 0,
      portion_quantity: parseInt(quantity, 10),
    };

    const { error: itemInsertError } = await supabase
      .from("order_items")
      .insert(orderItemPayload);

    if (itemInsertError) {
      await supabase.from("orders").delete().eq("id", orderId);
      return NextResponse.json({ error: `Order item insert error: ${itemInsertError.message}` }, { status: 500 });
    }

    // 3. Get LKS details to define destination_address
    const { data: lksProfile } = await supabase
      .from("lks_profiles")
      .select("foundation_name")
      .eq("id", lksId)
      .maybeSingle();

    const destinationAddress = lksProfile?.foundation_name || "LKS Penerima";

    // Get Seller details to define pickup_address
    const { data: sellerProfile } = await supabase
      .from("seller_profiles")
      .select("business_name")
      .eq("user_id", sellerId)
      .maybeSingle();

    const pickupAddress = sellerProfile?.business_name || "Toko Penyelamat Makanan";

    // 4. Insert into deliveries table
    const deliveryId = crypto.randomUUID();
    const deliveryPayload = {
      id: deliveryId,
      order_id: orderId,
      courier_id: null,
      pickup_address: pickupAddress,
      destination_address: destinationAddress,
      distance_km: 1.50,
      delivery_status: "available_for_courier",
      estimated_arrival_time: null,
      picked_up_at: null,
      delivered_at: null,
      lks_confirmed_at: null,
      created_at: now,
    };

    const { error: deliveryInsertError } = await supabase
      .from("deliveries")
      .insert(deliveryPayload);

    if (deliveryInsertError) {
      await supabase.from("order_items").delete().eq("order_id", orderId);
      await supabase.from("orders").delete().eq("id", orderId);
      return NextResponse.json({ error: `Delivery insert error: ${deliveryInsertError.message}` }, { status: 500 });
    }

    // 5. Insert into delivery_tracking_logs table
    const trackingLogPayload = {
      id: crypto.randomUUID(),
      delivery_id: deliveryId,
      status: "available_for_courier",
      notes: "Menunggu kurir mengambil donasi",
      latitude: -6.1944,
      longitude: 106.8229,
      created_at: now,
    };

    const { error: logInsertError } = await supabase
      .from("delivery_tracking_logs")
      .insert(trackingLogPayload);

    if (logInsertError) {
      await supabase.from("deliveries").delete().eq("id", deliveryId);
      await supabase.from("order_items").delete().eq("order_id", orderId);
      await supabase.from("orders").delete().eq("id", orderId);
      return NextResponse.json({ error: `Tracking log insert error: ${logInsertError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      orderId,
      orderCode,
    });

  } catch (error) {
    if (createdOrderId) {
      await supabase.from("order_items").delete().eq("order_id", createdOrderId);
      await supabase.from("orders").delete().eq("id", createdOrderId);
    }
    const message = error instanceof Error ? error.message : "Gagal memproses donasi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
