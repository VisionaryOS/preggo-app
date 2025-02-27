'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useJourney } from '@/context/JourneyContext';
import { motion } from 'framer-motion';

type Mood = 'great' | 'good' | 'okay' | 'challenging' | 'difficult';

interface MoodOption {
  value: Mood;
  label: string;
  emoji: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  { value: 'great', label: 'Great', emoji: '😄', color: 'bg-green-100 border-green-300 hover:bg-green-200' },
  { value: 'good', label: 'Good', emoji: '🙂', color: 'bg-blue-100 border-blue-300 hover:bg-blue-200' },
  { value: 'okay', label: 'Okay', emoji: '😐', color: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200' },
  { value: 'challenging', label: 'Challenging', emoji: '😟', color: 'bg-orange-100 border-orange-300 hover:bg-orange-200' },
  { value: 'difficult', label: 'Difficult', emoji: '😢', color: 'bg-red-100 border-red-300 hover:bg-red-200' },
];

export default function MoodCheck() {
  const { logMood } = useJourney();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      logMood({
        mood: selectedMood,
        notes: '',
      });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full py-6 space-y-3 text-center"
      >
        <div className="text-4xl">
          {moodOptions.find(m => m.value === selectedMood)?.emoji}
        </div>
        <p className="font-medium">Thanks for checking in!</p>
        <p className="text-sm text-muted-foreground">Your mood has been logged for today.</p>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setSubmitted(false)}
        >
          Update
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {moodOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleMoodSelect(option.value)}
            className={`flex flex-col items-center justify-center p-2 rounded-md border transition-colors ${
              selectedMood === option.value 
                ? `${option.color} ring-2 ring-offset-1 ring-primary` 
                : 'bg-background hover:bg-muted border-border'
            }`}
          >
            <span className="text-2xl mb-1">{option.emoji}</span>
            <span className="text-xs font-medium">{option.label}</span>
          </button>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={!selectedMood}
          size="sm"
        >
          Log Mood
        </Button>
      </div>
    </div>
  );
} 