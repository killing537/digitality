"use client";

import { useState, useEffect } from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import {
  PlusCircle, List as ListIcon, Trash2, Loader2, Package, Pencil,
  X, Check, Image as ImageIcon, LayoutDashboard, ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: "", description: "", price: "" });
  const [imageUrl, setImageUrl] = useState("");
  const [editItem, setEditItem] = useState<any>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal ambil produk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert("Upload gambar dulu!");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, imageUrl }),
      });
      if (res.ok) {
        alert("Produk Berhasil Ditambah!");
        setFormData({ name: "", description: "", price: "" });
        setImageUrl("");
        setActiveTab("list");
        fetchProducts();
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* SIDEBAR ADMIN */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-100 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl tracking-tighter">
          <Package size={32} />
          <span>DigiPay <span className="text-[10px] bg-indigo-100 px-2 py-1 rounded-md ml-1">ADMIN</span></span>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("list")}
            className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
          >
            <ListIcon size={20} /> List Produk
          </button>
          <button 
            onClick={() => setActiveTab("add")}
            className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'add' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
          >
            <PlusCircle size={20} /> Tambah Produk
          </button>
          <div className="h-px bg-gray-100 my-4"></div>
          <Link href="/" className="flex items-center gap-3 p-4 rounded-2xl font-bold text-gray-400 hover:text-indigo-600 transition-all">
            <ArrowLeft size={20} /> Lihat Toko
          </Link>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {activeTab === "list" ? (
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-black text-gray-900 mb-8">Katalog Produk</h1>
            {loading ? <Loader2 className="animate-spin text-indigo-600 mx-auto mt-20" size={40} /> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div key={p.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col group">
                    <img src={p.image} className="w-full aspect-square object-cover rounded-2xl mb-4 bg-gray-50" alt="" />
                    <h3 className="font-bold text-gray-900 line-clamp-1">{p.name}</h3>
                    <p className="text-indigo-600 font-black text-lg mb-4">Rp {Number(p.price).toLocaleString("id-ID")}</p>
                    <div className="flex gap-2 mt-auto">
                      <button className="flex-1 bg-gray-50 text-gray-400 p-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"><Trash2 size={18} className="mx-auto"/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-gray-900 mb-8">Produk Baru</h1>
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="mb-8 p-8 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 flex flex-col items-center justify-center text-center">
                <UploadButton<OurFileRouter, "productUploader">
                  endpoint="productUploader"
                  onClientUploadComplete={(res) => { setImageUrl(res?.[0].url || ""); alert("Gambar Terupload!"); }}
                />
                {imageUrl && <p className="mt-4 text-[10px] text-green-600 font-mono truncate w-full">{imageUrl}</p>}
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <input required placeholder="Nama Produk" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <textarea required placeholder="Deskripsi Lengkap" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none h-32" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                <input required type="number" placeholder="Harga (Contoh: 10000)" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                <button disabled={loading || !imageUrl} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:bg-gray-200">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : "Publish Produk Sekarang"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}