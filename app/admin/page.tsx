"use client";

import { useState, useEffect } from "react";
import { UploadButton } from "@uploadthing/react";
// Pastikan path ini benar sesuai lokasi file core.ts kamu
import type { OurFileRouter } from "@/app/api/uploadthing/core"; 
import { 
  PlusCircle, 
  List as ListIcon, 
  Trash2, 
  Loader2, 
  Package, 
  Image as ImageIcon 
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State untuk Form Add Product
  const [formData, setFormData] = useState({ name: "", description: "", price: "" });
  const [imageUrl, setImageUrl] = useState("");

  // Fetch Produk untuk List
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (activeTab === "list") fetchProducts(); 
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      const res = await fetch("/api/admin/delete-product", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      alert("Gagal menghapus produk");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert("Tunggu sampai gambar selesai diupload!");
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, imageUrl }),
      });
      
      if (res.ok) {
        alert("Produk berhasil ditambahkan!");
        setFormData({ name: "", description: "", price: "" });
        setImageUrl("");
        setActiveTab("list");
      }
    } catch (err) {
      alert("Gagal menambahkan produk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <div className="w-full md:w-64 bg-white border-r p-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-10 text-indigo-600 font-black text-xl">
          <Package /> DigiPay Admin
        </div>
        
        <button 
          onClick={() => setActiveTab("list")}
          className={`flex items-center gap-3 p-3 rounded-xl transition ${activeTab === "list" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-gray-500 hover:bg-gray-100"}`}
        >
          <ListIcon size={20} /> List Produk
        </button>

        <button 
          onClick={() => setActiveTab("add")}
          className={`flex items-center gap-3 p-3 rounded-xl transition ${activeTab === "add" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-gray-500 hover:bg-gray-100"}`}
        >
          <PlusCircle size={20} /> Tambah Produk
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 md:p-10">
        {activeTab === "list" ? (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Daftar Katalog</h1>
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
            ) : (
              <div className="grid gap-4">
                {products.length === 0 && <p className="text-center text-gray-400 py-10">Belum ada produk.</p>}
                {products.map((p) => (
                  <div key={p.id} className="bg-white p-4 rounded-2xl border flex items-center justify-between shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover" />
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center"><ImageIcon className="text-gray-400" /></div>
                      )}
                      <div>
                        <p className="font-bold text-gray-800">{p.name}</p>
                        <p className="text-sm text-indigo-600 font-medium">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Hapus Produk"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Tambah Produk Baru</h1>
            <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
              <div className="mb-8 p-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center bg-gray-50">
                {/* PENAMBAHAN GENERIC DI SINI UNTUK FIX ERROR BUILD */}
                <UploadButton<OurFileRouter, "productUploader">
                  endpoint="productUploader"
                  onClientUploadComplete={(res) => {
                    const url = res?.[0]?.url;
                    if (url) {
                      setImageUrl(url);
                      alert("Gambar berhasil diupload!");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`Gagal Upload: ${error.message}`);
                  }}
                />
                {imageUrl && (
                  <div className="mt-4 flex items-center gap-2 text-[10px] text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <CheckCircleIcon size={12} /> Gambar Siap
                  </div>
                )}
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <input 
                  required 
                  placeholder="Nama Produk" 
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
                <textarea 
                  required 
                  placeholder="Deskripsi Singkat" 
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-28" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
                <input 
                  required 
                  type="number" 
                  placeholder="Harga (Rp)" 
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
                />
                <button 
                  disabled={loading || !imageUrl} 
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex justify-center items-center gap-2 disabled:bg-gray-300 disabled:shadow-none"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Simpan ke Katalog"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Ikon tambahan untuk UI
function CheckCircleIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
