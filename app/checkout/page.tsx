"use client";
import { useState, Suspense } from "react"; // Tambahkan Suspense
import { useRouter, useSearchParams } from "next/navigation";
import { User, Phone, Mail, Loader2 } from "lucide-react";

// 1. Definisikan Interface untuk Form
interface CheckoutFormData {
  name: string;
  phone: string;
  email: string;
}

// 2. Pisahkan Form ke dalam komponen tersendiri untuk membungkusnya dengan Suspense
// Ini wajib di Next.js saat menggunakan useSearchParams() agar build tidak error
function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    phone: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return alert("Produk tidak valid.");
    
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, productId }),
      });
      const data = await res.json();
      
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("Gagal membuat pembayaran: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Data Pengiriman</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            required
            type="text"
            placeholder="Nama Lengkap"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            required
            type="tel"
            placeholder="Nomor WhatsApp"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            required
            type="email"
            placeholder="Alamat Email"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-gray-400"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Bayar Sekarang"}
        </button>
      </form>
    </div>
  );
}

// 3. Export utama dengan Suspense boundary
export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={<Loader2 className="animate-spin text-indigo-600" size={40} />}>
        <CheckoutForm />
      </Suspense>
    </div>
  );
}
