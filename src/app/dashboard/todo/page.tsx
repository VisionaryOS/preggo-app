'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

// Define schema for todo item
const todoSchema = z.object({
  title: z.string().min(3, 'Task must be at least 3 characters'),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  category: z.enum(['general', 'appointments', 'shopping', 'health']),
});

type TodoItem = z.infer<typeof todoSchema> & {
  id: string;
  completed: boolean;
  createdAt: Date;
};

// Sample todo categories with icons
const todoCategories = [
  { value: 'general', label: 'General' },
  { value: 'appointments', label: 'Appointments' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health & Wellness' },
];

export default function TodoPage() {
  const { toast } = useToast();
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: '1',
      title: 'Schedule next prenatal appointment',
      category: 'appointments',
      completed: false,
      createdAt: new Date(),
      dueDate: '2024-03-15',
      notes: 'Remember to take all documents',
    },
    {
      id: '2',
      title: 'Take prenatal vitamins',
      category: 'health',
      completed: true,
      createdAt: new Date(),
      dueDate: '2024-03-10',
    },
    {
      id: '3',
      title: 'Buy baby crib',
      category: 'shopping',
      completed: false,
      createdAt: new Date(),
    },
  ]);
  
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Setup form
  const form = useForm<z.infer<typeof todoSchema>>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: '',
      category: 'general',
    },
  });
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof todoSchema>) => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      title: data.title,
      category: data.category,
      completed: false,
      createdAt: new Date(),
      dueDate: data.dueDate,
      notes: data.notes,
    };
    
    setTodos([newTodo, ...todos]);
    form.reset();
    toast({
      title: "Task added",
      description: "Your task has been added to the list.",
    });
  };
  
  // Toggle todo completion
  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  // Delete todo
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast({
      title: "Task deleted",
      description: "Your task has been removed.",
    });
  };
  
  // Filter todos based on active filter and category
  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'completed' && todo.completed) ||
      (activeFilter === 'pending' && !todo.completed);
      
    const matchesCategory =
      activeCategory === 'all' || todo.category === activeCategory;
      
    return matchesFilter && matchesCategory;
  });
  
  return (
    <div className="h-full flex flex-col overflow-hidden p-4">
      <div className="flex flex-col space-y-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">To-Do List</h1>
          <p className="text-sm text-muted-foreground">
            Keep track of important tasks throughout your pregnancy journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 h-[calc(100vh-10rem)] overflow-hidden">
          {/* Todo Form */}
          <Card className="flex flex-col shadow-none">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-md">Add New Task</CardTitle>
              <CardDescription className="text-xs">
                Create a new task for your pregnancy journey
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 overflow-y-auto flex-1">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Task</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter task..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Category</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            {todoCategories.map((category) => (
                              <option key={category.value} value={category.value}>
                                {category.label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Due Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Todo List */}
          <Card className="lg:col-span-2 flex flex-col shadow-none">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-md">Your Tasks</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant={activeFilter === 'all' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveFilter('all')}
                    className="text-xs h-7 px-2"
                  >
                    All
                  </Button>
                  <Button
                    variant={activeFilter === 'pending' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveFilter('pending')}
                    className="text-xs h-7 px-2"
                  >
                    Pending
                  </Button>
                  <Button
                    variant={activeFilter === 'completed' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveFilter('completed')}
                    className="text-xs h-7 px-2"
                  >
                    Completed
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                <Button
                  variant={activeCategory === 'all' ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveCategory('all')}
                  className="text-xs h-7 px-2"
                >
                  All Categories
                </Button>
                {todoCategories.map((category) => (
                  <Button
                    key={category.value}
                    variant={activeCategory === category.value ? 'outline' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveCategory(category.value)}
                    className="text-xs h-7 px-2"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-2 flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto pr-1">
                {filteredTodos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No tasks found.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredTodos.map((todo) => (
                      <motion.div
                        key={todo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2 p-2 border rounded-md"
                      >
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {todo.title}
                          </p>
                          {todo.dueDate && (
                            <p className="text-xs text-muted-foreground">
                              Due: {new Date(todo.dueDate).toLocaleDateString()}
                            </p>
                          )}
                          {todo.notes && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {todo.notes}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTodo(todo.id)}
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 