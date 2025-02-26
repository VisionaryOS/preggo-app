import { AuthError } from '@supabase/supabase-js';

// Error codes mapping for better error messages
const ERROR_MESSAGES = {
  'auth/invalid-email': 'The email address is badly formatted.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/email-already-in-use': 'This email is already registered.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/network-request-failed': 'Network connection failed. Please check your internet.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/invalid-credential': 'Invalid login credentials.',
} as const;

// Supabase specific error codes
const SUPABASE_ERROR_CODES = {
  'invalid-anon-key': 'Configuration Error: Invalid anonymous key',
  'invalid-url': 'Configuration Error: Invalid Supabase URL',
  'storage-not-supported': 'Storage is not supported in this environment',
  'rate-limit': 'Too many requests. Please try again later',
} as const;

interface ErrorDetails {
  code: string;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export class AuthenticationError extends Error {
  public code: string;
  public context?: Record<string, unknown>;
  public timestamp: string;

  constructor(error: AuthError | Error, context?: Record<string, unknown>) {
    super(error.message);
    this.name = 'AuthenticationError';
    this.code = (error as AuthError).status?.toString() || 'unknown';
    this.context = context;
    this.timestamp = new Date().toISOString();
  }

  toJSON(): ErrorDetails {
    return {
      code: this.code,
      message: this.message,
      timestamp: this.timestamp,
      context: this.context,
    };
  }
}

export function getReadableErrorMessage(error: Error | AuthError): string {
  if (error instanceof AuthenticationError) {
    // Check our custom error mappings first
    const customMessage = ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES];
    if (customMessage) return customMessage;

    // Check Supabase specific errors
    const supabaseMessage = SUPABASE_ERROR_CODES[error.code as keyof typeof SUPABASE_ERROR_CODES];
    if (supabaseMessage) return supabaseMessage;
  }

  // Handle network errors
  if (error.message.includes('fetch')) {
    return 'Unable to connect to the authentication service. Please check your internet connection.';
  }

  if (error.message.includes('supabase')) {
    return 'Authentication service is temporarily unavailable. Please try again later.';
  }

  // Default to the error message if no specific handling
  return error.message;
}

export function logAuthError(error: Error | AuthError, context?: Record<string, unknown>): void {
  const errorDetails = new AuthenticationError(error, context).toJSON();
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group('🔐 Authentication Error');
    console.error('Error Details:', errorDetails);
    console.error('Stack Trace:', error.stack);
    console.groupEnd();
  }

  // Here you could add additional logging services
  // e.g., Sentry, LogRocket, etc.
  
  // You could also send to your error tracking endpoint
  if (process.env.NEXT_PUBLIC_ERROR_TRACKING_URL) {
    fetch(process.env.NEXT_PUBLIC_ERROR_TRACKING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorDetails),
    }).catch(console.error); // Fail silently
  }
}

export function isSupabaseConfigError(error: Error): boolean {
  return (
    error.message.includes('supabase') &&
    (error.message.includes('configuration') ||
      error.message.includes('invalid') ||
      error.message.includes('missing'))
  );
}

export function handleAuthError(error: Error | AuthError, context?: Record<string, unknown>): {
  message: string;
  severity: 'error' | 'warning' | 'info';
  actionRequired?: boolean;
} {
  // Log the error
  logAuthError(error, context);

  // Check for configuration errors
  if (isSupabaseConfigError(error)) {
    return {
      message: 'Authentication service is misconfigured. Please contact support.',
      severity: 'error',
      actionRequired: true,
    };
  }

  // Check for network/availability errors
  if (error.message.includes('fetch') || error.message.includes('network')) {
    return {
      message: 'Unable to reach authentication service. Please check your internet connection.',
      severity: 'warning',
      actionRequired: false,
    };
  }

  // Handle rate limiting
  if (error.message.includes('rate') || error.message.includes('too many')) {
    return {
      message: 'Too many attempts. Please try again in a few minutes.',
      severity: 'warning',
      actionRequired: false,
    };
  }

  // Default error handling
  return {
    message: getReadableErrorMessage(error),
    severity: 'error',
    actionRequired: false,
  };
} 