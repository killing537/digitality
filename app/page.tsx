"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, ShoppingCart, Menu, X, 
  Loader2, ArrowRight, CheckCircle2, ShieldCheck, 
  Clock, Info, AlertCircle 
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 1. FETCH PRODUK DARI GOOGLE SHEETS API
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 2. LOGIKA AUTO-CHECK STATUS PEMBAYARAN (POLLING)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (invoiceData && invoiceData.invoice_id) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/transactions/status?id=${invoiceData.invoice_id}`);
          const data = await res.json();
          // Jika status dari bayar.gg adalah 'success', arahkan ke halaman sukses
          if (data.success && data.data.status === "success") {
            clearInterval(interval);
            router.push("/success");
          }
        } catch (err) {
          console.error("Gagal mengecek status pembayaran");
        }
      }, 5000); // Cek setiap 5 detik
    }
    return () => clearInterval(interval);
  }, [invoiceData, router]);

  // 3. FUNGSI HANDLE BELI
  const handleBuy = async (product: any) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/transactions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productId: product.id, 
          amount: product.price, 
          name: product.name 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setInvoiceData(data); // Tampilkan modal invoice dengan QRIS
      } else {
        alert(data.error || "Gagal memproses transaksi");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* --- HEADER ASLI ANDA --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl">
              <Menu size={20}/>
            </button>
            <div className="flex items-center gap-2 text-indigo-600 font-black text-2xl tracking-tighter">
              <Package size={28} />
              <span>DigiPay</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <div className="hidden sm:block text-right mr-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Sistem</p>
                <p className="text-[10px] text-green-500 font-bold flex items-center justify-end gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Online
                </p>
             </div>
             <div className="bg-indigo-600 text-white p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
                <ShoppingCart size={20} />
             </div>
          </div>
        </div>
      </header>

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <p className="text-gray-400 font-medium animate-pulse">Memuat Produk Terbaik...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <div key={p.id} onClick={() => setSelectedProduct(p)} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 p-4 cursor-pointer group flex flex-col">
                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-gray-50 mb-5 relative">
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 shadow-sm">
                    INSTANT
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-4 px-2">{p.name}</h3>
                <div className="mt-auto flex items-center justify-between bg-gray-50 p-4 rounded-[1.5rem] group-hover:bg-indigo-50 transition-colors">
                  <span className="font-black text-indigo-600 text-xl">Rp {Number(p.price).toLocaleString("id-ID")}</span>
                  <div className="bg-white p-2 rounded-xl text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- MODAL DETAIL PRODUK --- */}
      {selectedProduct && !invoiceData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-8 md:p-10 relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedProduct(null)} className="absolute right-8 top-8 p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24}/></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-inner bg-gray-50">
                <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 text-green-500 font-bold text-[10px] mb-2 uppercase tracking-widest">
                  <CheckCircle2 size={14} /> Verified Product
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">{selectedProduct.name}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">Dapatkan akses instan setelah pembayaran terverifikasi secara otomatis oleh sistem kami.</p>
                
                <div className="bg-indigo-50 p-4 rounded-2xl mb-8 flex items-center justify-between">
                   <span className="text-gray-400 font-bold text-xs uppercase">Harga</span>
                   <span className="text-2xl font-black text-indigo-600">Rp {Number(selectedProduct.price).toLocaleString("id-ID")}</span>
                </div>

                <button 
                  disabled={isProcessing}
                  onClick={() => handleBuy(selectedProduct)}
                  className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:scale-100 shadow-xl shadow-indigo-100"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : "Bayar Sekarang"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL INVOICE PRO (DENGAN TOS & AUTO-CHECK) --- */}
      {invoiceData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-indigo-900/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl my-8 animate-in zoom-in-95 duration-300">
            
            {/* INVOICE HEADER */}
            <div className="bg-indigo-600 p-8 text-white text-center relative">
              <div className="flex justify-center mb-3"><Package size={40} /></div>
              <h2 className="font-black text-2xl tracking-tight leading-none">DIGIPAY INVOICE</h2>
              <div className="mt-3 inline-block px-3 py-1 bg-white/20 rounded-full text-[9px] font-mono tracking-wider">
                {invoiceData.invoice_id}
              </div>
            </div>

            <div className="p-8">
              {/* QRIS SECTION */}
              <div className="bg-white p-4 border-2 border-dashed border-indigo-100 rounded-[2rem] mb-6 flex flex-col items-center shadow-inner relative">
                {invoiceData.qris_converter?.qr_image_url ? (
                  <img 
                    src={invoiceData.qris_converter.qr_image_url} 
                    className="w-52 h-52 object-contain" 
                    alt="QRIS Payment" 
                  />
                ) : (
                  <div className="w-52 h-52 flex flex-col items-center justify-center text-slate-300">
                    <Loader2 className="animate-spin mb-2" size={32} />
                    <p className="text-[10px] font-bold">Menyiapkan QRIS...</p>
                  </div>
                )}
                <div className="absolute -bottom-3 bg-white px-4 py-1 border border-indigo-50 rounded-full shadow-sm">
                   <p className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter flex items-center gap-1">
                     <ShieldCheck size={10} /> Scan QRIS Untuk Bayar
                   </p>
                </div>
              </div>

              {/* PAYMENT DETAIL */}
              <div className="space-y-3 mb-8 bg-slate-50 p-5 rounded-[2rem]">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400 font-bold uppercase">Harga Produk</span>
                  <span className="font-bold text-slate-700">Rp {Number(invoiceData.amount).toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400 font-bold uppercase">Kode Unik</span>
                  <span className="font-bold text-orange-500">+{invoiceData.unique_code}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Harus Dibayar</span>
                  <span className="text-4xl font-black text-indigo-600 tracking-tighter">
                    Rp {Number(invoiceData.final_amount).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* TERMS OF SERVICE (TOS) */}
              <div className="border border-slate-100 rounded-2xl p-4 mb-8 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-slate-500">
                   <Info size={14} className="text-indigo-600" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Ketentuan Layanan</p>
                </div>
                <ul className="text-[9px] text-slate-400 space-y-2 leading-relaxed">
                  <li className="flex gap-2 font-medium">
                    <div className="min-w-[4px] h-[4px] bg-indigo-400 rounded-full mt-1.5"></div>
                    Transfer nominal yang sesuai (termasuk kode unik) agar sistem dapat memverifikasi otomatis.
                  </li>
                  <li className="flex gap-2 font-medium">
                    <div className="min-w-[4px] h-[4px] bg-indigo-400 rounded-full mt-1.5"></div>
                    Jangan menutup halaman ini sebelum status berubah sukses atau gunakan tombol tutup jika batal.
                  </li>
                  <li className="flex gap-2 font-medium">
                    <div className="min-w-[4px] h-[4px] bg-indigo-400 rounded-full mt-1.5"></div>
                    Invoice kedaluwarsa otomatis dalam 15 menit.
                  </li>
                </ul>
              </div>

              {/* INVOICE FOOTER BUTTONS */}
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 mb-4 animate-pulse">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                   <p className="text-[10px] font-bold text-slate-400 italic">Menunggu pembayaran anda...</p>
                </div>
                <button 
                  onClick={() => { setInvoiceData(null); setSelectedProduct(null); }} 
                  className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all text-sm flex items-center justify-center gap-2"
                >
                  <X size={16} /> Batalkan Pesanan
                </button>
              </div>
            </div>
            
            <div className="bg-slate-50 p-5 text-center border-t border-dashed border-slate-200">
              <p className="text-[9px] text-slate-400 font-black tracking-widest uppercase">Verified Secure Payment by DIGIPAYMENT</p>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER ASLI ANDA --- */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-indigo-600 font-black text-3xl mb-3 tracking-tighter">
            <Package size={32} />
            <span>DigiPay</span>
          </div>
          <p className="text-gray-400 text-xs font-medium max-w-xs mx-auto mb-8">Solusi terbaik untuk kebutuhan produk digital Anda dengan proses instan dan aman.</p>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">© 2026 DigiPay Marketplace • Payment secure by DIGIPAYMENT</p>
        </div>
      </footer>
    </div>
  );
}