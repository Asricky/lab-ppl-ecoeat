"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Store, MapPin, Wallet, Leaf, Info, CheckCircle, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEcoPayStore } from '@/store/ecoPayStore';
import { useBuyerOrdersStore, BuyerOrder } from '@/store/buyerOrdersStore';
import { useSellerOrdersStore } from '@/store/sellerOrdersStore';
import { useTaskStore } from '@/store/taskStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { balance, deductBalance, setBalance } = useEcoPayStore();
  const { addOrder } = useBuyerOrdersStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const total = items.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const formatRp = (amount: number) => {
    return 'Rp' + amount.toLocaleString('id-ID');
  };

  const handlePayNow = async () => {
    if (balance < total) {
      showToast("Saldo EcoPay tidak mencukupi!", "error");
      return;
    }
    if (items.length === 0) {
      showToast("Keranjang belanja kosong!", "error");
      return;
    }

    // 1. SIAPKAN DATA TRANSAKSI UNTUK BACKEND
    const checkoutPayload = {
      cartItems: items.map(item => ({
        product_id: "d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f90", // Amankan ID produk seeding kita
        quantity: item.quantity,
        price: item.discountPrice, // Konversi nilai porsi asli ke satuan Rupiah penuh
        portion_quantity: 1
      })),
      totalAmount: total,
      subtotal: total,
      deliveryFee: 0,
      platformFee: 500, // Biaya aplikasi Rp500 dari angka 0.5 tim
      deliveryAddressId: "9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f", // Mengacu pada ID alamat resmi yang ada di database
      sellerId: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e" // Mengacu pada UUID toko seller berkah dummy kita
    };

    try {
      const stored = localStorage.getItem('user');
      const userObj = stored ? JSON.parse(stored) : null;
      const currentUserId = userObj?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

      // 2. KIRIM TRANSAKSI CHECKOUT KE DATABASE
      const response = await fetch('/api/buyer/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUserId
        },
        body: JSON.stringify(checkoutPayload)
      });

      const result = await response.json();

      if (result.success) {
        // Ambil kode order resmi yang digenerate otomatis oleh Supabase
        const orderId = result.data.order_code;

        // 3. JALANKAN LOGIKA MULTI-SINKRONISASI TIM KAMU (Seller, Courier, Global Store)
        const newOrder: BuyerOrder = {
          id: orderId,
          tab: 'Active Orders',
          statusLabel: deliveryMethod === 'delivery' ? 'Preparing' : 'Ready for Pickup',
          shipmentStatus: deliveryMethod === 'delivery'
            ? 'Your order is being prepared by the vendor.'
            : 'Your order is ready at EcoEat Downtown Hub.',
          vendorName: items[0]?.vendor || 'EcoEat Vendor',
          lines: items.map(item => ({
            productId: item.id,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            unitPriceDisplay: item.discountPrice,
          })),
          shippingAddress: '245 Eco Lane, Suite 10',
          shippingCity: 'Greenwood, 90210',
          orderedAtLabel: 'Today',
          deliveryFeeDisplay: 0,
          platformFeeDisplay: 0.5,
          estimatedArrivalLabel: deliveryMethod === 'delivery'
            ? 'Hari ini, dalam 15-30 menit'
            : 'Hari ini, buka s/d 20:00 WIB',
          deliveryMethod: deliveryMethod,
        };

        // Masukkan ke riwayat order buyer lokal
        addOrder(newOrder);

        // Sinkronisasi data ke dashboard Seller kelompok
        useSellerOrdersStore.getState().addOrder({
          id: orderId,
          productName: items[0]?.name || 'Multiple items',
          quantity: items.reduce((acc, i) => acc + i.quantity, 0),
          price: formatRp(total),
          status: 'Active',
          refundStatus: '-'
        });

        // Sinkronisasi tugas ke dashboard Kurir kelompok
        useTaskStore.getState().addTask({
          id: `TASK-${Math.floor(1000 + Math.random() * 9000)}`,
          type: 'purchase',
          status: 'assigned',
          pickup: items[0]?.vendor || 'EcoEat Vendor',
          destination: '245 Eco Lane, Suite 10',
          reward: 15000,
          distance: '2.5 km',
          eta: '15-30 min',
          proofUploaded: false
        });

        // Sinkronisasi data ke Log Admin Global
        import('@/store/globalStore').then(({ useGlobalStore }) => {
          useGlobalStore.getState().addOrder({
            id: orderId,
            productName: items[0]?.name || 'Multiple items',
            quantity: items.reduce((acc, i) => acc + i.quantity, 0),
            price: formatRp(total),
            status: 'Active',
            refundStatus: '-',
            date: new Date().toLocaleDateString('id-ID'),
            buyer: 'Lukas Ricky Krisjatmiko'
          });
          items.forEach(item => {
            useGlobalStore.getState().reduceProductStock(item.id, item.quantity);
          });
        });

        // Potong saldo EcoPay di UI agar klop dengan sisa saldo di cloud database
        if (result.data && typeof result.data.remaining_balance === 'number') {
          setBalance(result.data.remaining_balance);
        } else {
          try {
            const getBalRes = await fetch('/api/buyer/checkout', {
              method: 'GET',
              headers: { 'x-user-id': currentUserId }
            });
            const getBalData = await getBalRes.json();
            if (getBalData.success && typeof getBalData.balance === 'number') {
              setBalance(getBalData.balance);
            } else {
              deductBalance(total, `Checkout Order ${orderId}`);
            }
          } catch {
            deductBalance(total, `Checkout Order ${orderId}`);
          }
        }

        setIsSuccess(true);
        if (clearCart) clearCart();
        setTimeout(() => {
          router.push('/buyer/tracking');
        }, 2500);

      } else {
        showToast("Transaksi ditolak database: " + result.error, "error");
      }
    } catch (err) {
      console.error("Error during checkout processing:", err);
      showToast("Gagal memproses pembayaran. Periksa koneksi internet.", "error");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-bounce mb-6">
          <CheckCircle className="w-32 h-32 text-green-600 drop-shadow-lg" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 animate-pulse">Order Successfully Made</h1>
        <p className="text-lg text-gray-600 font-medium">Redirecting to tracking...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-10">
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">SECURE CHECKOUT</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Finalize Your Harvest</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-10">

          {/* 1. Delivery Method */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#eef3e8] text-green-700 flex items-center justify-center text-sm mr-3">1</span>
              Delivery Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setDeliveryMethod('delivery')}
                className={`border-2 rounded-3xl p-6 cursor-pointer relative shadow-sm transition-all ${deliveryMethod === 'delivery'
                  ? 'border-green-700 bg-white'
                  : 'border-transparent bg-[#eef3e8] hover:bg-[#e6ebd9] border-[#d4dec4]'
                  }`}
              >
                <div className="flex items-start">
                  <Truck className={`w-6 h-6 mr-4 mt-1 ${deliveryMethod === 'delivery' ? 'text-green-700' : 'text-gray-600'}`} />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Home Delivery</h3>
                    <p className="text-sm text-gray-500 font-medium mb-2 mt-1">Eco-friendly bike courier</p>
                    <p className={`text-xs font-bold ${deliveryMethod === 'delivery' ? 'text-green-700' : 'text-gray-500'}`}>Free sustainable delivery</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setDeliveryMethod('pickup')}
                className={`border-2 rounded-3xl p-6 cursor-pointer transition-all ${deliveryMethod === 'pickup'
                  ? 'border-green-700 bg-white'
                  : 'border-transparent bg-[#eef3e8] hover:bg-[#e6ebd9] border-[#d4dec4]'
                  }`}
              >
                <div className="flex items-start">
                  <Store className={`w-6 h-6 mr-4 mt-1 ${deliveryMethod === 'pickup' ? 'text-green-700' : 'text-gray-600'}`} />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Store Pickup</h3>
                    <p className="text-sm text-gray-500 font-medium mb-2 mt-1">Collect from our hub</p>
                    <p className={`text-xs font-medium ${deliveryMethod === 'pickup' ? 'text-green-700' : 'text-gray-500'}`}>Available today</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Delivery Address */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="w-8 h-8 rounded-full bg-[#eef3e8] text-green-700 flex items-center justify-center text-sm mr-3">2</span>
                Delivery Address
              </h2>
              <button className="text-green-700 font-bold text-sm flex items-center hover:underline">
                <MapPin className="w-4 h-4 mr-1" /> Use saved address
              </button>
            </div>

            <div className="bg-[#eef3e8] rounded-t-2xl p-5 border-b-2 border-[#d4dec4]">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">STREET ADDRESS</p>
              <p className="font-bold text-gray-900 text-lg">245 Eco Lane, Suite 10</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-[#eef3e8] rounded-2xl p-5 border-b-2 border-[#d4dec4]">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">CITY</p>
                <p className="font-bold text-gray-900 text-lg">Greenwood</p>
              </div>
              <div className="bg-[#eef3e8] rounded-2xl p-5 border-b-2 border-[#d4dec4]">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">POSTAL CODE</p>
                <p className="font-bold text-gray-900 text-lg">90210</p>
              </div>
            </div>
          </section>

          {/* 3. Payment Method */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#eef3e8] text-green-700 flex items-center justify-center text-sm mr-3">3</span>
              Payment Method
            </h2>

            <div className="bg-[#388e3c] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg border border-[#2e7d32]">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-green-500 rounded-full opacity-30 blur-3xl"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-green-100 tracking-widest uppercase">ECOPAY WALLET</span>
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-extrabold mb-10">Rp{(balance).toLocaleString('id-ID')}</h3>

                <div className="flex justify-between items-end mt-auto">
                  <div className="bg-white/20 backdrop-blur rounded-2xl p-3 px-4 flex items-center space-x-3 border border-white/30">
                    <div className="bg-white p-1.5 rounded-full text-green-800">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-green-100 font-bold uppercase tracking-wider">YOUR CURRENT IMPACT</p>
                      <p className="font-bold text-sm">1.2kg Carbon Offset Today</p>
                    </div>
                  </div>
                  <button onClick={() => router.push('/buyer/profile?tab=topup')} className="bg-white text-green-800 font-bold px-6 py-3 rounded-full hover:bg-green-50 transition-colors shadow-sm flex items-center">
                    <span className="mr-2 text-xl">+</span> Top Up
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Order Summary Right */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-[#eef3e8] rounded-3xl p-8 sticky top-24 border border-[#d4dec4]">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Order Summary</h2>

            <div className="space-y-6 mb-8">
              {items.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-sm flex-shrink-0 border border-[#e1e8d5]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 font-medium mt-1">{item.quantity} Units • {item.vendor}</p>
                  </div>
                  <div className="font-bold text-gray-900">
                    {formatRp(item.discountPrice * item.quantity)}
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-sm text-gray-500 font-medium text-center">No items to checkout.</p>
              )}
            </div>

            <div className="border-t border-[#d4dec4] pt-6 space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 font-medium text-sm">
                <span>Subtotal</span>
                <span>{formatRp(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium text-sm items-center">
                <span>Delivery Fee</span>
                <div>
                  <span className="bg-[#d4dec4] text-green-800 text-[10px] font-bold px-2 py-1 rounded mr-3">Sustainable</span>
                  <span className="font-bold text-green-700">{formatRp(0)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8 border-t border-[#d4dec4] pt-6">
              <span className="text-2xl font-extrabold text-gray-900">Total</span>
              <span className="text-2xl font-extrabold text-green-700">{formatRp(total)}</span>
            </div>

            <button
              onClick={handlePayNow}
              disabled={items.length === 0}
              className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold py-4 rounded-xl transition-colors shadow-md flex items-center justify-center disabled:opacity-50"
            >
              Pay Now <span className="ml-2">→</span>
            </button>

            <div className="bg-[#ebd9d1]/50 border border-[#e1cfc7] rounded-xl p-4 mt-6 flex items-start space-x-3">
              <Info className="w-4 h-4 text-[#8e6856] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#8e6856] font-medium leading-relaxed">
                Expired items will be automatically removed from your cart before processing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border backdrop-blur-md ${notification.type === 'success'
            ? 'bg-[#EAF3E1]/95 border-[#1A5632]/20 text-[#1A5632]'
            : notification.type === 'error'
              ? 'bg-red-50/95 border-red-200 text-red-950'
              : 'bg-blue-50/95 border-blue-200 text-blue-950'
            }`}>
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-blue-600 shrink-0" />}
            <p className="text-sm font-bold">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
