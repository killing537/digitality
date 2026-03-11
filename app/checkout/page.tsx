"use client";

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Loader2, CreditCard, ShieldCheck, ArrowLeft, Smartphone, User, Mail } from 'lucide-react';
import Link from 'next/link';

function CheckoutForm() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId) {
      alert("Produk tidak valid. Silakan kembali ke katalog.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId, 
          name: customer.name,
          email: customer.email,
          phone: customer.phone 
        }),
      });

      const data = await res.json();

      if (res.ok && data.paymentUrl) {
        // Langsung arahkan ke halaman QRIS Bayar.gg
        window.location.href = data.paymentUrl;
      } else {
        alert(data.error || "Gagal memproses pembayaran. Periksa API Key di Vercel.");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div className="flex items-center gap-2 text-indigo-600">
            <CreditCard size={20} />
            <span className="font-bold uppercase tracking-widest text-sm">Checkout</span>
          </div>
          <div className="w-9"></div> {/* Spacer */}
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-800">Data Pembeli</h1>
          <p className="text-gray-400 text-sm mt-1">Lengkapi data untuk menerima akses produk</p>
        </div>

        <form onSubmit={handlePayment} className="space-y-5">
          {/* Input Nama */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              required 
              type="text"
              placeholder="Nama Lengkap"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              onChange={(e) => setCustomer({...customer, name: e.target.value})}
            />
          </div>
          
          {/* Input Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              required 
              type="email"
              placeholder="Email Aktif"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              onChange={(e) => setCustomer({...customer, email: e.target.value})}
            />
          </div>

          {/* Input WhatsApp */}
          <div className="relative">
            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              required
              type="tel"
              placeholder="No. WhatsApp (Aktif)"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              onChange={(e) => setCustomer({...customer, phone: e.target.value})}
            />
          </div>

          {/* Tombol Bayar */}
          <div className="pt-4">
            <button 
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:bg-gray-300 flex justify-center items-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> 
                  <span>Memproses...</span>
                </>
              ) : (
                "Bayar Sekarang via QRIS"
              )}
            </button>
          </div>
        </form>

        {/* Footer Keamanan */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-1 rounded-full">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Secure Payment by Bayar.gg</span>
          </div>
          <p className="text-[10px] text-gray-400 text-center px-4">
            Dengan menekan tombol, Anda setuju dengan syarat dan ketentuan yang berlaku.
          </p>
        </div>
      </div>
    </div>
  );
}

// Komponen utama dengan Suspense
export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}