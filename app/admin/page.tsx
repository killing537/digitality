"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "../api/uploadthing/core";
import { Loader2, PackagePlus, CheckCircle2, AlertCircle } from "lucide-react";
import "@uploadthing/react/styles.css";

export default function AdminPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      alert("Silakan unggah gambar atau video produk terlebih dahulu!");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/admin/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          imageUrl: imageUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', msg: "Produk berhasil disimpan ke Google Sheets!" });
        // Reset Form
        setFormData({ name: "", description: "", price: "" });
        setImageUrl("");
      } else {
        setStatus({ type: 'error', msg: data.error || "Gagal menyimpan produk." });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: "Terjadi kesalahan koneksi ke server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white flex items-center gap-3">
          <PackagePlus size={28} />
          <h1 className="text-xl font-bold">Panel Admin: Tambah Produk</h1>
        </div>

        <div className="p-8">
          {/* Status Message */}
          {status && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="text-sm font-medium">{status.msg}</span>
            </div>
          )}

          {/* Section Upload */}
          <div className="mb-8 p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 flex flex-col items-center">
            <label className="text-sm font-semibold text-gray-600 mb-4 text-center">
              Media Produk (Maksimal 128MB)
            </label>
            
            <UploadButton<OurFileRouter, "productUploader">
              endpoint="productUploader"
              onClientUploadComplete={(res) => {
                setImageUrl(res[0].ufsUrl); // Menggunakan ufsUrl sesuai versi terbaru
                alert("Upload Berhasil!");
              }}
              onUploadError={(error: Error) => {
                alert(`Gagal Upload: ${error.message}`);
              }}
              appearance={{
                button: "bg-indigo-600 hover:bg-indigo-700 rounded-lg px-6 py-2 transition-all",
              }}
            />
            
            {imageUrl && (
              <div className="mt-4 p-2 bg-white border rounded-lg w-full overflow-hidden text-center">
                <p className="text-[10px] text-green-600 font-mono break-all line-clamp-1">{imageUrl}</p>
                <span className="text-[10px] text-gray-400 italic">Media siap disimpan</span>
              </div>
            )}
          </div>

          {/* Form Data */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
              <input
                required
                type="text"
                placeholder="Contoh: Digital Asset Pack"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
              <textarea
                required
                rows={3}
                placeholder="Jelaskan isi produk digital Anda..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga (IDR)</label>
              <input
                required
                type="number"
                placeholder="Minimal 1000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-[0.98] disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> 
                  Menyimpan...
                </>
              ) : "Simpan ke Katalog"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
