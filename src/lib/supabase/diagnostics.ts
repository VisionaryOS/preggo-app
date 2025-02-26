/**
 * Supabase Diagnostics Utilities
 * 
 * This file contains utility functions for diagnosing Supabase connection issues.
 * Use these functions for debugging auth problems.
 */

import { createClient } from './client';
import { supabaseConfig } from './config';

interface DiagnosticResults {
  timestamp: string;
  configStatus: {
    urlPresent: boolean;
    keyPresent: boolean;
    urlValid: boolean;
    keyFormatValid: boolean;
    region?: string;
    availabilityZone?: string;
  };
  connectionTest: {
    success: boolean;
    error: string | null;
    responseTime: number;
    latency?: number;
  };
  environmentCheck: {
    isDevelopment: boolean;
    isProduction: boolean;
    environment: string;
    nodeVersion?: string;
    runtime?: string;
  };
  browserInfo: {
    userAgent: string;
    language: string;
    cookiesEnabled: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    onLine: boolean;
  } | null;
  storageCheck: {
    localStorageAvailable: boolean;
    sessionStorageAvailable: boolean;
    cookiesAvailable: boolean;
  };
}

function checkStorageAvailability(): { available: boolean; error?: string } {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return { available: true };
  } catch (e) {
    return { 
      available: false, 
      error: e instanceof Error ? e.message : 'Storage test failed'
    };
  }
}

async function testLatency(): Promise<number> {
  const start = performance.now();
  try {
    const supabase = createClient();
    await supabase.from('_status').select('time').limit(1);
    return performance.now() - start;
  } catch {
    return -1;
  }
}

export async function runSupabaseDiagnostics(): Promise<DiagnosticResults> {
  const isClient = typeof window !== 'undefined';
  const startTime = performance.now();

  // Initialize results object
  const results: DiagnosticResults = {
    timestamp: new Date().toISOString(),
    configStatus: {
      urlPresent: Boolean(supabaseConfig.supabaseUrl),
      keyPresent: Boolean(supabaseConfig.supabaseKey),
      urlValid: false,
      keyFormatValid: false,
    },
    connectionTest: {
      success: false,
      error: null,
      responseTime: 0,
    },
    environmentCheck: {
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production',
      environment: process.env.NODE_ENV || 'unknown',
      nodeVersion: process.version,
      runtime: typeof window !== 'undefined' ? 'browser' : 'node',
    },
    browserInfo: isClient ? {
      userAgent: navigator.userAgent,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      localStorage: typeof localStorage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      onLine: navigator.onLine,
    } : null,
    storageCheck: {
      localStorageAvailable: false,
      sessionStorageAvailable: false,
      cookiesAvailable: false,
    },
  };

  // Validate URL format
  if (supabaseConfig.supabaseUrl) {
    try {
      const url = new URL(supabaseConfig.supabaseUrl);
      results.configStatus.urlValid = true;
      results.configStatus.region = url.hostname.split('.')[0];
      
      // Extract availability zone if possible
      const zoneMatch = url.hostname.match(/[a-z]+-[a-z]+-\d[a-z]/);
      if (zoneMatch) {
        results.configStatus.availabilityZone = zoneMatch[0];
      }
    } catch {
      results.configStatus.urlValid = false;
    }
  }

  // Validate key format
  if (supabaseConfig.supabaseKey) {
    const parts = supabaseConfig.supabaseKey.split('.');
    results.configStatus.keyFormatValid = parts.length === 3;
  }

  // Test storage availability
  if (isClient) {
    const localStorageTest = checkStorageAvailability();
    results.storageCheck = {
      localStorageAvailable: localStorageTest.available,
      sessionStorageAvailable: checkStorageAvailability().available,
      cookiesAvailable: navigator.cookieEnabled,
    };
  }

  // Test actual connection
  try {
    const supabase = createClient();
    const latency = await testLatency();
    const { error } = await supabase.from('_status').select('time').limit(1);
    
    results.connectionTest = {
      success: !error,
      error: error ? error.message : null,
      responseTime: Math.round(performance.now() - startTime),
      latency: latency >= 0 ? Math.round(latency) : undefined,
    };
  } catch (error) {
    results.connectionTest = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Math.round(performance.now() - startTime),
    };
  }

  return results;
}

