import { ReactNode } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Get Started | Preggo App',
  description: 'Complete your profile and start tracking your pregnancy journey',
};

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Illustration/Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-pink-100 to-purple-100 flex-col items-center justify-center p-12 relative">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <Link href="/" className="inline-block">
              <Image 
                src="/logo.svg" 
                alt="Preggo App" 
                width={180} 
                height={60}
                className="mx-auto"
                priority
              />
            </Link>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Pregnancy Journey Starts Here</h2>
          <p className="text-gray-600 mb-8">
            Track your pregnancy milestones, manage appointments, and get personalized insights tailored to your journey.
          </p>
          <div className="mt-12 relative h-80">
            <Image
              src="/onboarding-illustration.svg"
              alt="Pregnancy journey illustration"
              fill
              style={{ objectFit: 'contain' }}
              priority
              className="drop-shadow-md"
            />
          </div>
        </div>
        <div className="absolute bottom-8 text-sm text-gray-500">
          © {new Date().getFullYear()} Preggo App. All rights reserved.
        </div>
      </div>

      {/* Right side - Onboarding Content */}
      <div className="flex-1 flex flex-col p-6 md:p-12 overflow-y-auto">
        <div className="md:hidden mb-8 flex justify-center">
          <Link href="/" className="inline-block">
            <Image 
              src="/logo.svg" 
              alt="Preggo App" 
              width={140} 
              height={40}
              priority
            />
          </Link>
        </div>
        
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
          {children}
        </div>
        
        <div className="md:hidden mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Preggo App. All rights reserved.
        </div>
      </div>
    </div>
  );
} 