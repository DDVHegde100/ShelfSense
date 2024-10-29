'use client';

import { useState } from 'react';

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for single-location retailers testing the waters',
      monthlyPrice: 499,
      annualPrice: 4990,
      features: [
        'Up to 5 cameras per store',
        'Real-time shelf monitoring',
        'Basic analytics dashboard',
        'Email alerts',
        'Mobile app access',
        'Community support',
      ],
      cta: 'Start Free Trial',
      popular: false,
      color: 'from-primary-light to-primary-medium',
    },
    {
      name: 'Professional',
      description: 'Ideal for growing chains with multiple locations',
      monthlyPrice: 1299,
      annualPrice: 12990,
      features: [
        'Up to 20 cameras per store',
        'Advanced predictive analytics',
        'Planogram compliance scoring',
        'Price tag OCR',
        'Custom alerts & automations',
        'Priority support',
        'Multi-store dashboard',
        'API access',
      ],
      cta: 'Start Free Trial',
      popular: true,
      color: 'from-primary-dark to-primary-medium',
    },
    {
      name: 'Enterprise',
      description: 'For large retailers demanding maximum performance',
      monthlyPrice: null,
      annualPrice: null,
      features: [
        'Unlimited cameras',
        'White-label solution',
        'Custom AI model training',
        'Dedicated account manager',
        'SLA guarantees',
        '24/7 phone support',
        'Advanced security & compliance',
        'Custom integrations',
        'On-premise deployment option',
      ],
      cta: 'Contact Sales',
      popular: false,
      color: 'from-primary-medium to-primary-dark',
    },
  ];

  return (
    <section id="pricing" className="section-padding bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 font-medium">
            Choose the perfect plan for your retail operation. All plans include a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                billingPeriod === 'monthly'
                  ? 'bg-primary-teal text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 relative ${
                billingPeriod === 'annual'
                  ? 'bg-primary-teal text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white/80 backdrop-blur-sm border-2 rounded-3xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in-up ${
                plan.popular
                  ? 'border-primary-dark ring-4 ring-primary-light/30'
                  : 'border-primary-medium/20'
              }`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-dark to-primary-medium text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  {plan.monthlyPrice ? (
                    <>
                      <div className="text-5xl font-bold gradient-text mb-2">
                        ${billingPeriod === 'monthly' ? plan.monthlyPrice : Math.floor(plan.annualPrice! / 12)}
                      </div>
                      <div className="text-gray-600">
                        per store / {billingPeriod === 'monthly' ? 'month' : 'month (billed annually)'}
                      </div>
                    </>
                  ) : (
                    <div className="text-4xl font-bold gradient-text mb-2">Custom</div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-dark to-primary-medium text-white hover:shadow-xl hover:scale-105'
                      : 'bg-white border-2 border-primary-medium text-primary-dark hover:bg-primary-cream'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>

              {/* Features List */}
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ Teaser */}
        <div className="text-center mt-16 animate-fade-in-up">
          <p className="text-gray-600 mb-4">Questions about pricing or features?</p>
          <button className="text-primary-dark font-semibold hover:text-primary-medium transition-colors">
            View FAQ →
          </button>
        </div>
      </div>
    </section>
  );
}
