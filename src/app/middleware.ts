import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // Check if we are on auth pages
  const isAuthPage = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup';
  
  // If user is signed in and trying to access auth page, redirect to dashboard
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // Protected routes - add any routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile'];
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`)
  );
  
  // If accessing a protected route without a session, redirect to login
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 