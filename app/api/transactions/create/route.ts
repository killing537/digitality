import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { productId, amount, name } = await req.json();
    const apiKey = process.env.BAYAR_GG_API_KEY;

    // Data dikirim sesuai dengan skema PHP yang kamu berikan
    const payload = {
      amount: Number(amount),
      description: `Pembelian Produk: ${name || productId}`,
      customer_name: "Customer DigiPay",
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      use_qris_converter: true, // Sesuai contoh PHP kamu
    };

    const response = await fetch("https://www.bayar.gg/api/create-payment.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey as string, // Sesuai contoh PHP: 'X-API-Key: ' . $apiKey
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    // Sesuai response JSON yang kamu lampirkan
    if (result.success === true && result.data?.payment_url) {
      return NextResponse.json({ 
        payment_url: result.data.payment_url 
      });
    } else {
      return NextResponse.json({ 
        error: result.message || "Gagal mendapatkan link pembayaran" 
      }, { status: 400 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: "Gagal menghubungi server bayar.gg" }, { status: 500 });
  }
}