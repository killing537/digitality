import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { productId, amount } = await req.json();

    // 1. Validasi input
    if (!productId || !amount) {
      return NextResponse.json(
        { error: "Product ID dan Amount diperlukan" },
        { status: 400 }
      );
    }

    // 2. Siapkan Payload untuk bayar.gg
    // Sesuaikan dengan dokumentasi bayar.gg yang kamu gunakan
    const payload = {
      api_key: process.env.BAYAR_GG_API_KEY, // Diambil dari .env
      main_gateway: "qris", // Memaksa metode QRIS
      amount: Number(amount),
      reference: `DIGI-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // ID Unik Transaksi
      order_item: `Pembelian Produk ID: ${productId}`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`, // Halaman setelah sukses
    };

    // 3. Panggil API bayar.gg
    const response = await fetch("https://api.bayar.gg/create-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    // 4. Cek respon dari server bayar.gg
    if (result.status === "success" || result.data?.checkout_url) {
      return NextResponse.json({ 
        checkout_url: result.data.checkout_url 
      });
    } else {
      console.error("Bayar.gg Error:", result);
      return NextResponse.json(
        { error: result.message || "Gagal membuat transaksi di bayar.gg" },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
