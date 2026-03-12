"use client";

import { useState, useEffect } from "react";
import { 
  Package, Search, ShoppingCart, Menu, X, LayoutGrid, 
  Loader2, CheckCircle2, ArrowRight, ShieldCheck
} from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
        setFilteredProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const result = products.filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(result);
  }, [searchQuery, products]);

  const handleBuy = async (product: any) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/transactions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          amount: product.price,
          name: product.name,
        }),
      });

      const data = await res.json();

      if (res.ok && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        alert(`Gagal: ${data.error || "Terjadi kesalahan"}`);
      }
    } catch (err) {
      alert("Kesalahan koneksi internet.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b h-16 sticky top-0 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden"><Menu size={20}/></button>
          <div className="flex items-center gap-2 text-indigo-600 font-black text-xl tracking-tighter">
            <Package size={24} /> <span>DigiPay</span>
          </div>
        </div>
        <div className="flex-1 max-w-xs mx-4 relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Cari..." 
            className="w-full pl-9 pr-4 py-1.5 bg-slate-100 rounded-xl outline-none text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="bg-indigo-600 text-white p-2 rounded-xl"><ShoppingCart size={20} /></div>
      </header>

      <div className="flex flex-1 max-w-7xl w-full mx-auto relative">
        <aside className={`fixed lg:sticky top-16 h-[calc(100vh-64px)] w-64 p-6 bg-white lg:bg-transparent border-r lg:border-none transition-all z-30 ${isSidebarOpen ? "left-0" : "-left-64 lg:left-0"}`}>
          <nav className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Menu Utama</p>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm bg-indigo-600 text-white"><LayoutGrid size={18} /> Katalog</button>
          </nav>
        </aside>

        <main className="flex-1 p-4 lg:p-8">
          {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={32} /></div> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div key={p.id} onClick={() => setSelectedProduct(p)} className="bg-white rounded-3xl border p-4 cursor-pointer hover:shadow-lg transition-all">
                  <img src={p.image} className="aspect-video rounded-2xl object-cover mb-4" alt={p.name} />
                  <h3 className="font-bold text-lg text-slate-800">{p.name}</h3>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <span className="font-black text-indigo-600">Rp {Number(p.price).toLocaleString("id-ID")}</span>
                    <ArrowRight size={18} className="text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-6 md:p-10 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedProduct(null)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"><X /></button>
            <div className="flex flex-col gap-6">
              <img src={selectedProduct.image} className="rounded-3xl w-full aspect-video object-cover" />
              <div>
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <ShieldCheck size={14} /> <span className="text-[10px] font-bold uppercase">Produk Digital</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">{selectedProduct.name}</h2>
                <p className="text-sm text-slate-500 mb-6">{selectedProduct.description}</p>
                <button 
                  disabled={isProcessing} 
                  onClick={() => handleBuy(selectedProduct)}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black flex justify-center items-center gap-2 hover:bg-indigo-700 transition-colors disabled:bg-slate-300"
                >
                  {isProcessing ? <Loader2 className="animate-spin"/> : `Bayar Rp ${Number(selectedProduct.price).toLocaleString("id-ID")}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}