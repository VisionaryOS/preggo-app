'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'Personalized Tracking',
    description: 'Custom insights and guidance for your unique pregnancy experience.'
  },
  {
    title: 'Health & Symptoms',
    description: 'Easily monitor your well-being and share insights with your doctor.'
  },
  {
    title: 'Supportive Community',
    description: 'Connect with women at your exact stage of pregnancy.'
  },
  {
    title: 'Nutrition & Wellness',
    description: 'Meal plans and self-care routines designed for pregnancy.'
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
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
} 