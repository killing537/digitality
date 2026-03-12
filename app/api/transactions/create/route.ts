import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { productId, amount, name } = await req.json();
    const apiKey = process.env.BAYAR_GG_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key belum terpasang di Vercel." }, { status: 500 });
    }

    const payload = {
      amount: Number(amount),
      description: `Beli: ${name}`,
      customer_name: "Customer DigiPay",
      payment_method: "gopay_qris",
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      use_qris_converter: true,
      qris_string: "00020101021126610014COM.GO-JEK.WWW01189360091435733160090210G5733160090303UMI51440014ID.CO.QRIS.WWW0215ID10243445564680303UMI5204581253033605802ID5911FAMILY FARM6005Medan61052011162070703A016304485F" // Tambahkan string QRIS dasar atau dinamis sesuai kebutuhan API
    };

    const response = await fetch("https://www.bayar.gg/api/create-payment.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success && result.data) {
      return NextResponse.json({ 
        success: true,
        payment_url: result.data.payment_url,
        qr_image: result.data.qris_converter?.qr_image_url || null, 
        final_amount: result.data.final_amount,
        invoice_id: result.data.invoice_id
      });
    } 
    return NextResponse.json({ error: result.message || "Gagal membuat invoice" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Koneksi terputus ke provider" }, { status: 500 });
  }
}