export function logDiagnosticResults(results: DiagnosticResults): void {
  console.group('🔍 Supabase Diagnostics Results');
  
  // Configuration Status
  console.group('Configuration');
  console.log('URL Valid:', results.configStatus.urlValid);
  console.log('Key Valid:', results.configStatus.keyFormatValid);
  console.log('Region:', results.configStatus.region);
  console.log('Availability Zone:', results.configStatus.availabilityZone);
  console.groupEnd();

  // Connection Test
  console.group('Connection');
  console.log('Success:', results.connectionTest.success);
  if (!results.connectionTest.success) {
    console.error('Error:', results.connectionTest.error);
  }
  console.log('Response Time:', results.connectionTest.responseTime + 'ms');
  if (results.connectionTest.latency) {
    console.log('Latency:', results.connectionTest.latency + 'ms');
  }
  console.groupEnd();

  // Environment
  console.group('Environment');
  console.table(results.environmentCheck);
  console.groupEnd();

  // Browser Info
  if (results.browserInfo) {
    console.group('Browser');
    console.table(results.browserInfo);
    console.groupEnd();
  }

  // Storage
  console.group('Storage');
  console.table(results.storageCheck);
  console.groupEnd();

  console.groupEnd();
}

export function getDiagnosticSummary(results: DiagnosticResults): {
  status: 'healthy' | 'degraded' | 'error';
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check configuration
  if (!results.configStatus.urlValid) {
    issues.push('Invalid Supabase URL configuration');
    recommendations.push('Verify NEXT_PUBLIC_SUPABASE_URL in your environment variables');
  }

  if (!results.configStatus.keyFormatValid) {
    issues.push('Invalid Supabase key format');
    recommendations.push('Verify NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables');
  }

  // Check connection
  if (!results.connectionTest.success) {
    issues.push(`Connection test failed: ${results.connectionTest.error}`);
    if (results.connectionTest.error?.includes('fetch')) {
      recommendations.push('Check your internet connection');
    }
  }

  // Check storage
  if (!results.storageCheck.localStorageAvailable) {
    issues.push('localStorage is not available');
    recommendations.push('Check browser privacy settings or incognito mode');
  }

  if (!results.storageCheck.cookiesAvailable) {
    issues.push('Cookies are disabled');
    recommendations.push('Enable cookies for authentication to work properly');
  }

  // Determine overall status
  let status: 'healthy' | 'degraded' | 'error' = 'healthy';
  if (issues.length > 0) {
    status = issues.some(i => i.includes('Invalid') || i.includes('failed')) 
      ? 'error' 
      : 'degraded';
  }

  return { status, issues, recommendations };
}

/**
 * Simple utility to check if Supabase authentication is configured correctly
 * @returns Boolean indicating if configuration appears valid
 */
export function isSupabaseConfigValid() {
  // URL must be present and in valid format
  const urlValid = Boolean(supabaseConfig.supabaseUrl);
  
  // Key must be present and in JWT format
  const keyValid = Boolean(supabaseConfig.supabaseKey) && 
                  supabaseConfig.supabaseKey.split('.').length === 3;
  
  return urlValid && keyValid;
}

/**
 * Logs configuration information to console for debugging
 * Use this in development only
 */
export function logSupabaseConfig() {
  if (process.env.NODE_ENV !== 'production') {
    console.info('Supabase Config Diagnostics:');
    console.info('- URL configured:', Boolean(supabaseConfig.supabaseUrl));
    console.info('- API Key configured:', Boolean(supabaseConfig.supabaseKey));
    
    if (supabaseConfig.supabaseUrl) {
      console.info('- URL domain:', new URL(supabaseConfig.supabaseUrl).hostname);
    }
    
    if (supabaseConfig.supabaseKey) {
      const parts = supabaseConfig.supabaseKey.split('.');
      console.info('- API Key format valid:', parts.length === 3);
    }
  }
} 