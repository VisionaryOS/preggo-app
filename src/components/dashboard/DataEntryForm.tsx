'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, ChevronUp } from 'lucide-react';

const formSchema = z.object({
  weight: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(40).max(200).optional()
  ),
  bloodPressure: z.string().regex(/^\d{2,3}\/\d{2,3}$/, "Invalid format (e.g. 120/80)").optional(),
  sleepHours: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(0).max(24).optional()
  ),
  mood: z.enum(['great', 'good', 'okay', 'poor', 'terrible']),
  exerciseMinutes: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(0).max(300).optional()
  ),
  waterIntake: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(0).max(5000).optional()
  ),
  hadSymptoms: z.boolean().default(false),
  symptoms: z.array(z.enum(['nausea', 'fatigue', 'headache', 'backPain', 'swelling', 'heartburn'])).optional(),
});

export type DataFormValues = z.infer<typeof formSchema>;

interface DataEntryFormProps {
  onDataSubmit: (data: DataFormValues) => void;
}

export function DataEntryForm({ onDataSubmit }: DataEntryFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const form = useForm<DataFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: undefined,
      bloodPressure: '',
      sleepHours: undefined,
      mood: 'good',
      exerciseMinutes: undefined,
      waterIntake: undefined,
      hadSymptoms: false,
      symptoms: [],
    },
  });

  function onSubmit(data: DataFormValues) {
    onDataSubmit(data);
    form.reset();
    setIsExpanded(false);
  }

  const symptomsOptions = [
    { value: 'nausea', label: 'Nausea' },
    { value: 'fatigue', label: 'Fatigue' },
    { value: 'headache', label: 'Headache' },
    { value: 'backPain', label: 'Back Pain' },
    { value: 'swelling', label: 'Swelling' },
    { value: 'heartburn', label: 'Heartburn' },
  ];

  return (
    <Card className="border border-border shadow-sm transition-all duration-200 hover:shadow-md">
      <CardHeader 
        className="pb-3 cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Daily Health Tracker</span>
          <Button variant="ghost" size="sm" className="gap-1">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </CardTitle>
        <CardDescription>
          Track your pregnancy health metrics and symptoms to visualize trends
        </CardDescription>
      </CardHeader>
      {isExpanded && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (lbs)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter weight"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                          className="focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bloodPressure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Pressure</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. 120/80" 
                          {...field} 
                          className="focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sleepHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sleep (hours)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Hours of sleep"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                          className="focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mood</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="focus-visible:ring-primary">
                            <SelectValue placeholder="Select mood" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="great">Great</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="okay">Okay</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                            <SelectItem value="terrible">Terrible</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="exerciseMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Minutes of exercise"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                          className="focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="waterIntake"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Water Intake (ml)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Water consumed"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                          className="focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="hadSymptoms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Experienced Symptoms</FormLabel>
                        <FormDescription>
                          Did you experience any pregnancy symptoms today?
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
                
                {form.watch('hadSymptoms') && (
                  <div className="rounded-lg border p-4">
                    <FormLabel className="text-base">Select Symptoms</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {symptomsOptions.map((symptom) => (
                        <FormField
                          key={symptom.value}
                          control={form.control}
                          name="symptoms"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={symptom.value}
                                className="flex flex-row items-start space-x-3 space-y-0 p-2"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(symptom.value as any)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      return checked
                                        ? field.onChange([...current, symptom.value])
                                        : field.onChange(
                                            current.filter((value) => value !== symptom.value)
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {symptom.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 border-t pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit">Save Entry</Button>
            </CardFooter>
          </form>
        </Form>
      )}
    </Card>
  );
} 