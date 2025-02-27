'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Define schema for baby customization
const babySchema = z.object({
  name: z.string().optional(),
  gender: z.enum(['unknown', 'boy', 'girl']),
  weight: z.number().min(1).max(10).optional(),
  length: z.number().min(30).max(60).optional(),
  nicknames: z.string().optional(),
  futureAspirations: z.object({
    careers: z.array(z.string()).optional(),
    sports: z.array(z.string()).optional(),
    otherInterests: z.string().optional(),
  }).optional(),
});

type BabyCustomization = z.infer<typeof babySchema>;

// Default values for baby customization
const defaultBabyValues: BabyCustomization = {
  name: '',
  gender: 'unknown',
  weight: 3.5,
  length: 50,
  nicknames: '',
  futureAspirations: {
    careers: [],
    sports: [],
    otherInterests: '',
  },
};

// Career options to select from
const careerOptions = [
  { id: 'doctor', label: 'Doctor' },
  { id: 'engineer', label: 'Engineer' },
  { id: 'artist', label: 'Artist' },
  { id: 'scientist', label: 'Scientist' },
  { id: 'musician', label: 'Musician' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'entrepreneur', label: 'Entrepreneur' },
  { id: 'writer', label: 'Writer' },
];

// Sport options to select from
const sportOptions = [
  { id: 'soccer', label: 'Soccer' },
  { id: 'basketball', label: 'Basketball' },
  { id: 'swimming', label: 'Swimming' },
  { id: 'tennis', label: 'Tennis' },
  { id: 'gymnastics', label: 'Gymnastics' },
  { id: 'dance', label: 'Dance' },
  { id: 'athletics', label: 'Athletics' },
  { id: 'volleyball', label: 'Volleyball' },
];

// Weight and length benchmarks
const weightBenchmarks = {
  light: 2.5,
  average: 3.5,
  heavy: 4.0
};

const lengthBenchmarks = {
  short: 45,
  average: 50,
  tall: 55
};

