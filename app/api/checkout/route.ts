import { NextResponse } from 'next/server';
import { getGoogleSheetsClient } from '@/lib/google-sheets';

export async function POST(req: Request) {
  try {
    const { productId, name, email, phone } = await req.json();

    // 1. Ambil API Key dari Environment Variable
    const apiKey = process.env.BAYAR_GG_API_KEY;
    
    if (!apiKey) {
      console.error("EROR: BAYAR_GG_API_KEY tidak ditemukan di Vercel");
      return NextResponse.json({ error: "Konfigurasi API Key hilang" }, { status: 500 });
    }

    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // 2. Ambil data produk dari Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A2:F',
    });

    const rows = response.data.values || [];
    const product = rows.find(row => row[0] === productId);

    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    // 3. Panggil API Bayar.gg sesuai Dokumentasi Baru
    const bayarResponse = await fetch('https://www.bayar.gg/api/create-payment.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // PERBAIKAN: Menggunakan X-API-Key sesuai dokumentasi kamu
        'X-API-Key': apiKey, 
      },
      body: JSON.stringify({
        amount: Number(product[3]), // Harga dari kolom D
        description: `Order ${product[1]} - ${name}`,
        customer_name: name,
        customer_email: email,
        customer_phone: phone || "08123456789",
        payment_method: 'gopay_qris', 
        use_qris_converter: false,
        callback_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
        redirect_url: `${process.env.NEXT_PUBLIC_URL}/thanks`,
      }),
    });

    const result = await bayarResponse.json();

    // Bayar.gg biasanya mengembalikan response dalam object 'data'
    // berdasarkan contoh PHP yang kamu berikan
    if (result.success && result.data?.payment_url) {
      return NextResponse.json({ paymentUrl: result.data.payment_url });
    } else {
      console.error("Detail Error Bayar.gg:", result);
      return NextResponse.json({ 
        error: result.error || "Gagal membuat link pembayaran" 
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error("CHECKOUT_CRITICAL_ERROR:", error.message);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
