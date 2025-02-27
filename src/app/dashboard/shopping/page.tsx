'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, ShoppingBag, Trash2 } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

// Define schema for shopping item
const shoppingItemSchema = z.object({
  name: z.string().min(2, 'Item name must be at least 2 characters'),
  quantity: z.string().optional(),
  price: z.string().optional(),
  notes: z.string().optional(),
  category: z.enum(['essentials', 'nursery', 'clothing', 'feeding', 'travel', 'healthcare', 'toys', 'other']),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
});

type ShoppingItem = z.infer<typeof shoppingItemSchema> & {
  id: string;
  completed: boolean;
};

// Sample categories with emoji icons
const categories = [
  { value: 'essentials', label: 'Essentials', icon: '🧸' },
  { value: 'nursery', label: 'Nursery', icon: '🛏️' },
  { value: 'clothing', label: 'Clothing', icon: '👶' },
  { value: 'feeding', label: 'Feeding', icon: '🍼' },
  { value: 'travel', label: 'Travel', icon: '🚗' },
  { value: 'healthcare', label: 'Healthcare', icon: '🩹' },
  { value: 'toys', label: 'Toys', icon: '🎯' },
  { value: 'other', label: 'Other', icon: '📋' },
];

// Priority levels
const priorities = [
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' },
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
];

// Sample shopping list items
const sampleItems: ShoppingItem[] = [
  {
    id: '1',
    name: 'Car seat',
    quantity: '1',
    price: '250',
    notes: 'Make sure it fits our car model',
    category: 'travel',
    priority: 'high',
    completed: false,
  },
  {
    id: '2',
    name: 'Diapers (newborn size)',
    quantity: '2 packs',
    price: '40',
    notes: 'Get different brands to test',
    category: 'essentials',
    priority: 'high',
    completed: true,
  },
  {
    id: '3',
    name: 'Baby monitor',
    quantity: '1',
    price: '120',
    notes: 'With video capability',
    category: 'nursery',
    priority: 'medium',
    completed: false,
  },
  {
    id: '4',
    name: 'Onesies (0-3 months)',
    quantity: '10',
    price: '80',
    notes: 'Mix of long and short sleeves',
    category: 'clothing',
    priority: 'medium',
    completed: false,
  },
  {
    id: '5',
    name: 'Baby bottles',
    quantity: '6',
    price: '35',
    notes: 'Anti-colic type preferred',
    category: 'feeding',
    priority: 'medium',
    completed: false,
  },
  {
    id: '6',
    name: 'Baby thermometer',
    quantity: '1',
    price: '25',
    notes: 'Digital with quick read',
    category: 'healthcare',
    priority: 'medium',
    completed: false,
  },
];

export default function ShoppingListPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("list");
  const [items, setItems] = useState<ShoppingItem[]>(sampleItems);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeStatus, setActiveStatus] = useState<string>('all');
  
  // Setup form
  const form = useForm<z.infer<typeof shoppingItemSchema>>({
    resolver: zodResolver(shoppingItemSchema),
    defaultValues: {
      name: '',
      category: 'essentials',
      priority: 'medium',
    },
  });
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof shoppingItemSchema>) => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      ...data,
      completed: false,
    };
    
    setItems([...items, newItem]);
    form.reset({
      name: '',
      category: 'essentials',
      priority: 'medium',
    });
    toast({
      title: 'Item added',
      description: 'Your item has been added to the shopping list.',
    });
  };
  
  // Toggle item completion
  const toggleItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  // Delete item
  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your shopping list.',
    });
  };
  
  // Filter items based on active category and status
  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesStatus = 
      activeStatus === 'all' || 
      (activeStatus === 'completed' && item.completed) || 
      (activeStatus === 'pending' && !item.completed);
    
    return matchesCategory && matchesStatus;
  });
  
  // Calculate statistics
  const stats = {
    total: items.length,
    completed: items.filter(item => item.completed).length,
    pending: items.filter(item => !item.completed).length,
    estimatedTotal: items.reduce((sum, item) => {
      const price = item.price ? parseFloat(item.price) : 0;
      return sum + price;
    }, 0),
    completedTotal: items.filter(item => item.completed).reduce((sum, item) => {
      const price = item.price ? parseFloat(item.price) : 0;
      return sum + price;
    }, 0),
  };
  
  return (
    <div className="h-full flex flex-col overflow-hidden p-4">
      <div className="flex flex-col space-y-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shopping List</h1>
          <p className="text-sm text-muted-foreground">
            Keep track of everything you need for your baby
          </p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="shadow-none border">
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">Purchased</p>
                  <h3 className="text-lg font-bold">{stats.completed} / {stats.total}</h3>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ 
                    width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-none border">
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">Total Budget</p>
                  <h3 className="text-lg font-bold">${stats.estimatedTotal.toFixed(2)}</h3>
                </div>
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900 dark:text-amber-300">
                  <span className="font-bold text-xs">$</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Spent: ${stats.completedTotal.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-none border">
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">Priority Items</p>
                  <h3 className="text-lg font-bold">{items.filter(item => item.priority === 'high' && !item.completed).length}</h3>
                </div>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 dark:bg-red-900 dark:text-red-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1 h-[calc(100vh-15rem)] grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
          {/* Shopping Form */}
          <Card className="flex flex-col shadow-none">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-md">Add Item</CardTitle>
              <CardDescription className="text-xs">
                Add a new item to your shopping list
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 overflow-y-auto flex-1">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Item Name</FormLabel>
                        <FormControl>
                          <Input placeholder="What do you need to buy..." {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Quantity</FormLabel>
                          <FormControl>
                            <Input placeholder="1" {...field} className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Est. Price</FormLabel>
                          <FormControl>
                            <Input placeholder="$0.00" {...field} className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
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
                            {categories.map((category) => (
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
                  
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Priority</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            {priorities.map((priority) => (
                              <option key={priority.value} value={priority.value}>
                                {priority.label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add to List
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Shopping List */}
          <Card className="lg:col-span-2 flex flex-col shadow-none">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-md">Your Shopping List</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant={activeStatus === 'all' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveStatus('all')}
                    className="text-xs h-7 px-2"
                  >
                    All
                  </Button>
                  <Button
                    variant={activeStatus === 'pending' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveStatus('pending')}
                    className="text-xs h-7 px-2"
                  >
                    To Buy
                  </Button>
                  <Button
                    variant={activeStatus === 'completed' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveStatus('completed')}
                    className="text-xs h-7 px-2"
                  >
                    Purchased
                  </Button>
                </div>
              </div>
              
              <div className="flex overflow-x-auto gap-1 pb-1 mt-2 hide-scrollbar">
                <Button
                  variant={activeCategory === 'all' ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveCategory('all')}
                  className="text-xs h-7 px-2 whitespace-nowrap"
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={activeCategory === category.value ? 'outline' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveCategory(category.value)}
                    className="text-xs h-7 px-2 whitespace-nowrap"
                  >
                    {category.icon} {category.label}
                  </Button>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-2 flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto pr-1">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No items found.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2 p-2 border rounded-md"
                      >
                        <div className="flex-shrink-0">
                          <Checkbox
                            checked={item.completed}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <p className={`font-medium text-sm truncate ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {item.name}
                            </p>
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-sm ${
                              priorities.find(p => p.value === item.priority)?.color
                            }`}>
                              {item.priority}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                            <span className="mr-2">
                              {categories.find(c => c.value === item.category)?.icon}
                            </span>
                            {item.quantity && <span className="mr-2">Qty: {item.quantity}</span>}
                            {item.price && <span>${item.price}</span>}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteItem(item.id)}
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
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