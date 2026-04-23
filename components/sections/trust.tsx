'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const trusts = [
  {
    icon: '🔒',
    label: 'Bank-Grade Security',
    description: 'Your data is encrypted and secure',
  },
  {
    icon: '⚡',
    label: 'Works Offline',
    description: 'Continue working without internet',
  },
  {
    icon: '📱',
    label: 'Mobile Money Ready',
    description: 'MTN MoMo & Airtel Money integrated',
  },
  {
    icon: '🚀',
    label: 'Fast Implementation',
    description: 'Up and running in 48 hours',
  },
  {
    icon: '👥',
    label: '500+ Schools',
    description: 'Trusted by schools across Africa',
  },
  {
    icon: '⭐',
    label: '4.9/5 Rating',
    description: 'Highly rated by educators',
  },
];

export function TrustSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section
      ref={ref}
      className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {trusts.map((trust, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="group text-center"
            >
              <motion.div
                className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300"
                whileHover={{ rotate: 10, y: -5 }}
              >
                {trust.icon}
              </motion.div>
              <h4 className="font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                {trust.label}
              </h4>
              <p className="text-xs text-foreground/60 leading-tight">
                {trust.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent my-12 origin-left"
        />

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-3 gap-8 text-center"
        >
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              500+
            </div>
            <p className="text-sm text-foreground/70">Schools using SmartSchool</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              50K+
            </div>
            <p className="text-sm text-foreground/70">Students managed daily</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              99.9%
            </div>
            <p className="text-sm text-foreground/70">Uptime guarantee</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
