"use client";

import { motion } from "framer-motion";
import { Card, Title, Text, Divider, Metric } from "@tremor/react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  emoji: string;
  highlight: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "First-time mom",
    content:
      "The week-by-week guides helped me understand exactly what was happening with my baby. I felt more confident talking to my doctor because I knew what questions to ask.",
    emoji: "👶",
    highlight: "Empowered me during doctor visits",
  },
  {
    name: "Maria Rodriguez",
    role: "Mom of two",
    content:
      "The nutrition recommendations were game-changers for my second pregnancy. I had much less morning sickness and more energy compared to my first pregnancy journey.",
    emoji: "🥗",
    highlight: "Better nutrition, easier pregnancy",
  },
  {
    name: "Taylor Williams",
    role: "Single mom",
    content:
      "The community feature connected me with other single moms. Having that support system made all the difference during those challenging moments.",
    emoji: "👩‍👧",
    highlight: "Found my support system",
  },
  {
    name: "Jennifer Lee",
    role: "35-week pregnant",
    content:
      "I love how the app adapts to each stage of pregnancy. The third-trimester exercises have helped tremendously with my back pain and sleep quality.",
    emoji: "🧘‍♀️",
    highlight: "Personalized to my needs",
  },
  {
    name: "Aisha Thomas",
    role: "Working mom",
    content:
      "Being able to track my appointments, symptoms, and questions all in one place makes managing pregnancy alongside my career so much easier.",
    emoji: "📱",
    highlight: "Simplified my pregnancy management",
  },
  {
    name: "Rebecca Chen",
    role: "High-risk pregnancy",
    content:
      "The symptom tracking feature helped me notice patterns that I shared with my specialist. We caught an issue early that could have been much worse.",
    emoji: "💓",
    highlight: "Early detection of complications",
  },
];

const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="py-24 bg-gradient-to-b from-white to-indigo-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Text className="text-indigo-600 font-semibold tracking-wide uppercase">
              Testimonials
            </Text>
            <Title className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Loved by Mothers Everywhere
            </Title>
            <Text className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Hear from real moms who have transformed their pregnancy journey
              with our app.
            </Text>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{testimonial.emoji}</div>
                  <div>
                    <Text className="font-semibold">{testimonial.name}</Text>
                    <Text className="text-sm text-gray-500">
                      {testimonial.role}
                    </Text>
                  </div>
                </div>

                <Divider />

                <div className="flex-grow py-4">
                  <Text className="italic">
                    &quot;{testimonial.content}&quot;
                  </Text>
                </div>

                <div className="mt-auto pt-4">
                  <Card
                    decoration="top"
                    decorationColor="indigo"
                    className="bg-indigo-50 border-0"
                  >
                    <Text className="text-indigo-800 font-medium">
                      {testimonial.highlight}
                    </Text>
                  </Card>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-20"
        >
          <Card className="inline-block max-w-2xl mx-auto p-6">
            <Metric className="text-indigo-800">96%</Metric>
            <Title className="text-xl">of mothers recommend our app</Title>
            <Divider />
            <div className="flex justify-center gap-8 mt-4">
              <div className="text-center">
                <Metric>4.9/5</Metric>
                <Text className="text-sm">App Store</Text>
              </div>
              <div className="text-center">
                <Metric>4.8/5</Metric>
                <Text className="text-sm">Google Play</Text>
              </div>
              <div className="text-center">
                <Metric>10k+</Metric>
                <Text className="text-sm">Active Users</Text>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
