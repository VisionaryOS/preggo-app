import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabaseConfig } from './config';

export const createClient = () => {
  try {
    const cookiesStore = cookies();
    
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Check if environment variables exist
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration on server. Falling back to config values.');
      
      // Use type assertion to allow additional properties
      const config = {
        cookies: () => cookiesStore,
        supabaseUrl: supabaseConfig.supabaseUrl,
        supabaseKey: supabaseConfig.supabaseKey,
      } as { 
        cookies: () => ReturnType<typeof cookies>; 
        supabaseUrl: string; 
        supabaseKey: string; 
        [key: string]: unknown; 
      };
      
      return createServerComponentClient(config);
    }
    
    // Use environment variables with type assertion
    return createServerComponentClient({
      cookies: () => cookiesStore,
    } as { cookies: () => ReturnType<typeof cookies>; [key: string]: unknown });
  } catch (error) {
    console.error('Error creating server Supabase client:', error);
    
    // If all else fails, create with fallback values
    try {
      return createServerComponentClient({
        cookies: () => cookies(),
      });
    } catch (fallbackError) {
      console.error('Fatal: Failed to create server Supabase client:', fallbackError);
      throw new Error('Authentication service unavailable');
    }
  }
} 