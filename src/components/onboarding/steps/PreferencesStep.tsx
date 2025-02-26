'use client';

import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription, Form } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { OnboardingFormData } from '../OnboardingModal';
import { Loader2 } from 'lucide-react';

// Validation schema
const preferencesSchema = z.object({
  preferences: z.object({
    notifications: z.boolean(),
    weekly_updates: z.boolean(),
    daily_tips: z.boolean(),
  }),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

interface PreferencesStepProps {
  preferences: {
    notifications: boolean;
    weekly_updates: boolean;
    daily_tips: boolean;
  };
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isSaving: boolean;
}

export default function PreferencesStep({ 
  preferences, 
  updateFormData, 
  onNext, 
  onPrev,
  isSaving 
}: PreferencesStepProps) {
  
  // Form definition with react-hook-form
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferences: {
        notifications: preferences.notifications,
        weekly_updates: preferences.weekly_updates,
        daily_tips: preferences.daily_tips,
      }
    },
  });

  // Handle form submission
  function onSubmit(values: PreferencesFormValues) {
    updateFormData({ preferences: values.preferences });
    onNext();
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Customize your experience</h2>
          <p className="text-muted-foreground mt-2">
            Choose your preferences to make your pregnancy journey more personalized
          </p>
        </div>

        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-8"
            id="preferences-form"
          >
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="preferences.notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Notifications</FormLabel>
                      <FormDescription>
                        Receive important alerts about your pregnancy journey
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="preferences.weekly_updates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Weekly Updates</FormLabel>
                      <FormDescription>
                        Receive weekly updates about your baby's development
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="preferences.daily_tips"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Daily Tips</FormLabel>
                      <FormDescription>
                        Get daily tips and advice for a healthy pregnancy
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>

      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={onPrev}
          disabled={isSaving}
        >
          Back
        </Button>
        <Button 
          type="submit" 
          form="preferences-form"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Complete Setup'
          )}
        </Button>
      </div>
    </div>
  );
} 