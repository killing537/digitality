import { NextResponse } from 'next/server';
import { SignJWT } from 'jose'; // Gunakan jose karena ringan untuk middleware

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Validasi dengan data di Vercel
    if (
      username === process.env.ADMIN_USER && 
      password === process.env.ADMIN_PASSWORD
    ) {
      // Buat Token JWT
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const token = await new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('2h') // Login hangus dalam 2 jam
        .sign(secret);

      const response = NextResponse.json({ success: true });

      // Simpan di Cookie browser
      response.cookies.set('admin_token', token, {
        httpOnly: true, // Tidak bisa dicuri script jahat
        secure: true,
        sameSite: 'strict',
        maxAge: 7200, // 2 jam
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: "Username atau Password salah" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
