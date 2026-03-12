import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { productId, amount } = await req.json();

    // Data untuk dikirim ke bayar.gg
    const payload = {
      api_key: process.env.BAYAR_GG_API_KEY,
      main_gateway: "qris", // Menggunakan QRIS
      amount: Number(amount),
      reference: `DIGI-${Date.now()}`, // ID unik transaksi
      order_item: `Pembelian Produk ID: ${productId}`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    };

    const response = await fetch("https://api.bayar.gg/create-transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.status === "success") {
      return NextResponse.json({ checkout_url: result.data.checkout_url });
    } else {
      return NextResponse.json({ error: "Gagal memproses ke bayar.gg" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
