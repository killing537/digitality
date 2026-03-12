"use client";
import { useState, useEffect } from "react";
import { UploadButton } from "@uploadthing/react";
import { PlusCircle, List, Trash2, LayoutDashboard, Loader2, Package } from "lucide-react";

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
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { if (activeTab === "list") fetchProducts(); }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    await fetch("/api/admin/delete-product", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    fetchProducts();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/add-product", {
      method: "POST",
      body: JSON.stringify({ ...formData, imageUrl }),
    });
    setLoading(false);
    setActiveTab("list"); // Pindah ke list setelah tambah
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-10 text-indigo-600 font-black text-xl">
          <Package /> DigiPay Admin
        </div>
        
        <button 
          onClick={() => setActiveTab("list")}
          className={`flex items-center gap-3 p-3 rounded-xl transition ${activeTab === "list" ? "bg-indigo-600 text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"}`}
        >
          <List size={20} /> List Produk
        </button>

        <button 
          onClick={() => setActiveTab("add")}
          className={`flex items-center gap-3 p-3 rounded-xl transition ${activeTab === "add" ? "bg-indigo-600 text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"}`}
        >
          <PlusCircle size={20} /> Tambah Produk
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10">
        {activeTab === "list" ? (
          <div>
            <h1 className="text-2xl font-bold mb-6">Daftar Produk</h1>
            {loading ? <Loader2 className="animate-spin mx-auto" /> : (
              <div className="grid gap-4">
                {products.map((p) => (
                  <div key={p.id} className="bg-white p-4 rounded-2xl border flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <img src={p.image} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold">{p.name}</p>
                        <p className="text-sm text-gray-500">Rp {p.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-xl">
            <h1 className="text-2xl font-bold mb-6">Tambah Produk Baru</h1>
            <form onSubmit={handleAddProduct} className="space-y-4 bg-white p-8 rounded-3xl border shadow-sm">
              <div className="mb-4">
                 <UploadButton endpoint="productUploader" onClientUploadComplete={(res) => setImageUrl(res[0].ufsUrl)} />
                 {imageUrl && <p className="text-[10px] text-green-600 mt-2 truncate">{imageUrl}</p>}
              </div>
              <input required placeholder="Nama Produk" className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <textarea required placeholder="Deskripsi" className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, description: e.target.value})} />
              <input required type="number" placeholder="Harga" className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, price: e.target.value})} />
              <button disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition flex justify-center">
                {loading ? <Loader2 className="animate-spin" /> : "Simpan Produk"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
