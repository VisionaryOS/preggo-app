'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { useJourney } from '@/context/JourneyContext';
import { TodaysFocus } from '@/types/journey.types';
import { motion } from 'framer-motion';

/**
 * Component to display the user's daily focus items with priorities
 */
export default function TodaysFocusComponent() {
  const { journeyState, completeTodaysFocus } = useJourney();
  const { todaysFocus } = journeyState;
  
  // Handle completing a focus item
  const handleComplete = (id: string) => {
    completeTodaysFocus(id);
  };
  
  // Get priority icon based on priority level
  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // Get priority text based on priority level
  const getPriorityText = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'High priority';
      case 'medium':
        return 'Medium priority';
      case 'low':
        return 'Low priority';
    }
  };
  
  // Order focus items by priority
  const orderedFocusItems = [...todaysFocus].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  if (todaysFocus.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">No focus items for today</p>
        <Button variant="outline" size="sm" className="mt-2">
          Add Focus Item
        </Button>
      </div>
    );
  }
  
  // Animate list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      {orderedFocusItems.map((focus) => (
        <motion.div
          key={focus.id}
          variants={item}
          className={`relative p-4 rounded-lg border ${
            focus.completed 
              ? 'bg-primary/5 border-primary/20' 
              : 'bg-card border-border'
          }`}
        >
          <div className="flex items-start gap-3">
            <Button
              size="icon"
              variant={focus.completed ? "default" : "outline"}
              className={`h-6 w-6 rounded-full ${
                !focus.completed ? 'border-dashed' : ''
              }`}
              onClick={() => handleComplete(focus.id)}
            >
              {focus.completed && <Check className="h-3 w-3" />}
            </Button>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className={`font-medium ${focus.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {focus.title}
                </h4>
                
                <div className="flex items-center text-xs text-muted-foreground">
                  {getPriorityIcon(focus.priority)}
                  <span className="ml-1">{getPriorityText(focus.priority)}</span>
                </div>
              </div>
              
              <p className={`text-sm ${focus.completed ? 'text-muted-foreground/70 line-through' : 'text-muted-foreground'}`}>
                {focus.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
      
      <div className="text-center pt-2">
        <Button variant="ghost" size="sm">
          View All Tasks
        </Button>
      </div>
    </motion.div>
  );
} 