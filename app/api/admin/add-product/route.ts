import { NextResponse } from 'next/server';
import { getGoogleSheetsClient } from '@/lib/google-sheets';

export async function POST(req: Request) {
  try {
    const { name, description, price, imageUrl } = await req.json();
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Generate ID unik (misal: P-123)
    const id = `P-${Date.now().toString().slice(-4)}`;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[id, name, description, price, imageUrl, 'Tersedia']],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal simpan ke Sheets" }, { status: 500 });
  }
}
