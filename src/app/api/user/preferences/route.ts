import { createAPIRouteClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { concerns, experience } = await request.json();
    
    const supabase = createAPIRouteClient();
    
    // Check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get the user ID from the session
    const userId = session.user.id;
    
    // Update the user's metadata with the new preferences
    const { data, error } = await supabase.auth.updateUser({
      data: {
        concerns: concerns || [],
        pregnancy_experience: experience || '',
      }
    });
    
    if (error) {
      console.error('Error updating user preferences:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Try to also update the preferences in the users table
    try {
      // Use type assertion to avoid TypeScript error with unknown properties
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          concerns: concerns || [],
          pregnancy_experience: experience || '' 
        } as any)
        .eq('id', userId);
      
      if (updateError) {
        console.warn('Warning: Could not update user preferences in users table:', updateError);
        // We don't return an error here since the auth metadata was successfully updated
      }
    } catch (err) {
      console.warn('Warning: Error updating users table:', err);
      // Continue even if this fails
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'Preferences updated successfully'
    });
    
  } catch (error) {
    console.error('Preferences update error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 