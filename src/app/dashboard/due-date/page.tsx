'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Check, Clock, Info, List, MapPin, Plus, Baby } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, addDays, subDays, differenceInDays } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

// Schema for planning items
const planningItemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  date: z.date({
    required_error: "Please select a date",
  }),
  notes: z.string().optional(),
  category: z.enum(['preparation', 'hospital', 'postpartum', 'other']),
  completed: z.boolean().default(false),
});

type PlanningItem = z.infer<typeof planningItemSchema> & {
  id: string;
};

// Sample planning categories
const planningCategories = [
  { value: 'preparation', label: 'Preparation', icon: '🏠' },
  { value: 'hospital', label: 'Hospital', icon: '🏥' },
  { value: 'postpartum', label: 'Postpartum', icon: '👶' },
  { value: 'other', label: 'Other', icon: '📝' },
];

// Due date form schema
const dueDateFormSchema = z.object({
  dueDate: z.date({
    required_error: "Please select your due date",
  }),
});

export default function DueDatePlanningPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("timeline");
  const [dueDate, setDueDate] = useState<Date | null>(new Date('2024-10-15'));
  const [planningItems, setPlanningItems] = useState<PlanningItem[]>([
    {
      id: '1',
      title: 'Pack hospital bag',
      date: addDays(new Date('2024-10-15'), -14),
      notes: 'Include toiletries, comfortable clothes, phone charger, and going home outfit for baby',
      category: 'preparation',
      completed: false,
    },
    {
      id: '2',
      title: 'Install car seat',
      date: addDays(new Date('2024-10-15'), -21),
      notes: 'Have it inspected at local fire station or by certified installer',
      category: 'preparation',
      completed: true,
    },
    {
      id: '3',
      title: 'Prepare meals for freezer',
      date: addDays(new Date('2024-10-15'), -7),
      notes: 'Prepare and freeze 1-2 weeks worth of easy meals',
      category: 'preparation',
      completed: false,
    },
    {
      id: '4',
      title: 'Set up postpartum care items',
      date: addDays(new Date('2024-10-15'), 1),
      notes: 'Prepare recovery station with pads, peri bottle, comfortable clothes',
      category: 'postpartum',
      completed: false,
    },
  ]);

  // Form for setting due date
  const dueDateForm = useForm<z.infer<typeof dueDateFormSchema>>({
    resolver: zodResolver(dueDateFormSchema),
    defaultValues: {
      dueDate: dueDate || undefined,
    },
  });

  // Form for adding planning items
  const planningForm = useForm<z.infer<typeof planningItemSchema>>({
    resolver: zodResolver(planningItemSchema),
    defaultValues: {
      title: '',
      category: 'preparation',
      completed: false,
    },
  });

  // Update due date
  const onDueDateSubmit = (data: z.infer<typeof dueDateFormSchema>) => {
    setDueDate(data.dueDate);
    toast({
      title: 'Due date updated',
      description: `Your due date has been set to ${format(data.dueDate, 'MMMM d, yyyy')}.`,
    });
  };

  // Add planning item
  const onPlanningSubmit = (data: z.infer<typeof planningItemSchema>) => {
    const newItem: PlanningItem = {
      id: Date.now().toString(),
      ...data,
    };

    setPlanningItems([...planningItems, newItem]);
    planningForm.reset({
      title: '',
      category: 'preparation',
      completed: false,
    });
    toast({
      title: 'Planning item added',
      description: 'Your planning item has been added successfully.',
    });
  };

  // Toggle completion status
  const toggleCompleted = (id: string) => {
    setPlanningItems(
      planningItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Delete planning item
  const deleteItem = (id: string) => {
    setPlanningItems(planningItems.filter((item) => item.id !== id));
    toast({
      title: 'Item deleted',
      description: 'The planning item has been removed.',
    });
  };

  // Calculate date ranges around due date
  const dueDateRanges = dueDate
    ? {
        beforeWeek: {
          start: subDays(dueDate, 7),
          end: subDays(dueDate, 1),
        },
        dueDate: dueDate,
        afterWeek: {
          start: addDays(dueDate, 1),
          end: addDays(dueDate, 7),
        },
      }
    : null;

  // Filter items by time period
  const getItemsForPeriod = (start: Date, end: Date) => {
    return planningItems.filter(
      (item) =>
        item.date >= start && item.date <= end
    );
  };

  // Group planning items by date
  const groupItemsByDate = (items: PlanningItem[]) => {
    const grouped: Record<string, PlanningItem[]> = {};
    
    items.forEach((item) => {
      const dateStr = format(item.date, 'yyyy-MM-dd');
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(item);
    });
    
    return Object.entries(grouped)
      .map(([dateStr, items]) => ({
        date: new Date(dateStr),
        items,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  // Calculate countdown
  const daysUntilDueDate = dueDate ? differenceInDays(dueDate, new Date()) : 0;
  const countdownText = daysUntilDueDate === 0
    ? "Today is your due date!"
    : daysUntilDueDate > 0
      ? `${daysUntilDueDate} days until your due date`
      : `${Math.abs(daysUntilDueDate)} days past your due date`;

  return (
    <main className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Due Date Planning</h1>
          <p className="text-muted-foreground mt-2">
            Plan important tasks before and after your due date
          </p>
        </div>

        {/* Due Date Information */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle>Your Due Date</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col justify-center items-center p-6 bg-muted/30 rounded-lg">
                <div className="text-4xl font-bold mb-2 text-primary">
                  {dueDate ? format(dueDate, 'MMMM d, yyyy') : 'Not set'}
                </div>
                <p className="text-sm text-center text-muted-foreground">{countdownText}</p>
                
                <Form {...dueDateForm}>
                  <form onSubmit={dueDateForm.handleSubmit(onDueDateSubmit)} className="w-full mt-4">
                    <FormField
                      control={dueDateForm.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full pl-3 text-left font-normal flex justify-between items-center"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select your due date</span>
                                  )}
                                  <CalendarIcon className="h-4 w-4" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full mt-2">
                      Update Due Date
                    </Button>
                  </form>
                </Form>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold mb-4">Important Time Periods</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Before Due Date (Week Before)</h4>
                      <div className="text-sm text-muted-foreground">
                        {dueDateRanges ? format(dueDateRanges.beforeWeek.start, 'MMM d') + ' - ' + format(dueDateRanges.beforeWeek.end, 'MMM d, yyyy') : ''}
                      </div>
                    </div>
                    <p className="text-sm mt-1">Prepare your home, have your hospital bag ready, and make final arrangements.</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-primary/5">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Due Date</h4>
                      <div className="text-sm text-muted-foreground">
                        {dueDate ? format(dueDate, 'MMMM d, yyyy') : ''}
                      </div>
                    </div>
                    <p className="text-sm mt-1">The estimated date of delivery. Remember, only a small percentage of babies are born exactly on their due date.</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">After Due Date (Week After)</h4>
                      <div className="text-sm text-muted-foreground">
                        {dueDateRanges ? format(dueDateRanges.afterWeek.start, 'MMM d') + ' - ' + format(dueDateRanges.afterWeek.end, 'MMM d, yyyy') : ''}
                      </div>
                    </div>
                    <p className="text-sm mt-1">Initial recovery period and first week with your newborn.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Due Date Planning */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full sm:w-auto mb-6">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="add">Add Planning Item</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-6">
            {!dueDate ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-medium mb-2">Please set your due date first</h3>
                  <p className="text-sm text-muted-foreground">
                    Set your due date to see the planning timeline
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Before Due Date Week */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-1 rounded">
                      <Info className="h-5 w-5" />
                    </span>
                    Week Before Due Date 
                    <span className="text-base font-normal text-muted-foreground">
                      ({format(dueDateRanges!.beforeWeek.start, 'MMM d')} - {format(dueDateRanges!.beforeWeek.end, 'MMM d')})
                    </span>
                  </h3>
                  
                  {getItemsForPeriod(dueDateRanges!.beforeWeek.start, dueDateRanges!.beforeWeek.end).length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No planning items for this period</p>
                        <Button 
                          variant="link" 
                          onClick={() => setActiveTab("add")}
                          className="mt-2"
                        >
                          Add a planning item
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {groupItemsByDate(getItemsForPeriod(dueDateRanges!.beforeWeek.start, dueDateRanges!.beforeWeek.end)).map((group) => (
                        <div key={group.date.toISOString()} className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            {format(group.date, 'EEEE, MMMM d, yyyy')}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {group.items.map((item) => (
                              <PlanningItemCard 
                                key={item.id} 
                                item={item} 
                                onToggleComplete={toggleCompleted}
                                onDelete={deleteItem}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Due Date */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 text-primary p-1 rounded">
                      <CalendarIcon className="h-5 w-5" />
                    </span>
                    Due Date 
                    <span className="text-base font-normal text-muted-foreground">
                      ({format(dueDate, 'MMMM d, yyyy')})
                    </span>
                  </h3>
                  
                  <div className="p-6 border rounded-lg bg-primary/5">
                    <h4 className="font-medium">Your Estimated Delivery Date</h4>
                    <p className="text-sm mt-2">
                      Remember that only about 4% of babies are born on their exact due date! 
                      Most babies are born between 38 and 42 weeks of pregnancy, 
                      with the majority arriving within a week of the due date.
                    </p>
                    <div className="mt-4">
                      <h5 className="text-sm font-medium">Signs of labor to watch for:</h5>
                      <ul className="text-sm mt-2 space-y-1 list-disc pl-5">
                        <li>Regular, painful contractions</li>
                        <li>Water breaking</li>
                        <li>Bloody show (pink or brown discharge)</li>
                        <li>Lower back pain or pressure</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* After Due Date Week */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-1 rounded">
                      <Baby className="h-5 w-5" />
                    </span>
                    Week After Due Date 
                    <span className="text-base font-normal text-muted-foreground">
                      ({format(dueDateRanges!.afterWeek.start, 'MMM d')} - {format(dueDateRanges!.afterWeek.end, 'MMM d')})
                    </span>
                  </h3>
                  
                  {getItemsForPeriod(dueDateRanges!.afterWeek.start, dueDateRanges!.afterWeek.end).length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No planning items for this period</p>
                        <Button 
                          variant="link" 
                          onClick={() => setActiveTab("add")}
                          className="mt-2"
                        >
                          Add a planning item
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {groupItemsByDate(getItemsForPeriod(dueDateRanges!.afterWeek.start, dueDateRanges!.afterWeek.end)).map((group) => (
                        <div key={group.date.toISOString()} className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            {format(group.date, 'EEEE, MMMM d, yyyy')}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {group.items.map((item) => (
                              <PlanningItemCard 
                                key={item.id} 
                                item={item} 
                                onToggleComplete={toggleCompleted}
                                onDelete={deleteItem}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add Planning Item</CardTitle>
                <CardDescription>
                  Create a new task for your due date planning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...planningForm}>
                  <form onSubmit={planningForm.handleSubmit(onPlanningSubmit)} className="space-y-4">
                    <FormField
                      control={planningForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Pack hospital bag" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={planningForm.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className="w-full pl-3 text-left font-normal flex justify-between items-center"
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Select a date</span>
                                    )}
                                    <CalendarIcon className="h-4 w-4" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={planningForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                {planningCategories.map((category) => (
                                  <option key={category.value} value={category.value}>
                                    {category.icon} {category.label}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={planningForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Additional details about this task..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Planning Item
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

// Planning Item Card Component
interface PlanningItemCardProps {
  item: PlanningItem;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

function PlanningItemCard({ item, onToggleComplete, onDelete }: PlanningItemCardProps) {
  const category = planningCategories.find(cat => cat.value === item.category);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`border rounded-lg p-4 ${item.completed ? 'bg-muted/50' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div 
          className="flex-shrink-0 h-6 w-6 cursor-pointer border rounded-full flex items-center justify-center"
          onClick={() => onToggleComplete(item.id)}
        >
          {item.completed && <Check className="h-4 w-4" />}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                {item.title}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {category?.icon} {category?.label}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item.id)}
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 -mt-1 -mr-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </Button>
          </div>
          {item.notes && (
            <p className="text-sm mt-2 bg-muted/30 p-2 rounded">
              {item.notes}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
} 