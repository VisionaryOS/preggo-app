import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (for API routes and server components)
export const createServerClient = () => {
  try {
    // Try to use cookie-based auth first (preferred)
    const cookieStore = cookies();
    return createRouteHandlerClient<Database>({ cookies: () => cookieStore });
  } catch (error) {
    // Fallback to direct client if cookies are not available
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    return createClient<Database>(supabaseUrl, supabaseKey);
  }
};

// For use in Server Components with cookie-based auth
export const createServerComponentSupabase = () => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
};

// Specifically for API route handlers
export const createAPIRouteClient = () => {
  const cookieStore = cookies();
  return createRouteHandlerClient<Database>({ cookies: () => cookieStore });
}; 