'use client';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Install Smart Cameras',
      description: 'Deploy low-cost cameras with edge AI devices (NVIDIA Jetson/Coral TPU) across your store aisles. Setup takes less than a day.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'AI Learns Your Products',
      description: 'Our computer vision models (YOLOv8, CLIP embeddings) automatically detect and categorize your SKUs with 98% accuracy.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Real-Time Monitoring Begins',
      description: 'Start receiving live shelf data, stock alerts, compliance scores, and pricing insights through your dashboard and mobile app.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Optimize & Scale',
      description: 'Use predictive analytics to prevent stock-outs, reduce shrink, and expand to all your stores with our cloud infrastructure.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How <span className="gradient-text">ShelfSense</span> Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From installation to insights in four simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-dark via-primary-medium to-primary-light transform -translate-y-1/2"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative animate-fade-in-up"
                style={{animationDelay: `${index * 0.15}s`}}
              >
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-primary-dark to-primary-medium rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                  {step.number}
                </div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-sm border-2 border-primary-medium/20 rounded-2xl p-8 pt-12 hover:shadow-2xl hover:scale-105 transition-all duration-300 h-full">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-primary-cream rounded-xl flex items-center justify-center text-primary-dark mb-6">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20 animate-fade-in-up">
          <p className="text-lg text-gray-600 mb-6">Ready to transform your retail operations?</p>
          <button className="px-8 py-4 bg-gradient-to-r from-primary-dark to-primary-medium text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300">
            Schedule a Demo →
          </button>
        </div>
      </div>
    </section>
  );
}
