import { NextResponse } from 'next/server';
import { getGoogleSheetsClient } from '@/lib/google-sheets';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, imageUrl } = body;

    // Log untuk debug di console Vercel
    console.log("Menerima data:", { name, description, price, imageUrl });

    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const id = `P-${Date.now().toString().slice(-4)}`;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        // Pastikan urutan kolom sesuai: ID, Nama, Deskripsi, Harga, Image, Status
        values: [[id, name, description, price, imageUrl, 'Tersedia']],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error Detail:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
