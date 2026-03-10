import { NextResponse } from 'next/server';
import { getGoogleSheetsClient } from '@/lib/google-sheets';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Verifikasi status dari Bayar.gg
    // Sesuaikan field status berdasarkan dokumentasi terbaru Bayar.gg (biasanya 'PAID' atau 'SUCCESS')
    if (body.status === 'PAID') {
      const externalId = body.external_id; // Contoh: "order-P001-1710123456"
      const productId = externalId.split('-')[1]; // Mengambil "P001" dari external_id

      const sheets = await getGoogleSheetsClient();
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;

      // 2. Cari baris produk di Google Sheets
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A:F',
      });

      const rows = response.data.values;
      if (!rows) return NextResponse.json({ message: 'Sheet empty' }, { status: 400 });

      // Cari index baris berdasarkan Product ID (Kolom A)
      const rowIndex = rows.findIndex(row => row[0] === productId);

      if (rowIndex !== -1) {
        const sheetRowNumber = rowIndex + 1; // Baris di Excel/Sheets mulai dari 1

        // 3. Update Kolom Status (Kolom F) menjadi "Terjual"
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `Sheet1!F${sheetRowNumber}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [['Terjual']],
          },
        });

        console.log(`Produk ${productId} berhasil diupdate menjadi Terjual.`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}
