"use client";

import { useState, useEffect } from "react";
import { Package, Search, ShoppingCart, Menu, X, LayoutGrid, Loader2, ArrowRight, QrCode } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/products").then(res => res.json()).then(data => {
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const handleBuy = async (product: any) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/transactions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, amount: product.price, name: product.name }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInvoiceData(data); // Tampilkan invoice di modal
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* HEADER TETAP DIPERTAHANKAN */}
      <header className="bg-white border-b h-16 sticky top-0 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600 font-black text-xl">
          <Package size={24} /> <span>DigiPay</span>
        </div>
        <div className="bg-indigo-600 text-white p-2 rounded-xl"><ShoppingCart size={20} /></div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} onClick={() => setSelectedProduct(p)} className="bg-white rounded-3xl border p-4 cursor-pointer hover:shadow-lg transition-all">
              <img src={p.image} className="aspect-video rounded-2xl object-cover mb-4" alt="" />
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-indigo-600 font-black mt-2">Rp {Number(p.price).toLocaleString("id-ID")}</p>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL INVOICE TANPA REDIRECT */}
      {invoiceData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-indigo-900/90 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="bg-indigo-600 p-6 text-white text-center">
              <p className="text-[10px] font-bold uppercase opacity-80">Invoice ID</p>
              <p className="font-mono text-xs">{invoiceData.invoice_id}</p>
            </div>
            <div className="p-8 flex flex-col items-center text-center">
              <div className="bg-white p-4 border-4 border-indigo-50 rounded-3xl mb-6">
                <img src={invoiceData.qr_image} className="w-48 h-48" alt="QRIS" />
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase">Total Bayar</p>
              <p className="text-3xl font-black text-indigo-600 mb-6">Rp {Number(invoiceData.final_amount).toLocaleString("id-ID")}</p>
              <button onClick={() => { setInvoiceData(null); setSelectedProduct(null); }} className="w-full py-3 bg-gray-100 rounded-2xl font-bold text-gray-500">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER TETAP DIPERTAHANKAN */}
      <footer className="bg-white border-t py-6 text-center text-xs text-gray-400">
        © 2026 DigiPay - Payment by bayar.gg
      </footer>
    </div>
  );
}