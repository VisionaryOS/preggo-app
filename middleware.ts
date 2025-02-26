import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    
    // Add additional headers to aid debugging
    res.headers.set('X-Auth-Check-Time', new Date().toISOString());
    
    try {
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
    } catch (sessionError) {
      console.error('Error fetching session in middleware:', sessionError);
      
      // If there's an error fetching the session but we're not on a protected route,
      // let the request proceed
      if (!req.nextUrl.pathname.startsWith('/dashboard') && 
          !req.nextUrl.pathname.startsWith('/profile')) {
        return res;
      }
      
      // For protected routes with session errors, redirect to login
      return NextResponse.redirect(new URL('/login?error=session', req.url));
    }
  } catch (error) {
    console.error('Fatal middleware error:', error);
    
    // If we can't even create the Supabase client, still allow access to auth pages
    // but redirect protected routes to error page or login
    if (req.nextUrl.pathname.startsWith('/dashboard') || 
        req.nextUrl.pathname.startsWith('/profile')) {
      return NextResponse.redirect(new URL('/login?error=auth', req.url));
    }
    
    // For non-protected routes, just continue
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 