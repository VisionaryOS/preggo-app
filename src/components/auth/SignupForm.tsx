'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormValues } from '@/types/auth.types';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Send, Heart, Mail, User, LockKeyhole, CalendarDays, CheckCircle2, Baby } from 'lucide-react';

interface FormStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const formSteps: FormStep[] = [
  {
    title: "Let's get to know you",
    description: "We're excited you're joining our pregnancy journey!",
    icon: <User className="h-6 w-6 text-pink-400" />
  },
  {
    title: "Secure your account",
    description: "Create a safe space for your pregnancy journey",
    icon: <LockKeyhole className="h-6 w-6 text-pink-400" />
  },
  {
    title: "Personalize your experience",
    description: "Help us tailor Preggo to your pregnancy stage",
    icon: <Baby className="h-6 w-6 text-pink-400" />
  },
];

interface SignupFormProps {
  onStepChange?: (step: number) => void;
}

export default function SignupForm({ onStepChange }: SignupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { signUp, signIn, error, clearError } = useAuth();

  // Notify parent component of step changes
  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    trigger,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      dueDate: '',
    },
    mode: 'onChange',
  });

  const watchedEmail = watch('email');
  const watchedFullName = watch('fullName');

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setSuccess(false);
    clearError();

    try {
      // Step 1: Sign up the user
      const signupResponse = await signUp(data.email, data.password, {
        full_name: data.fullName,
        due_date: data.dueDate || null,
      });
      
      if (signupResponse.error) {
        return; // Error is already handled by useAuth
      }

      setSuccess(true);
      
      // No longer auto-redirecting to onboarding - user must complete the form
      // and click the Continue button manually after seeing success message
      setIsRedirecting(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof SignupFormValues)[] = [];

    // Determine which fields to validate based on current step
    if (currentStep === 0) {
      fieldsToValidate = ['email', 'fullName'];
    } else if (currentStep === 1) {
      fieldsToValidate = ['password', 'confirmPassword'];
    }

    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-pink-500" />
                <Label htmlFor="email" className="text-base font-medium">
                  What's your email?
                </Label>
              </div>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...register('email')}
                disabled={isLoading}
                className="w-full text-base py-6 rounded-xl border-gray-200 focus-visible:ring-pink-500"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1 pl-7">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-pink-500" />
                <Label htmlFor="fullName" className="text-base font-medium">
                  What should we call you?
                </Label>
              </div>
              <Input
                id="fullName"
                type="text"
                placeholder="Jane Doe"
                {...register('fullName')}
                disabled={isLoading}
                className="w-full text-base py-6 rounded-xl border-gray-200 focus-visible:ring-pink-500"
              />
              {errors.fullName && (
                <p className="text-sm text-red-600 mt-1 pl-7">{errors.fullName.message}</p>
              )}
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-pink-50 rounded-lg border border-pink-100 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="p-2 bg-pink-100 rounded-full flex-shrink-0"
              >
                <User className="h-4 w-4 text-pink-600" />
              </motion.div>
              <p className="text-sm text-pink-800">
                Hi {watchedFullName || 'there'}! Let's create a secure password for your account
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <LockKeyhole className="h-5 w-5 text-pink-500" />
                <Label htmlFor="password" className="text-base font-medium">
                  Create a strong password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                {...register('password')}
                disabled={isLoading}
                className="w-full text-base py-6 rounded-xl border-gray-200 focus-visible:ring-pink-500"
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1 pl-7">{errors.password.message}</p>
              )}
            </div>
            
            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-pink-500" />
                <Label htmlFor="confirmPassword" className="text-base font-medium">
                  Confirm your password
                </Label>
              </div>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                disabled={isLoading}
                className="w-full text-base py-6 rounded-xl border-gray-200 focus-visible:ring-pink-500"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1 pl-7">{errors.confirmPassword.message}</p>
              )}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-pink-50 rounded-lg border border-pink-100 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="p-2 bg-pink-100 rounded-full flex-shrink-0"
              >
                <Mail className="h-4 w-4 text-pink-600" />
              </motion.div>
              <p className="text-sm text-pink-800">
                We'll send important updates to {watchedEmail || 'your email'}
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-pink-500" />
                <Label htmlFor="dueDate" className="text-base font-medium">
                  When is your baby due? (optional)
                </Label>
              </div>
              <Input
                id="dueDate"
                type="date"
                {...register('dueDate')}
                disabled={isLoading}
                className="w-full text-base py-6 rounded-xl border-gray-200 focus-visible:ring-pink-500"
              />
              {errors.dueDate && (
                <p className="text-sm text-red-600 mt-1 pl-7">{errors.dueDate.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-2 pl-7">
                This helps us personalize your pregnancy journey
              </p>
            </div>
            
            <div className="mt-8">
              <motion.div 
                className="p-5 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border border-pink-100 shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <p className="font-medium text-pink-800">Almost there!</p>
                </div>
                <p className="text-sm text-gray-600">
                  Ready to join thousands of mothers on their pregnancy journey? Complete your signup to access personalized insights and support.
                </p>
              </motion.div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-gray-100 shadow-xl rounded-2xl bg-white/90 backdrop-blur-sm px-1">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-full shadow-md shadow-purple-100"
            >
              {formSteps[currentStep].icon}
            </motion.div>
            <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              {formSteps[currentStep].title}
            </CardTitle>
          </div>
          <CardDescription className="text-center text-gray-600 mt-1">
            {formSteps[currentStep].description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-5 px-6 sm:px-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-5 bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 text-pink-800 rounded-xl shadow-sm"
            >
              <div className="flex gap-3 items-center">
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-pink-600" />
                </div>
                <h3 className="font-medium">Your account has been created!</h3>
              </div>
              <p className="text-sm ml-10 mt-2 mb-4">
                {getValues('dueDate') ? 
                  "Continue to complete your profile setup and start your personalized pregnancy journey." :
                  "Please set up your profile to get personalized guidance for your pregnancy."}
              </p>
              <Button 
                onClick={() => router.push('/onboarding')} 
                className="w-full mt-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl shadow-md"
              >
                Continue to Setup
              </Button>
            </motion.div>
          )}
          
          {!success && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                {renderFormStep()}
              </AnimatePresence>
              
              <div className="flex justify-between gap-3 mt-8">
                {currentStep > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isLoading}
                    className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900 py-6 text-base"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <div className="flex-1"></div>
                )}
                
                {currentStep < formSteps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl py-6 text-base shadow-md shadow-purple-100/50"
                  >
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl py-6 text-base shadow-md shadow-purple-100/50 animate-shimmer"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col items-center py-6">
          <p className="text-sm text-center text-gray-500 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-pink-600 hover:text-pink-700 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 