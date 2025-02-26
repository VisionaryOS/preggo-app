import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { supabaseConfig } from './config';

// Utility function to test Supabase connection
export async function testSupabaseConnection() {
  try {
    const supabase = createClient();
    
    // Simple health check - just fetch Supabase's time
    const { data, error } = await supabase.from('_status').select('time');
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
    
    return {
      success: true,
      message: 'Successfully connected to Supabase',
      data
    };
  } catch (error) {
    console.error('Supabase connection test exception:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error testing Supabase connection',
      error
    };
  }
}

export const createClient = () => {
  try {
    // Get Supabase configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Validate that we have the required values
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration. Check your environment variables.');
      throw new Error('Missing Supabase configuration');
    }
    
    // Create and return the client with proper error handling
    return createClientComponentClient({
      supabaseUrl,
      supabaseKey,
    });
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    
    // Create a fallback client with the hardcoded config as last resort
    try {
      return createClientComponentClient({
        supabaseUrl: supabaseConfig.supabaseUrl,
        supabaseKey: supabaseConfig.supabaseKey,
      });
    } catch (fallbackError) {
      console.error('Fatal: Failed to create fallback Supabase client:', fallbackError);
      throw new Error('Authentication service unavailable. Please contact support.');
    }
  }
} 