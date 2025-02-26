'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

const profileSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  dueDate: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isLoading, refreshSession } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      dueDate: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
        dueDate: user.user_metadata?.due_date || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setIsSaving(true);
    setMessage(null);
    
    try {
      const supabase = createClient();
      
      const { error } = await supabase.auth.updateUser({
        email: data.email !== user.email ? data.email : undefined,
        data: {
          full_name: data.fullName,
          due_date: data.dueDate || null,
        },
      });
      
      if (error) throw error;
      
      await refreshSession();
      
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!',
      });
    } catch (error: Error | unknown) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred while updating your profile',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>
        
        {message && (
          <div 
            className={`mb-4 p-3 rounded ${
              message.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              {...register('fullName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSaving}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              disabled={true}
            />
            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed due to verification requirements
            </p>
          </div>
          
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Expected Due Date (Optional)
            </label>
            <input
              id="dueDate"
              type="date"
              {...register('dueDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSaving}
            />
          </div>
          
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 