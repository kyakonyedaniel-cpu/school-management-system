'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Users,
  BookOpen,
  CreditCard,
  CheckCircle2,
  MessageSquare,
  BarChart3,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Student Management',
    description: 'Track student records, enrollment, and personal information effortlessly',
  },
  {
    icon: CreditCard,
    title: 'Fees & Payments',
    description: 'Collect fees via MTN MoMo, Airtel Money, and bank transfers',
  },
  {
    icon: BookOpen,
    title: 'Academics',
    description: 'Manage grades, report cards, and academic performance tracking',
  },
  {
    icon: CheckCircle2,
    title: 'Attendance',
    description: 'Real-time attendance tracking and automated parent notifications',
  },
  {
    icon: MessageSquare,
    title: 'Communication',
    description: 'WhatsApp and SMS integration for instant school-parent communication',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Comprehensive dashboards and reports for school administration',
  },
];

export function FeaturesSection() {
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
      id="features"
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
            Everything Schools Need
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Comprehensive features designed specifically for African schools
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-primary/5 rounded-xl transition-all duration-300 blur-xl" />
                
                <div className="relative bg-white rounded-xl p-8 border border-border group-hover:border-primary/50 shadow-sm group-hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  {/* Icon Container */}
                  <div className="mb-6 p-4 w-fit rounded-lg bg-secondary group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                    <Icon className="text-primary" size={28} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed flex-grow">
                    {feature.description}
                  </p>
                  
                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                    <span className="text-sm font-semibold">Learn more</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
