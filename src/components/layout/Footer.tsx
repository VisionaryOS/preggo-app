'use client';

import Link from 'next/link';
import { Text } from '@tremor/react';

const Footer = () => {
  return (
    <footer className="bg-indigo-900 text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center">
              <span className="text-3xl mr-2">👶</span>
              <span className="font-bold text-xl">MomCare</span>
            </Link>
            <Text className="mt-4 text-indigo-100">
              Supporting mothers through every step of their pregnancy journey with care, expertise, and community.
            </Text>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-indigo-100 hover:text-white">
                <span className="sr-only">Facebook</span>
                <span className="text-2xl">📱</span>
              </a>
              <a href="#" className="text-indigo-100 hover:text-white">
                <span className="sr-only">Instagram</span>
                <span className="text-2xl">📷</span>
              </a>
              <a href="#" className="text-indigo-100 hover:text-white">
                <span className="sr-only">Twitter</span>
                <span className="text-2xl">🐦</span>
              </a>
            </div>
          </div>
          
          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-indigo-100 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-indigo-100 hover:text-white transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-indigo-100 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-indigo-100 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#about" className="text-indigo-100 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#careers" className="text-indigo-100 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#blog" className="text-indigo-100 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-indigo-100 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#help" className="text-indigo-100 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="text-indigo-100 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="text-indigo-100 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#accessibility" className="text-indigo-100 hover:text-white transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="border-t border-indigo-800 pt-8 pb-12">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">Subscribe to our newsletter</h3>
            <Text className="text-indigo-100 mb-4">
              Get the latest updates, tips and special offers sent directly to your inbox.
            </Text>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md flex-grow text-gray-900"
                required
              />
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-indigo-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-indigo-300">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} MomCare. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-indigo-300 hover:text-white transition-colors">
              Privacy
            </a>
            <span className="text-indigo-600">•</span>
            <a href="#" className="text-indigo-300 hover:text-white transition-colors">
              Terms
            </a>
            <span className="text-indigo-600">•</span>
            <a href="#" className="text-indigo-300 hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 