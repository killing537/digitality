"use client";
import { CheckCircle, ArrowLeft, Download, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl text-center animate-in zoom-in-95">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle size={64} className="text-green-500" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Pembayaran Berhasil!</h1>
        <p className="text-slate-500 mb-8">Terima kasih telah berbelanja di DigiPay. Pesananmu sedang diproses otomatis.</p>
        
        <div className="space-y-3">
          <Link href="/" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all">
            <ShoppingBag size={20} /> Kembali Belanja
          </Link>
          <button className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200">
            <Download size={20} /> Simpan Invoice
          </button>
        </div>
      </div>
    </div>
  );
}