import { NextResponse } from 'next/server';
import { getGoogleSheetsClient } from '@/lib/google-sheets';

export async function POST(req: Request) {
  try {
    const { productId, name, email, phone } = await req.json();

    // 1. Ambil data produk dari Google Sheets untuk mendapatkan harga
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:F',
    });

    const rows = response.data.values;
    const product = rows?.find(row => row[0] === productId);

    if (!product) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    const price = parseInt(product[3]); // Kolom harga (D)
    const productName = product[1];     // Kolom nama (B)

    // 2. Kirim data ke Bayar.gg sesuai spesifikasi terbaru
    const payload = {
      amount: price,
      description: `Pembayaran untuk ${productName}`,
      customer_name: name,
      customer_email: email,
      customer_phone: phone, // Sesuai parameter baru
      callback_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
      redirect_url: `${process.env.NEXT_PUBLIC_URL}/thanks`,
      payment_method: 'gopay_qris', // Mengizinkan semua metode pembayaran
    };

    const bayarResponse = await fetch('https://www.bayar.gg/api/create-payment.php', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.BAYAR_GG_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await bayarResponse.json();

    // Pastikan Bayar.gg mengembalikan URL pembayaran
    if (result.url) {
      return NextResponse.json({ paymentUrl: result.url });
    } else {
      console.error('Bayar.gg Error:', result);
      return NextResponse.json({ error: 'Gagal membuat pembayaran' }, { status: 500 });
    }

  } catch (error) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
