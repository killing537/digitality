"use client";

import { useState, useEffect } from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import {
  PlusCircle,
  List as ListIcon,
  Trash2,
  Loader2,
  Package,
  Pencil,
  X,
  Check,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";

export default function AdminDashboard() {
  // Tabs & Loading State
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  // State untuk Form Tambah
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [imageUrl, setImageUrl] = useState("");

  // State untuk Modal Edit
  const [editItem, setEditItem] = useState<any>(null);

  // 1. Fungsi Ambil Data Produk
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil produk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "list") fetchProducts();
  }, [activeTab]);

  // 2. Fungsi Tambah Produk
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert("Upload gambar terlebih dahulu!");

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
      alert("Gagal menambah produk");
    } finally {
      setLoading(false);
    }
  };

  // 3. Fungsi Update Produk (Edit)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/update-product", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editItem.id,
          name: editItem.name,
          description: editItem.description,
          price: editItem.price,
          imageUrl: editItem.image,
        }),
      });

      if (res.ok) {
        alert("Produk berhasil diupdate!");
        setEditItem(null);
        fetchProducts();
      }
    } catch (err) {
      alert("Gagal mengupdate produk");
    } finally {
      setLoading(false);
    }
  };

  // 4. Fungsi Hapus Produk
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* --- SIDEBAR (RESPONSIF MOBILE) --- */}
      <div className="w-full md:w-64 bg-white border-b md:border-r border-gray-100 p-6 flex md:flex-col items-center md:items-start justify-between md:justify-start gap-4 sticky top-0 md:static z-10 md:z-auto">
        <div className="flex items-center gap-2 mb-0 md:mb-12 text-indigo-600 font-bold text-xl">
          <Package size={24} />
          <span>DigiPay Admin</span>
        </div>

        {/* Menu Items */}
        <div className="flex flex-row md:flex-col gap-2">
          <button
            onClick={() => setActiveTab("list")}
            className={`flex items-center gap-2.5 p-3 md:p-4 rounded-xl font-medium transition-all ${
              activeTab === "list"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <ListIcon size={20} />
            <span className="hidden md:inline">List Produk</span>
          </button>

          <button
            onClick={() => setActiveTab("add")}
            className={`flex items-center gap-2.5 p-3 md:p-4 rounded-xl font-medium transition-all ${
              activeTab === "add"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <PlusCircle size={20} />
            <span className="hidden md:inline">Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 p-5 md:p-10 overflow-y-auto">
        {activeTab === "list" ? (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 mb-6 md:mb-8">
              Daftar Katalog
            </h1>
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.length === 0 && (
                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-20 bg-white rounded-3xl border border-gray-100">
                    <p className="text-gray-400">Belum ada produk.</p>
                  </div>
                )}
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-5 rounded-3xl border border-gray-100 flex flex-col items-center justify-between shadow-sm hover:shadow-lg transition-all text-center relative"
                  >
                    <img
                      src={p.image || "https://placehold.co/100x100?text=No+Img"}
                      alt=""
                      className="w-20 h-20 rounded-2xl object-cover bg-gray-50 mb-4"
                    />
                    <h3 className="font-bold text-gray-800 text-base mb-1 truncate w-full px-2">
                      {p.name}
                    </h3>
                    <p className="text-indigo-600 font-bold mb-5">
                      Rp {Number(p.price).toLocaleString("id-ID")}
                    </p>

                    <div className="flex gap-2 w-full justify-center border-t border-gray-100 pt-3 mt-auto">
                      <button
                        onClick={() => setEditItem(p)}
                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex-1"
                        title="Edit"
                      >
                        <Pencil size={18} className="mx-auto" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all flex-1"
                        title="Hapus"
                      >
                        <Trash2 size={18} className="mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* --- FORM TAMBAH PRODUK (SEKARANG MUNCUL UTUH) --- */
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 mb-6 md:mb-8">
              Produk Baru
            </h1>
            <div className="bg-white p-8 md:p-10 rounded-3xl md:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className="mb-8 p-6 md:p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center bg-gray-50">
                <UploadButton<OurFileRouter, "productUploader">
                  endpoint="productUploader"
                  onClientUploadComplete={(res) => {
                    const url = res?.[0]?.url;
                    if (url) {
                      setImageUrl(url);
                      alert("Gambar Berhasil diupload!");
                    }
                  }}
                  onUploadError={(error: Error) =>
                    alert(`Upload Gagal: ${error.message}`)
                  }
                />
                {imageUrl && (
                  <div className="mt-4 flex items-center gap-2 text-xs font-mono text-green-600 bg-green-50 px-3 py-1 rounded-full w-full">
                    <CheckCircle size={14} className="flex-shrink-0" />
                    <span className="truncate">{imageUrl}</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4 md:space-y-5">
                <input
                  required
                  placeholder="Nama Produk"
                  className="w-full p-4 md:p-5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-base"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <textarea
                  required
                  placeholder="Deskripsi Lengkap"
                  className="w-full p-4 md:p-5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-32 text-base"
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <input
                  required
                  type="number"
                  placeholder="Harga Jual (Rp)"
                  className="w-full p-4 md:p-5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-base"
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
                <button
                  disabled={loading || !imageUrl}
                  className="w-full bg-indigo-600 text-white py-4 md:py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:bg-gray-300"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    "Publish Produk"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL EDIT (RESPONSIF MOBILE) --- */}
      {editItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 md:p-10 shadow-2xl relative animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setEditItem(null)}
              className="absolute right-6 top-6 md:right-8 md:top-8 p-1.5 hover:bg-gray-100 rounded-full transition"
            >
              <X size={20} className="text-gray-400" />
            </button>

            <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-8 text-gray-800">
              Edit Produk
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                required
                placeholder="Nama Produk"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                value={editItem.name}
                onChange={(e) =>
                  setEditItem({ ...editItem, name: e.target.value })
                }
              />
              <input
                required
                type="number"
                placeholder="Harga (Rp)"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                value={editItem.price}
                onChange={(e) =>
                  setEditItem({ ...editItem, price: e.target.value })
                }
              />
              <textarea
                placeholder="Deskripsi"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none h-24"
                value={editItem.description}
                onChange={(e) =>
                  setEditItem({ ...editItem, description: e.target.value })
                }
              />

              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col items-center gap-2">
                <p className="text-xs font-bold text-indigo-400">
                  Ganti Gambar?
                </p>
                <UploadButton<OurFileRouter, "productUploader">
                  endpoint="productUploader"
                  onClientUploadComplete={(res) =>
                    setEditItem({ ...editItem, image: res?.[0].url })
                  }
                />
              </div>

              <button
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4 md:py-5 rounded-2xl font-black mt-4 flex justify-center items-center gap-2 hover:bg-indigo-700 transition"
              ) : (
                <>
                  <Check size={20} /> Simpan Perubahan
                </>
              )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
