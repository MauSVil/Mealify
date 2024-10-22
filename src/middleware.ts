import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const protectedAdminRoutes = ['/admin/dashboard', '/admin/products', '/admin/onboard'];
const protectedUserRoutes = ['/user/dashboard', '/user/businesses'];

const excludedRoutes = ['/admin/sign-in', '/user/sign-in', '/admin/sign-up', '/user/sign-up'];

const SECRET_KEY = process.env.JWT_SECRET!;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = request.cookies;

  if (excludedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const verifyToken = (token: string | undefined) => {
    if (!token) return false;

    try {
      const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp < now) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };

  if (protectedAdminRoutes.some((route) => pathname.startsWith(route))) {
    const adminToken = cookieStore.get('atoken')?.value;
    
    if (!verifyToken(adminToken)) {
      return NextResponse.redirect(new URL('/admin/sign-in', request.url));
    }
  }

  if (protectedUserRoutes.some((route) => pathname.startsWith(route))) {
    const userToken = cookieStore.get('utoken')?.value;
    
    if (!verifyToken(userToken)) {
      return NextResponse.redirect(new URL('/user/sign-in', request.url));
    }
  }

  return NextResponse.next();
}
