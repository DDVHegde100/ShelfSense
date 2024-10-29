'use client';

import { useState } from 'react';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "ShelfSense reduced our out-of-stock incidents by 62% in the first quarter. The ROI was immediate and the insights are invaluable.",
      author: "Sarah Johnson",
      role: "VP of Operations",
      company: "Regional Grocery Chain",
      rating: 5,
      image: "SJ",
    },
    {
      quote: "We've eliminated pricing errors that were costing us thousands per month. The OCR accuracy is remarkable and our customers trust our pricing now.",
      author: "Michael Chen",
      role: "Store Manager",
      company: "Urban Convenience Stores",
      rating: 5,
      image: "MC",
    },
    {
      quote: "The planogram compliance feature alone justified the investment. We went from 73% to 96% compliance across all locations.",
      author: "Jennifer Martinez",
      role: "Director of Merchandising",
      company: "Pharmacy Chain",
      rating: 5,
      image: "JM",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="testimonials" className="section-padding bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-medium/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Loved by <span className="gradient-text">Retail Leaders</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers say about transforming their operations with ShelfSense
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-sm border-2 border-primary-medium/20 rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in-up ${
                  index === activeIndex ? 'ring-2 ring-primary-medium' : ''
                }`}
                style={{animationDelay: `${index * 0.1}s`}}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {/* Stars */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-dark to-primary-medium rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-primary-dark font-medium">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up">
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">500+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">98%</div>
            <div className="text-gray-600">Would Recommend</div>
          </div>
        </div>
      </div>
    </section>
  );
}
