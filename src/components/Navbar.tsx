'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 animate-fade-in">
            <a href="#" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-primary-teal rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                ShelfSense
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 animate-fade-in">
            <a href="#features" className="text-gray-800 hover:text-primary-teal transition-colors duration-200 font-semibold">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-800 hover:text-primary-teal transition-colors duration-200 font-semibold">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-800 hover:text-primary-teal transition-colors duration-200 font-semibold">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-800 hover:text-primary-teal transition-colors duration-200 font-semibold">
              Testimonials
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4 animate-fade-in">
            <button className="px-6 py-2.5 text-gray-700 font-semibold hover:text-primary-teal transition-colors duration-200">
              Sign In
            </button>
            <button className="px-6 py-2.5 bg-primary-teal text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-light/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-primary-medium/20 animate-fade-in-down">
          <div className="px-6 py-4 space-y-3">
            <a href="#features" className="block py-2 text-gray-700 hover:text-primary-dark transition-colors font-medium">
              Features
            </a>
            <a href="#how-it-works" className="block py-2 text-gray-700 hover:text-primary-dark transition-colors font-medium">
              How It Works
            </a>
            <a href="#pricing" className="block py-2 text-gray-700 hover:text-primary-dark transition-colors font-medium">
              Pricing
            </a>
            <a href="#testimonials" className="block py-2 text-gray-700 hover:text-primary-dark transition-colors font-medium">
              Testimonials
            </a>
            <div className="pt-4 space-y-2 border-t border-primary-medium/20">
              <button className="w-full py-2.5 text-primary-dark font-medium hover:bg-primary-light/20 rounded-lg transition-colors">
                Sign In
              </button>
              <button className="w-full py-2.5 bg-gradient-to-r from-primary-dark to-primary-medium text-white rounded-lg font-medium hover:shadow-lg transition-all">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
