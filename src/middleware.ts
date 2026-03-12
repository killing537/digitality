import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Hanya proteksi rute yang dimulai dengan /admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = req.headers.get('authorization');

    if (authHeader) {
      // Decode user:pass dari header Authorization
      const authValue = authHeader.split(' ')[1];
      const [user, password] = atob(authValue).split(':');

      // Ambil data dari Environment Variables
      const adminUser = process.env.ADMIN_USER;
      const adminPass = process.env.ADMIN_PASSWORD;

      // Jika cocok, izinkan masuk
      if (user === adminUser && password === adminPass) {
        return NextResponse.next();
      }
    }

    // Jika tidak cocok atau belum login, munculkan popup login browser
    return new NextResponse('Auth Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
      },
    });
  }

  return NextResponse.next();
}

// Konfigurasi agar middleware hanya berjalan di folder admin
export const config = {
  matcher: '/admin/:path*',
};