export default function BabyPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');

  // Setup form with default values
  const form = useForm<BabyCustomization>({
    resolver: zodResolver(babySchema),
    defaultValues: defaultBabyValues,
  });

  // Handle form submission
  const onSubmit = (data: BabyCustomization) => {
    toast({
      title: "Baby details saved",
      description: data.name 
        ? `${data.name}'s details have been updated.` 
        : "Your baby's details have been updated.",
    });
    // Here you would typically save to your database
  };

  // Get weight benchmark description
  const getWeightDescription = (weight: number | undefined) => {
    if (weight === undefined) return "unknown";
    if (weight <= weightBenchmarks.light) return "lighter than average";
    if (weight >= weightBenchmarks.heavy) return "heavier than average";
    return "around average weight";
  };

  // Get length benchmark description
  const getLengthDescription = (length: number | undefined) => {
    if (length === undefined) return "unknown";
    if (length <= lengthBenchmarks.short) return "shorter than average";
    if (length >= lengthBenchmarks.tall) return "taller than average";
    return "around average length";
  };

  // Safe accessor for arrays
  const safeJoin = (arr: string[] | undefined) => {
    return arr && arr.length > 0 ? arr.join(', ') : '';
  };

  return (
    <div className="h-full flex flex-col overflow-hidden p-4">
      <div className="flex flex-col space-y-4 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Baby Details</h1>
          <p className="text-sm text-muted-foreground">
            Track your baby's details and imagine their future
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Baby Preview */}
          <Card className="shadow-none order-2 lg:order-1">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-md">Baby Summary</CardTitle>
              <CardDescription className="text-xs">
                A summary of your baby's details
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <motion.div 
                className="relative flex flex-col items-center w-full p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Baby Avatar - Simplified */}
                <div className="relative w-48 h-48 flex flex-col items-center justify-center">
                  <div className={`w-32 h-32 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-2`}>
                    {/* Gender Indicator (optional subtle bg tint) */}
                    {form.watch('gender') === 'boy' && (
                      <div className="absolute inset-0 bg-blue-100 opacity-50 rounded-full"></div>
                    )}
                    {form.watch('gender') === 'girl' && (
                      <div className="absolute inset-0 bg-pink-100 opacity-50 rounded-full"></div>
                    )}
                    
                    {/* Simple face */}
                    <div className="relative w-16 h-16">
                      <div className="flex justify-between w-full absolute top-1/3">
                        <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                        <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                      </div>
                      <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Baby Name */}
                  <div className="text-center mt-4">
                    <h3 className="font-medium text-lg">
                      {form.watch('name') || "Your Baby"}
                    </h3>
                    {form.watch('nicknames') && (
                      <p className="text-sm text-muted-foreground">
                        "{form.watch('nicknames')}"
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Baby Stats */}
                <div className="grid grid-cols-1 gap-4 w-full mt-6">
                  <div className="border rounded-md p-3">
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="font-medium capitalize">
                      {form.watch('gender') === 'unknown' ? 'Surprise' : form.watch('gender')}
                    </p>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="text-xs text-muted-foreground">Estimated Weight</p>
                    <p className="font-medium">
                      {form.watch('weight') !== undefined
                        ? `${form.watch('weight').toFixed(2)} kg (${getWeightDescription(form.watch('weight'))})`
                        : '--'}
                    </p>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="text-xs text-muted-foreground">Estimated Length</p>
                    <p className="font-medium">
                      {form.watch('length') !== undefined
                        ? `${form.watch('length')} cm (${getLengthDescription(form.watch('length'))})`
                        : '--'}
                    </p>
                  </div>
                  
                  {/* Future Aspirations Summary */}
                  {((form.watch('futureAspirations.careers')?.length ?? 0) > 0 || 
                    (form.watch('futureAspirations.sports')?.length ?? 0) > 0) && (
                    <div className="border rounded-md p-3">
                      <p className="text-xs text-muted-foreground">Future Dreams</p>
                      <div className="mt-1">
                        {(form.watch('futureAspirations.careers')?.length ?? 0) > 0 && (
                          <p className="text-sm">
                            <span className="font-medium">Career:</span> {safeJoin(form.watch('futureAspirations.careers'))}
                          </p>
                        )}
                        {(form.watch('futureAspirations.sports')?.length ?? 0) > 0 && (
                          <p className="text-sm">
                            <span className="font-medium">Sports:</span> {safeJoin(form.watch('futureAspirations.sports'))}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </CardContent>
          </Card>
          
          {/* Customization Form */}
          <Card className="lg:col-span-2 flex flex-col shadow-none order-1 lg:order-2">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-md">Baby Details</CardTitle>
              <CardDescription className="text-xs">
                Enter details about your baby and dreams for their future
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 overflow-y-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="details">Basic Details</TabsTrigger>
                  <TabsTrigger value="future">Future Dreams</TabsTrigger>
                </TabsList>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <TabsContent value="details" className="space-y-4 mt-0">
                      {/* Gender */}
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Gender</FormLabel>
                            <FormDescription className="text-xs mt-0">
                              Do you know your baby's gender yet?
                            </FormDescription>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="unknown" id="gender-unknown" />
                                  <Label htmlFor="gender-unknown">Don't know yet</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="boy" id="gender-boy" />
                                  <Label htmlFor="gender-boy">Boy</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="girl" id="gender-girl" />
                                  <Label htmlFor="gender-girl">Girl</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Baby's Name</FormLabel>
                            <FormDescription className="text-xs mt-0">
                              Have you chosen a name?
                            </FormDescription>
                            <FormControl>
                              <Input placeholder="Enter name..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Nicknames */}
                      <FormField
                        control={form.control}
                        name="nicknames"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nicknames or Terms of Endearment</FormLabel>
                            <FormDescription className="text-xs mt-0">
                              What nickname do you use when talking to your baby?
                            </FormDescription>
                            <FormControl>
                              <Input placeholder="Little one, sweetie, etc..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Projected Weight */}
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Estimated Weight (kg): {field.value !== undefined ? field.value.toFixed(2) : 'Unknown'}
                            </FormLabel>
                            <FormDescription className="text-xs mt-0">
                              Based on ultrasound or doctor's projection
                            </FormDescription>
                            <FormControl>
                              <div className="space-y-3">
                                <Slider
                                  value={[field.value ?? 3.5]}
                                  min={1}
                                  max={5}
                                  step={0.1}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Lighter ({weightBenchmarks.light} kg)</span>
                                  <span>Average ({weightBenchmarks.average} kg)</span>
                                  <span>Heavier ({weightBenchmarks.heavy} kg)</span>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Projected Length */}
                      <FormField
                        control={form.control}
                        name="length"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Estimated Length (cm): {field.value !== undefined ? field.value : 'Unknown'}
                            </FormLabel>
                            <FormDescription className="text-xs mt-0">
                              Based on ultrasound or doctor's projection
                            </FormDescription>
                            <FormControl>
                              <div className="space-y-3">
                                <Slider
                                  value={[field.value ?? 50]}
                                  min={30}
                                  max={60}
                                  step={1}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Shorter ({lengthBenchmarks.short} cm)</span>
                                  <span>Average ({lengthBenchmarks.average} cm)</span>
                                  <span>Taller ({lengthBenchmarks.tall} cm)</span>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="future" className="space-y-6 mt-0">
                      <div>
                        <h3 className="text-base font-medium mb-2">Dream Careers</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          What careers do you imagine for your baby's future? (Choose up to 3)
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {careerOptions.map((career) => (
                            <div key={career.id} className="flex items-start space-x-2">
                              <Checkbox 
                                id={`career-${career.id}`} 
                                onCheckedChange={(checked) => {
                                  const currentCareers = form.getValues('futureAspirations.careers') || [];
                                  if (checked) {
                                    if (currentCareers.length < 3) {
                                      form.setValue('futureAspirations.careers', [...currentCareers, career.label]);
                                    }
                                  } else {
                                    form.setValue('futureAspirations.careers', 
                                      currentCareers.filter(c => c !== career.label)
                                    );
                                  }
                                }}
                                checked={(form.watch('futureAspirations.careers') || []).includes(career.label)}
                              />
                              <Label 
                                htmlFor={`career-${career.id}`}
                                className="text-sm cursor-pointer"
                              >
                                {career.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-base font-medium mb-2">Sports & Activities</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          What sports or activities might your baby enjoy? (Choose up to 3)
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {sportOptions.map((sport) => (
                            <div key={sport.id} className="flex items-start space-x-2">
                              <Checkbox 
                                id={`sport-${sport.id}`}
                                onCheckedChange={(checked) => {
                                  const currentSports = form.getValues('futureAspirations.sports') || [];
                                  if (checked) {
                                    if (currentSports.length < 3) {
                                      form.setValue('futureAspirations.sports', [...currentSports, sport.label]);
                                    }
                                  } else {
                                    form.setValue('futureAspirations.sports', 
                                      currentSports.filter(s => s !== sport.label)
                                    );
                                  }
                                }}
                                checked={(form.watch('futureAspirations.sports') || []).includes(sport.label)}
                              />
                              <Label 
                                htmlFor={`sport-${sport.id}`}
                                className="text-sm cursor-pointer"
                              >
                                {sport.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="futureAspirations.otherInterests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Other Dreams & Aspirations</FormLabel>
                            <FormDescription className="text-xs mt-0">
                              Share any other dreams or hopes you have for your baby
                            </FormDescription>
                            <FormControl>
                              <Input placeholder="Other interests, talents, or dreams..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <div className="pt-2">
                      <Button type="submit" className="w-full">
                        Save Baby Details
                      </Button>
                    </div>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 