'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';

// Onboarding Steps
import WelcomeStep from './components/WelcomeStep';
import DueDateStep from './components/DueDateStep';
import ProfileStep from './components/ProfileStep';
import CompleteStep from './components/CompleteStep';

// Define step types
export type OnboardingStep = 'welcome' | 'due-date' | 'profile' | 'complete';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    due_date: null as Date | null,
    pregnancy_week: null as number | null,
    health_conditions: [] as string[],
    experience: '',
    interests: [] as string[],
    sleep_quality: null as number | null,
    stress_level: null as number | null,
    preferences: {
      notifications: true,
      weekly_updates: true,
      daily_tips: true,
      data_collection: true,
    }
  });

  // Handle initial redirection if needed
  useEffect(() => {
    // Only redirect if authentication check is complete
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/signup');
      } else {
        setIsInitializing(false);
      }
    }
  }, [isLoading, isAuthenticated, router]);

  // Pre-fill data if available from user
  useEffect(() => {
    if (user) {
      // Get user data from metadata or user object
      const userData = {
        full_name: user.user_metadata?.full_name || '',
        due_date: user.user_metadata?.due_date ? new Date(user.user_metadata.due_date) : null,
        pregnancy_week: user.user_metadata?.pregnancy_week || null,
        health_conditions: user.user_metadata?.health_conditions || [],
        experience: user.user_metadata?.experience || '',
        interests: user.user_metadata?.interests || [],
        sleep_quality: user.user_metadata?.sleep_quality || null,
        stress_level: user.user_metadata?.stress_level || null,
        preferences: {
          notifications: user.user_metadata?.preferences?.notifications ?? true,
          weekly_updates: user.user_metadata?.preferences?.weekly_updates ?? true,
          daily_tips: user.user_metadata?.preferences?.daily_tips ?? true,
          data_collection: user.user_metadata?.preferences?.data_collection ?? true,
        }
      };
      
      setFormData(prev => ({
        ...prev,
        ...userData
      }));
    }
  }, [user]);

  // Save user profile data to Supabase
  const saveUserProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const supabase = createClient();
      
      // Format data for Supabase
      const profileData = {
        full_name: formData.full_name,
        due_date: formData.due_date ? formData.due_date.toISOString().split('T')[0] : null,
        pregnancy_week: formData.pregnancy_week,
        health_conditions: formData.health_conditions,
        experience: formData.experience,
        interests: formData.interests,
        sleep_quality: formData.sleep_quality,
        stress_level: formData.stress_level,
        preferences: formData.preferences,
        onboarding_completed: true
      };
      
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: profileData
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully!",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      
      toast({
        title: "Error saving profile",
        description: "There was a problem saving your profile. Please try again.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Navigate to next step
  const nextStep = async () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('due-date');
        break;
      case 'due-date':
        setCurrentStep('profile');
        break;
      case 'profile':
        setCurrentStep('complete');
        break;
      case 'complete':
        // Save final profile data before redirecting
        const saveSuccess = await saveUserProfile();
        if (saveSuccess) {
          router.push('/dashboard');
        }
        break;
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    switch (currentStep) {
      case 'due-date':
        setCurrentStep('welcome');
        break;
      case 'profile':
        setCurrentStep('due-date');
        break;
      case 'complete':
        setCurrentStep('profile');
        break;
    }
  };

  // Update form data
  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  // Show loading state while checking authentication
  if (isLoading || isInitializing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500">Setting up your profile...</p>
      </div>
    );
  }

  // Render the appropriate step
  return (
    <div className="flex-1 flex flex-col">
      {currentStep === 'welcome' && (
        <WelcomeStep onNext={nextStep} />
      )}
      
      {currentStep === 'due-date' && (
        <DueDateStep 
          onNext={nextStep}
          onPrev={prevStep}
          dueDate={formData.due_date}
          updateFormData={updateFormData}
        />
      )}
      
      {currentStep === 'profile' && (
        <ProfileStep
          onNext={nextStep}
          onPrev={prevStep}
          fullName={formData.full_name}
          preferences={formData.preferences}
          updateFormData={updateFormData}
        />
      )}
      
      {currentStep === 'complete' && (
        <CompleteStep
          onNext={nextStep}
          onPrev={prevStep}
          formData={formData}
          isSaving={isSaving}
        />
      )}
    </div>
  );
} 