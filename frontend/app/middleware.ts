import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
 
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const role = payload.role as string;

    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/member/dashboard', request.url));
    }

    if (pathname.startsWith('/member') && role !== 'MEMBER') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
} 