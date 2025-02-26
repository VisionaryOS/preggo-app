'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft, Loader2 } from 'lucide-react';
import { formatDateToString } from '@/lib/utils/due-date-calculator';
import { createClientWithRetry } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { calculatePregnancyWeek } from '@/lib/utils/due-date-calculator';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronRight, 
  Calendar, 
  User, 
  Heart, 
  Settings,
  Clock,
  Activity, 
  Sparkles,
  Bookmark,
  BarChart4,
  BrainCircuit
} from 'lucide-react';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const staggerItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

// Summary item component for consistent styling
const SummaryItem = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
  <div className="py-3 border-b border-gray-100 last:border-b-0">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <div className="font-medium">{value}</div>
  </div>
);

interface CompleteStepProps {
  onNext: () => void;
  onPrev: () => void;
  formData: {
    full_name: string;
    due_date: Date | null;
    pregnancy_week?: number | null;
    health_conditions?: string[];
    experience?: string;
    interests?: string[];
    sleep_quality?: number | null;
    stress_level?: number | null;
    preferences: {
      notifications: boolean;
      weekly_updates: boolean;
      daily_tips?: boolean;
      data_collection?: boolean;
    }
  };
  isSaving: boolean;
}

// Helper function to convert experience value to readable text
const formatExperience = (experience: string | undefined) => {
  switch (experience) {
    case 'first_time':
      return 'First-time parent';
    case 'experienced':
      return 'Experienced parent';
    case 'multiple':
      return 'Expecting multiples';
    default:
      return 'Not specified';
  }
};

// Map interest values to readable text with emojis
const interestLabels: Record<string, { label: string, emoji: string }> = {
  'nutrition': { label: 'Nutrition & Diet', emoji: '🥗' },
  'exercise': { label: 'Exercise & Fitness', emoji: '🧘‍♀️' },
  'baby_development': { label: 'Baby Development', emoji: '👶' },
  'mental_wellbeing': { label: 'Mental Wellbeing', emoji: '🧠' },
  'sleep': { label: 'Sleep Tips', emoji: '💤' },
  'symptoms': { label: 'Pregnancy Symptoms', emoji: '🤰' },
};

// Map health condition values to readable text
const healthConditionLabels: Record<string, string> = {
  'none': 'None',
  'diabetes': 'Diabetes',
  'hypertension': 'Hypertension',
  'thyroid': 'Thyroid issues',
  'anemia': 'Anemia',
  'anxiety_depression': 'Anxiety/Depression',
};

