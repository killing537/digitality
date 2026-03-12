"use client";

import { useState, useEffect } from "react";
import { 
  Package, Search, ShoppingCart, Menu, X, ChevronRight, 
  Instagram, Twitter, LayoutGrid, TrendingUp, Tag, Loader2, 
  CheckCircle2, ArrowRight, ShieldCheck, Zap
} from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State untuk Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua Produk");

  // State untuk Detail/Modal Beli
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // 1. Fetch Data Produk
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const productList = Array.isArray(data) ? data : [];
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (err) {
        console.error("Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Logika Search & Filter
  useEffect(() => {
    let result = products;
    if (searchQuery) {
      result = result.filter((p) => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeCategory === "Terlaris") {
      result = result.filter((p) => Number(p.price) > 50000);
    } else if (activeCategory === "Promo") {
      result = result.filter((p) => p.name.toLowerCase().includes("promo"));
    }
    setFilteredProducts(result);
  }, [searchQuery, activeCategory, products]);

  // 3. Fungsi Checkout QRIS (Gopay/QRIS via bayar.gg)
  const handleBuy = async (product: any) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/transactions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          amount: product.price,
        }),
      });

      const data = await res.json();

      if (data.checkout_url) {
        // Mengarahkan ke halaman bayar.gg yang berisi QRIS
        window.location.href = data.checkout_url;
      } else {
        alert("Gagal membuat transaksi. Pastikan API Key bayar.gg sudah benar.");
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem saat mencoba checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-indigo-100">
      
      {/* --- HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl text-gray-600">
              {isSidebarOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
            <div className="flex items-center gap-2 text-indigo-600 font-black text-2xl tracking-tighter">
              <Package size={28} />
              <span>DigiPay</span>
            </div>
          </div>

          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Cari lisensi atau akun premium..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 transition-all outline-none text-sm"
              />
            </div>
          </div>

          <button className="bg-indigo-600 text-white p-2.5 rounded-2xl shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95 transition-all">
            <ShoppingCart size={20} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl w-full mx-auto relative px-4 sm:px-0">
        
        {/* --- SIDEBAR --- */}
        <aside className={`
          fixed lg:sticky top-16 h-[calc(100vh-64px)] bg-white lg:bg-transparent
          w-64 border-r lg:border-none p-6 transition-all z-30
          ${isSidebarOpen ? "left-0 shadow-2xl" : "-left-64 lg:left-0"}
        `}>
          <div className="space-y-8">
            <nav className="space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 mb-4">Navigasi Utama</p>
              {[
                { icon: <LayoutGrid size={18} />, label: "Semua Produk" },
                { icon: <TrendingUp size={18} />, label: "Terlaris" },
                { icon: <Tag size={18} />, label: "Promo" },
              ].map((item) => (
                <button 
                  key={item.label}
                  onClick={() => { setActiveCategory(item.label); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl font-bold text-sm transition-all ${
                    activeCategory === item.label 
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]" 
                    : "text-gray-500 hover:bg-white hover:text-indigo-600"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] text-white overflow-hidden relative group">
              <Zap className="absolute -right-2 -top-2 opacity-20 group-hover:rotate-12 transition-transform" size={80} />
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-indigo-200 uppercase mb-1">Instant Delivery</p>
                <p className="font-bold text-lg leading-tight mb-4">Proses Otomatis 24 Jam</p>
                <div className="w-8 h-1 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 p-4 lg:p-10 min-w-0">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">{activeCategory}</h1>
            <p className="text-sm text-gray-500 font-medium">Temukan penawaran terbaik untuk kebutuhan digital Anda.</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="animate-spin text-indigo-600" size={48} />
            </div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                  <Package className="mx-auto text-gray-200 mb-4" size={64} />
                  <h3 className="text-lg font-bold text-gray-800">Tidak ditemukan</h3>
                  <button onClick={() => {setSearchQuery(""); setActiveCategory("Semua Produk")}} className="mt-4 text-indigo-600 font-bold text-sm underline">Reset Filter</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((p) => (
                    <div 
                      key={p.id} 
                      onClick={() => setSelectedProduct(p)}
                      className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all p-4 flex flex-col group cursor-pointer"
                    >
                      <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-gray-50 mb-5 relative">
                        <img 
                          src={p.image || "https://placehold.co/600x400"} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="px-2 flex-1 flex flex-col">
                        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors">{p.name}</h3>
                        <p className="text-[11px] text-gray-400 line-clamp-2 mb-6 flex-1 leading-relaxed italic">{p.description}</p>
                        <div className="flex items-center justify-between mt-auto bg-gray-50 p-3 rounded-2xl">
                          <span className="font-black text-indigo-600 text-lg">Rp {Number(p.price).toLocaleString("id-ID")}</span>
                          <div className="bg-white p-2 rounded-xl shadow-sm text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <ArrowRight size={20} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* --- MODAL DETAIL & CHECKOUT QRIS --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setSelectedProduct(null)}></div>
          <div className="bg-white w-full max-w-2xl rounded-t-[3rem] sm:rounded-[3rem] p-8 md:p-12 relative shadow-2xl animate-in slide-in-from-bottom duration-500 overflow-y-auto max-h-[90vh]">
            <button onClick={() => setSelectedProduct(null)} className="absolute right-8 top-8 p-2 hover:bg-gray-100 rounded-full transition"><X size={24}/></button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="aspect-square rounded-[2rem] overflow-hidden bg-gray-50 shadow-inner">
                <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verified Product</span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">{selectedProduct.name}</h2>
                <div className="text-sm text-gray-500 leading-relaxed mb-8 flex-1">
                  {selectedProduct.description}
                  <div className="mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-[11px] font-bold text-indigo-600">
                        <CheckCircle2 size={14} /> Bayar via QRIS (Otomatis)
                      </li>
                      <li className="flex items-center gap-2 text-[11px] font-bold text-indigo-600">
                        <CheckCircle2 size={14} /> Support 24/7
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Harga</span>
                    <span className="text-3xl font-black text-indigo-600">Rp {Number(selectedProduct.price).toLocaleString("id-ID")}</span>
                  </div>
                  <button 
                    disabled={isProcessing}
                    onClick={() => handleBuy(selectedProduct)}
                    className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 disabled:bg-gray-300"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <>Beli via QRIS <ArrowRight size={22}/></>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-indigo-600 font-black text-3xl mb-4 italic">
            <Package size={32} />
            <span>DigiPay</span>
          </div>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-12 font-medium">Platform produk digital otomatis 24 jam dengan pembayaran QRIS terintegrasi.</p>
          <div className="pt-8 border-t border-gray-50 text-center">
            <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em]">© 2026 DigiPay Marketplace.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
