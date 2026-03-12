import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { productId, amount, name } = await req.json();
    
    // Pastikan variabel ini ada di Environment Variables Vercel
    const apiKey = process.env.BAYAR_GG_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://digipays.vercel.app";

    if (!apiKey) {
      return NextResponse.json({ error: "API Key belum terpasang di server Vercel." }, { status: 500 });
    }

    // Payload disesuaikan persis dengan dokumentasi PHP Anda
    const payload = {
      amount: Number(amount),
      description: `Pembelian: ${name || "Produk Digital"}`,
      customer_name: "Pembeli DigiPay",
      redirect_url: `${baseUrl}/success`,
      use_qris_converter: false,
    };

    const response = await fetch("https://www.bayar.gg/api/create-payment.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey, // Header krusial dari contoh PHP Anda
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    // Debugging: Log ini akan muncul di dashboard Vercel -> Logs
    console.log("Response bayar.gg:", result);

    if (result.success === true && result.data?.payment_url) {
      return NextResponse.json({ payment_url: result.data.payment_url });
    } else {
      // Mengambil pesan error spesifik dari server bayar.gg
      return NextResponse.json({ 
        error: result.message || "Gagal mendapatkan link pembayaran dari provider." 
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Internal Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada sistem internal server." }, { status: 500 });
  }
}