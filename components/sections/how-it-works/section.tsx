'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle, ArrowRight, Users, Wallet, FileText, BarChart3, Smartphone, Wifi, MessageSquare } from 'lucide-react';

const steps = [
  {
    icon: Users,
    title: 'Import Students',
    description: 'Upload your student list or add them one by one. We help you get organized in minutes.',
  },
  {
    icon: Wallet,
    title: 'Set Up Fees',
    description: 'Create fee structures, add payment options, and send invoices to parents via WhatsApp.',
  },
  {
    icon: FileText,
    title: 'Track Everything',
    description: 'Attendance, exams, library, transport - all from one dashboard.',
  },
  {
    icon: BarChart3,
    title: 'Generate Reports',
    description: 'Instant reports for parents, teachers, and administrators. No more spreadsheets.',
  },
];

const features = [
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Works on any phone or tablet. Parents can check balances and make payments from their mobile.',
  },
  {
    icon: Wifi,
    title: 'Works Offline',
    description: 'Don\'t worry about internet. Data syncs automatically when you\'re back online.',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Updates',
    description: 'Send automatic fee reminders and attendance reports directly to parents\' WhatsApp.',
  },
];

export function HowItWorksSection() {
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
      id="how-it-works"
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
            How It Works
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Get started in minutes. No technical expertise required.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative bg-background rounded-xl p-6 border border-border hover:border-primary/50 transition-colors"
            >
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mt-2">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-foreground/70">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Why SmartSchool */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-xl font-bold text-foreground mb-8">
            Why SmartSchool Pro?
          </h3>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex gap-4 items-start"
            >
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                <p className="text-sm text-foreground/70">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16"
        >
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Start Free Trial <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}