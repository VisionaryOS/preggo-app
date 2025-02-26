'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingFormData } from '../OnboardingModal';

// Common pregnancy symptoms
const commonSymptoms = [
  { id: "nausea", label: "Nausea or morning sickness" },
  { id: "fatigue", label: "Fatigue" },
  { id: "cravings", label: "Food cravings" },
  { id: "headaches", label: "Headaches" },
  { id: "backPain", label: "Back pain" },
  { id: "moodSwings", label: "Mood swings" },
  { id: "swelling", label: "Swelling in feet/ankles" },
  { id: "insomnia", label: "Insomnia" },
  { id: "heartburn", label: "Heartburn" },
  { id: "constipation", label: "Constipation" }
];

// Generate week options (1-42 weeks)
const weekOptions = Array.from({ length: 42 }, (_, i) => ({ 
  value: String(i + 1), 
  label: `Week ${i + 1}` 
}));

// Validation schema
const pregnancyInfoSchema = z.object({
  weeks: z.string({
    required_error: "Please select how many weeks you are along",
  }),
  symptoms: z.array(z.string()).optional(),
});

type PregnancyInfoFormValues = z.infer<typeof pregnancyInfoSchema>;

interface PregnancyInfoStepProps {
  dueDate: Date | null;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function PregnancyInfoStep({ dueDate, updateFormData, onNext, onPrev }: PregnancyInfoStepProps) {
  // Create empty array for selected symptoms
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  // Form definition with react-hook-form
  const form = useForm<PregnancyInfoFormValues>({
    resolver: zodResolver(pregnancyInfoSchema),
    defaultValues: { 
      weeks: "",
      symptoms: [],
    },
  });

  // Calculate estimated due date based on selected weeks
  const calculateDueDate = (weeks: number): Date => {
    const today = new Date();
    const daysRemaining = (40 - weeks) * 7; // 40 weeks is full term
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + daysRemaining);
    return dueDate;
  };

  // Handle form submission
  function onSubmit(values: PregnancyInfoFormValues) {
    const weeksNumber = parseInt(values.weeks);
    const calculatedDueDate = calculateDueDate(weeksNumber);
    
    // Update form data with calculated due date and store symptoms in metadata
    updateFormData({ 
      due_date: calculatedDueDate,
      // Add symptoms to metadata (not part of the original schema, but we'll store it there)
      //@ts-ignore - Adding custom field to the form data
      symptoms: selectedSymptoms 
    });
    
    onNext();
  }

  // Handle continue button click
  const handleContinue = () => {
    form.handleSubmit(onSubmit)();
  };

  // Handle symptom selection/deselection
  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        return prev.filter(id => id !== symptomId);
      } else {
        return [...prev, symptomId];
      }
    });
    
    // Update form value
    const currentSymptoms = form.getValues("symptoms") || [];
    if (currentSymptoms.includes(symptomId)) {
      form.setValue("symptoms", currentSymptoms.filter(id => id !== symptomId));
    } else {
      form.setValue("symptoms", [...currentSymptoms, symptomId]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Your Pregnancy Progress 🤰</h2>
          <p className="text-muted-foreground mt-2">
            Tell us how far along you are and any symptoms you're experiencing
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full max-w-md"
            id="pregnancy-info-form"
          >
            <FormField
              control={form.control}
              name="weeks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How many weeks are you?</FormLabel>
                  <FormDescription>
                    Select how many weeks along you are in your pregnancy
                  </FormDescription>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select weeks" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {weekOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Current Symptoms</FormLabel>
              <FormDescription>
                Select any symptoms you're currently experiencing
              </FormDescription>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {commonSymptoms.map((symptom) => (
                  <div key={symptom.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom.id}
                      checked={selectedSymptoms.includes(symptom.id)}
                      onCheckedChange={() => toggleSymptom(symptom.id)}
                    />
                    <label
                      htmlFor={symptom.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {symptom.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </Form>

        {form.watch("weeks") && (
          <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20 animate-in fade-in-50 slide-in-from-bottom-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👶</span>
              <div>
                <p className="font-medium">
                  You're {form.watch("weeks")} weeks along!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on this, your estimated due date would be around {form.watch("weeks") && new Intl.DateTimeFormat('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  }).format(calculateDueDate(parseInt(form.watch("weeks"))))}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={onPrev}
          type="button"
        >
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={!form.watch("weeks")}
          type="button"
          className="relative group"
        >
          <span className="relative z-10">Continue</span>
        </Button>
      </div>
    </div>
  );
} 