'use client';

import { useState } from 'react';

export default function Hero() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="relative pt-24 pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24 overflow-hidden min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border-2 border-primary-mint/40 rounded-full px-5 py-2.5 animate-fade-in shadow-lg">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-gray-800">Trusted by 500+ retailers worldwide</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight animate-fade-in-up tracking-tight">
              <span className="block text-gray-700 font-normal">Transform Your</span>
              <span className="block gradient-text mt-1 font-black">Retail Intelligence</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl animate-fade-in-up font-medium">
              Real-time shelf monitoring powered by AI. Detect out-of-stocks, measure compliance, and boost revenue—all from a single platform.
            </p>

            {/* Email Signup Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg animate-fade-in-up">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                required
                className="flex-1 px-6 py-4 rounded-full bg-white border-2 border-primary-teal/40 focus:border-primary-teal focus:outline-none focus:ring-4 focus:ring-primary-mint/30 transition-all text-gray-900 placeholder-gray-600 font-medium shadow-md"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-primary-teal text-white rounded-full font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap hover:bg-primary-mint"
              >
                {submitted ? '✓ Joined Waitlist!' : 'Join Waitlist'}
              </button>
            </form>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-8 pt-4 animate-fade-in-up">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-primary-mint" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700 font-bold">No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-primary-mint" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700 font-bold">14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-primary-mint" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700 font-bold">Setup in minutes</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual/Dashboard Mockup */}
          <div className="relative animate-fade-in-right">
            {/* Floating Cards */}
            <div className="relative w-full aspect-square max-w-xl mx-auto">
              {/* Main Dashboard Card */}
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-primary-medium/20 p-8 transform hover:scale-105 transition-transform duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Live Dashboard</h3>
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                  
                  {/* Mock Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-primary-cream to-white p-4 rounded-xl">
                      <div className="text-sm text-gray-600 font-medium">Availability</div>
                      <div className="text-3xl font-bold gradient-text mt-1">96.8%</div>
                      <div className="text-xs text-green-600 mt-1">↑ 2.3% vs last week</div>
                    </div>
                    <div className="bg-gradient-to-br from-primary-light/30 to-white p-4 rounded-xl">
                      <div className="text-sm text-gray-600 font-medium">Out of Stock</div>
                      <div className="text-3xl font-bold text-primary-dark mt-1">24</div>
                      <div className="text-xs text-red-600 mt-1">↓ 8 items today</div>
                    </div>
                  </div>

                  {/* Mock Chart */}
                  <div className="bg-gradient-to-br from-primary-cream to-white p-4 rounded-xl">
                    <div className="text-sm text-gray-600 font-medium mb-3">Weekly Performance</div>
                    <div className="flex items-end space-x-2 h-32">
                      {[65, 78, 82, 75, 88, 92, 96].map((height, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-primary-dark to-primary-medium rounded-t-lg animate-fade-in-up" style={{height: `${height}%`, animationDelay: `${i * 0.1}s`}}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Alert Card */}
              <div className="absolute -right-4 top-16 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-primary-medium/20 p-4 animate-float transform hover:scale-110 transition-transform duration-300">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">Low Stock Alert</div>
                    <div className="text-xs text-gray-600 mt-1">Aisle 4B - Restock needed</div>
                    <div className="text-xs text-gray-500 mt-2">2 mins ago</div>
                  </div>
                </div>
              </div>

              {/* Floating Success Card */}
              <div className="absolute -left-4 bottom-16 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-primary-medium/20 p-4 animate-float transform hover:scale-110 transition-transform duration-300" style={{animationDelay: '1s'}}>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">Compliance Check</div>
                    <div className="text-xs text-gray-600 mt-1">Planogram 98% accurate</div>
                    <div className="text-xs text-gray-500 mt-2">5 mins ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-primary-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
