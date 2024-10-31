'use client';

import { useState } from 'react';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="section-padding bg-gradient-to-br from-primary-dark via-primary-medium to-primary-light relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 mb-8 animate-fade-in">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-white font-medium">Limited Time: Get Early Access</span>
        </div>

        {/* Main Headline */}
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up leading-tight">
          Ready to Transform Your<br />
          Retail Operations?
        </h2>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-fade-in-up leading-relaxed">
          Join 500+ retailers already using ShelfSense to maximize revenue, reduce costs, and delight customers.
        </p>

        {/* Email Signup Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8 animate-fade-in-up">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your work email"
            required
            className="flex-1 px-8 py-5 rounded-full bg-white/95 backdrop-blur-sm border-2 border-white/50 focus:border-white focus:outline-none focus:ring-4 focus:ring-white/30 transition-all text-gray-900 placeholder-gray-500 text-lg"
          />
          <button
            type="submit"
            className="px-10 py-5 bg-white text-primary-dark rounded-full font-bold text-lg hover:bg-primary-cream hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
          >
            {submitted ? '✓ Welcome Aboard!' : 'Get Early Access'}
          </button>
        </form>

        {/* Trust Signals */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm animate-fade-in-up">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Free 14-day trial</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Setup in 24 hours</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-12 mt-16 pt-16 border-t border-white/20 animate-fade-in-up">
          <div>
            <div className="text-5xl font-bold text-white mb-2">98%</div>
            <div className="text-white/80">Detection Accuracy</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-white mb-2">45%</div>
            <div className="text-white/80">Avg. Revenue Increase</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-white mb-2">24/7</div>
            <div className="text-white/80">Real-Time Monitoring</div>
          </div>
        </div>
      </div>
    </section>
  );
}
