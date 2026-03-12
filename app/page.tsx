"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  ChevronRight, 
  Facebook, 
  Instagram, 
  Twitter,
  LayoutGrid,
  TrendingUp,
  Tag
} from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <div className="flex items-center gap-2 text-indigo-600 font-black text-2xl">
              <Package size={28} />
              <span className="hidden sm:inline">DigiPay</span>
            </div>
          </div>

          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari produk digital..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 hover:bg-gray-100 rounded-full text-gray-600 relative">
              <ShoppingCart size={22} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] flex items-center justify-center rounded-full">0</span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
            <button className="hidden sm:block text-sm font-bold text-indigo-600 px-4 py-2 hover:bg-indigo-50 rounded-xl transition">Masuk</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        
        {/* --- SIDEBAR (RESPONSIF) --- */}
        <aside className={`
          fixed lg:sticky top-16 h-[calc(100vh-64px)] bg-white lg:bg-transparent
          w-64 border-r lg:border-none p-6 transition-all z-30
          ${isSidebarOpen ? "left-0" : "-left-64 lg:left-0"}
        `}>
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Kategori</p>
              <nav className="space-y-1">
                {[
                  { icon: <LayoutGrid size={18} />, label: "Semua Produk" },
                  { icon: <TrendingUp size={18} />, label: "Terlaris" },
                  { icon: <Tag size={18} />, label: "Promo" },
                ].map((item, idx) => (
                  <button key={idx} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white lg:hover:shadow-sm text-gray-600 hover:text-indigo-600 group transition-all">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-sm font-semibold">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="p-5 bg-indigo-600 rounded-3xl text-white relative overflow-hidden group">
              <div className="relative z-10">
                <p className="font-bold text-sm mb-1 text-indigo-100">Dapatkan Promo</p>
                <p className="font-black text-xl mb-3 leading-tight">Diskon Akhir Pekan!</p>
                <button className="bg-white text-indigo-600 text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-tighter">Cek Sekarang</button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500 rounded-full opacity-50 blur-2xl group-hover:scale-150 transition-all duration-700"></div>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 p-6 lg:p-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-black text-gray-800">Katalog Digital</h1>
            <p className="text-sm text-gray-400 font-medium">{products.length} Produk ditemukan</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <LoaderCircle />
              <p className="text-sm text-gray-400 font-medium animate-pulse">Menyiapkan koleksi...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-3 flex flex-col group cursor-pointer">
                  <div className="aspect-square rounded-[1.5rem] overflow-hidden bg-gray-50 mb-4 relative">
                    <img 
                      src={p.image || "https://placehold.co/400x400?text=Digital+Product"} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/80 backdrop-blur-md p-2 rounded-xl text-gray-400 hover:text-red-500 shadow-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{p.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-4 h-8 leading-relaxed">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-indigo-600">Rp {Number(p.price).toLocaleString("id-ID")}</span>
                      <button className="bg-gray-50 hover:bg-indigo-600 hover:text-white p-2.5 rounded-xl transition-all">
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-2xl mb-6">
                <Package size={28} />
                <span>DigiPay</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Pasar digital terpercaya untuk kebutuhan lisensi, akun premium, dan produk virtual lainnya dengan sistem pembayaran otomatis 24 jam.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-6">Layanan</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="hover:text-indigo-600 cursor-pointer">Cara Pembelian</li>
                <li className="hover:text-indigo-600 cursor-pointer">Cek Status Pesanan</li>
                <li className="hover:text-indigo-600 cursor-pointer">Kebijakan Privasi</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-6">Ikuti Kami</h4>
              <div className="flex gap-4">
                <div className="p-2 bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-lg cursor-pointer transition-all"><Facebook size={20} /></div>
                <div className="p-2 bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-lg cursor-pointer transition-all"><Instagram size={20} /></div>
                <div className="p-2 bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-lg cursor-pointer transition-all"><Twitter size={20} /></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400 font-medium">© 2026 DigiPay Digital Marketplace. Seluruh Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-6 text-xs text-gray-400 font-medium">
              <span>Syarat & Ketentuan</span>
              <span>Hubungi Kami</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Ikon loading sederhana
function LoaderCircle() {
  return (
    <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
  );
}
