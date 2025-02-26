import React from 'react'
import Link from 'next/link'
import { SignUpForm } from '@/components/auth/signup-form'
import { Heart } from 'lucide-react'

export default function SignUpPage() {
  // In a real app, we would handle the form submission by connecting to Supabase
  const handleSignUp = async (values: { 
    fullName: string; 
    email: string; 
    password: string;
    confirmPassword: string;
  }) => {
    // This is just a mock implementation for now
    console.log('SignUp values:', values)
    // In a real app, we would have something like:
    // const { data, error } = await supabase.auth.signUp({
    //   email: values.email,
    //   password: values.password,
    //   options: {
    //     data: {
    //       full_name: values.fullName,
    //     },
    //   },
    // })
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
            Create your PregnancyPal account
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card px-6 py-8 shadow-sm sm:rounded-lg sm:px-10">
            <SignUpForm onSubmit={handleSignUp} />
          </div>
        </div>
      </div>
    </div>
  )
} 