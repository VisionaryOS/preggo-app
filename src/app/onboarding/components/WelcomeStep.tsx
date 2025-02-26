'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div 
      className="flex-1 flex flex-col"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div variants={fadeInUp} className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
        <p className="text-gray-600">
          Let's set up your pregnancy journey together. We'll help you track important milestones, 
          log your symptoms, and keep you informed with week-by-week insights.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} className="mb-8">
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h2 className="text-xl font-semibold mb-4">What you'll get:</h2>
          <ul className="space-y-3">
            {[
              'Personalized pregnancy timeline based on your due date',
              'Week-by-week updates on your baby\'s development',
              'Symptom and health tracking tools',
              'Appointment reminders',
              'Nutrition and exercise guidance',
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-3 text-green-500 flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="mt-auto">
        <p className="text-sm text-gray-500 mb-6">
          This will only take a few minutes. Let's create your personalized pregnancy journey!
        </p>
        <Button 
          onClick={onNext} 
          className="w-full py-6 text-lg"
        >
          Get Started
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
} 