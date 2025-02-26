import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// Cache the client instance to prevent multiple initializations
let cachedClient: SupabaseClient<Database> | null = null;
let connectionAttempts = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 500; // ms

/**
 * Delay execution for a specified number of milliseconds
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a Supabase client with retry logic and proper error handling
 * Uses exponential backoff for retries (500ms, 1000ms, 2000ms)
 */
export const createClient = (): SupabaseClient<Database> => {
  // Return cached client if available and valid
  if (cachedClient) return cachedClient;

  try {
    // Create and cache the client - no keys needed here
    // Auth is handled via cookies set by the server
    cachedClient = createClientComponentClient<Database>();

    // Reset connection attempts on successful creation
    connectionAttempts = 0;
    return cachedClient;
  } catch (error) {
    connectionAttempts++;
    console.error(
      `Error creating Supabase client (attempt ${connectionAttempts}):`,
      error,
    );

    // If we haven't exceeded max retries, try again with exponential backoff
    if (connectionAttempts < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY * connectionAttempts}ms...`);

      // Here we need to handle the recursive promise chain carefully
      throw new Error("Temporary error, will retry");
    }

    // Reset connection attempts for next time
    connectionAttempts = 0;
    throw new Error(
      "Authentication service unavailable after multiple attempts",
    );
  }
};

/**
 * Helper function to handle retries with proper typing
 */
export const createClientWithRetry = async (): Promise<
  SupabaseClient<Database>
> => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      return createClient();
    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) throw error;
      await delay(RETRY_DELAY * retries);
    }
  }

  throw new Error("Failed to create client after maximum retries");
};

/**
 * Tests the Supabase connection with retry logic
 */
export async function testSupabaseConnection() {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const supabase = await createClientWithRetry();
      const { data, error } = await supabase
        .from("_status")
        .select("time")
        .limit(1);

      if (!error) {
        return {
          success: true,
          data,
          error: null,
        };
      }

      // If there's an error, retry with delay
      retries++;
      await delay(RETRY_DELAY * retries);
    } catch (error) {
      retries++;
      console.error(`Connection test failed (attempt ${retries}):`, error);

      if (retries >= MAX_RETRIES) {
        return {
          success: false,
          error,
        };
      }

      await delay(RETRY_DELAY * retries);
    }
  }

  return {
    success: false,
    error: new Error("Connection test failed after maximum retry attempts"),
  };
}
