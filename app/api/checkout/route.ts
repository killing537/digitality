import { NextResponse } from 'next/server';
import { getGoogleSheetsClient } from '@/lib/google-sheets';

export async function POST(req: Request) {
  try {
    const { productId, name, email, phone } = await req.json();

    // 1. Ambil API Key dan cek di log server (hanya muncul di Vercel Dashboard)
    const apiKey = process.env.BAYAR_GG_API_KEY;
    if (!apiKey) {
      console.error("KRITIS: BAYAR_GG_API_KEY tidak terbaca dari Environment Variables!");
      return NextResponse.json({ error: "Konfigurasi server tidak lengkap" }, { status: 500 });
    }

    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A2:F',
    });

    const rows = response.data.values || [];
    const product = rows.find(row => row[0] === productId);

    if (!product) return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

    // 2. Request ke Bayar.gg dengan Header yang diperketat
    const bayarResponse = await fetch('https://www.bayar.gg/api/create-payment.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Pastikan formatnya "Bearer [KUNCI]"
        'Authorization': `Bearer ${apiKey}`, 
      },
      body: JSON.stringify({
        amount: Number(product[3]), // Kolom Harga
        description: `Order ${product[1]} - ${name}`,
        customer_name: name,
        customer_email: email,
        customer_phone: phone || "08123456789",
        payment_method: 'gopay_qris',
        use_qris_converter: true,
        callback_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
        redirect_url: `${process.env.NEXT_PUBLIC_URL}/thanks`,
      }),
    });

    const result = await bayarResponse.json();

    if (result.success && result.url) {
      return NextResponse.json({ paymentUrl: result.url });
    } else {
      // Log error dari Bayar.gg agar terlihat di Vercel Logs
      console.error("Bayar.gg Error Detail:", result);
      return NextResponse.json({ error: result.error || "Gagal membuat invoice" }, { status: 400 });
    }

  } catch (error: any) {
    console.error("CHECKOUT_CRITICAL_ERROR:", error.message);
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 });
  }
}
