import { NextResponse } from 'next/server';
import { getGoogleSheetsClient } from '@/lib/google-sheets';

export async function GET() {
  const sheets = await getGoogleSheetsClient();
  const range = 'Sheet1!A2:F'; // Sesuaikan range kolom Anda
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
  });

  const rows = response.data.values || [];
  // Filter produk yang "Tersedia"
  const availableProducts = rows
    .filter(row => row[5] === 'Tersedia')
    .map(row => ({
      id: row[0],
      name: row[1],
      description: row[2],
      price: parseInt(row[3]),
      image: row[4],
    }));

  return NextResponse.json(availableProducts);
}
