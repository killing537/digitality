import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://www.bayar.gg/api/get-payment-methods.php', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BAYAR_GG_API_KEY}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil metode pembayaran' }, { status: 500 });
  }
}
