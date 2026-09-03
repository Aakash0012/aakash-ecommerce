import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow requests to the login page and auth API to pass through
  if (pathname === '/admin/login' || pathname.startsWith('/api/admin-auth')) {
    return NextResponse.next();
  }

  // Protect all other /admin routes
  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_token')?.value;

    if (adminToken !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};