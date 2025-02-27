'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CalendarIcon, User, Heart, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Interest options with emojis
const interestOptions = [
  { label: "Nutrition & Diet", value: "nutrition", emoji: "🥗" },
  { label: "Exercise & Fitness", value: "exercise", emoji: "🧘‍♀️" },
  { label: "Baby Development", value: "baby_development", emoji: "👶" },
  { label: "Mental Wellbeing", value: "mental_wellbeing", emoji: "🧠" },
  { label: "Sleep Tips", value: "sleep", emoji: "💤" },
  { label: "Pregnancy Symptoms", value: "symptoms", emoji: "🤰" },
];

// Health condition options
const healthConditions = [
  { label: "None", value: "none" },
  { label: "Diabetes", value: "diabetes" },
  { label: "Hypertension", value: "hypertension" },
  { label: "Thyroid issues", value: "thyroid" },
  { label: "Anemia", value: "anemia" },
  { label: "Anxiety/Depression", value: "anxiety_depression" },
];

const profileSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  dueDate: z.date().optional(),
  pregnancyWeek: z.number().min(0).max(42).optional().nullable(),
  healthConditions: z.array(z.string()).default([]),
  experience: z.enum(['first_time', 'experienced', 'multiple']).optional(),
  interests: z.array(z.string()).default([]),
  sleepQuality: z.number().min(1).max(5).optional().nullable(),
  stressLevel: z.number().min(1).max(5).optional().nullable(),
  notifications: z.boolean().default(true),
  weeklyUpdates: z.boolean().default(true),
  dailyTips: z.boolean().default(true),
  dataCollection: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const router = useRouter();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      healthConditions: [],
      interests: [],
      notifications: true,
      weeklyUpdates: true,
      dailyTips: true,
      dataCollection: true,
    },
  });

  // Load user data
  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
        dueDate: user.user_metadata?.due_date ? new Date(user.user_metadata.due_date) : undefined,
        pregnancyWeek: user.user_metadata?.pregnancy_week || null,
        healthConditions: user.user_metadata?.health_conditions || [],
        experience: user.user_metadata?.experience as any || undefined,
        interests: user.user_metadata?.interests || [],
        sleepQuality: user.user_metadata?.sleep_quality || null,
        stressLevel: user.user_metadata?.stress_level || null,
        notifications: user.user_metadata?.preferences?.notifications ?? true,
        weeklyUpdates: user.user_metadata?.preferences?.weekly_updates ?? true,
        dailyTips: user.user_metadata?.preferences?.daily_tips ?? true,
        dataCollection: user.user_metadata?.preferences?.data_collection ?? true,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const supabase = createClient();
      
      // Format data for Supabase
      const profileData = {
        full_name: data.fullName,
        due_date: data.dueDate ? data.dueDate.toISOString().split('T')[0] : null,
        pregnancy_week: data.pregnancyWeek,
        health_conditions: data.healthConditions,
        experience: data.experience,
        interests: data.interests,
        sleep_quality: data.sleepQuality,
        stress_level: data.stressLevel,
        preferences: {
          notifications: data.notifications,
          weekly_updates: data.weeklyUpdates,
          daily_tips: data.dailyTips,
          data_collection: data.dataCollection,
        }
      };
      
      // If email changed, update it
      const updateData: any = { data: profileData };
      if (data.email !== user.email) {
        updateData.email = data.email;
      }
      
      // Update user metadata
      const { error } = await supabase.auth.updateUser(updateData);
      
      if (error) throw error;
      
      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully!",
      });
      
      // Refresh data
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error('Error saving profile:', error);
      
      toast({
        title: "Error saving profile",
        description: error instanceof Error ? error.message : "There was a problem saving your profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your personal information and preferences
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs 
              defaultValue="personal" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="personal" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="health" className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Health
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Preferences
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your basic profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your login email address
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="pl-3 text-left font-normal flex justify-between"
                                >
                                  {field.value ? (
                                    format(field.value, "MMMM d, yyyy")
                                  ) : (
                                    <span className="text-gray-500">Select due date</span>
                                  )}
                                  <CalendarIcon className="h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Your expected delivery date
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
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your experience" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="first_time">First-time parent 🌱</SelectItem>
                              <SelectItem value="experienced">Experienced parent 👶</SelectItem>
                              <SelectItem value="multiple">Expecting multiples 👯</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            This helps us tailor content based on your experience
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
                          <FormLabel>Interests</FormLabel>
                          <FormDescription className="mb-4">
                            Select topics you&apos;d like to see more content about
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
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="health" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Health Information</CardTitle>
                    <CardDescription>
                      Information to help personalize your health insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="pregnancyWeek"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Pregnancy Week</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Slider
                                value={field.value !== undefined && field.value !== null ? [field.value] : [0]}
                                min={0}
                                max={42}
                                step={1}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="flex-1"
                              />
                              <div className="w-12 text-center font-medium">
                                {field.value !== undefined && field.value !== null ? field.value : '?'}
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
                      name="healthConditions"
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
                        name="sleepQuality"
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
                                  value={field.value !== undefined && field.value !== null ? [field.value] : [3]}
                                  min={1}
                                  max={5}
                                  step={1}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                                <div className="w-8 text-center font-medium">
                                  {field.value !== undefined && field.value !== null ? field.value : 3}/5
                                </div>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stressLevel"
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
                                  value={field.value !== undefined && field.value !== null ? [field.value] : [3]}
                                  min={1}
                                  max={5}
                                  step={1}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                                <div className="w-8 text-center font-medium">
                                  {field.value !== undefined && field.value !== null ? field.value : 3}/5
                                </div>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>App Preferences</CardTitle>
                    <CardDescription>
                      Customize your app experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="notifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-1">
                            <FormLabel className="text-base">Push Notifications</FormLabel>
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
                      name="weeklyUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-1">
                            <FormLabel className="text-base">Weekly Updates</FormLabel>
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
                      name="dailyTips"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-1">
                            <FormLabel className="text-base">Daily Tips</FormLabel>
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
                      name="dataCollection"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-1">
                            <FormLabel className="text-base">Data Collection</FormLabel>
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
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
} 