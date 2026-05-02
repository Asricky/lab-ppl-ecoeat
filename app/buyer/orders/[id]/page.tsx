"use client";
import Link from 'next/link';
import { AlertCircle, CheckCircle2, MessageSquare, HelpCircle, Leaf, Truck } from 'lucide-react';

export default function OrderDetailPage() {
  const formatRp = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount * 10000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">Order Details</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left column */}
        <div className="flex-1 space-y-8">
          
          {/* Order Item */}
          <div className="bg-white rounded-3xl p-8 border border-[#eef3e8] shadow-sm flex flex-col sm:flex-row gap-8 relative overflow-hidden">
            <div className="w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 border border-[#eef3e8]">
              <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500" alt="Organic Veggie Box" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col flex-1">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">Organic Veggie Box</h2>
              <p className="text-sm text-gray-500 font-medium mb-5 leading-relaxed">
                A curated selection of peak-season vegetables from local sustainable farms. 10-12lbs of fresh surplus.
              </p>
              <div className="bg-[#eef3e8] w-fit px-4 py-2 rounded-xl border border-[#d4dec4] flex items-center mb-6">
                <Leaf className="w-4 h-4 text-green-700 mr-2" />
                <span className="text-xs font-bold text-gray-700">Sold by: <span className="text-green-800">Willow Creek Farms</span></span>
              </div>
              <div className="mt-auto">
                <p className="text-xs text-gray-500 font-medium mb-1">Quantity: 1 Unit</p>
                <p className="text-3xl font-extrabold text-gray-900">{formatRp(42.50)}</p>
              </div>
            </div>
          </div>

          {/* Delivery Progress */}
          <div className="bg-[#eef3e8] rounded-3xl p-10 border border-[#d4dec4] shadow-sm">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-8">Delivery Progress</h3>
            
            <div className="relative border-l-2 border-[#c3d1b0] ml-4 space-y-10">
              
              <div className="relative pl-10">
                <div className="absolute -left-[17px] top-0 bg-green-700 rounded-full w-8 h-8 flex items-center justify-center border-4 border-[#eef3e8] shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-extrabold text-gray-900 text-lg">Order Confirmed</h4>
                <p className="text-[10px] text-gray-500 font-extrabold mb-1 uppercase tracking-wider">Oct 12, 2024 • 09:14 AM</p>
                <p className="text-sm text-gray-600 font-medium">Your payment was processed and the farm has started packing.</p>
              </div>

              <div className="relative pl-10">
                <div className="absolute -left-[17px] top-0 bg-green-700 rounded-full w-8 h-8 flex items-center justify-center border-4 border-[#eef3e8] shadow-sm">
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-extrabold text-gray-900 text-lg">On Delivery</h4>
                <p className="text-[10px] text-gray-500 font-extrabold mb-1 uppercase tracking-wider">Oct 14, 2024 • 02:30 PM</p>
                <p className="text-sm text-gray-600 font-medium">Courier picked up your box and is en route to your location.</p>
              </div>

              <div className="relative pl-10">
                <div className="absolute -left-[17px] top-0 bg-red-600 rounded-full w-8 h-8 flex items-center justify-center border-4 border-[#eef3e8] shadow-sm">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-extrabold text-red-700 text-lg">Failed Delivery</h4>
                <p className="text-[10px] text-red-700 font-extrabold mb-3 uppercase tracking-wider">Oct 14, 2024 • 05:45 PM</p>
                
                <div className="bg-red-50 border border-red-100 rounded-2xl p-5 shadow-sm">
                  <p className="text-sm text-red-800 font-medium leading-relaxed">
                    Unable to access delivery location. The courier attempted to contact you but was unable to reach you. The perishables have been returned to the distribution hub.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-[460px] space-y-6">
          
          {/* Refund Card */}
          <div className="bg-[#d4dec4] rounded-3xl p-10 relative overflow-hidden shadow-sm border border-[#c3d1b0]">
            <div className="absolute top-0 right-0 bg-[#8e6856] text-white text-[10px] font-extrabold px-4 py-2 rounded-bl-2xl tracking-widest uppercase shadow-sm">
              REFUND ELIGIBLE
            </div>
            
            <h3 className="text-2xl font-extrabold text-gray-900 mb-4 mt-2 leading-tight">Your order was not delivered</h3>
            <p className="text-sm text-gray-700 font-medium leading-relaxed mb-8">
              We're sorry we couldn't get your harvest to you. Because the items are perishable, a re-delivery cannot be scheduled for this specific box. You are entitled to a full refund of the order amount.
            </p>

            <div className="space-y-4 mb-6 border-b border-[#c3d1b0] pb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">Box Subtotal</span>
                <span className="font-extrabold text-gray-900">{formatRp(42.50)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">Eco-Delivery Fee</span>
                <span className="font-extrabold text-gray-900">{formatRp(5.00)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-extrabold text-gray-900 text-xl">Total Refund</span>
              <span className="font-extrabold text-green-800 text-3xl">{formatRp(47.50)}</span>
            </div>

            <button className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold py-4 rounded-xl transition-colors shadow-md flex items-center justify-center mb-5 text-lg">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg> Request Refund
            </button>
            <p className="text-[10px] text-gray-600 text-center font-medium leading-relaxed px-4">
              Refunds typically process within 3-5 business days to your original payment method.
            </p>
          </div>

          {/* Need Assistance */}
          <div className="bg-white rounded-3xl p-8 border border-[#eef3e8] shadow-sm">
            <h3 className="font-extrabold text-gray-900 mb-6 text-xl">Need Assistance?</h3>
            <div className="space-y-5">
              <div className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-2xl transition-colors">
                <div className="bg-[#eef3e8] p-3.5 rounded-full text-green-700 border border-[#d4dec4]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Chat with Support</h4>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">Average wait time: 2 mins</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-2xl transition-colors">
                <div className="bg-[#ebd9d1]/30 p-3.5 rounded-full text-[#8e6856] border border-[#e1cfc7]">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Delivery FAQs</h4>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">Learn about our failed delivery policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Carbon Impact Maintained */}
          <div className="bg-[#f4f7ed] rounded-3xl p-6 border border-[#d4dec4] flex items-start space-x-4 shadow-sm">
            <Leaf className="w-5 h-5 text-green-800 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-green-900 text-sm mb-1">Carbon Impact Maintained</h4>
              <p className="text-[10px] text-green-900/70 font-medium leading-relaxed">
                Even though delivery failed, the carbon offset credits from this transaction will still be applied to Willow Creek Farms reforestation efforts.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
