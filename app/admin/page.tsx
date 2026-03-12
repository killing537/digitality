"use client";

import { useState, useEffect } from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core"; 
import { PlusCircle, List, Trash2, Loader2, Package, Pencil, X, Check } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState<any>(null); // State untuk produk yang sedang diedit
  
  const [formData, setFormData] = useState({ name: "", description: "", price: "" });
  const [imageUrl, setImageUrl] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { if (activeTab === "list") fetchProducts(); }, [activeTab]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/update-product", {
      method: "PUT",
      body: JSON.stringify({ ...editItem }),
    });
    if (res.ok) {
      setEditItem(null);
      fetchProducts();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus?")) return;
    await fetch("/api/admin/delete-product", { method: "DELETE", body: JSON.stringify({ id }) });
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR (Sama seperti sebelumnya) */}
      <div className="w-64 bg-white border-r p-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-10 text-indigo-600 font-black text-xl"><Package /> DigiPay</div>
        <button onClick={() => setActiveTab("list")} className={`flex items-center gap-3 p-3 rounded-xl ${activeTab === "list" ? "bg-indigo-600 text-white" : "text-gray-500"}`}><List size={20} /> List</button>
        <button onClick={() => setActiveTab("add")} className={`flex items-center gap-3 p-3 rounded-xl ${activeTab === "add" ? "bg-indigo-600 text-white" : "text-gray-500"}`}><PlusCircle size={20} /> Tambah</button>
      </div>

      <div className="flex-1 p-10">
        {activeTab === "list" ? (
          <div className="grid gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-2xl border flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={p.image} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <p className="font-bold">{p.name}</p>
                    <p className="text-sm text-indigo-600">Rp {Number(p.price).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditItem(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* FORM ADD (Sama seperti sebelumnya) */
          <p>Form Add Product...</p>
        )}
      </div>

      {/* MODAL EDIT */}
      {editItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Produk</h2>
              <button onClick={() => setEditItem(null)}><X /></button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input className="w-full p-4 border rounded-2xl" value={editItem.name} onChange={(e) => setEditItem({...editItem, name: e.target.value})} />
              <input type="number" className="w-full p-4 border rounded-2xl" value={editItem.price} onChange={(e) => setEditItem({...editItem, price: e.target.value})} />
              <textarea className="w-full p-4 border rounded-2xl" value={editItem.description} onChange={(e) => setEditItem({...editItem, description: e.target.value})} />
              
              <div className="flex flex-col gap-2">
                <p className="text-xs text-gray-400">Ganti Gambar (Opsional):</p>
                <UploadButton<OurFileRouter, "productUploader">
                  endpoint="productUploader"
                  onClientUploadComplete={(res) => setEditItem({...editItem, image: res?.[0].url})}
                />
              </div>

              <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <><Check size={20} /> Simpan Perubahan</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
