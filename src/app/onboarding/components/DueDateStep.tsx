'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  calculateDueDateFromLMP, 
  calculateDueDateFromConception,
  formatDateToString
} from '@/lib/utils/due-date-calculator';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

interface DueDateStepProps {
  onNext: () => void;
  onPrev: () => void;
  dueDate: Date | null;
  updateFormData: (data: { due_date: Date | null }) => void;
}

// Form validation schemas
const lmpSchema = z.object({
  lmpDate: z.date({
    required_error: "Please select your last period date",
  }),
});

const conceptionSchema = z.object({
  conceptionDate: z.date({
    required_error: "Please select your conception date",
  }),
});

const knownDueDateSchema = z.object({
  knownDueDate: z.date({
    required_error: "Please select your known due date",
  }),
});

type LMPFormValues = z.infer<typeof lmpSchema>;
type ConceptionFormValues = z.infer<typeof conceptionSchema>;
type KnownDueDateFormValues = z.infer<typeof knownDueDateSchema>;

export default function DueDateStep({ 
  onNext, 
  onPrev, 
  dueDate, 
  updateFormData 
}: DueDateStepProps) {
  const [calculationMethod, setCalculationMethod] = useState<string>("lmp");
  const [calculatedDueDate, setCalculatedDueDate] = useState<Date | null>(dueDate);

  // LMP form
  const lmpForm = useForm<LMPFormValues>({
    resolver: zodResolver(lmpSchema),
    defaultValues: {}
  });

  // Conception form
  const conceptionForm = useForm<ConceptionFormValues>({
    resolver: zodResolver(conceptionSchema),
    defaultValues: {}
  });

  // Known due date form
  const knownDueDateForm = useForm<KnownDueDateFormValues>({
    resolver: zodResolver(knownDueDateSchema),
    defaultValues: {}
  });

  // Handle LMP form submission
  const onLMPSubmit = (data: LMPFormValues) => {
    const due = calculateDueDateFromLMP(data.lmpDate);
    setCalculatedDueDate(due);
    updateFormData({ due_date: due });
  };

  // Handle conception form submission
  const onConceptionSubmit = (data: ConceptionFormValues) => {
    const due = calculateDueDateFromConception(data.conceptionDate);
    setCalculatedDueDate(due);
    updateFormData({ due_date: due });
  };

  // Handle known due date form submission
  const onKnownDueDateSubmit = (data: KnownDueDateFormValues) => {
    setCalculatedDueDate(data.knownDueDate);
    updateFormData({ due_date: data.knownDueDate });
  };

  // Handle next button click
  const handleNext = () => {
    if (calculatedDueDate) {
      onNext();
    }
  };

  return (
    <motion.div 
      className="flex-1 flex flex-col"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Calculate Your Due Date</h1>
        <p className="text-gray-600">
          Your due date helps us personalize your pregnancy journey. Choose the calculation method that works best for you.
        </p>
      </div>

      <Tabs
        value={calculationMethod}
        onValueChange={setCalculationMethod}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="lmp">Last Period</TabsTrigger>
          <TabsTrigger value="conception">Conception</TabsTrigger>
          <TabsTrigger value="known">Known Due Date</TabsTrigger>
        </TabsList>

        <TabsContent value="lmp" className="flex-1 flex flex-col space-y-4">
          <Form {...lmpForm}>
            <form onSubmit={lmpForm.handleSubmit(onLMPSubmit)} className="flex-1 flex flex-col">
              <FormField
                control={lmpForm.control}
                name="lmpDate"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>First day of your last period</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="date"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          onChange={(e) => {
                            const date = e.target.valueAsDate;
                            if (date) {
                              field.onChange(date);
                              // Auto calculate when date is selected
                              onLMPSubmit({ lmpDate: date });
                            }
                          }}
                        />
                        <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      We'll calculate your due date using Naegele's rule (LMP + 280 days)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="conception" className="flex-1 flex flex-col space-y-4">
          <Form {...conceptionForm}>
            <form onSubmit={conceptionForm.handleSubmit(onConceptionSubmit)} className="flex-1 flex flex-col">
              <FormField
                control={conceptionForm.control}
                name="conceptionDate"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>Conception date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="date"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          onChange={(e) => {
                            const date = e.target.valueAsDate;
                            if (date) {
                              field.onChange(date);
                              // Auto calculate when date is selected
                              onConceptionSubmit({ conceptionDate: date });
                            }
                          }}
                        />
                        <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      We'll calculate your due date as 266 days from conception (38 weeks)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="known" className="flex-1 flex flex-col space-y-4">
          <Form {...knownDueDateForm}>
            <form onSubmit={knownDueDateForm.handleSubmit(onKnownDueDateSubmit)} className="flex-1 flex flex-col">
              <FormField
                control={knownDueDateForm.control}
                name="knownDueDate"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>Your due date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="date"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          onChange={(e) => {
                            const date = e.target.valueAsDate;
                            if (date) {
                              field.onChange(date);
                              // Auto update when date is selected
                              onKnownDueDateSubmit({ knownDueDate: date });
                            }
                          }}
                        />
                        <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      If you already know your due date from your healthcare provider
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </TabsContent>
      </Tabs>

      {calculatedDueDate && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-1">Estimated Due Date</h3>
          <p className="text-green-700">
            {formatDateToString(calculatedDueDate)}
          </p>
        </div>
      )}

      {!calculatedDueDate && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">Due Date Required</h3>
            <p className="text-amber-700 text-sm">
              Please select a date to calculate your due date. This helps us personalize your pregnancy journey.
            </p>
          </div>
        </div>
      )}

      <div className="mt-auto pt-8 flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrev}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!calculatedDueDate}
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
} 