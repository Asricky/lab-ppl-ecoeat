"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Package, 
  AlertTriangle, 
  Scale, 
  Heart, 
  Eye, 
  Pencil, 
  Trash2, 
  Clock,
  X,
  ArrowLeft,
  Leaf,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

import { useProductStore } from '@/store/productStore';

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const { products, deleteProduct, updateProduct } = useProductStore();
  
  // Modal states
  const [modalType, setModalType] = useState<'view' | 'edit' | 'delete' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({ name: '', stock: 0, price: '', status: '', description: '', type: 'Sell' });

  const filteredProducts = products.filter((p: any) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Selling') return p.type === 'Sell';
    if (activeTab === 'Donating') return p.type === 'Donate';
    return true;
  });

  const openModal = (type: 'view' | 'edit' | 'delete', product: any) => {
    setSelectedProduct(product);
    setModalType(type);
    if (type === 'edit') {
      setEditForm({
        name: product.name,
        stock: product.stock,
        price: product.price,
        status: product.status,
        description: product.description || '',
        type: product.type || 'Sell'
      });
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedProduct(null);
  };

  const handleDelete = () => {
    deleteProduct(selectedProduct.id);
    closeModal();
  };

  const handleEditSave = () => {
    updateProduct(selectedProduct.id, editForm);
    closeModal();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Back Button */}
      <div className="mb-4">
        <button onClick={() => window.history.back()} className="flex items-center space-x-2 text-gray-500 hover:text-[#1A5632] transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 w-fit">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Products</h1>
          <div className="flex space-x-1 bg-gray-100/80 p-1 rounded-xl w-max">
            {['All', 'Selling', 'Donating'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-green-700 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <Link href="/dashboard/seller/products/create" className="block">
          <button className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm w-full md:w-auto">
            <Plus size={20} />
            <span>Add New Product</span>
          </button>
        </Link>
      </div>

      {/* Live Feed: Recently Registered Products */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse mr-2.5 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            Live: Newly Registered Products
          </h2>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Updated just now</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.slice(0, 3).map((product: any, idx: number) => (
            <div 
              key={`live-${product.id}`} 
              onClick={() => openModal('view', product)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-green-100 hover:border-green-300 hover:shadow-md cursor-pointer flex items-start space-x-4 relative overflow-hidden group transition-all"
            >
              <div className="absolute top-0 right-0 bg-green-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-xl uppercase tracking-wider z-10 shadow-sm">
                {idx === 0 ? 'Just Now' : `${idx + 1}m ago`}
              </div>
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="pr-4">
                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 group-hover:text-[#1A5632] transition-colors line-clamp-1">{product.name}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-bold text-[#1A5632]">{product.price}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-[10px] text-gray-500 font-medium">{product.stock} units</span>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      product.type === 'Donate' 
                        ? 'bg-[#F2E8DF] text-[#7A5B42]' 
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                  {product.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Inventory List</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Expiry</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredProducts.map((product: any) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                      product.type === 'Donate' 
                        ? 'bg-[#F2E8DF] text-[#7A5B42]' 
                        : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {product.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-700">{product.stock} units</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center space-x-1.5 ${product.status === 'Expiring Soon' ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      <Clock size={14} className={product.status === 'Expiring Soon' ? 'text-red-500' : 'text-gray-400'} />
                      <span>{product.expiry}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.status === 'Expiring Soon' 
                        ? 'bg-rose-100 text-rose-700' 
                        : product.status === 'Sold Out'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => openModal('view', product)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View details">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => openModal('edit', product)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit product">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => openModal('delete', product)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete product">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Package size={40} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="text-gray-500 mt-1">Try changing the tab filter or add a new product.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
            {modalType === 'view' && (
              <button onClick={closeModal} className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-gray-700 hover:text-[#1A5632] transition-colors font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm border border-gray-100/50">
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
            )}
            <button onClick={closeModal} className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm border border-gray-100/50">
              <X size={16} />
            </button>

            {modalType === 'view' && selectedProduct && (
              <div className="bg-[#F4F8EC] min-h-[400px] flex flex-col pt-12 p-6">
                <div className="mb-6">
                  <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-2">{selectedProduct.name}</h2>
                  <div className="flex items-end space-x-3">
                    <span className="text-3xl font-extrabold text-[#1A5632]">{selectedProduct.price}</span>
                    <span className="text-sm font-bold text-gray-400 line-through mb-1.5">Rp {(parseInt(selectedProduct.price.replace(/\D/g,'')) * 1.5).toLocaleString('id-ID')}</span>
                    <span className="text-xs font-bold text-gray-500 mb-1.5">per unit</span>
                  </div>
                </div>

                <div className="bg-[#FDF9ED] rounded-2xl p-5 mb-6 shadow-sm border border-[#F2E8DF]">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2 text-red-700 font-bold text-sm">
                      <Clock size={18} />
                      <span>Expires in: {selectedProduct.expiry}</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="bg-white border border-gray-200 text-gray-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">Near Expiry</span>
                      <span className="bg-white border border-gray-200 text-gray-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">Surplus</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="w-1/4 h-full bg-red-600 rounded-full"></div>
                    </div>
                    <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Only {selectedProduct.stock} left - Selling Fast!</span>
                  </div>
                </div>

                <div className="bg-[#EAF3EA] rounded-2xl p-5 mb-6 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#D1E8D7] rounded-full flex items-center justify-center text-[#1A5632] shrink-0">
                    <Leaf size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900">Green Valley Farm</h4>
                      <span className="text-xs font-bold text-[#1A5632]">1.2 miles away</span>
                    </div>
                    <div className="flex justify-between items-end mt-1">
                      <p className="text-xs font-medium text-gray-600 flex items-center">
                        <MapPin size={12} className="mr-1" /> Downtown Market, Sector 4
                      </p>
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Local Vendor</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm mb-2">
                  <h4 className="flex items-center space-x-2 font-bold text-gray-900 mb-3 text-sm">
                    <Package size={16} className="text-gray-500" />
                    <span>Handling & Storage</span>
                  </h4>
                  <p className="text-sm font-medium text-gray-600 leading-relaxed">
                    {selectedProduct.description || "Store at room temperature. Best used within 2 days of purchase. Eco-friendly compostable packaging provided to maintain freshness during transport."}
                  </p>
                </div>
              </div>
            )}

            {modalType === 'edit' && selectedProduct && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name</label>
                      <input 
                        type="text" 
                        value={editForm.name} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                        className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors text-gray-900 font-medium" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Listing Type</label>
                      <select 
                        value={editForm.type || 'Sell'} 
                        onChange={e => setEditForm({...editForm, type: e.target.value})}
                        className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors text-gray-900 font-medium appearance-none" 
                      >
                        <option value="Sell">Sell (Marketplace)</option>
                        <option value="Donate">Donate (Charity)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description & Storage Details</label>
                    <textarea 
                      rows={3}
                      value={editForm.description} 
                      onChange={e => setEditForm({...editForm, description: e.target.value})}
                      className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors text-gray-900 font-medium resize-none" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stock</label>
                      <input 
                        type="number" 
                        value={editForm.stock} 
                        onChange={e => setEditForm({...editForm, stock: parseInt(e.target.value)})}
                        className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors text-gray-900 font-medium" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price</label>
                      <input 
                        type="text" 
                        value={editForm.price} 
                        onChange={e => setEditForm({...editForm, price: e.target.value})}
                        className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors text-gray-900 font-medium" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                    <select 
                      value={editForm.status}
                      onChange={e => setEditForm({...editForm, status: e.target.value})}
                      className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors text-gray-900 font-medium"
                    >
                      <option value="Active">Active</option>
                      <option value="Expiring Soon">Expiring Soon</option>
                      <option value="Sold Out">Sold Out</option>
                    </select>
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <button onClick={closeModal} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition-colors">Cancel</button>
                  <button onClick={handleEditSave} className="flex-1 bg-[#1A5632] hover:bg-[#0F351F] text-white py-3 rounded-xl font-bold transition-colors">Save Changes</button>
                </div>
              </div>
            )}

            {modalType === 'delete' && selectedProduct && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Product?</h2>
                <p className="text-gray-500 font-medium mb-8">
                  Are you sure you want to delete <span className="font-bold text-gray-700">{selectedProduct.name}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition-colors">Cancel</button>
                  <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-colors">Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
