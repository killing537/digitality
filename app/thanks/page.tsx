import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="animate-bounce mb-4">
        <CheckCircle size={80} className="text-green-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
      <p className="text-gray-600 mb-8 max-w-sm">
        Terima kasih telah berbelanja. Pesanan Anda sedang kami proses dan produk telah otomatis diperbarui.
      </p>
      <Link 
        href="/" 
        className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
      >
        Kembali ke Katalog
      </Link>
    </div>
  );
}
