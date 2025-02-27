'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Create avatar fallback based on name
const getInitials = (name: string) => {
  return name.substring(0, 2).toUpperCase();
};

// Generate a random pastel color based on name
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-pink-200 text-pink-800',
    'bg-blue-200 text-blue-800',
    'bg-green-200 text-green-800',
    'bg-purple-200 text-purple-800',
    'bg-yellow-200 text-yellow-800',
  ];
  
  // Use name's character code to pick a color
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

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
        <motion.h2 
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          What Mothers Say
        </motion.h2>
        <motion.p 
          className="text-muted-foreground mt-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Experiences from our community
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => {
          const avatarColor = getAvatarColor(testimonial.name);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardDescription className="italic text-base">"{testimonial.quote}"</CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center gap-4 pt-4">
                  <Avatar>
                    <AvatarFallback className={avatarColor}>
                      {getInitials(testimonial.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
} 