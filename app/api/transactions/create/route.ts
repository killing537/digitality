import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { productId, amount, name } = await req.json();
    const apiKey = process.env.BAYAR_GG_API_KEY;

    // Payload disesuaikan dengan skema yang kamu inginkan
    const payload = {
      amount: Number(amount),
      description: `Beli: ${name}`,
      customer_name: "Customer DigiPay",
      payment_method: "gopay_qris",
      use_qris_converter: true,
      // Pastikan string QRIS ini valid sesuai akun merchant kamu
      qris_string: "00020101021126610014COM.GO-JEK.WWW01189360091435733160090210G5733160090303UMI51440014ID.CO.QRIS.WWW0215ID10243445564680303UMI5204581253033605802ID5911FAMILY FARM6005Medan61052011162070703A016304485F",
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`
    };

    const response = await fetch("https://www.bayar.gg/api/create-payment.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey as string,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success && result.data) {
      // Mengirimkan objek data (termasuk invoice_id dan qris_converter)
      return NextResponse.json(result.data);
    } 
    return NextResponse.json({ error: result.message || "Gagal membuat invoice" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Koneksi ke provider terputus" }, { status: 500 });
  }
}