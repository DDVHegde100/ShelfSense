'use client';

import { useState, useEffect } from 'react';

const businessTypes = [
  'grocery store',
  'pharmacy',
  'gas station',
  'convenience store',
  'retail shop',
  'supermarket'
];

interface StatCard {
  label: string;
  withoutValue: string;
  withValue: string;
  withoutColor: string;
  withColor: string;
  description: string;
  icon: React.ReactNode;
}

const stats: StatCard[] = [
  {
    label: 'Annual Revenue Loss',
    withoutValue: '$1.2M',
    withValue: '$180K',
    withoutColor: 'text-red-600',
    withColor: 'text-green-600',
    description: 'average per store due to stockouts',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    label: 'Out-of-Stock Rate',
    withoutValue: '8.3%',
    withValue: '1.2%',
    withoutColor: 'text-red-600',
    withColor: 'text-green-600',
    description: 'of products unavailable when needed',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  {
    label: 'Customer Loss',
    withoutValue: '43%',
    withValue: '7%',
    withoutColor: 'text-red-600',
    withColor: 'text-green-600',
    description: 'switch to competitors after stockouts',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    label: 'Restock Delay',
    withoutValue: '4.5 hrs',
    withValue: '28 min',
    withoutColor: 'text-red-600',
    withColor: 'text-green-600',
    description: 'average time to detect and restock',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    label: 'Labor Cost',
    withoutValue: '$85K',
    withValue: '$31K',
    withoutColor: 'text-red-600',
    withColor: 'text-green-600',
    description: 'annual manual shelf monitoring costs',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    label: 'Operational Efficiency',
    withoutValue: '54%',
    withValue: '94%',
    withoutColor: 'text-red-600',
    withColor: 'text-green-600',
    description: 'shelf management effectiveness',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
];

export default function Impact() {
  const [currentType, setCurrentType] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [withShelfSense, setWithShelfSense] = useState(false);

  // Typing effect
  useEffect(() => {
    const currentWord = businessTypes[currentType];
    const timeout = setTimeout(() => {
      if (!isDeleting && text !== currentWord) {
        setText(currentWord.slice(0, text.length + 1));
      } else if (isDeleting && text !== '') {
        setText(currentWord.slice(0, text.length - 1));
      } else if (!isDeleting && text === currentWord) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setCurrentType((prev) => (prev + 1) % businessTypes.length);
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, currentType]);

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            If you own a{' '}
            <span className="relative">
              <span className="gradient-text">{text}</span>
              <span className="animate-pulse">|</span>
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The harsh reality of retail shelf management—and how ShelfSense changes everything.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-12 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          <div className="inline-flex items-center gap-4 bg-gray-100 rounded-full p-2">
            <span className={`px-6 py-2 font-semibold transition-all duration-300 ${!withShelfSense ? 'text-gray-900' : 'text-gray-500'}`}>
              Without ShelfSense
            </span>
            <button
              onClick={() => setWithShelfSense(!withShelfSense)}
              className="relative w-16 h-8 rounded-full bg-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-teal focus:ring-offset-2"
              style={{
                backgroundColor: withShelfSense ? 'rgb(35, 155, 167)' : 'rgb(209, 213, 219)'
              }}
            >
              <div
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300"
                style={{
                  transform: withShelfSense ? 'translateX(32px)' : 'translateX(0)'
                }}
              />
            </button>
            <span className={`px-6 py-2 font-semibold transition-all duration-300 ${withShelfSense ? 'text-gray-900' : 'text-gray-500'}`}>
              With ShelfSense
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative bg-white border-2 rounded-2xl p-8 transition-all duration-200 hover:shadow-2xl hover:-translate-y-2 hover:scale-105"
              style={{
                borderColor: withShelfSense ? 'rgb(122, 218, 165)' : 'rgb(239, 68, 68)',
                animationDelay: `${0.3 + index * 0.1}s`
              }}
            >
              {/* Icon */}
              <div className={`mb-4 transition-transform duration-300 group-hover:scale-110 ${
                withShelfSense ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.icon}
              </div>

              {/* Label */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {stat.label}
              </h3>

              {/* Value */}
              <div className={`text-4xl font-black transition-all duration-500 ${
                withShelfSense ? stat.withColor : stat.withoutColor
              }`}>
                {withShelfSense ? stat.withValue : stat.withoutValue}
              </div>

              {/* Change Indicator */}
              {withShelfSense && (
                <div className="absolute top-4 right-4">
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold animate-fadeIn">
                    ↓ Improved
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fadeInUp" style={{animationDelay: '1s'}}>
          <div className="inline-block bg-gradient-to-r from-primary-mint to-primary-teal rounded-2xl p-1">
            <div className="bg-white rounded-xl px-8 py-6">
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {withShelfSense ? (
                  <>Join 500+ stores already saving millions with ShelfSense</>
                ) : (
                  <>Don't let your business become another statistic</>
                )}
              </p>
              <p className="text-gray-600">
                {withShelfSense ? (
                  <>Average ROI of 340% in first 6 months</>
                ) : (
                  <>28% of retailers cite out-of-stock as their #1 challenge</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
