'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section id="get-started" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-1/4 w-1/3 h-1/3 bg-[rgba(var(--color-primary),0.08)] rounded-full blur-3xl transform translate-x-1/2"></div>
        <div className="absolute left-0 bottom-1/4 w-1/3 h-1/3 bg-[rgba(var(--color-secondary),0.08)] rounded-full blur-3xl transform -translate-x-1/2"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-12 sm:px-12 sm:py-16 md:py-20 md:px-16 lg:flex lg:items-center">
            <div className="lg:w-2/3 lg:pr-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  <span className="block">Ready to start your</span>
                  <span className="block text-[rgb(var(--color-primary))]">pregnancy journey with expert guidance?</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-gray-500">
                  Join thousands of expecting mothers who use MomCare to navigate their pregnancy with confidence. 
                  Sign up today for free and get access to all our features.
                </p>
                <div className="mt-8 space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                  <Link href="#signup" className="btn-primary block text-center sm:inline-flex sm:items-center sm:justify-center">
                    Get Started Free
                  </Link>
                  <Link href="#contact" className="btn-secondary block text-center sm:inline-flex sm:items-center sm:justify-center">
                    Contact Support
                  </Link>
                </div>
              </motion.div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/3">
              <motion.div
                className="bg-[rgba(var(--color-primary),0.1)] rounded-xl p-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sign up for updates</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Stay informed about new features and pregnancy resources.
                  </p>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="email" className="sr-only">Email address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[rgb(var(--color-primary))] focus:border-[rgb(var(--color-primary))] placeholder-gray-400"
                        placeholder="Enter your email"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[rgb(var(--color-primary))] text-white rounded-lg px-4 py-3 font-medium hover:bg-[rgb(var(--color-primary))] hover:opacity-90 transition-opacity"
                    >
                      Subscribe
                    </button>
                  </form>
                  <p className="mt-4 text-xs text-gray-500">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 