import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const invoiceId = searchParams.get("id");
  const apiKey = process.env.BAYAR_GG_API_KEY;

  try {
    const res = await fetch(`https://www.bayar.gg/api/check-payment.php?id=${invoiceId}`, {
      headers: { "X-API-Key": apiKey as string }
    });
    const result = await res.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}