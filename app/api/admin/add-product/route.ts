import { NextResponse } from 'next/server';
import { getGoogleSheetsClient } from '@/lib/google-sheets';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, imageUrl } = body;

    // Validasi data
    if (!name || !price || !imageUrl) {
      return NextResponse.json({ error: "Data produk tidak lengkap" }, { status: 400 });
    }

    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Buat ID unik berdasarkan timestamp
    const id = `ID-${Date.now().toString().slice(-6)}`;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:F', // Pastikan nama tab di Google Sheets adalah Sheet1
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[id, name, description, price, imageUrl, 'Tersedia']],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("SHEETS_ERROR:", error.message);
    return NextResponse.json({ error: "Gagal menyambung ke Google Sheets. Pastikan email Service Account sudah di-Share ke Spreadsheet sebagai Editor." }, { status: 500 });
  }
}
