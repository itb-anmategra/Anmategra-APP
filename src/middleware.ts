import { getToken } from 'next-auth/jwt';
import { type NextRequest, NextResponse } from 'next/server';

const AUTH_ROUTES = ['/authentication'];
const STATIC = [
  '/_next',
  '/api',
  '/images',
  '/favicon.ico',
  '/manifest.json',
  '/robots.txt',
];

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Skip static files and API routes
  if (STATIC.some((route) => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  // Redirect to authentication if not logged in (except for root and auth page)
  if (pathname !== '/' && pathname !== '/authentication' && pathname !== '/auth-error' && !token) {
    return NextResponse.redirect(new URL('/authentication', req.url));
  }

  // If authenticated, redirect from auth routes to role-based home
  if (AUTH_ROUTES.includes(pathname) && token) {
    return NextResponse.redirect(new URL(`/${token.role}`, req.url));
  }

  // If authenticated and accessing root, redirect to role-based home
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL(`/${token.role}`, req.url));
  }

  // If authenticated and URL doesn't start with role, prepend role
  const role = token?.role;
  if (role) {
    const rolePrefix = `/${role}`;
    
    // If the path doesn't start with the role prefix
    if (!pathname.startsWith(rolePrefix)) {
      // Check if it's trying to access another role's route
      const otherRoles = ['admin', 'lembaga', 'mahasiswa'].filter(r => r !== role);
      const isAccessingOtherRole = otherRoles.some(r => pathname.startsWith(`/${r}`));
      
      if (isAccessingOtherRole) {
        // Redirect to their own role's home
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      }
      
      // Otherwise, prepend their role to the path
      return NextResponse.redirect(new URL(`${rolePrefix}${pathname}`, req.url));
    }
  }

  return NextResponse.next();
}