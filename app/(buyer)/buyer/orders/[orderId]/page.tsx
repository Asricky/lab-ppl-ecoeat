"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Leaf,
  MapPin,
  Package,
  Receipt,
  Truck,
} from "lucide-react";
import RefundRequestButton from "@/components/buyer/RefundRequestButton";
import {
  displayToIdr,
  orderPaymentBreakdown,
  useBuyerOrdersStore,
} from "@/store/buyerOrdersStore";

export default function OrderDetailDynamicPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const orders = useBuyerOrdersStore((s) => s.orders);
  const order = useMemo(() => orders.find((o) => o.id === orderId), [orders, orderId]);

  const formatRp = (displayAmount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(displayAmount * 1000);
  };

  const formatRpIdr = (idr: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(idr);
  };

  if (!order) {
    return (
      <div className="max-w-6xl mx-auto pb-12 text-center py-24">
        <Package className="w-14 h-14 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Pesanan tidak ditemukan</h1>
        <p className="text-gray-600 mb-8">Order ID `{orderId}` tidak ada dalam daftar Anda.</p>
        <Link
          href="/buyer/orders"
          className="inline-flex items-center gap-2 text-green-800 font-bold border-2 border-green-700 px-6 py-3 rounded-xl hover:bg-green-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Order History
        </Link>
      </div>
    );
  }

  const breakdown = orderPaymentBreakdown(order);
  const lineTotalDisplay = breakdown.subtotalItems;
  const refundIdr =
    order.refundAmountDisplay != null
      ? displayToIdr(order.refundAmountDisplay)
      : displayToIdr(lineTotalDisplay);

  const showEta =
    order.tab === "Active Orders" || !!order.estimatedArrivalLabel;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <Link
        href="/buyer/orders"
        className="inline-flex items-center gap-2 text-sm font-bold text-green-800 mb-6 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke riwayat pesanan
      </Link>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{order.id}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Detail pesanan</h1>
        </div>
        <span className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold bg-[#eef3e8] border border-[#d4dec4] text-green-900">
          {order.statusLabel}
        </span>
      </div>

      {showEta && (
        <section className="mb-8 rounded-3xl border border-[#388e3c]/30 bg-gradient-to-br from-[#eef3e8] to-[#e1e8d5] p-6 md:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-green-800 p-3 text-white shadow-md shrink-0">
              <Truck className="w-7 h-7" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-extrabold text-gray-900 flex flex-wrap items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-green-800 shrink-0" />
                Tracking & estimasi
              </h2>
              {order.estimatedArrivalLabel && (
                <p className="text-green-950 font-bold text-base mb-2">
                  Estimasi sampai:{" "}
                  <span className="text-green-800">{order.estimatedArrivalLabel}</span>
                </p>
              )}
              <p className="text-sm text-gray-700 font-medium leading-relaxed">{order.shipmentStatus}</p>
              {order.tab === "Active Orders" && (
                <Link
                  href="/buyer/tracking"
                  className="inline-block mt-4 text-sm font-bold text-green-800 underline underline-offset-2 hover:text-green-950"
                >
                  Lacak di halaman Tracking →
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-8">
          <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#eef3e8] shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-green-700" /> Item pesanan
            </h2>
            {order.lines.map((line) => (
              <div key={line.productId + line.name} className="flex gap-6 border-b border-[#eef3e8] pb-6 last:border-0 last:pb-0">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border border-[#e1e8d5] shrink-0">
                  <img src={line.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-gray-900 text-lg">{line.name}</h3>
                  {order.vendorName && (
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      Vendor EcoEat: <span className="text-green-800 font-semibold">{order.vendorName}</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-3">
                    Jumlah unit:{" "}
                    <span className="font-extrabold text-gray-900">{line.quantity}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Harga satuan ×{line.quantity}: {formatRp(line.unitPriceDisplay)} / unit
                  </p>
                  <p className="text-lg font-extrabold text-green-800 mt-2">
                    Subtotal baris {formatRp(line.quantity * line.unitPriceDisplay)}
                  </p>
                </div>
              </div>
            ))}
          </section>

          <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#eef3e8] shadow-sm">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-green-700" />
              Rincian pembayaran
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 font-medium text-gray-700">
                <span>Subtotal produk</span>
                <span className="font-bold text-gray-900 tabular-nums">{formatRp(breakdown.subtotalItems)}</span>
              </div>
              <div className="flex justify-between gap-4 font-medium text-gray-700">
                <span>Biaya kirim EcoEat</span>
                <span className="font-bold text-gray-900 tabular-nums">
                  {breakdown.delivery > 0 ? formatRp(breakdown.delivery) : "Gratis"}
                </span>
              </div>
              {breakdown.platform > 0 && (
                <div className="flex justify-between gap-4 font-medium text-gray-700">
                  <span>Biaya layanan</span>
                  <span className="font-bold text-gray-900 tabular-nums">{formatRp(breakdown.platform)}</span>
                </div>
              )}
              <div className="flex justify-between items-center gap-4 pt-4 mt-4 border-t-2 border-dashed border-[#d4dec4] text-base">
                <span className="font-extrabold text-gray-900">Total pembayaran</span>
                <span className="font-extrabold text-green-900 text-xl tabular-nums">
                  {formatRp(breakdown.grandTotal)}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 font-medium mt-4 leading-relaxed">
              Total sudah mencakup produk surplus, kirim hemat, dan layanan pembayaran aman EcoPay.
            </p>
          </section>

          <section className="bg-[#eef3e8] rounded-3xl p-6 md:p-8 border border-[#d4dec4] shadow-sm">
            <h2 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-800" /> Alamat pengiriman
            </h2>
            <p className="font-bold text-gray-900 text-base">{order.shippingAddress}</p>
            <p className="text-sm text-gray-700 font-medium mt-1">{order.shippingCity}</p>
            {order.shippingPhone && (
              <p className="text-sm text-gray-600 mt-2 font-medium">Nomor kontak: {order.shippingPhone}</p>
            )}
          </section>

          {!showEta && (
            <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#eef3e8] shadow-sm">
              <h3 className="text-lg font-extrabold text-gray-900 mb-4">Status pengiriman</h3>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">{order.shipmentStatus}</p>
            </section>
          )}

          {order.tab === "Active Orders" && (
            <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#eef3e8] shadow-sm">
              <h3 className="text-lg font-extrabold text-gray-900 mb-6">Alur pengiriman</h3>
              <div className="relative border-l-2 border-[#c3d1b0] ml-3 space-y-6">
                <div className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-green-700 ring-4 ring-white" />
                  <h4 className="font-bold text-gray-900">Pesanan diproses</h4>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mt-0.5">{order.orderedAtLabel}</p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-green-600 ring-4 ring-white flex items-center justify-center">
                    <Truck className="w-3 h-3 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900">Dalam perjalanan</h4>
                  <p className="text-sm text-gray-600 font-medium mt-1">{order.shipmentStatus}</p>
                </div>
              </div>
            </section>
          )}

        </div>

        <aside className="w-full lg:w-[400px] space-y-6">
          {order.refundEligible ? (
            <div className="hidden lg:block bg-[#d4dec4] rounded-3xl p-8 border border-[#c3d1b0] shadow-sm relative overflow-hidden">
              <span className="inline-block bg-[#8e6856] text-white text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-widest mb-4">
                Refund tersedia
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Ajukan refund</h3>
              <p className="text-sm text-gray-700 font-medium leading-relaxed mb-6">
                Nominal berikut akan ditambahkan ke saldo EcoPay Anda setelah permintaan diproses.
              </p>
              <p className="text-2xl font-extrabold text-green-900 mb-6">{formatRpIdr(refundIdr)}</p>
              <RefundRequestButton
                orderId={order.id}
                refundAmountDisplay={order.refundAmountDisplay ?? lineTotalDisplay}
                className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold py-4 rounded-xl transition-colors shadow-md text-base"
              />
            </div>
          ) : order.statusLabel === "Refund completed" ? (
            <div className="bg-[#f4f7ed] rounded-3xl p-8 border border-[#d4dec4] flex items-start gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-700 shrink-0" />
              <div>
                <h3 className="font-extrabold text-gray-900">Refund selesai</h3>
                <p className="text-sm text-gray-600 font-medium mt-1">{order.shipmentStatus}</p>
              </div>
            </div>
          ) : null}

          <div className="bg-[#f4f7ed] rounded-3xl p-6 border border-[#d4dec4] flex gap-3">
            <Leaf className="w-5 h-5 text-green-800 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-green-900 text-sm">Dampak EcoEat</h4>
              <p className="text-xs text-green-900/80 font-medium leading-relaxed mt-1">
                Terima kasih telah menyelamatkan surplus bersama EcoEat mengurangi food waste.
              </p>
            </div>
          </div>

          <Link
            href="/buyer/orders"
            className="hidden lg:flex items-center justify-center gap-2 w-full rounded-xl border-2 border-[#d4dec4] bg-white py-3 font-bold text-green-900 hover:bg-[#eef3e8] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke daftar pesanan
          </Link>
        </aside>
      </div>

      {order.refundEligible && (
        <div className="mt-8 lg:hidden space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-950 font-medium leading-relaxed">{order.shipmentStatus}</p>
          </div>
          <div className="bg-[#d4dec4] rounded-3xl p-8 border border-[#c3d1b0] shadow-sm">
            <span className="inline-block bg-[#8e6856] text-white text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-widest mb-3">
              Refund tersedia
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 mb-4">Ajukan refund</h3>
            <p className="text-sm font-bold text-green-950 mb-4">{formatRpIdr(refundIdr)}</p>
            <RefundRequestButton
              orderId={order.id}
              refundAmountDisplay={order.refundAmountDisplay ?? lineTotalDisplay}
              className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold py-4 rounded-xl transition-colors shadow-md text-base"
            />
          </div>
        </div>
      )}
    </div>
  );
}
