'use client';

import { motion } from 'framer-motion';
import { Button, Card, Title, Text } from '@tremor/react';

const HeroSection = () => {
  return (
    <section className="relative py-20 sm:py-32 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      {/* Background pattern/decoration - subtle and modern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl">
          <svg className="w-full" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H1200V600H0V0Z" fill="url(#grid-pattern)" />
            <defs>
              <pattern id="grid-pattern" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="scale(2) rotate(0)">
                <rect x="19" y="19" width="2" height="2" rx="1" fill="currentColor" />
              </pattern>
            </defs>
          </svg>
        </div>
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center space-y-8">
          {/* Main headline with emoji */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="inline-block text-5xl sm:text-6xl mb-4">
              👶 🤰 💕
            </div>
            <Title className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-indigo-900">
              Your Pregnancy Journey Made Beautiful
            </Title>
            <Text className="mt-6 text-lg leading-8 text-gray-700 max-w-3xl mx-auto">
              Supporting you with personalized care, guidance, and a vibrant community throughout every step of motherhood. Because every mom deserves the best.
            </Text>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button 
              size="lg"
              variant="primary" 
              className="bg-indigo-600 hover:bg-indigo-700 shadow-lg"
            >
              Start Your Journey Free ✨
            </Button>
            <Button 
              size="lg"
              variant="secondary"
              className="border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              See How It Works 📱
            </Button>
          </motion.div>
          
          {/* Trust indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-8"
          >
            <Text className="text-sm font-medium text-gray-500 mb-4">
              Trusted by 10,000+ mothers around the world
            </Text>
            <div className="flex items-center justify-center gap-4">
              <Card 
                decoration="top"
                decorationColor="indigo"
                className="max-w-xs p-4 shadow-sm"
              >
                <div className="flex flex-col items-center">
                  <div className="text-2xl mb-2">⭐⭐⭐⭐⭐</div>
                  <Text className="font-semibold">4.9/5 from 2,000+ reviews</Text>
                  <Text className="text-xs text-gray-500">Verified mothers</Text>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Key benefits highlight */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8"
          >
            <div className="text-center p-4">
              <div className="text-3xl mb-2">📊</div>
              <Text className="font-medium">Week-by-Week Tracking</Text>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">👩‍👩‍👧‍👧</div>
              <Text className="font-medium">Mother Community</Text>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">👩‍⚕️</div>
              <Text className="font-medium">Expert Guidance</Text>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 