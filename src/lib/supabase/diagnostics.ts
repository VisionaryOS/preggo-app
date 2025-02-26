/**
 * Minimalist Supabase Diagnostics
 * 
 * This utility provides basic diagnostics without the performance overhead
 * of the previous implementation. Only used when explicitly called for troubleshooting.
 */

import { createClient } from './client';

// Simple health check that can be triggered manually
export async function checkSupabaseHealth() {
  try {
    const supabase = createClient();
    const start = performance.now();
    const { error } = await supabase.from('_status').select('time').limit(1);
    const latency = Math.round(performance.now() - start);
    
    return {
      success: !error,
      error: error ? error.message : null,
      latency: `${latency}ms`
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      latency: 'N/A'
    };
  }
}

// Validate Supabase configuration - only run when there's a suspected config issue
export function validateSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const issues: string[] = [];
  
  if (!supabaseUrl) {
    issues.push('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!supabaseKey) {
    issues.push('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// Only expose this for admin/debug purposes
export function logSupabaseConfig() {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Attempted to log Supabase config in non-development environment');
    return;
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const keyExists = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.group('Supabase Configuration');
  console.log('URL:', supabaseUrl || 'NOT SET');
  console.log('Key exists:', keyExists);
  console.groupEnd();
} 