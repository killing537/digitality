"use client";
import { useState } from "react";
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "../api/uploadthing/core";
import { Loader2, PackagePlus } from "lucide-react";
        import { UploadButton } from "@uploadthing/react";

export default function AdminPage() {
  const [formData, setFormData] = useState({ name: "", description: "", price: "" });
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert("Upload gambar dulu!");
    setLoading(true);

    const res = await fetch("/api/admin/add-product", {
      method: "POST",
      body: JSON.stringify({ ...formData, imageUrl }),
    });

    if (res.ok) {
      alert("Produk berhasil ditambah!");
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-2xl rounded-3xl my-10">
      <div className="flex items-center gap-3 mb-8">
        <PackagePlus size={32} className="text-indigo-600" />
        <h1 className="text-2xl font-bold">Tambah Produk Baru</h1>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Media Produk (Img/Vid)</label>

// Di dalam return UI:
<UploadButton<OurFileRouter, "productUploader">
  endpoint="productUploader"
  onClientUploadComplete={(res) => {
    setImageUrl(res[0].url);
    alert("Upload Berhasil!");
  }}
  onUploadError={(error: Error) => alert(`Error! ${error.message}`)}
/>
        {imageUrl && <p className="mt-2 text-xs text-green-600 truncate">Uploaded: {imageUrl}</p>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Nama Produk"
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <textarea
          required
          placeholder="Deskripsi"
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          required
          type="number"
          placeholder="Harga (Rp)"
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <button
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Simpan ke Katalog"}
        </button>
      </form>
    </div>
  );
}
