'use client';

import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { OnboardingFormData } from '../OnboardingModal';

// Validation schema
const nameSchema = z.object({
  full_name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
});

type NameFormValues = z.infer<typeof nameSchema>;

interface NameStepProps {
  fullName: string;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
}

export default function NameStep({ fullName, updateFormData, onNext }: NameStepProps) {
  // Form definition with react-hook-form
  const form = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { full_name: fullName || '' },
  });

  // Handle form submission
  function onSubmit(values: NameFormValues) {
    updateFormData({ full_name: values.full_name });
    onNext();
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">What should we call you?</h2>
          <p className="text-muted-foreground mt-2">
            We'll use this name to personalize your experience
          </p>
        </div>

        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-8 w-full max-w-md"
            id="name-form"
          >
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Your name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your name" 
                      {...field} 
                      className="text-lg" 
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      <div className="flex justify-end mt-8">
        <Button 
          type="submit" 
          size="lg" 
          form="name-form"
          disabled={!form.formState.isValid}
        >
          Continue
        </Button>
      </div>
    </div>
  );
} 