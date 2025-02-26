import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/session',
];

// Define routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/onboarding',
];

// Define routes that require completed profile
const profileRequiredRoutes = [
  '/dashboard',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create a Supabase client for the middleware
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh session if expired
  await supabase.auth.getSession();
  
  // Get the current path
  const path = req.nextUrl.pathname;
  
  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
  
  // Check if the route requires a completed profile
  const requiresProfile = profileRequiredRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
  
  // Check if the path is an API route that's not in publicRoutes
  const isProtectedApiRoute = path.startsWith('/api/') && 
    !publicRoutes.some(route => path.startsWith(route));
  
  if (isProtectedRoute || isProtectedApiRoute) {
    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    // If no session, redirect to login
    if (!session) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(redirectUrl);
    }
    
    // If route requires a completed profile, check if user has completed onboarding
    if (requiresProfile) {
      try {
        // Check if user has a due date set (indicating completed onboarding)
        const { data: profile, error } = await supabase
          .from('users')
          .select('due_date')
          .eq('id', session.user.id)
          .single();
        
        // If no due date or error, redirect to onboarding
        if (error || !profile || !profile.due_date) {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }
      } catch (error) {
        console.error('Error checking profile completion:', error);
        // On error, still allow access to avoid blocking users
      }
    }
  } else if (path === '/login' || path === '/signup') {
    // Check if user is already logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Redirect to dashboard if already logged in
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
  
  return res;
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 