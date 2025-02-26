import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, meta } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    const supabase = createServerClient();
    
    // Step 1: Sign up the user
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: meta || {},
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login?verified=true`,
      },
    });
    
    if (signupError) {
      return NextResponse.json(
        { error: signupError.message },
        { status: 400 }
      );
    }

    // If signupData already includes a session (auto-confirm enabled), return it
    if (signupData.session) {
      return NextResponse.json({ 
        user: signupData.user,
        session: signupData.session
      });
    }

    // Step 2: Attempt to sign in immediately (for providers with auto-confirm enabled)
    try {
      const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!signinError && signinData.session) {
        // Successfully signed in after signup
        return NextResponse.json({ 
          user: signinData.user,
          session: signinData.session
        });
      }
    } catch (signinError) {
      // If sign in fails, we'll still return the signup data without a session
      console.log('Auto-login failed, returning signup data only:', signinError);
    }
    
    // Return signup data without session (email confirmation required)
    return NextResponse.json({ 
      user: signupData.user,
      session: null
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 