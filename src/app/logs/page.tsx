'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDate } from '@/lib/utils';

// Define the log entry schema
const logSchema = z.object({
  date: z.string().min(1, { message: 'Date is required' }),
  notes: z.string().max(500, { message: 'Notes must be 500 characters or less' }).optional().nullable(),
  mood: z.string().optional().nullable(),
  symptoms: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),
});

type LogFormValues = z.infer<typeof logSchema>;

// Define the log entry type to match the database schema
type LogEntry = {
  id: string;
  user_id: string;
  created_at: string;
  date?: string; // Added as it may be derived from created_at
  notes: string | null;
  mood: string[] | null; // Array in database
  symptoms: string[] | null; // Array in database
  weight: number | null; // Number in database
};

// Helper function to convert string to array
const stringToArray = (value: string | null | undefined): string[] | null => {
  if (!value) return null;
  return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
};

// Helper function to convert string to number
const stringToNumber = (value: string | null | undefined): number | null => {
  if (!value) return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

// Helper function to convert array to string
const arrayToString = (value: string[] | null | undefined): string => {
  if (!value || !Array.isArray(value)) return '';
  return value.join(', ');
};

export default function LogsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      notes: '',
      mood: '',
      symptoms: '',
      weight: '',
    },
  });

  // Function to fetch logs - memoized with useCallback to avoid dependency issues in useEffect
  const fetchLogs = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('pregnancy_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map the database response to include a date field if needed
      const formattedLogs = (data || []).map(log => {
        // Type assertion to handle potential missing date field
        const dbLog = log as any;
        // Use existing date or extract from created_at
        const dateValue = dbLog.date || dbLog.created_at.split('T')[0];
        return {
          ...log,
          date: dateValue
        };
      }) as LogEntry[];

      setLogs(formattedLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load your pregnancy logs',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch logs on component mount
  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user, fetchLogs]);

  // Function to handle form submission
  const onSubmit = async (data: LogFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    setMessage(null);
    const supabase = createClient();

    try {
      // Convert form string values to appropriate types for database
      const dbData = {
        date: data.date,
        notes: data.notes,
        mood: stringToArray(data.mood),
        symptoms: stringToArray(data.symptoms),
        weight: stringToNumber(data.weight)
      };

      if (currentLogId) {
        // Update existing log
        const { error } = await supabase
          .from('pregnancy_logs')
          .update(dbData)
          .eq('id', currentLogId);

        if (error) throw error;

        setMessage({
          type: 'success',
          text: 'Log updated successfully!',
        });
      } else {
        // Create new log
        const { error } = await supabase.from('pregnancy_logs').insert({
          user_id: user.id,
          ...dbData
        });

        if (error) throw error;

        setMessage({
          type: 'success',
          text: 'New log created successfully!',
        });
      }

      // Reset form and fetch updated logs
      reset({
        date: new Date().toISOString().split('T')[0],
        notes: '',
        mood: '',
        symptoms: '',
        weight: '',
      });
      setCurrentLogId(null);
      fetchLogs();
    } catch (error) {
      console.error('Error saving log:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save your log entry',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to edit a log
  const handleEdit = (log: LogEntry) => {
    setCurrentLogId(log.id);
    reset({
      date: log.date || log.created_at.split('T')[0],
      notes: log.notes || '',
      mood: arrayToString(log.mood),
      symptoms: arrayToString(log.symptoms),
      weight: log.weight?.toString() || '',
    });

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to delete a log
  const handleDelete = async (id: string) => {
    if (!user || !window.confirm('Are you sure you want to delete this log entry?')) return;

    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('pregnancy_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // If we were editing this log, reset the form
      if (currentLogId === id) {
        setCurrentLogId(null);
        reset({
          date: new Date().toISOString().split('T')[0],
          notes: '',
          mood: '',
          symptoms: '',
          weight: '',
        });
      }

      setMessage({
        type: 'success',
        text: 'Log entry deleted successfully!',
      });
      fetchLogs();
    } catch (error) {
      console.error('Error deleting log:', error);
      setMessage({
        type: 'error',
        text: 'Failed to delete the log entry',
      });
    }
  };

  // Loading state
  if (isLoading && logs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative h-16 w-16">
          <div className="absolute top-0 h-16 w-16 animate-ping rounded-full bg-primary/10"></div>
          <div className="absolute top-0 h-16 w-16 animate-pulse rounded-full bg-primary/30"></div>
          <div className="absolute top-[10px] left-[10px] h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">Pregnancy Journal</h1>
              <p className="text-muted-foreground">Don&apos;t hesitate to log anything about your pregnancy journey!</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle>{currentLogId ? 'Edit Log Entry' : 'Add New Log Entry'}</CardTitle>
                <CardDescription>
                  Record how you're feeling and any important notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {message && (
                  <div
                    className={`mb-4 p-3 rounded-md ${
                      message.type === 'success'
                        ? 'bg-green-100 border border-green-300 text-green-700'
                        : 'bg-red-100 border border-red-300 text-red-700'
                    }`}
                  >
                    <p className="text-sm font-medium">{message.text}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      {...register('date')}
                      disabled={isSubmitting}
                    />
                    {errors.date && (
                      <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mood">Mood</Label>
                    <Input
                      id="mood"
                      type="text"
                      placeholder="How are you feeling today? (e.g., Happy, Tired, Anxious)"
                      {...register('mood')}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Symptoms</Label>
                    <Input
                      id="symptoms"
                      type="text"
                      placeholder="Any symptoms to note? (e.g., Nausea, Backache)"
                      {...register('symptoms')}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (optional)</Label>
                    <Input
                      id="weight"
                      type="text"
                      placeholder="Current weight (lbs/kg)"
                      {...register('weight')}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <textarea
                      id="notes"
                      rows={4}
                      placeholder="Any additional notes about your day..."
                      {...register('notes')}
                      disabled={isSubmitting}
                      className="w-full p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {errors.notes && (
                      <p className="text-sm text-red-600 mt-1">{errors.notes.message}</p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    {currentLogId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCurrentLogId(null);
                          reset({
                            date: new Date().toISOString().split('T')[0],
                            notes: '',
                            mood: '',
                            symptoms: '',
                            weight: '',
                          });
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : currentLogId ? (
                        'Update Entry'
                      ) : (
                        'Save Entry'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle>Your Journal Entries</CardTitle>
                <CardDescription>
                  {logs.length > 0
                    ? `You have ${logs.length} recorded entries`
                    : 'Start tracking your pregnancy journey'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logs.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium">No entries yet</h3>
                      <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                        Use the form to add your first pregnancy journal entry
                      </p>
                    </div>
                  ) : (
                    logs.map((log) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-lg">
                            {formatDate(log.date || log.created_at.split('T')[0])}
                          </h3>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(log)}
                              className="h-8 w-8 p-0"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(log.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          {log.mood && log.mood.length > 0 && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground block">Mood</span>
                              <span>{Array.isArray(log.mood) ? log.mood.join(', ') : log.mood}</span>
                            </div>
                          )}
                          {log.symptoms && log.symptoms.length > 0 && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground block">Symptoms</span>
                              <span>{Array.isArray(log.symptoms) ? log.symptoms.join(', ') : log.symptoms}</span>
                            </div>
                          )}
                          {log.weight && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground block">Weight</span>
                              <span>{log.weight}</span>
                            </div>
                          )}
                        </div>
                        
                        {log.notes && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground block">Notes</span>
                            <p className="mt-1 whitespace-pre-line">{log.notes}</p>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 