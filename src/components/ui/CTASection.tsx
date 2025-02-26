'use client';

import { motion } from 'framer-motion';
import { Card, Title, Text, Grid, Col, Button, Metric, Divider } from '@tremor/react';

const CTASection = () => {
  return (
    <section id="get-started" className="py-24 bg-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Title className="text-3xl sm:text-4xl font-bold text-indigo-900">
            Start Your Motherhood Journey Today
          </Title>
          <Text className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of mothers who trust our app to guide them through every step of pregnancy and early motherhood.
          </Text>
        </motion.div>

        <Grid numItems={1} numItemsMd={2} className="gap-8">
          <Col>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-3">🎁</div>
                  <Title>Free Plan</Title>
                </div>
                <Divider />
                <Metric className="my-4">$0 <span className="text-sm font-normal text-gray-500">/month</span></Metric>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <Text>Week-by-week pregnancy tracking</Text>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <Text>Basic health monitoring</Text>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <Text>Community forums access</Text>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <Text>Essential pregnancy information</Text>
                  </div>
                </div>
                <Button 
                  size="lg"
                  variant="primary"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Get Started Free ✨
                </Button>
              </Card>
            </motion.div>
          </Col>

          <Col>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full border-2 border-indigo-200 relative">
                <div className="absolute -top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular 💖
                </div>
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-3">👑</div>
                  <Title>Premium Plan</Title>
                </div>
                <Divider />
                <Metric className="my-4">$4.99 <span className="text-sm font-normal text-gray-500">/month</span></Metric>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <Text><span className="font-medium">Everything in Free plan, plus:</span></Text>
                  </div>
                  <div className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <Text>Personalized nutrition & meal plans</Text>
                  </div>
                  <div className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <Text>Direct Q&A with pregnancy experts</Text>
                  </div>
                  <div className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <Text>Advanced health analytics & insights</Text>
                  </div>
                  <div className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <Text>Ad-free experience with premium content</Text>
                  </div>
                </div>
                <Button 
                  size="lg"
                  variant="primary"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Try Premium Free for 7 Days ✨
                </Button>
                <Text className="text-center text-sm mt-3 text-gray-500">
                  No credit card required for trial
                </Text>
              </Card>
            </motion.div>
          </Col>
        </Grid>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <Text className="text-gray-600 max-w-xl mx-auto mb-6">
            Join over 10,000 mothers who have trusted our app to support them through their pregnancy journey. Download now and start experiencing the difference.
          </Text>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">📱</div>
              <div className="text-left">
                <Text className="font-medium">iOS & Android</Text>
                <Text className="text-sm text-gray-500">Available on all devices</Text>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🔒</div>
              <div className="text-left">
                <Text className="font-medium">Secure & Private</Text>
                <Text className="text-sm text-gray-500">Your data stays private</Text>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-2xl">❤️</div>
              <div className="text-left">
                <Text className="font-medium">Expert Support</Text>
                <Text className="text-sm text-gray-500">Backed by professionals</Text>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection; 