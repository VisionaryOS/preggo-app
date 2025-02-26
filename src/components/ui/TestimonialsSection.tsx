'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    content: "This app has been my constant companion throughout my pregnancy. The weekly updates are so detailed and helpful, and I love connecting with other moms due around the same time as me.",
    author: "Sarah J.",
    role: "First-time mom, 28 weeks",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    content: "As a busy working mom expecting my second child, this app has been a lifesaver. The nutrition guides and meal plans have made it so much easier to stay healthy despite my hectic schedule.",
    author: "Michelle T.",
    role: "Second pregnancy, 34 weeks",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    id: 3,
    content: "I was feeling so anxious during my first trimester, but the supportive community here and the expert advice sections helped me feel more confident and prepared. Highly recommend!",
    author: "Jessica L.",
    role: "First-time mom, 18 weeks",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    id: 4,
    content: "The exercise routines are perfect for staying active safely. I appreciate that they're approved by healthcare professionals and adjust based on which trimester you're in.",
    author: "Alicia M.",
    role: "Fitness enthusiast, 24 weeks",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg"
  },
  {
    id: 5,
    content: "I love how personalized this app feels. It remembers my preferences and gives me relevant information exactly when I need it. It's like having a pregnancy coach in my pocket!",
    author: "Rachel K.",
    role: "Third-time mom, 30 weeks",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg"
  },
  {
    id: 6,
    content: "The symptom tracker has been invaluable for my doctor's appointments. I can show my OB exactly what I've been experiencing, which has led to much more productive visits.",
    author: "Emily P.",
    role: "High-risk pregnancy, 22 weeks",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg"
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 bg-[rgba(var(--color-muted),0.3)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-[rgb(var(--color-primary))] tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Loved by Mothers Everywhere
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Hear from real moms who are using MomCare to navigate their pregnancy journey.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="absolute -top-5 left-7">
                <svg width="45" height="36" className="text-[rgb(var(--color-primary))] opacity-20">
                  <path d="M13.415.001C6.07 5.185.887 13.681.887 23.041c0 7.632 4.608 12.096 9.936 12.096 5.04 0 8.784-4.032 8.784-8.784 0-4.752-3.312-8.208-7.632-8.208-.864 0-2.016.144-2.304.288.72-4.896 5.328-10.656 9.936-13.536L13.415.001zm24.768 0c-7.2 5.184-12.384 13.68-12.384 23.04 0 7.632 4.608 12.096 9.936 12.096 4.896 0 8.784-4.032 8.784-8.784 0-4.752-3.456-8.208-7.776-8.208-.864 0-1.872.144-2.16.288.72-4.896 5.184-10.656 9.792-13.536L38.183.001z" fill="currentColor" />
                </svg>
              </div>
              
              <div className="pt-8">
                <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-[rgba(var(--color-primary),0.1)]">
                    <div className="h-full w-full rounded-full bg-[rgba(var(--color-primary),0.2)] flex items-center justify-center">
                      <span className="text-[rgb(var(--color-primary))] font-bold">{testimonial.author.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">{testimonial.author}</h4>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 