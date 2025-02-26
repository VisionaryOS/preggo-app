'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

// Step component types - will be created in separate files
// These are pre-declared here to help TypeScript understand the components will exist
import NameStep from '@/components/onboarding/steps/NameStep';
import PregnancyInfoStep from '@/components/onboarding/steps/PregnancyInfoStep';
import PreferencesStep from '@/components/onboarding/steps/PreferencesStep';

// Define step types
export type OnboardingStep = 'name' | 'pregnancy-info' | 'preferences';

// Define the form data structure
export interface OnboardingFormData {
  full_name: string;
  due_date: Date | null;
  preferences: {
    weekly_updates: boolean;
    daily_tips: boolean;
    notifications: boolean;
  }
}

export default function OnboardingModal() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('name');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<OnboardingFormData>({
    full_name: '',
    due_date: null,
    preferences: {
      weekly_updates: true,
      daily_tips: true,
      notifications: true,
    }
  });

  // Steps configuration
  const steps: { id: OnboardingStep; label: string; description: string; emoji: string }[] = [
    { id: 'name', label: 'Your Name', description: 'Tell us what to call you', emoji: '👋' },
    { id: 'pregnancy-info', label: 'Pregnancy Progress', description: 'How far along are you?', emoji: '🤰' },
    { id: 'preferences', label: 'Preferences', description: 'Customize your experience', emoji: '⚙️' }
  ];

  // Navigate to next step
  const nextStep = async () => {
    if (currentStep === 'name') {
      setCurrentStep('pregnancy-info');
    } else if (currentStep === 'pregnancy-info') {
      setCurrentStep('preferences');
    } else if (currentStep === 'preferences') {
      await saveProfileData();
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep === 'pregnancy-info') {
      setCurrentStep('name');
    } else if (currentStep === 'preferences') {
      setCurrentStep('pregnancy-info');
    }
  };

  // Update form data
  const updateFormData = (data: Partial<OnboardingFormData>) => {
    setFormData(prev => {
      // Special handling for due_date to ensure it's a proper Date object
      if (data.due_date !== undefined) {
        return {
          ...prev,
          ...data,
          due_date: data.due_date ? new Date(data.due_date) : null
        };
      }
      
      // Default handling for other fields
      return {
        ...prev,
        ...data
      };
    });
  };

  // Save profile data to Supabase
  const saveProfileData = async () => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Ensure the due date is properly formatted for storage
      const formattedDueDate = formData.due_date ? new Date(formData.due_date).toISOString() : null;

      // Update user metadata with onboarding information
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          due_date: formattedDueDate,
          preferences: formData.preferences,
          // @ts-ignore - Add symptoms to metadata if present
          symptoms: formData.symptoms,
          onboarding_completed: true
        }
      });

      if (metadataError) {
        throw new Error(`Failed to update user metadata: ${metadataError.message}`);
      }

      // Skip profile storage in database tables since the table schema is unknown
      // Instead, rely on user metadata which is already stored above

      toast({
        title: "Profile saved successfully!",
        description: "Welcome to PregnancyPlus!",
        variant: "default"
      });

      // Force reload the page to refresh the dashboard with new data
      window.location.href = '/dashboard';
      
    } catch (err) {
      console.error('Error saving onboarding data:', err);
      toast({
        title: "Error saving profile",
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'name':
        return (
          <NameStep 
            fullName={formData.full_name}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        );
      case 'pregnancy-info':
        return (
          <PregnancyInfoStep 
            dueDate={formData.due_date instanceof Date ? formData.due_date : null}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'preferences':
        return (
          <PreferencesStep 
            preferences={formData.preferences}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
            isSaving={isSaving}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop overlay with frosted-glass effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-background/60 backdrop-blur-md backdrop-filter bg-opacity-80" 
      />
      
      <Card className="z-10 w-full max-w-4xl mx-auto overflow-hidden shadow-xl animate-in fade-in-0 zoom-in-95 rounded-xl">
        <div className="flex flex-col md:flex-row h-[600px] w-full">
          {/* Left sidebar with progress indicators */}
          <div className="bg-muted/40 w-full md:w-64 p-6 shrink-0 border-r">
            <div className="space-y-2 mb-8">
              <h2 className="text-2xl font-bold">Welcome! 👋</h2>
              <p className="text-muted-foreground text-sm">
                Let's set up your account in just a few steps
              </p>
            </div>
            
            <div className="relative mt-10">
              {/* Vertical line connecting steps */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted" />
              
              {/* Step indicators */}
              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                
                return (
                  <div key={step.id} className="relative flex items-start mb-10">
                    <div className={cn(
                      "rounded-full z-10 w-7 h-7 flex items-center justify-center flex-shrink-0 border-2 transition-colors duration-200",
                      isActive && "border-primary bg-primary text-primary-foreground",
                      isCompleted && "border-primary bg-primary text-primary-foreground",
                      !isActive && !isCompleted && "border-muted-foreground bg-background text-muted-foreground"
                    )}>
                      {isCompleted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center space-x-2">
                        <p className={cn(
                          "font-medium transition-colors duration-200",
                          isActive && "text-primary",
                          !isActive && !isCompleted && "text-muted-foreground"
                        )}>
                          {step.label}
                        </p>
                        <span className="text-lg">{step.emoji}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Right content area with form steps */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </div>
  );
} 