'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Heart, 
  Bookmark, 
  Activity,
  Smile,
  Settings,
  MessageSquare
} from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

// Form validation schema
const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  pregnancy_week: z.number().min(0).max(42).optional(),
  health_conditions: z.array(z.string()).default([]),
  experience: z.enum(['first_time', 'experienced', 'multiple']).optional(),
  interests: z.array(z.string()).default([]),
  sleep_quality: z.number().min(1).max(5).optional(),
  stress_level: z.number().min(1).max(5).optional(),
  notifications: z.boolean().default(true),
  weekly_updates: z.boolean().default(true),
  daily_tips: z.boolean().default(true),
  data_collection: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileStepProps {
  onNext: () => void;
  onPrev: () => void;
  fullName: string;
  preferences: {
    notifications: boolean;
    weekly_updates: boolean;
    daily_tips?: boolean;
    data_collection?: boolean;
  };
  updateFormData: (data: { 
    full_name: string; 
    pregnancy_week?: number;
    health_conditions?: string[];
    experience?: string;
    interests?: string[];
    sleep_quality?: number;
    stress_level?: number;
    preferences: {
      notifications: boolean;
      weekly_updates: boolean;
      daily_tips: boolean;
      data_collection: boolean;
    }
  }) => void;
}

// Health condition options
const healthConditions = [
  { label: "None", value: "none" },
  { label: "Diabetes", value: "diabetes" },
  { label: "Hypertension", value: "hypertension" },
  { label: "Thyroid issues", value: "thyroid" },
  { label: "Anemia", value: "anemia" },
  { label: "Anxiety/Depression", value: "anxiety_depression" },
];

// Interest options with emojis
const interestOptions = [
  { label: "Nutrition & Diet", value: "nutrition", emoji: "🥗" },
  { label: "Exercise & Fitness", value: "exercise", emoji: "🧘‍♀️" },
  { label: "Baby Development", value: "baby_development", emoji: "👶" },
  { label: "Mental Wellbeing", value: "mental_wellbeing", emoji: "🧠" },
  { label: "Sleep Tips", value: "sleep", emoji: "💤" },
  { label: "Pregnancy Symptoms", value: "symptoms", emoji: "🤰" },
];

