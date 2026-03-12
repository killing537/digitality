import { NextResponse } from 'next/server';
import { getGoogleSheetsClient } from '@/lib/google-sheets';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Bayar.gg mengirim status sukses biasanya melalui 'status' atau 'status_code'
    if (data.status === 'success' || data.status === 'PAID') {
      const sheets = await getGoogleSheetsClient();
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;

      // Ambil semua data untuk mencari baris mana yang harus diupdate
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A:F',
      });

      const rows = response.data.values || [];
      // Cari baris berdasarkan ID Produk atau deskripsi (tergantung data yang dikirim webhook)
      // Disini kita asumsikan kamu mengirim ID di deskripsi atau metadata
      
      // Contoh sederhana: Update status baris tertentu (misal baris terakhir yang dibayar)
      // Di sistem nyata, kamu butuh ID transaksi yang unik.
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}
