import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { productId, amount } = await req.json();

    // Log untuk debugging (bisa dilihat di Vercel Logs)
    console.log("Memulai transaksi untuk:", productId, "Jumlah:", amount);

    const apiKey = process.env.BAYAR_GG_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server Error: API Key tidak terkonfigurasi" }, { status: 500 });
    }

    const payload = {
      api_key: apiKey,
      main_gateway: "qris",
      amount: Number(amount),
      reference: `DIGI-${Date.now()}`,
      order_item: `Produk ID: ${productId}`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    };

    const response = await fetch("https://www.bayar.gg/api/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    // SINKRONISASI: bayar.gg biasanya mengembalikan 'success' atau 'data.checkout_url'
    if (result.status === "success" || result.data?.checkout_url) {
      return NextResponse.json({ checkout_url: result.data.checkout_url });
    } else {
      return NextResponse.json({ error: result.message || "Gagal dari provider" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: "Koneksi terputus" }, { status: 500 });
  }
}