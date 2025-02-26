import React from 'react'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { Heart } from 'lucide-react'

export default function LoginPage() {
  // In a real app, we would handle the form submission by connecting to Supabase
  const handleLogin = async (values: { email: string; password: string }) => {
    // This is just a mock implementation for now
    console.log('Login values:', values)
    // In a real app, we would have something like:
    // const { error } = await supabase.auth.signInWithPassword(values)
    // if (error) throw error
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center px-6 py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <Heart className="h-10 w-10 text-primary" />
          </Link>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight">
            Sign in to PregnancyPal
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card px-6 py-8 shadow-sm sm:rounded-lg sm:px-10">
            <LoginForm onSubmit={handleLogin} />
          </div>
        </div>
      </div>
    </div>
  )
} 