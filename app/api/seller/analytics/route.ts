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

// Helper to calculate start/end Date bounds for timeRange
function getTimeBounds(timeRange: string): { start: Date; end: Date } {
  const now = new Date();
  let start = new Date();
  let end = new Date();

  switch (timeRange) {
    case "This Week": {
      // Monday 00:00:00 to Sunday 23:59:59
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      start = new Date(now.setDate(diff));
      start.setHours(0, 0, 0, 0);
      
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case "This Month": {
      // First day of current month to last day of current month
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    }
    case "This Year": {
      // Jan 1 to Dec 31 of current year
      start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    }
    case "All Time":
    default: {
      // Jan 1, 2022 to now
      start = new Date("2022-01-01T00:00:00.000Z");
      end = new Date();
      end.setHours(23, 59, 59, 999);
      break;
    }
  }

  return { start, end };
}

// GET: Seller Analytics & Impact data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId");
    const timeRange = searchParams.get("timeRange") || "This Month";

    if (!sellerId) {
      return NextResponse.json({ error: "Missing sellerId parameter" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    // 1. Fetch Seller Profile to get their profile ID
    const { data: profile, error: profileErr } = await supabase
      .from("seller_profiles")
      .select("id, business_name")
      .eq("user_id", sellerId)
      .maybeSingle();

    if (profileErr) {
      return NextResponse.json({ error: `Seller profile error: ${profileErr.message}` }, { status: 500 });
    }

    const sellerProfileId = profile?.id;
    const businessName = profile?.business_name || "Toko Penyelamat Makanan";

    // Fetch User details for avatar_url
    const { data: userProfile } = await supabase
      .from("users")
      .select("avatar_url")
      .eq("id", sellerId)
      .maybeSingle();

    const avatarUrl = userProfile?.avatar_url || "https://i.pravatar.cc/150?u=seller";

    const { start, end } = getTimeBounds(timeRange);

    // 2. Fetch completed orders within the time range
    const { data: orders, error: ordersErr } = await supabase
      .from("orders")
      .select("*")
      .eq("seller_id", sellerId)
      .eq("order_status", "completed")
      .gte("completed_at", start.toISOString())
      .lte("completed_at", end.toISOString());

    if (ordersErr) {
      return NextResponse.json({ error: `Orders query error: ${ordersErr.message}` }, { status: 500 });
    }

    const completedOrders = orders || [];
    const totalOrders = completedOrders.length;

    // Calculate portions saved (Meals Saved)
    let totalDonationPortions = 0;
    completedOrders.forEach(o => {
      totalDonationPortions += Number(o.total_portions) || 0;
    });

    // 3. Fetch active commercial products
    // (commercial products means is_donation = false, status = active, created_at <= end)
    let activeProductsQuery = supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "active")
      .eq("is_donation", false)
      .lte("created_at", end.toISOString());

    if (sellerProfileId) {
      activeProductsQuery = activeProductsQuery.eq("seller_profile_id", sellerProfileId);
    }

    const { count: activeCount, error: activeErr } = await activeProductsQuery;
    if (activeErr) {
      return NextResponse.json({ error: `Active products query error: ${activeErr.message}` }, { status: 500 });
    }
    const activeProducts = activeCount || 0;

    // 4. Generate Chart Series based on timeRange
    let chartSeries: Array<{ label: string; donations: number }> = [];

    if (timeRange === "This Week") {
      const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const donationsByDay = Array(7).fill(0);

      completedOrders.forEach(o => {
        const d = new Date(o.completed_at || o.ordered_at);
        const dayIdx = d.getDay(); // 0 is Sunday, 1 is Monday, etc.
        const labelIdx = dayIdx === 0 ? 6 : dayIdx - 1; // map Sunday to 6, Mon-Sat to 0-5
        if (labelIdx >= 0 && labelIdx < 7) {
          donationsByDay[labelIdx] += Number(o.total_portions) || 0;
        }
      });

      chartSeries = labels.map((label, i) => ({
        label,
        donations: donationsByDay[i],
      }));
    } else if (timeRange === "This Month") {
      const labels = ["W1", "W2", "W3", "W4"];
      const donationsByWeek = Array(4).fill(0);

      completedOrders.forEach(o => {
        const d = new Date(o.completed_at || o.ordered_at);
        const dayOfMonth = d.getDate();
        let weekIdx = 0;
        if (dayOfMonth <= 7) weekIdx = 0;
        else if (dayOfMonth <= 14) weekIdx = 1;
        else if (dayOfMonth <= 21) weekIdx = 2;
        else weekIdx = 3;

        donationsByWeek[weekIdx] += Number(o.total_portions) || 0;
      });

      chartSeries = labels.map((label, i) => ({
        label,
        donations: donationsByWeek[i],
      }));
    } else if (timeRange === "This Year") {
      const labels = ["Q1", "Q2", "Q3", "Q4"];
      const donationsByQuarter = Array(4).fill(0);

      completedOrders.forEach(o => {
        const d = new Date(o.completed_at || o.ordered_at);
        const month = d.getMonth(); // 0-11
        let quarterIdx = 0;
        if (month <= 2) quarterIdx = 0;
        else if (month <= 5) quarterIdx = 1;
        else if (month <= 8) quarterIdx = 2;
        else quarterIdx = 3;

        donationsByQuarter[quarterIdx] += Number(o.total_portions) || 0;
      });

      chartSeries = labels.map((label, i) => ({
        label,
        donations: donationsByQuarter[i],
      }));
    } else {
      // All Time: years from 2022 to current year
      const currentYear = new Date().getFullYear();
      const years: number[] = [];
      for (let y = 2022; y <= currentYear; y++) {
        years.push(y);
      }

      const donationsByYear = Array(years.length).fill(0);

      completedOrders.forEach(o => {
        const d = new Date(o.completed_at || o.ordered_at);
        const year = d.getFullYear();
        const yearIdx = years.indexOf(year);
        if (yearIdx !== -1) {
          donationsByYear[yearIdx] += Number(o.total_portions) || 0;
        }
      });

      chartSeries = years.map((yr, i) => ({
        label: String(yr),
        donations: donationsByYear[i],
      }));
    }

    // 5. Query top performing products
    let topProducts: any[] = [];
    if (completedOrders.length > 0) {
      const orderIds = completedOrders.map(o => o.id);
      const { data: orderItems, error: itemsErr } = await supabase
        .from("order_items")
        .select("product_id, quantity, portion_quantity")
        .in("order_id", orderIds);

      if (itemsErr) {
        return NextResponse.json({ error: `Order items query error: ${itemsErr.message}` }, { status: 500 });
      }

      // Group by product_id and sum portion_quantity (portions sold)
      const salesByProduct: Record<string, number> = {};
      (orderItems || []).forEach(item => {
        if (item.product_id) {
          const qty = Number(item.quantity) || 1;
          const portions = Number(item.portion_quantity) || 1;
          const totalPortionsSold = portions * qty;
          salesByProduct[item.product_id] = (salesByProduct[item.product_id] || 0) + totalPortionsSold;
        }
      });

      const productIds = Object.keys(salesByProduct);
      if (productIds.length > 0) {
        const { data: productsData, error: prodsErr } = await supabase
          .from("products")
          .select("id, title, price, stock_quantity")
          .in("id", productIds);

        if (prodsErr) {
          return NextResponse.json({ error: `Products details query error: ${prodsErr.message}` }, { status: 500 });
        }

        const { data: imgsData } = await supabase
          .from("product_images")
          .select("product_id, image_url")
          .in("product_id", productIds)
          .eq("is_primary", true);

        topProducts = (productsData || []).map(p => {
          const portionsSold = salesByProduct[p.id] || 0;
          const img = (imgsData || []).find(i => i.product_id === p.id);
          const priceNum = parseFloat(String(p.price)) || 0;
          const formattedPrice = priceNum > 0 ? `Rp ${priceNum.toLocaleString("id-ID")}` : "Gratis (Donasi)";

          return {
            id: p.id,
            name: p.title,
            price: formattedPrice,
            stock: Number(p.stock_quantity) || 0,
            image: img?.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
            salesEstimate: portionsSold,
          };
        }).sort((a, b) => b.salesEstimate - a.salesEstimate);
      }
    }

    return NextResponse.json({
      sellerProfile: {
        businessName,
        avatarUrl,
      },
      metrics: {
        totalOrders,
        totalDonationPortions,
        activeProducts,
      },
      chartSeries,
      topProducts,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memproses metrik seller";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
