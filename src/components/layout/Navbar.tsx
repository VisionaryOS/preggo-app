'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-[rgb(var(--color-primary))] flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </span>
              <span className="text-xl font-semibold text-[rgb(var(--color-primary))]">MomCare</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-[rgb(var(--color-primary))] transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-700 hover:text-[rgb(var(--color-primary))] transition-colors">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-gray-700 hover:text-[rgb(var(--color-primary))] transition-colors">
              Testimonials
            </Link>
            <Link href="#faq" className="text-gray-700 hover:text-[rgb(var(--color-primary))] transition-colors">
              FAQ
            </Link>
            <Link href="#contact" className="btn-primary">
              Get Started
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[rgb(var(--color-primary))] focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden bg-white shadow-xl"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="#features" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[rgb(var(--color-primary))] hover:bg-gray-50"
              onClick={toggleMenu}
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[rgb(var(--color-primary))] hover:bg-gray-50"
              onClick={toggleMenu}
            >
              How It Works
            </Link>
            <Link 
              href="#testimonials" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[rgb(var(--color-primary))] hover:bg-gray-50"
              onClick={toggleMenu}
            >
              Testimonials
            </Link>
            <Link 
              href="#faq" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[rgb(var(--color-primary))] hover:bg-gray-50"
              onClick={toggleMenu}
            >
              FAQ
            </Link>
            <Link 
              href="#contact" 
              className="block px-3 py-2 rounded-md text-base font-medium bg-[rgb(var(--color-primary))] text-white"
              onClick={toggleMenu}
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar; 