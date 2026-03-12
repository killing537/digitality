"use client";
import Link from 'next/link';
import { CheckCircle, Download, Home } from 'lucide-react';

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle size={60} className="text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-gray-800 mb-2">Terima Kasih!</h1>
        <p className="text-gray-500 mb-8">Pembayaran kamu berhasil dikonfirmasi. Link produk telah dikirim ke email kamu.</p>
        
        <div className="space-y-3">
          <Link href="/" className="flex items-center justify-center gap-2 w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition">
            <Home size={18} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
