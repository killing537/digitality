const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!imageUrl) return alert("Tunggu upload selesai atau upload ulang gambar!");
  
  setLoading(true);
  try {
    const res = await fetch("/api/admin/add-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // WAJIB ADA
      body: JSON.stringify({ 
        name: formData.name, 
        description: formData.description, 
        price: formData.price, 
        imageUrl: imageUrl // Pastikan variabel ini berisi link utfs.io
      }),
    });

    if (res.ok) {
      alert("Produk berhasil disimpan ke Google Sheets!");
      setFormData({ name: "", description: "", price: "" });
      setImageUrl("");
    } else {
      const errData = await res.json();
      alert("Gagal: " + errData.error);
    }
  } catch (err) {
    alert("Koneksi gagal!");
  } finally {
    setLoading(false);
  }
};
