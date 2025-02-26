'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';

const testimonials = [
  {
    quote: "This app has been my daily companion throughout my pregnancy. The weekly updates are so detailed.",
    name: "Sarah",
    role: "First-time mom"
  },
  {
    quote: "I love how the nutrition guides are actually realistic! The community has become my support system.",
    name: "Emma",
    role: "Due in July"
  },
  {
    quote: "After using three different pregnancy apps with my first baby, this is the only one I'm using this time.",
    name: "Michelle",
    role: "Second pregnancy"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">What Mothers Say</h2>
        <p className="text-muted-foreground mt-2">Experiences from our community</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="h-full">
            <CardHeader>
              <CardDescription className="italic">"{testimonial.quote}"</CardDescription>
            </CardHeader>
            <CardFooter>
              <div>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
} 