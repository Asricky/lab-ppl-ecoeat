/**
 * Shared seller dashboard / analytics metrics derived from products + seed orders.
 * Keeps dashboard and analytics in sync for the same time range.
 */

export type SellerTimeRange =
  | 'Today'
  | 'This Week'
  | 'This Month'
  | 'This Year'
  | 'All Time';

export type ProductLike = {
  type: string;
  status: string;
  stock: number;
};

/** Dummy seller orders — shared with orders page & dashboard totals */
export const SELLER_ORDERS = [
  {
    id: 'ORD-001',
    productName: 'Nasi Goreng Spesial',
    quantity: 2,
    price: 'Rp 30.000',
    status: 'Completed' as const,
    refundStatus: '-',
  },
  {
    id: 'ORD-002',
    productName: 'Ayam Bakar Madu',
    quantity: 1,
    price: 'Rp 25.000',
    status: 'Refunded' as const,
    refundStatus: 'Processed',
  },
  {
    id: 'ORD-003',
    productName: 'Sayur Asem',
    quantity: 3,
    price: 'Rp 15.000',
    status: 'Active' as const,
    refundStatus: '-',
  },
  {
    id: 'ORD-004',
    productName: 'Sate Ayam',
    quantity: 1,
    price: 'Rp 20.000',
    status: 'Cancelled' as const,
    refundStatus: 'Pending',
  },
];

const RANGE_WEIGHT: Record<SellerTimeRange, number> = {
  Today: 0.12,
  'This Week': 0.35,
  'This Month': 1,
  'This Year': 4.2,
  'All Time': 8.5,
};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Orders counted toward totals (exclude cancelled) */
export function baseOrderUnits(): number {
  return SELLER_ORDERS.filter((o) => o.status !== 'Cancelled').reduce(
    (sum, o) => sum + o.quantity,
    0
  );
}

export function countActiveProducts(products: ProductLike[]): number {
  return products.filter((p) => p.type === 'Sell' && p.status === 'Active').length;
}

/** Donation inventory portions (Donate-type products in catalog). */
export function totalDonationPortions(products: ProductLike[]): number {
  return products
    .filter((p) => p.type === 'Donate')
    .reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
}

export interface SellerMetrics {
  totalOrders: number;
  totalDonationPortions: number;
  /** Legacy alias — same as `totalDonationPortions` (older UI used this name). */
  totalDonationsPorsi: number;
  activeProducts: number;
}

export function getSellerMetrics(
  products: ProductLike[],
  timeRange: SellerTimeRange
): SellerMetrics {
  const safe = Array.isArray(products) ? products : [];
  const w = RANGE_WEIGHT[timeRange] ?? 1;
  const activeProducts = countActiveProducts(safe);
  const donationBase = totalDonationPortions(safe);
  const orderBase = baseOrderUnits();
  const totalDonationPortionsScaled = Math.max(0, Math.round(donationBase * w));

  return {
    activeProducts,
    totalDonationPortions: totalDonationPortionsScaled,
    totalDonationsPorsi: totalDonationPortionsScaled,
    totalOrders: Math.max(0, Math.round(orderBase * w)),
  };
}

export interface DonationChartPoint {
  label: string;
  donations: number;
}

function chartLabels(timeRange: SellerTimeRange): string[] {
  switch (timeRange) {
    case 'Today':
      return ['6am', '9am', '12pm', '3pm', '6pm', '9pm'];
    case 'This Week':
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    case 'This Month':
      return ['W1', 'W2', 'W3', 'W4'];
    case 'This Year':
      return ['Q1', 'Q2', 'Q3', 'Q4'];
    case 'All Time':
      return ['2022', '2023', '2024', '2025', '2026'];
    default:
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }
}

/**
 * Splits total donation portions (for selected period) across time buckets for the impact chart.
 */
export function buildDonationChartSeries(
  products: ProductLike[],
  timeRange: SellerTimeRange
): DonationChartPoint[] {
  const safe = Array.isArray(products) ? products : [];
  const labels = chartLabels(timeRange);
  const { totalDonationPortions: periodPortions } = getSellerMetrics(safe, timeRange);
  const n = labels.length;
  if (n === 0) return [];

  const seed = hashString(
    `${timeRange}:${safe.length}:${totalDonationPortions(safe)}`
  );
  const weights: number[] = labels.map((_, i) => {
    const v = 0.65 + ((seed >> (i % 16)) & 15) / 100 + (i % 3) * 0.08;
    return v;
  });
  const sumW = weights.reduce((a, b) => a + b, 0);
  return labels.map((label, i) => ({
    label,
    donations: Math.round((periodPortions * weights[i]) / sumW),
  }));
}

export function maxChartDonations(points: DonationChartPoint[]): number {
  const m = Math.max(1, ...points.map((p) => p.donations));
  return m * 1.15;
}
