'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, HeartPulse, Users, Apple } from 'lucide-react';

const features = [
  {
    title: 'Personalized Tracking',
    description: 'Custom insights and guidance for your unique pregnancy experience.',
    icon: CalendarDays
  },
  {
    title: 'Health & Symptoms',
    description: 'Easily monitor your well-being and share insights with your doctor.',
    icon: HeartPulse
  },
  {
    title: 'Supportive Community',
    description: 'Connect with women at your exact stage of pregnancy.',
    icon: Users
  },
  {
    title: 'Nutrition & Wellness',
    description: 'Meal plans and self-care routines designed for pregnancy.',
    icon: Apple
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Key Features</h2>
        <p className="text-muted-foreground mt-2">Everything you need for a healthy pregnancy</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={index} 
              className="group transition-all duration-300 hover:shadow-md hover:border-primary/20"
            >
              <CardHeader className="pb-2">
                <div className="mb-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Icon size={22} />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
} 