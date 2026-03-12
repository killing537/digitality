"use client";

import { useState, useEffect } from "react";
import { 
  Package, Search, ShoppingCart, Menu, X, LayoutGrid, 
  Loader2, ArrowRight, ShieldCheck
} from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleBuy = async (product: any) => {
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
        setInvoiceData(data); // Tampilkan modal invoice
      } else {
        alert(data.error || "Gagal membuat transaksi");
      }
    } catch (err) {
      alert("Kesalahan koneksi");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* HEADER ASLI ANDA */}
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
          <div className="bg-indigo-600 text-white p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
            <ShoppingCart size={20} />
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl w-full mx-auto relative px-4 sm:px-0">
        <main className="flex-1 p-4 lg:p-10 min-w-0">
          {loading ? <div className="flex justify-center py-32"><Loader2 className="animate-spin text-indigo-600" size={48} /></div> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} onClick={() => setSelectedProduct(p)} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all p-4 flex flex-col group cursor-pointer">
                  <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-gray-50 mb-5">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{p.name}</h3>
                  <div className="flex items-center justify-between mt-auto bg-gray-50 p-3 rounded-2xl">
                    <span className="font-black text-indigo-600 text-lg">Rp {Number(p.price).toLocaleString("id-ID")}</span>
                    <div className="bg-white p-2 rounded-xl shadow-sm text-indigo-600"><ArrowRight size={20} /></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MODAL DETAIL PRODUK */}
      {selectedProduct && !invoiceData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-8 relative shadow-2xl">
            <button onClick={() => setSelectedProduct(null)} className="absolute right-8 top-8 p-2 hover:bg-gray-100 rounded-full"><X size={24}/></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <img src={selectedProduct.image} className="aspect-square rounded-[2rem] object-cover" alt="" />
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-black text-gray-900 mb-4">{selectedProduct.name}</h2>
                <button 
                  disabled={isProcessing}
                  onClick={() => handleBuy(selectedProduct)}
                  className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 flex items-center justify-center gap-3 disabled:bg-gray-300"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : "Bayar Sekarang"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INVOICE (QRIS DALAM HALAMAN) */}
      {invoiceData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-indigo-900/90 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl text-center">
            <div className="bg-indigo-600 p-6 text-white uppercase text-[10px] font-bold tracking-widest">
              Invoice: {invoiceData.invoice_id}
            </div>
            <div className="p-8 flex flex-col items-center">
              <div className="bg-white p-4 border-4 border-indigo-50 rounded-3xl mb-6">
                <img src={invoiceData.qris_converter?.qr_image_url} className="w-48 h-48" alt="QRIS" />
              </div>
              <p className="text-3xl font-black text-indigo-600 mb-8">Rp {Number(invoiceData.final_amount).toLocaleString("id-ID")}</p>
              <button onClick={() => { setInvoiceData(null); setSelectedProduct(null); }} className="w-full py-4 bg-gray-100 rounded-2xl font-bold text-gray-500">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER ASLI ANDA */}
      <footer className="bg-white border-t border-gray-100 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-indigo-600 font-black text-2xl mb-2">
            <Package size={24} />
            <span>DigiPay</span>
          </div>
          <p className="text-gray-400 text-xs">© 2026 DigiPay Marketplace. Payment by bayar.gg.</p>
        </div>
      </footer>
    </div>
  );
}