export default function CompleteStep({ 
  onNext, 
  onPrev, 
  formData,
  isSaving
}: CompleteStepProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save profile data to Supabase
  const saveProfile = async () => {
    if (!user) {
      setError('User not authenticated. Please sign in again.');
      return;
    }

    if (!formData.due_date) {
      setError('Due date is required. Please go back and enter your due date.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const supabase = await createClientWithRetry();
      
      // Calculate pregnancy week from due date
      const pregnancyWeek = calculatePregnancyWeek(formData.due_date);
      
      // Format data for storage
      const dueDate = formData.due_date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      // Prepare user data for database
      const userData = {
        id: user.id,
        full_name: formData.full_name,
        due_date: dueDate,
        pregnancy_week: pregnancyWeek,
        preferences: {
          notifications: formData.preferences.notifications,
          weekly_updates: formData.preferences.weekly_updates,
          daily_tips: true,
          data_collection: true
        },
        onboarding_completed: true,
        last_updated: new Date().toISOString()
      };

      // Update user profile in the users table
      const { error: updateError } = await supabase
        .from('users')
        .upsert(userData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });
      
      if (updateError) {
        console.error('Database update error:', updateError);
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }

      // Update user metadata with preferences
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          due_date: dueDate,
          preferences: formData.preferences,
          onboarding_completed: true
        }
      });

      if (metadataError) {
        console.error('Auth metadata update error:', metadataError);
        throw new Error(`Failed to update user metadata: ${metadataError.message}`);
      }

      // Success!
      setIsSuccess(true);
      toast({
        title: "Profile saved successfully! 🎉",
        description: "Your preferences have been saved. Welcome to Preggo!",
        variant: "default"
      });
      
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        onNext();
      }, 1500);
      
    } catch (err) {
      console.error('Error saving profile:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile. Please try again.';
      setError(errorMessage);
      
      toast({
        title: "Error saving profile",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Format due date for display
  const formattedDueDate = formData.due_date 
    ? format(formData.due_date, 'MMMM d, yyyy')
    : 'Not set';

  return (
    <motion.div 
      className="flex-1 flex flex-col"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Your Profile is Complete! ✨</h1>
        <p className="text-gray-600">
          Here's a summary of your personalized pregnancy journey information.
        </p>
      </div>
      
      <motion.div 
        className="flex-1 space-y-6"
        variants={staggerItems}
      >
        <motion.div variants={itemFadeIn}>
          <Card className="overflow-hidden border-green-100 bg-green-50/30">
            <CardContent className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <Check className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-medium">Profile Created</h3>
                <p className="text-sm text-gray-600">
                  Your personalized journey is ready to begin
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemFadeIn}>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <User className="mr-2 h-5 w-5 text-primary" />
            Personal Information
          </h3>
          <Card>
            <CardContent className="p-6 grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="font-medium">{formData.full_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Experience</p>
                  <p className="font-medium">{formatExperience(formData.experience)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Due Date</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <p className="font-medium">{formattedDueDate}</p>
                </div>
              </div>
              {formData.pregnancy_week !== undefined && formData.pregnancy_week !== null && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Current Week</p>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <p className="font-medium">Week {formData.pregnancy_week}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {formData.interests && formData.interests.length > 0 && (
          <motion.div variants={itemFadeIn}>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              Your Interests
            </h3>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map(interest => (
                    interestLabels[interest] ? (
                      <div 
                        key={interest} 
                        className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        <span className="mr-1">{interestLabels[interest].emoji}</span>
                        {interestLabels[interest].label}
                      </div>
                    ) : null
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        <motion.div variants={itemFadeIn}>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Heart className="mr-2 h-5 w-5 text-primary" />
            Health Information
          </h3>
          <Card>
            <CardContent className="p-6 space-y-4">
              {formData.health_conditions && formData.health_conditions.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Health Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.health_conditions.map(condition => (
                      <div 
                        key={condition}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm"
                      >
                        {condition === 'none' ? (
                          <Bookmark className="h-3 w-3 mr-1" />
                        ) : (
                          <Activity className="h-3 w-3 mr-1" />
                        )}
                        {healthConditionLabels[condition] || condition}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-500">Health Conditions</p>
                  <p className="text-gray-600">No health conditions specified</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {formData.sleep_quality !== undefined && formData.sleep_quality !== null && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sleep Quality</p>
                    <div className="flex items-center">
                      <div className="flex mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div 
                            key={i}
                            className={`h-2 w-6 mr-1 rounded-sm ${
                              i < formData.sleep_quality! ? 'bg-primary' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm">{formData.sleep_quality}/5</span>
                    </div>
                  </div>
                )}
                
                {formData.stress_level !== undefined && formData.stress_level !== null && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Stress Level</p>
                    <div className="flex items-center">
                      <div className="flex mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div 
                            key={i}
                            className={`h-2 w-6 mr-1 rounded-sm ${
                              i < formData.stress_level! ? 'bg-amber-500' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm">{formData.stress_level}/5</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemFadeIn}>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Settings className="mr-2 h-5 w-5 text-primary" />
            App Preferences
          </h3>
          <Card>
            <CardContent className="p-6 grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className={`h-4 w-4 rounded-full mr-2 ${formData.preferences.notifications ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm">Push Notifications</span>
              </div>
              <div className="flex items-center">
                <div className={`h-4 w-4 rounded-full mr-2 ${formData.preferences.weekly_updates ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm">Weekly Updates</span>
              </div>
              {formData.preferences.daily_tips !== undefined && (
                <div className="flex items-center">
                  <div className={`h-4 w-4 rounded-full mr-2 ${formData.preferences.daily_tips ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">Daily Tips</span>
                </div>
              )}
              {formData.preferences.data_collection !== undefined && (
                <div className="flex items-center">
                  <div className={`h-4 w-4 rounded-full mr-2 ${formData.preferences.data_collection ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">Data Collection</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemFadeIn} className="mt-10">
          <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
            <div className="flex items-start mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                <BrainCircuit className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-primary">Personalized Experience</h3>
                <p className="text-gray-600">
                  We'll use this information to tailor your pregnancy journey with content and tips most relevant to you.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              You can update your profile information at any time from your account settings.
            </p>
          </div>
        </motion.div>
      </motion.div>
      
      <div className="pt-8 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button 
          onClick={onNext}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              Go to Dashboard
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
} 