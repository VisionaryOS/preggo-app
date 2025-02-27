'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, Trash2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

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
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

// Define schema for appointment
const appointmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  doctor: z.string().min(3, 'Doctor name must be at least 3 characters'),
  notes: z.string().optional(),
  type: z.enum(['checkup', 'ultrasound', 'test', 'other']),
});

type Appointment = z.infer<typeof appointmentSchema> & {
  id: string;
};

// Sample appointment types
const appointmentTypes = [
  { value: 'checkup', label: 'Regular Check-up' },
  { value: 'ultrasound', label: 'Ultrasound' },
  { value: 'test', label: 'Lab Test' },
  { value: 'other', label: 'Other' },
];

export default function AppointmentsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      title: 'First Trimester Checkup',
      date: new Date(2024, 2, 20),
      time: '10:00',
      location: 'City Medical Center',
      doctor: 'Dr. Sarah Johnson',
      notes: 'Bring previous test results',
      type: 'checkup',
    },
    {
      id: '2',
      title: 'Anatomy Scan Ultrasound',
      date: new Date(2024, 3, 15),
      time: '14:30',
      location: 'Women&apos;s Health Clinic',
      doctor: 'Dr. Michael Chen',
      notes: 'Drink plenty of water before the appointment',
      type: 'ultrasound',
    },
  ]);

  // Setup form
  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      title: '',
      type: 'checkup',
    },
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof appointmentSchema>) => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...data,
    };

    setAppointments([...appointments, newAppointment]);
    form.reset();
    toast({
      title: "Appointment added",
      description: "Your appointment has been added to your calendar.",
    });
  };

  // Delete appointment
  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id));
    toast({
      title: "Appointment deleted",
      description: "Your appointment has been removed.",
    });
  };

  // Sort appointments by date
  const sortedAppointments = [...appointments].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Group appointments by month
  const appointmentsByMonth: Record<string, Appointment[]> = {};
  sortedAppointments.forEach((appointment) => {
    const monthYear = format(appointment.date, 'MMMM yyyy');
    if (!appointmentsByMonth[monthYear]) {
      appointmentsByMonth[monthYear] = [];
    }
    appointmentsByMonth[monthYear].push(appointment);
  });

  return (
    <div className="h-full flex flex-col overflow-hidden p-4">
      <div className="flex flex-col space-y-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track your prenatal appointments
          </p>
        </div>

        <div className="flex-1 h-[calc(100vh-10rem)] overflow-hidden">
          <Tabs defaultValue="upcoming" className="h-full flex flex-col">
            <TabsList className="w-full justify-start mb-2">
              <TabsTrigger value="upcoming" className="text-xs">Upcoming</TabsTrigger>
              <TabsTrigger value="add" className="text-xs">Add New</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto pr-1">
                {Object.keys(appointmentsByMonth).length === 0 ? (
                  <Card className="shadow-none border">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      <CalendarIcon className="h-10 w-10 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-semibold mb-1">No Appointments</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        You haven't added any appointments yet.
                      </p>
                      <Button size="sm" onClick={() => setActiveTab("add")}>
                        <Plus className="mr-1 h-3 w-3" />
                        Add Appointment
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {Object.keys(appointmentsByMonth).map((monthYear) => (
                      <div key={monthYear} className="space-y-3">
                        <h3 className="text-md font-semibold">{monthYear}</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          {appointmentsByMonth[monthYear].map((appointment) => (
                            <motion.div
                              key={appointment.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <Card className="shadow-none border">
                                <CardHeader className="p-3 pb-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle className="text-sm">{appointment.title}</CardTitle>
                                      <CardDescription className="text-xs">
                                        {format(appointment.date, 'EEEE, MMMM d, yyyy')}
                                      </CardDescription>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                      onClick={() => deleteAppointment(appointment.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-3 pt-1">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-xs">
                                      <Clock className="h-3 w-3 text-muted-foreground" />
                                      <span>{appointment.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs">
                                      <MapPin className="h-3 w-3 text-muted-foreground" />
                                      <span className="truncate">{appointment.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs">
                                      <span className="font-medium">Doctor:</span>
                                      <span className="truncate">{appointment.doctor}</span>
                                    </div>
                                    {appointment.notes && (
                                      <div className="mt-1 text-xs text-muted-foreground">
                                        <span className="font-medium">Notes:</span> {appointment.notes}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="add" className="flex-1 overflow-hidden">
              <Card className="h-full flex flex-col shadow-none border">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-md">Add New Appointment</CardTitle>
                  <CardDescription className="text-xs">
                    Enter the details of your upcoming appointment
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 flex-1 overflow-y-auto">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Appointment Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter appointment title" {...field} className="h-9" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-xs">Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={`h-9 w-full justify-start text-left font-normal ${
                                        !field.value && "text-muted-foreground"
                                      }`}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Time</FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  {...field}
                                  className="h-9"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Appointment Type</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                {appointmentTypes.map((type) => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Location</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter location" {...field} className="h-9" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="doctor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Doctor</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter doctor's name" {...field} className="h-9" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button type="submit" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Appointment
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 