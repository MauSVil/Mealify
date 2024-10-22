import { NextRequest, NextResponse } from 'next/server';

const protectedAdminRoutes = ['/admin/dashboard', '/admin/products', '/admin/onboard'];
const protectedUserRoutes = ['/user/dashboard', '/user/businesses'];

const excludedRoutes = ['/admin/sign-in', '/user/sign-in', '/admin/sign-up', '/user/sign-up'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = request.cookies;

  if (excludedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (protectedAdminRoutes.some((route) => pathname.startsWith(route))) {
    const adminToken = cookieStore.get('atoken')?.value;
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/sign-in', request.url));
    }
  }

  if (protectedUserRoutes.some((route) => pathname.startsWith(route))) {
    const userToken = cookieStore.get('utoken')?.value;
    if (!userToken) {
      return NextResponse.redirect(new URL('/user/sign-in', request.url));
    }
  }

  return NextResponse.next();
}
