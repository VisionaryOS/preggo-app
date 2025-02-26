"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserCircle, 
  Mail, 
  Calendar, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  ChevronLeft,
  Check 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SignupFormProps {
  onSignupSuccess?: () => void;
}

export function SignupForm({ onSignupSuccess }: SignupFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [passwordState, setPasswordState] = useState('');
  const [confirmPasswordState, setConfirmPasswordState] = useState('');
  
  const passwordRef = useRef('');
  const confirmPasswordRef = useRef('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    dueDate: '',
    agreeTerms: false,
    concerns: [] as string[],
    experience: '',
  });
  
  const [validationErrors, setValidationErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: '',
    concerns: '',
    experience: '',
  });
  
  const concernOptions = [
    "Nutrition",
    "Exercise",
    "Sleep",
    "Mental Health",
    "Birth Plan",
    "Baby Essentials",
    "Symptoms",
    "Weight Gain"
  ];
  
  // Helper functions and handlers go here
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleConcernToggle = (concern: string) => {
    if (formData.concerns.includes(concern)) {
      setFormData({
        ...formData,
        concerns: formData.concerns.filter(c => c !== concern),
      });
    } else {
      setFormData({
        ...formData,
        concerns: [...formData.concerns, concern],
      });
    }
  };
  
  const handleExperienceSelect = (experience: string) => {
    setFormData({
      ...formData,
      experience,
    });
  };
  
  const validateStep = (step: number) => {
    const newErrors = { ...validationErrors };
    let isValid = true;
    
    if (step === 0) {
      // Validate basic info
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
        isValid = false;
      } else {
        newErrors.fullName = '';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
        isValid = false;
      } else {
        newErrors.email = '';
      }
    } else if (step === 1) {
      // Validate security info
      if (!passwordRef.current || passwordRef.current.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
        isValid = false;
      } else {
        newErrors.password = '';
      }
      
      if (passwordRef.current !== confirmPasswordRef.current) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      } else {
        newErrors.confirmPassword = '';
      }
      
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the terms';
        isValid = false;
      } else {
        newErrors.agreeTerms = '';
      }
    } else if (step === 2) {
      // Validate preferences
      if (formData.concerns.length === 0) {
        newErrors.concerns = 'Please select at least one concern';
        isValid = false;
      } else {
        newErrors.concerns = '';
      }
      
      if (!formData.experience) {
        newErrors.experience = 'Please select your experience';
        isValid = false;
      } else {
        newErrors.experience = '';
      }
    }
    
    setValidationErrors(newErrors);
    return isValid;
  };
  
  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < 2) {
        // Move to next step
        setCurrentStep(currentStep + 1);
      } else {
        // Submit form
        await handleSubmit();
      }
    }
  };
  
  const handleStepChange = (step: number) => {
    if (step >= 0 && step <= 2) {
      setCurrentStep(step);
    }
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Replace with your actual signup logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAccountCreated(true);
      
      // Additional delay to show account created message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSignupSuccess) {
        onSignupSuccess();
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  // Form steps components
  const formSteps = [
    // Step 1: Basic Info
    <div key="basic-info" className="space-y-6 w-full">
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <UserCircle className="h-5 w-5 text-primary" />
          </div>
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="pl-10 py-6 text-lg rounded-xl border-border bg-card/70 backdrop-blur-sm focus-visible:ring-primary focus-visible:border-primary"
            placeholder="Your full name"
            autoComplete="name"
          />
        </div>
        {validationErrors.fullName && (
          <p className="text-sm text-destructive ml-1">{validationErrors.fullName}</p>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="pl-10 py-6 text-lg rounded-xl border-border bg-card/70 backdrop-blur-sm focus-visible:ring-primary focus-visible:border-primary"
            placeholder="Your email address"
            autoComplete="email"
          />
        </div>
        {validationErrors.email && (
          <p className="text-sm text-destructive ml-1">{validationErrors.email}</p>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <Input
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleInputChange}
            className="pl-10 py-6 text-lg rounded-xl border-border bg-card/70 backdrop-blur-sm focus-visible:ring-primary focus-visible:border-primary"
            placeholder="Expected due date"
          />
        </div>
      </div>
      
      <div className="flex gap-3 pt-2">
        <Button 
          onClick={handleNext}
          disabled={!validateStep(currentStep)}
          className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 shadow-md hover:shadow-lg relative overflow-hidden"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>,
    
    // Step 2: Security
    <div key="security" className="space-y-6 w-full">
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <Input
            name="password"
            type="password"
            value={passwordState}
            onChange={(e) => {
              setPasswordState(e.target.value);
              passwordRef.current = e.target.value;
            }}
            className="pl-10 py-6 text-lg rounded-xl border-border bg-card/70 backdrop-blur-sm focus-visible:ring-primary focus-visible:border-primary"
            placeholder="Create password (min. 8 characters)"
            autoComplete="new-password"
          />
        </div>
        {validationErrors.password && (
          <p className="text-sm text-destructive ml-1">{validationErrors.password}</p>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <Input
            name="confirmPassword"
            type="password"
            value={confirmPasswordState}
            onChange={(e) => {
              setConfirmPasswordState(e.target.value);
              confirmPasswordRef.current = e.target.value;
            }}
            className="pl-10 py-6 text-lg rounded-xl border-border bg-card/70 backdrop-blur-sm focus-visible:ring-primary focus-visible:border-primary"
            placeholder="Confirm password"
            autoComplete="new-password"
          />
        </div>
        {validationErrors.confirmPassword && (
          <p className="text-sm text-destructive ml-1">{validationErrors.confirmPassword}</p>
        )}
      </div>
      
      <div className="mt-4 flex items-start space-x-3">
        <input
          id="terms"
          name="agreeTerms"
          type="checkbox"
          checked={formData.agreeTerms}
          onChange={handleInputChange}
          className="h-5 w-5 mt-1 border-border rounded-md checked:bg-primary"
        />
        <label htmlFor="terms" className="text-card-foreground font-medium">
          I agree to the <Link href="/terms" className="text-primary font-semibold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary font-semibold hover:underline">Privacy Policy</Link>
        </label>
      </div>
      {validationErrors.agreeTerms && (
        <p className="text-sm text-destructive ml-1">{validationErrors.agreeTerms}</p>
      )}
      
      <div className="flex gap-3 pt-2">
        <Button 
          variant="outline"
          onClick={() => handleStepChange(currentStep - 1)}
          className="w-1/3 py-6 text-lg border border-border text-foreground rounded-xl hover:bg-muted"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!validateStep(currentStep)}
          className="w-2/3 py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 shadow-md hover:shadow-lg relative overflow-hidden"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>,

    // Step 3: Additional Preferences
    <div key="preferences" className="space-y-6 w-full">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4 text-foreground">What are your main pregnancy concerns?</h3>
        <div className="grid grid-cols-2 gap-3">
          {concernOptions.map((concern) => (
            <div 
              key={concern}
              onClick={() => handleConcernToggle(concern)}
              className={`
                p-4 border rounded-xl cursor-pointer transition-all duration-200
                ${formData.concerns.includes(concern) 
                  ? 'bg-primary/10 border-primary text-foreground shadow-sm' 
                  : 'bg-card border-border text-muted-foreground hover:bg-card/70'}
              `}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                  formData.concerns.includes(concern) ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {formData.concerns.includes(concern) && <Check className="h-3 w-3" />}
                </div>
                <span className="font-medium">{concern}</span>
              </div>
            </div>
          ))}
        </div>
        {validationErrors.concerns && (
          <p className="text-sm text-destructive">{validationErrors.concerns}</p>
        )}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-2 text-foreground">Your pregnancy experience</h3>
        <div className="space-y-3">
          {["First-time mom", "Second pregnancy", "Third+ pregnancy"].map((option) => (
            <div 
              key={option}
              onClick={() => handleExperienceSelect(option)}
              className={`
                p-4 border rounded-xl cursor-pointer transition-all duration-200 flex items-center
                ${formData.experience === option 
                  ? 'bg-primary/10 border-primary text-foreground shadow-sm' 
                  : 'bg-card border-border text-muted-foreground hover:bg-card/70'}
              `}
            >
              <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                formData.experience === option ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                {formData.experience === option && <Check className="h-3 w-3" />}
              </div>
              <span className="font-medium">{option}</span>
            </div>
          ))}
        </div>
        {validationErrors.experience && (
          <p className="text-sm text-destructive">{validationErrors.experience}</p>
        )}
      </div>
      
      <div className="flex gap-3 pt-2">
        <Button 
          variant="outline"
          onClick={() => handleStepChange(currentStep - 1)}
          className="w-1/3 py-6 text-lg border border-border text-foreground rounded-xl hover:bg-muted"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button 
          onClick={handleNext}
          disabled={isLoading || formData.concerns.length === 0 || !formData.experience}
          className="w-2/3 py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 shadow-md hover:shadow-lg relative overflow-hidden"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {accountCreated ? "Finalizing setup..." : "Creating Account..."}
            </>
          ) : (
            <>
              {accountCreated ? "Complete Setup" : "Complete Signup"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
      
      {/* Display critical validation errors if any */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
          <p className="text-sm text-destructive font-medium">Please fix the errors above to continue</p>
        </div>
      )}
    </div>,
  ];
  
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress indicator */}
      <div className="flex justify-between mb-8">
        {[0, 1, 2].map((step) => (
          <div 
            key={step}
            className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step === currentStep
                ? 'border-primary bg-primary text-primary-foreground'
                : step < currentStep
                  ? 'border-primary bg-primary/20 text-primary'
                  : 'border-muted bg-muted/30 text-muted-foreground'
            }`}
          >
            {step + 1}
            {step < 2 && (
              <div className={`absolute top-1/2 -right-full h-0.5 w-full ${
                step < currentStep ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>
      
      {/* Current step form */}
      {formSteps[currentStep]}
    </div>
  );
} 