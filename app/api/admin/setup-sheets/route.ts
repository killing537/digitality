import { NextResponse } from 'next/server';
import { getGoogleSheetsClient } from '@/lib/google-sheets';

export async function GET() {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Menulis Header ke baris pertama (A1 sampai F1)
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1:F1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          ['ID', 'Nama', 'Deskripsi', 'Harga', 'Image', 'Status']
        ],
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Header Google Sheets berhasil dibuat! Sekarang kamu bisa menambah produk dari halaman admin." 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
