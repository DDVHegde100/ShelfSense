'use client';

export default function Features() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      title: 'Real-Time Shelf Monitoring',
      description: 'AI-powered cameras continuously monitor every shelf, detecting out-of-stock items, misplacements, and planogram violations in real-time.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Predictive Analytics',
      description: 'Machine learning models forecast demand, predict stock-outs before they happen, and recommend optimal replenishment schedules.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Instant Alerts',
      description: 'Get notified immediately when critical issues arise. Push notifications to mobile devices ensure your team responds fast.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      title: 'Planogram Compliance',
      description: 'Automatically verify that products are placed according to planograms. Measure compliance scores and identify violations.',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Price Tag OCR',
      description: 'Optical character recognition scans price tags and compares them with your POS system to catch pricing errors before customers do.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Edge Computing',
      description: 'Process video feeds locally on NVIDIA Jetson or Coral TPU devices for ultra-low latency and reduced bandwidth costs.',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <section id="features" className="section-padding bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-light/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary-medium/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to <span className="gradient-text">Optimize Your Shelves</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto font-medium">
            Comprehensive retail intelligence powered by computer vision and edge AI
          </p>
        </div>

        {/* Features Grid - All 6 in a row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Icon Container */}
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mx-auto`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-sm font-bold text-gray-900 mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 animate-fade-in-up">
          <button className="px-8 py-4 bg-primary-teal text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-primary-mint">
            Explore All Features →
          </button>
        </div>
      </div>
    </section>
  );
}
