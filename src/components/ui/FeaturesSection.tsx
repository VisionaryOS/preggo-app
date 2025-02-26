'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, Title, Text, TabGroup, TabList, Tab, TabPanels, TabPanel } from '@tremor/react';

interface Feature {
  id: string;
  emoji: string;
  title: string;
  description: string;
  benefits: string[];
}

interface TrimesterFeature {
  emoji: string;
  title: string;
  description: string;
}

interface TrimesterFeatures {
  firstTrimester: TrimesterFeature[];
  secondTrimester: TrimesterFeature[];
  thirdTrimester: TrimesterFeature[];
}

const features: Feature[] = [
  {
    id: 'pregnancy-tracker',
    emoji: '📊',
    title: 'Week-by-Week Tracker',
    description: "Follow your baby's development with detailed insights for each week of pregnancy.",
    benefits: [
      "Know exactly what's happening with your baby's growth each week",
      "Understand the changes in your body and how to manage them",
      "Prepare ahead for important milestones and doctor appointments"
    ]
  },
  {
    id: 'nutrition-guide',
    emoji: '🥗',
    title: 'Nutrition Guide',
    description: 'Personalized meal plans and nutrition advice for each trimester.',
    benefits: [
      "Easy-to-follow meal plans optimized for your specific pregnancy stage",
      "Shopping lists that make grocery trips simple and effective",
      "Delicious recipes designed to provide essential nutrients for you and baby"
    ]
  },
  {
    id: 'exercise-plans',
    emoji: '🧘‍♀️',
    title: 'Safe Exercise Plans',
    description: 'Stay active with exercise routines specifically designed for pregnant women.',
    benefits: [
      "Doctor-approved exercises that are safe for each trimester",
      "Workouts that help reduce common pregnancy discomforts",
      "Preparation for labor with targeted strength and breathing exercises"
    ]
  },
  {
    id: 'community',
    emoji: '👩‍👩‍👧‍👧',
    title: 'Mom Community',
    description: 'Connect with other expecting mothers at similar stages.',
    benefits: [
      "Share your journey with moms who understand exactly what you're going through",
      "Get real-life advice and recommendations from those who've been there",
      "Build lasting friendships that continue after your babies arrive"
    ]
  },
  {
    id: 'health-monitoring',
    emoji: '💓',
    title: 'Health Monitoring',
    description: 'Track important health metrics throughout your pregnancy.',
    benefits: [
      "Easy logging of weight, blood pressure, and other vital metrics",
      "Symptom tracker to discuss with your healthcare provider",
      "Automatic notifications for concerning changes that need attention"
    ]
  },
  {
    id: 'expert-advice',
    emoji: '👩‍⚕️',
    title: 'Expert Guidance',
    description: 'Access to articles, videos, and tips from OB-GYNs and midwives.',
    benefits: [
      "Medical information translated into easy-to-understand language",
      "Access to a library of expert-reviewed articles on every pregnancy topic",
      "Video tutorials for breathing techniques, birthing positions, and more"
    ]
  }
];

// Features organized by trimester for the tab view
const trimesterFeatures: TrimesterFeatures = {
  firstTrimester: [
    {
      emoji: '🤢',
      title: 'Morning Sickness Management',
      description: 'Natural remedies and tips to help you manage nausea and maintain nutrition.'
    },
    {
      emoji: '💤',
      title: 'Fatigue Solutions',
      description: 'Strategies to cope with first-trimester exhaustion while maintaining your daily life.'
    },
    {
      emoji: '🗓️',
      title: 'Appointment Scheduler',
      description: 'Keeps track of your first vital doctor visits and reminds you of key screenings.'
    }
  ],
  secondTrimester: [
    {
      emoji: '👶',
      title: 'Baby Movement Tracker',
      description: 'Start monitoring those exciting first kicks and movements.'
    },
    {
      emoji: '🛍️',
      title: 'Maternity Essentials Guide',
      description: 'Shopping guidance for comfortable clothes and pregnancy necessities.'
    },
    {
      emoji: '📸',
      title: 'Pregnancy Photoshoot Ideas',
      description: 'Creative ways to document your growing bump during the "golden trimester."'
    }
  ],
  thirdTrimester: [
    {
      emoji: '🛌',
      title: 'Sleep Support System',
      description: 'Techniques and position guides for better sleep as your belly grows.'
    },
    {
      emoji: '🏥',
      title: 'Birth Plan Creator',
      description: 'Interactive tool to develop and share your ideal birth experience with your providers.'
    },
    {
      emoji: '🧸',
      title: 'Hospital Bag Checklist',
      description: "Comprehensive, customizable list so you're ready when the big day arrives."
    }
  ]
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Text className="text-indigo-600 font-semibold tracking-wide uppercase">Features</Text>
          <Title className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Everything You Need on Your Motherhood Journey
          </Title>
          <Text className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Designed by mothers, for mothers - with the tools and support you need at every stage.
          </Text>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card decoration="top" decorationColor="indigo" className="h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-3">{feature.emoji}</div>
                    <Title className="text-lg font-semibold">{feature.title}</Title>
                  </div>
                  <Text className="mb-4">{feature.description}</Text>
                  
                  <div className="mt-auto">
                    <Text className="font-medium text-indigo-600 mb-2">Why mothers love this:</Text>
                    <ul className="space-y-2 ml-1">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-indigo-500 mr-2">✓</span>
                          <Text className="text-sm">{benefit}</Text>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Trimester-specific features with Tremor Tabs */}
        <div className="mt-24">
          <div className="text-center mb-8">
            <Title className="text-2xl font-bold text-gray-900">
              Support That Evolves With Your Pregnancy
            </Title>
            <Text className="text-gray-600">
              Our app adapts to your changing needs throughout your pregnancy journey
            </Text>
          </div>
          
          <Card>
            <TabGroup>
              <TabList className="mb-6">
                <Tab>First Trimester</Tab>
                <Tab>Second Trimester</Tab>
                <Tab>Third Trimester</Tab>
              </TabList>
              <TabPanels>
                {(Object.keys(trimesterFeatures) as Array<keyof TrimesterFeatures>).map((trimester, i) => (
                  <TabPanel key={i}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {trimesterFeatures[trimester].map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          className="text-center p-4"
                        >
                          <div className="text-3xl mb-2">{item.emoji}</div>
                          <Text className="font-semibold">{item.title}</Text>
                          <Text className="text-sm text-gray-500">{item.description}</Text>
                        </motion.div>
                      ))}
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>
          </Card>
        </div>
        
        {/* CTA Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <Card className="bg-indigo-50 border-0">
            <div className="text-center py-6">
              <Title className="text-indigo-800">Ready to start your journey?</Title>
              <Text className="mb-6">Join thousands of mothers who trust our app every day</Text>
              <Link 
                href="#get-started" 
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get Started Free ✨
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection; 