export default function ProfileStep({ 
  onNext, 
  onPrev, 
  fullName, 
  preferences,
  updateFormData 
}: ProfileStepProps) {
  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: fullName || '',
      notifications: preferences?.notifications ?? true,
      weekly_updates: preferences?.weekly_updates ?? true,
      daily_tips: preferences?.daily_tips ?? true,
      data_collection: preferences?.data_collection ?? true,
    },
  });

  // Handle form submission
  const onSubmit = (data: ProfileFormValues) => {
    updateFormData({
      full_name: data.full_name,
      pregnancy_week: data.pregnancy_week,
      health_conditions: data.health_conditions,
      experience: data.experience,
      interests: data.interests,
      sleep_quality: data.sleep_quality,
      stress_level: data.stress_level,
      preferences: {
        notifications: data.notifications,
        weekly_updates: data.weekly_updates,
        daily_tips: data.daily_tips,
        data_collection: data.data_collection,
      }
    });
    onNext();
  };

  return (
    <motion.div 
      className="flex-1 flex flex-col"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create Your Personalized Experience</h1>
        <p className="text-gray-600">
          Tell us more about yourself so we can customize your pregnancy journey
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
          <Tabs defaultValue="basics" className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basics">
                <User className="h-4 w-4 mr-2" />
                Basics
              </TabsTrigger>
              <TabsTrigger value="health">
                <Heart className="h-4 w-4 mr-2" />
                Health
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="flex-1">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="Enter your full name" 
                            {...field} 
                          />
                          <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        This is how we'll address you throughout the app
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pregnancy Experience</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="first_time">First-time parent 🌱</SelectItem>
                            <SelectItem value="experienced">Experienced parent 👶</SelectItem>
                            <SelectItem value="multiple">Expecting multiples 👯</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        We'll tailor content based on your experience
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What topics interest you most?</FormLabel>
                      <FormDescription className="mb-4">
                        Select the topics you'd like to see more content about
                      </FormDescription>
                      <div className="grid grid-cols-2 gap-3">
                        {interestOptions.map(interest => (
                          <Card 
                            key={interest.value}
                            className={`cursor-pointer border transition-all ${
                              field.value?.includes(interest.value) 
                                ? 'border-primary bg-primary/5' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => {
                              const currentValues = new Set(field.value || []);
                              if (currentValues.has(interest.value)) {
                                currentValues.delete(interest.value);
                              } else {
                                currentValues.add(interest.value);
                              }
                              field.onChange(Array.from(currentValues));
                            }}
                          >
                            <CardContent className="flex items-center p-3">
                              <div className="text-xl mr-3">{interest.emoji}</div>
                              <span className="text-sm font-medium">{interest.label}</span>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="health" className="flex-1 space-y-6">
              <FormField
                control={form.control}
                name="pregnancy_week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Pregnancy Week (if known)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={field.value !== undefined ? [field.value] : [0]}
                          min={0}
                          max={42}
                          step={1}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="flex-1"
                        />
                        <div className="w-12 text-center font-medium">
                          {field.value !== undefined ? field.value : '?'}
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      This helps us show you relevant content for your stage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="health_conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Health Conditions</FormLabel>
                    <FormDescription className="mb-3">
                      Select any pre-existing conditions for more relevant guidance
                    </FormDescription>
                    <div className="grid grid-cols-2 gap-3">
                      {healthConditions.map(condition => (
                        <div
                          key={condition.value}
                          className={`border rounded-md p-3 cursor-pointer ${
                            field.value?.includes(condition.value)
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200'
                          }`}
                          onClick={() => {
                            const currentValues = new Set(field.value || []);
                            if (currentValues.has(condition.value)) {
                              currentValues.delete(condition.value);
                            } else {
                              currentValues.add(condition.value);
                            }
                            field.onChange(Array.from(currentValues));
                          }}
                        >
                          <div className="flex items-center">
                            {condition.value === 'none' ? (
                              <Bookmark className="h-4 w-4 mr-2 text-primary" />
                            ) : (
                              <Activity className="h-4 w-4 mr-2 text-primary" />
                            )}
                            <span className="text-sm font-medium">{condition.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="sleep_quality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sleep Quality</FormLabel>
                      <FormDescription>
                        How well are you sleeping?
                      </FormDescription>
                      <div className="flex justify-between mt-2 mb-1 text-gray-500 text-xs">
                        <span>Poor</span>
                        <span>Excellent</span>
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={field.value !== undefined ? [field.value] : [3]}
                            min={1}
                            max={5}
                            step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="w-8 text-center font-medium">
                            {field.value || 3}/5
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stress_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stress Level</FormLabel>
                      <FormDescription>
                        How stressed do you feel?
                      </FormDescription>
                      <div className="flex justify-between mt-2 mb-1 text-gray-500 text-xs">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={field.value !== undefined ? [field.value] : [3]}
                            min={1}
                            max={5}
                            step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="w-8 text-center font-medium">
                            {field.value || 3}/5
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="flex-1 space-y-4">
              <h3 className="text-lg font-medium mb-2">App Preferences</h3>
              
              <FormField
                control={form.control}
                name="notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Push Notifications
                      </FormLabel>
                      <FormDescription>
                        Receive timely reminders and updates
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
                name="weekly_updates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center">
                        <Activity className="h-4 w-4 mr-2" />
                        Weekly Updates
                      </FormLabel>
                      <FormDescription>
                        Get weekly summaries of your pregnancy journey
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
                name="daily_tips"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center">
                        <Smile className="h-4 w-4 mr-2" />
                        Daily Tips
                      </FormLabel>
                      <FormDescription>
                        Receive daily pregnancy tips and advice
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
                name="data_collection"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Data Collection
                      </FormLabel>
                      <FormDescription>
                        Allow anonymous data collection to improve your experience
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
            </TabsContent>
          </Tabs>

          <div className="mt-auto pt-6 flex justify-between">
            <Button
              type="button"
              onClick={onPrev}
              variant="outline"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Button type="submit">
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
} 