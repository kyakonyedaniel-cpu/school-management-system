'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, Mail, MapPin, Clock, Send, Check, MessageSquare, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    email: '',
    phone: '',
    students: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: '+256 700 737 512',
      description: 'Mon-Fri 8am-6pm EAT',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'kyakonyedaniel@gmail.com',
      description: 'We respond within 24 hours',
    },
    {
      icon: MapPin,
      title: 'Office',
      content: 'Kampala, Uganda',
      description: 'Near Uganda Museum',
    },
    {
      icon: Clock,
      title: 'Support Hours',
      content: 'Mon-Sat 8am-8pm EAT',
      description: '24/7 for urgent issues',
    },
  ];

  const studentOptions = ['1-100', '101-300', '301-500', '501-1000', '1000+'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-foreground/70">
              Have questions about SmartSchool Pro? We'd love to hear from you. 
              Fill out the form and we'll be in touch within 24 hours.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Form & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-background rounded-xl p-6 border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <info.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                <p className="text-primary font-medium">{info.content}</p>
                <p className="text-sm text-foreground/60">{info.description}</p>
              </div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-background rounded-xl p-6 md:p-8 border border-border"
          >
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Message Sent!
                </h3>
                <p className="text-foreground/70 mb-6">
                  Thank you for reaching out. We'll be in touch within 24 hours.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                >
                  <ArrowRight size={18} />
                  Back to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      School Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.school}
                      onChange={(e) =>
                        setFormData({ ...formData, school: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                      placeholder="Kampala Primary School"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                      placeholder="john@school.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                      placeholder="+256..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Number of Students
                  </label>
                  <select
                    value={formData.students}
                    onChange={(e) =>
                      setFormData({ ...formData, students: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                  >
                    <option value="">Select student count</option>
                    {studentOptions.map((option) => (
                      <option key={option} value={option}>
                        {option} students
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors min-h-[120px]"
                    placeholder="Tell us about your school and how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-4">
          {[
            {
              q: 'How long does it take to set up?',
              a: 'Most schools are up and running within 24 hours. We help you import existing data and train your staff.',
            },
            {
              q: 'Do you offer training?',
              a: 'Yes! All plans include free onboarding and training. Professional plans include hands-on training sessions.',
            },
            {
              q: 'Can I switch plans later?',
              a: 'Absolutely! You can upgrade or downgrade anytime. Changes apply immediately.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept MTN MoMo, Airtel Money, and bank transfers. Annual plans also accept credit cards.',
            },
          ].map((faq, index) => (
            <details
              key={index}
              className="group bg-background rounded-xl border border-border overflow-hidden"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/30 transition-colors">
                <span className="font-semibold text-foreground">{faq.q}</span>
                <span className="ml-4 text-primary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-foreground/70">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Transform Your School?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join 500+ schools already using SmartSchool Pro to manage their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/subscription"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}