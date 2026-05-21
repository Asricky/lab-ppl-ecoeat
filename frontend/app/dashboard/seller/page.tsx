import DocumentUpload from '@/components/DocumentUpload';

export default function SellerDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Seller Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <DocumentUpload 
          title="NIB Seller" 
          description="Unggah Nomor Induk Berusaha (NIB) untuk verifikasi toko Anda." 
        />
        <DocumentUpload 
          title="Surat Legalitas LKS (F2 & F3)" 
          description="Unggah dokumen F2 & F3 jika Anda merupakan Lembaga Kesejahteraan Sosial." 
        />
      </div>
    </div>
  );
}
