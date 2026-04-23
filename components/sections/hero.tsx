'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section ref={ref} className="pt-32 pb-20 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">
                Trusted by 500+ schools
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6"
            >
              School Management
              <span className="text-primary"> Made Simple</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg text-foreground/70 mb-8 leading-relaxed"
            >
              Manage students, fees, attendance, and more from one intuitive platform. Built
              for African schools, works offline, supports mobile money payments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/sign-up" className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group">
                Start Free Trial <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/80 transition-colors">
                Book a Demo
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-12 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
                <span className="text-sm text-foreground/70">
                  No credit card required
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
                <span className="text-sm text-foreground/70">
                  14-day free trial
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Floating Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-3xl -z-10" />
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border border-border">
              {/* Dashboard Header */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm font-semibold text-foreground">SmartSchool Dashboard</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-primary/40" />
                  <div className="w-3 h-3 rounded-full bg-primary/30" />
                  <div className="w-3 h-3 rounded-full bg-primary/20" />
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                    <div className="text-xs text-foreground/70 mb-2">Total Students</div>
                    <div className="text-2xl font-bold text-primary">1,248</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-100/30 to-emerald-100/10 rounded-lg p-4 border border-emerald-200/30">
                    <div className="text-xs text-foreground/70 mb-2">Fees Collected</div>
                    <div className="text-2xl font-bold text-emerald-600">₦45.2M</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100/30 to-blue-100/10 rounded-lg p-4 border border-blue-200/30">
                    <div className="text-xs text-foreground/70 mb-2">Attendance</div>
                    <div className="text-2xl font-bold text-blue-600">94%</div>
                  </div>
                </div>

                {/* Student Activity */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground/70 font-medium">Recent Enrollments</span>
                    <span className="text-primary font-semibold">→</span>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/20" />
                      <div className="flex-1 space-y-1">
                        <div className="h-2 bg-foreground/10 rounded w-24" />
                        <div className="h-1.5 bg-foreground/10 rounded w-32" />
                      </div>
                      <div className="w-4 h-4 rounded border border-primary/30" />
                    </div>
                  ))}
                </div>

                {/* Action Button Mockup */}
                <button className="w-full py-2 px-4 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 transition-colors">
                  View Full Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
