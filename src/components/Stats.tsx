'use client';

import { useEffect, useState, useRef } from 'react';

interface StatProps {
  end: number;
  duration: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedNumber({ end, duration, suffix = '', prefix = '' }: StatProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <div ref={ref} className="text-5xl md:text-6xl font-bold gradient-text">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

export default function Stats() {
  const logos = [
    {
      name: 'Kroger',
      logo: (
        <svg viewBox="0 0 200 60" className="h-8 w-auto">
          <rect width="200" height="60" fill="#0033A0"/>
          <text x="100" y="38" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="white" textAnchor="middle">Kroger</text>
        </svg>
      )
    },
    {
      name: 'Safeway',
      logo: (
        <svg viewBox="0 0 200 60" className="h-8 w-auto">
          <rect width="200" height="60" fill="#E31837"/>
          <text x="100" y="38" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle">SAFEWAY</text>
        </svg>
      )
    },
    {
      name: 'CVS',
      logo: (
        <svg viewBox="0 0 200 60" className="h-8 w-auto">
          <rect width="200" height="60" fill="#CC0000"/>
          <text x="30" y="42" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold" fill="white">CVS</text>
          <text x="120" y="42" fontFamily="Arial, sans-serif" fontSize="18" fill="white">pharmacy</text>
        </svg>
      )
    },
    {
      name: 'Walgreens',
      logo: (
        <svg viewBox="0 0 200 60" className="h-8 w-auto">
          <rect width="200" height="60" fill="#E41B13"/>
          <text x="100" y="35" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="bold" fill="white" textAnchor="middle">Walgreens</text>
        </svg>
      )
    },
    {
      name: 'Meijer',
      logo: (
        <svg viewBox="0 0 200 60" className="h-8 w-auto">
          <rect width="200" height="60" fill="#FFD100"/>
          <text x="100" y="38" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="bold" fill="#CC0000" textAnchor="middle">meijer</text>
        </svg>
      )
    },
    {
      name: 'Target',
      logo: (
        <svg viewBox="0 0 200 60" className="h-8 w-auto">
          <rect width="200" height="60" fill="#CC0000"/>
          <circle cx="35" cy="30" r="18" fill="white"/>
          <circle cx="35" cy="30" r="14" fill="#CC0000"/>
          <circle cx="35" cy="30" r="8" fill="white"/>
          <text x="75" y="40" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="white">Target</text>
        </svg>
      )
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Stats Grid with Icons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-20">
          {/* Stat 1 */}
          <div className="text-center space-y-3 p-8 bg-white rounded-2xl border-2 border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-200 animate-fade-in-up group">
            <div className="w-16 h-16 mx-auto bg-primary-teal rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <AnimatedNumber end={500} duration={2000} suffix="+" />
            <div className="text-lg font-bold text-gray-900">Active Retailers</div>
            <p className="text-sm text-gray-600 font-medium">Across 15 countries</p>
          </div>

          {/* Stat 2 */}
          <div className="text-center space-y-3 p-8 bg-white rounded-2xl border-2 border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-200 animate-fade-in-up group" style={{animationDelay: '0.1s'}}>
            <div className="w-16 h-16 mx-auto bg-primary-mint rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <AnimatedNumber end={98} duration={2000} suffix="%" />
            <div className="text-lg font-bold text-gray-900">Accuracy Rate</div>
            <p className="text-sm text-gray-600 font-medium">In product detection</p>
          </div>

          {/* Stat 3 */}
          <div className="text-center space-y-3 p-8 bg-white rounded-2xl border-2 border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-200 animate-fade-in-up group" style={{animationDelay: '0.2s'}}>
            <div className="w-16 h-16 mx-auto bg-primary-gold rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <AnimatedNumber end={45} duration={2000} suffix="%" />
            <div className="text-lg font-bold text-gray-900">Revenue Increase</div>
            <p className="text-sm text-gray-600 font-medium">Average per store</p>
          </div>

          {/* Stat 4 */}
          <div className="text-center space-y-3 p-8 bg-white rounded-2xl border-2 border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-200 animate-fade-in-up group" style={{animationDelay: '0.3s'}}>
            <div className="w-16 h-16 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <AnimatedNumber end={24} duration={2000} suffix="/7" />
            <div className="text-lg font-bold text-gray-900">Real-Time Monitoring</div>
            <p className="text-sm text-gray-600 font-medium">Always watching</p>
          </div>
        </div>

        {/* Animated Logo Carousel - "As Seen On" Style */}
        <div className="animate-fade-in-up">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Powering Retail Excellence At</p>
          </div>
          
          {/* Scrolling Logo Container */}
          <div className="relative overflow-hidden bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl py-8 shadow-inner">
            {/* Scrolling Animation */}
            <div className="relative flex gap-8 animate-scroll no-scrollbar">
              {[...logos, ...logos].map((logo, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-6 py-4 bg-white rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 border-2 border-gray-100"
                >
                  {logo.logo}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

