'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Smartphone, Wifi, Users, Zap } from 'lucide-react';

const advantages = [
  {
    icon: Smartphone,
    title: 'Mobile Money Ready',
    description:
      'MTN MoMo, Airtel Money, and bank transfers built-in. No merchant account setup needed.',
  },
  {
    icon: Wifi,
    title: 'Works Offline',
    description:
      'Sync when connected. Keep working even with poor internet connectivity.',
  },
  {
    icon: Users,
    title: 'Teacher-Friendly',
    description: 'No IT skills required. Intuitive interface everyone can use immediately.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for low-bandwidth connections and older devices.',
  },
];

export function AfricanAdvantageSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-transparent"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-primary">
              Built for Africa
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            The African Advantage
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl">
            Built from the ground up for African schools. Mobile money payments, offline
            support, and everything optimized for your connectivity.
          </p>
        </motion.div>

        {/* Advantages Grid */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-8"
        >
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl p-8 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-4 p-3 w-fit rounded-lg bg-secondary">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {advantage.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {advantage.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 bg-white rounded-xl p-8 md:p-12 border border-border"
        >
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            Supported Payment Methods
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-yellow-600">MTN</span>
              </div>
              <p className="font-medium text-foreground">MTN MoMo</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-red-600">ATM</span>
              </div>
              <p className="font-medium text-foreground">Airtel Money</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-blue-600">BANK</span>
              </div>
              <p className="font-medium text-foreground">Bank Transfer</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
