'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '250,000',
    period: '/month',
    description: 'Perfect for small to mid-sized schools',
    features: [
      'Up to 500 students',
      'Student management',
      'Basic fee collection',
      'Attendance tracking',
      'Email support',
      'Termly reports',
      'Mobile app access',
      'WhatsApp integration',
      'Custom branding',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '450,000',
    period: '/month',
    description: 'Complete solution for growing and large institutions',
    features: [
      'Unlimited students',
      'Student management',
      'Advanced fee collection',
      'Attendance tracking',
      'WhatsApp integration',
      'Real-time analytics',
      'Weekly reports',
      'Priority support',
      'Custom branding',
      'Mobile money payments',
      'API access',
      'Multi-campus support',
    ],
    cta: 'Scale Your School',
    highlighted: true,
  },
];

export function PricingSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      ref={ref}
      id="pricing"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Choose the perfect plan for your school. All plans include a 14-day free trial.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative rounded-2xl transition-all duration-300 overflow-hidden group ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-primary via-primary to-primary/90 text-white shadow-2xl hover:shadow-3xl'
                  : 'bg-background border border-border hover:border-primary/50 hover:shadow-xl'
              }`}
            >
              {/* Glow effect on hover */}
              {plan.highlighted && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}

              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-primary px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="relative p-8 md:p-10 flex flex-col h-full">
                {/* Plan Name */}
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    plan.highlighted ? 'text-white' : 'text-foreground'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-6 font-medium ${
                    plan.highlighted ? 'text-white/85' : 'text-foreground/70'
                  }`}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-8 pb-8 border-b border-current border-opacity-20">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span
                      className={`text-4xl md:text-5xl font-bold ${
                        plan.highlighted ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      UGX {plan.price}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        plan.highlighted ? 'text-white/70' : 'text-foreground/60'
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className={`text-xs ${
                      plan.highlighted ? 'text-white/60' : 'text-foreground/50'
                    }`}
                  >
                    14-day free trial • Cancel anytime
                  </p>
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.highlighted ? '/sign-up' : '/sign-up'}
                  className={`block w-full text-center py-3 px-4 rounded-lg font-semibold transition-all duration-300 mb-8 transform hover:scale-105 active:scale-95 ${
                    plan.highlighted
                      ? 'bg-white text-primary hover:bg-white/95 shadow-lg'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <div className="space-y-3 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * featureIndex, duration: 0.3 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          plan.highlighted
                            ? 'bg-white/30'
                            : 'bg-primary/10'
                        }`}
                      >
                        <Check
                          size={16}
                          className={
                            plan.highlighted ? 'text-white' : 'text-primary'
                          }
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          plan.highlighted
                            ? 'text-white/90'
                            : 'text-foreground/80'
                        }`}
                      >
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-foreground/70 mb-4">
            Need help choosing? Check our{' '}
            <Link href="/subscription" className="text-primary font-semibold hover:underline">
              detailed comparison
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}