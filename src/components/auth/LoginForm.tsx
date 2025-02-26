'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/types/auth.types';
import { useAuth } from '@/hooks/useAuth';
import { testSupabaseConnection } from '@/lib/supabase/client';
import { runSupabaseDiagnostics } from '@/lib/supabase/diagnostics';
import Link from 'next/link';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'failed'>('unknown');
  const { signIn } = useAuth();

  // Verify Supabase connection on component mount
  useEffect(() => {
    const verifyConnection = async () => {
      const result = await testSupabaseConnection();
      setConnectionStatus(result.success ? 'connected' : 'failed');
      
      if (!result.success) {
        console.error('Supabase connection test failed in login form:', result);
      }
    };
    
    verifyConnection();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    // If connection status is failed, run diagnostics and provide helpful error
    if (connectionStatus === 'failed') {
      const diagnostics = await runSupabaseDiagnostics();
      if (!diagnostics.connectionTest.success) {
        setError('Authentication service is currently unavailable. Please try again later or contact support.');
        console.error('Login attempted with failed connection. Diagnostics:', diagnostics);
        setIsLoading(false);
        return;
      }
    }

    try {
      console.log('Attempting login for:', data.email);
      const response = await signIn(data.email, data.password);
      
      if (response.error) {
        console.error('Login error details:', response.error);
        
        // Handle specific error cases
        if (response.error.message?.includes('Invalid login') || 
            response.error.message?.includes('Invalid email')) {
          setError('Invalid email or password. Please try again.');
        } else if (response.error.message?.includes('Invalid API key') || 
                  response.error.message?.includes('configuration')) {
          // Run diagnostics to provide better error messages
          const diagnostics = await runSupabaseDiagnostics();
          setError('Authentication service configuration error. Please contact support.');
          console.error('Auth configuration error during login:', diagnostics);
        } else {
          setError(response.error.message || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show connection error if connection test failed
  useEffect(() => {
    if (connectionStatus === 'failed') {
      setError('Unable to connect to the authentication service. Please try again later.');
    } else if (connectionStatus === 'connected' && error === 'Unable to connect to the authentication service. Please try again later.') {
      setError(null); // Clear the connection error if connection is now working
    }
  }, [connectionStatus, error]);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
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
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || connectionStatus === 'failed'}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
} 