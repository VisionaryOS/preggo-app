'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormValues } from '@/types/auth.types';
import { useAuth } from '@/hooks/useAuth';
import { testSupabaseConnection } from '@/lib/supabase/client';
import { runSupabaseDiagnostics, logSupabaseConfig } from '@/lib/supabase/diagnostics';
import Link from 'next/link';

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'failed'>('unknown');
  const { signUp } = useAuth();

  // On component mount, verify Supabase connection
  useEffect(() => {
    // Log configuration in development environment
    if (process.env.NODE_ENV !== 'production') {
      logSupabaseConfig();
    }
    
    const verifyConnection = async () => {
      // Run more comprehensive diagnostics when in development
      if (process.env.NODE_ENV === 'development') {
        const diagnostics = await runSupabaseDiagnostics();
        console.info('Supabase diagnostics:', diagnostics);
        setConnectionStatus(diagnostics.connectionTest.success ? 'connected' : 'failed');
        
        if (!diagnostics.connectionTest.success) {
          console.error('Supabase connection test failed:', diagnostics.connectionTest.error);
        }
      } else {
        // Simpler test in production
        const result = await testSupabaseConnection();
        setConnectionStatus(result.success ? 'connected' : 'failed');
        
        if (!result.success) {
          console.error('Supabase connection test failed:', result);
        }
      }
    };
    
    verifyConnection();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      dueDate: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // If connection already failed, perform a diagnostics check
    if (connectionStatus === 'failed') {
      const diagnostics = await runSupabaseDiagnostics();
      
      if (!diagnostics.connectionTest.success) {
        console.error('Detailed diagnostics before signup:', diagnostics);
        
        let errorMessage = 'Unable to connect to the authentication service.';
        
        // More detailed error messages based on diagnostics
        if (!diagnostics.configStatus.urlPresent || !diagnostics.configStatus.urlValid) {
          errorMessage += ' Invalid service URL configuration.';
        } else if (!diagnostics.configStatus.keyPresent || !diagnostics.configStatus.keyFormatValid) {
          errorMessage += ' Invalid API key configuration.';
        } else if (diagnostics.connectionTest.error) {
          errorMessage += ` Error: ${diagnostics.connectionTest.error}`;
        }
        
        setError(`${errorMessage} Please contact support.`);
        setIsLoading(false);
        return;
      }
    }

    try {
      // Log information for debugging purposes
      console.log('Starting signup process with:', { email: data.email, fullName: data.fullName });
      
      const response = await signUp(data.email, data.password, {
        full_name: data.fullName,
        due_date: data.dueDate || null,
      });
      
      if (response.error) {
        console.error('Signup error details:', response.error);
        
        // Handle specific error cases
        if (response.error.message?.includes('Invalid API key') || 
            response.error.message?.includes('configuration')) {
          
          // Try testing the connection directly
          const connectionTest = await testSupabaseConnection();
          if (!connectionTest.success) {
            setError('Authentication service is currently unavailable. Please try again later or contact support.');
            console.error('Connection test failed after API key error:', connectionTest);
          } else {
            setError('Authentication service configuration error. Please contact support.');
            console.error('Auth configuration error with working connection:', response.error);
          }
        } else if (response.error.message?.includes('already registered') || 
                  response.error.message?.includes('already in use')) {
          setError('This email is already registered. Please use a different email or try logging in.');
        } else if (response.error.message?.includes('rate limit')) {
          setError('Too many signup attempts. Please try again later.');
        } else {
          setError(response.error.message || 'An error occurred during signup. Please try again.');
        }
      } else {
        console.log('Signup successful:', response.data?.user?.id);
        setSuccess(true);
      }
    } catch (err) {
      console.error('Unexpected signup error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show connection error message if connection test failed
  useEffect(() => {
    if (connectionStatus === 'failed') {
      setError('Unable to connect to the authentication service. Please try again later.');
    } else if (connectionStatus === 'connected' && error === 'Unable to connect to the authentication service. Please try again later.') {
      setError(null); // Clear the connection error if connection is now working
    }
  }, [connectionStatus, error]);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-medium">Your account has been created successfully!</p>
          <p className="mt-1">Please check your email to confirm your registration. If you don&apos;t see the email, check your spam folder.</p>
          <p className="mt-2">
            You can <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium underline">log in</Link> after confirming your email.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="your.email@example.com"
            disabled={isLoading || success}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            {...register('fullName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Jane Doe"
            disabled={isLoading || success}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Expected Due Date (Optional)
          </label>
          <input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            disabled={isLoading || success}
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            disabled={isLoading || success}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            disabled={isLoading || success}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || success}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
} 