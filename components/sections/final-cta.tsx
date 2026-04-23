'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

export function FinalCTASection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section ref={ref} className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 md:p-16 text-center border border-primary/20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-foreground mb-6"
          >
            Ready to Transform Your School?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-foreground/70 mb-8 leading-relaxed"
          >
            Join 500+ schools already using SmartSchool Pro. Start your 14-day free trial
            today. No credit card required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/sign-up" className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group">
              Start Free Trial <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 bg-white text-primary font-semibold rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors">
              Schedule Demo
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 pt-8 border-t border-primary/20 flex flex-col sm:flex-row justify-around gap-6"
          >
            <div>
              <p className="text-2xl font-bold text-primary">500+</p>
              <p className="text-sm text-foreground/70">Schools Using SmartSchool</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">50K+</p>
              <p className="text-sm text-foreground/70">Students Managed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">98%</p>
              <p className="text-sm text-foreground/70">Customer Satisfaction</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
