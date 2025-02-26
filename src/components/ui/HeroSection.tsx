'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-b from-[rgba(var(--background-start-rgb),0.9)] to-[rgba(var(--background-end-rgb),0.9)] pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      {/* Background pattern/decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <svg className="absolute left-0 top-0 h-[500px] w-[500px] translate-x-[-50%] translate-y-[-20%] text-[rgba(var(--color-primary),0.2)]" aria-hidden="true" viewBox="0 0 512 512">
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512Z" fill="currentColor" />
        </svg>
        <svg className="absolute right-0 bottom-0 h-[500px] w-[500px] translate-x-[50%] translate-y-[20%] text-[rgba(var(--color-secondary),0.2)]" aria-hidden="true" viewBox="0 0 512 512">
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512Z" fill="currentColor" />
        </svg>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left column with text content */}
          <motion.div 
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[rgb(var(--color-primary))]">
              Your Pregnancy Journey <span className="text-gray-800">Made Beautiful</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Supporting expecting mothers with personalized care, guidance, and a vibrant community throughout your pregnancy journey.
            </p>
            <div className="mt-10 flex gap-6 flex-col sm:flex-row justify-center md:justify-start">
              <Link href="#get-started" className="btn-primary">
                Get Started Free
              </Link>
              <Link href="#learn-more" className="btn-secondary">
                Learn More
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex flex-col items-center md:items-start">
              <p className="text-sm font-medium text-gray-500">Trusted by thousands of moms</p>
              <div className="mt-4 flex space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[rgb(var(--color-${i % 2 ? 'primary' : 'secondary'}))]`}>
                      <span className="sr-only">User avatar</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-600">4.9/5 • 2,000+ reviews</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right column with image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="aspect-[4/3] bg-[rgba(var(--color-primary),0.1)] rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-full w-full">
                  {/* Placeholder for a pregnancy-related image */}
                  <div className="absolute inset-0 flex items-center justify-center bg-[rgba(var(--color-primary),0.08)] text-center p-8">
                    <p className="text-gray-500 italic">
                      [Here will be a beautiful image of a pregnant woman using the app, showing features like tracking, community support, and expert advice]
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[rgba(var(--color-primary),0.2)] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[rgb(var(--color-primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Week tracking</p>
                <p className="text-xs text-gray-500">Know what to expect</p>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[rgba(var(--color-secondary),0.2)] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[rgb(var(--color-secondary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Community</p>
                <p className="text-xs text-gray-500">Connect with other moms</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 