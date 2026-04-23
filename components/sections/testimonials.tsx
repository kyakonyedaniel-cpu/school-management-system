'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

const testimonials = [
  {
    name: 'Jane Kyambadde',
    role: 'School Principal, Kampala',
    content:
      "SmartSchool Pro has transformed how we manage our school. Registration, fees, attendance - everything is now digital and organized. Parents love getting instant updates via WhatsApp!",
    avatar: '👩‍🏫',
  },
  {
    name: 'Paul Musyoka',
    role: 'Head Teacher, Nairobi',
    content:
      'The offline feature is amazing - we never lose data even when internet goes down. And the mobile money integration means parents can pay fees directly. Fantastic!',
    avatar: '👨‍💼',
  },
  {
    name: 'Grace Okonkwo',
    role: 'School Administrator, Lagos',
    content:
      'I was skeptical about digital solutions, but this is so simple. My team learned it in days. The support team is also very responsive and helpful.',
    avatar: '👩‍💻',
  },
  {
    name: 'David Obwoya',
    role: 'Bursar, Kampala',
    content:
      'Tracking fees and payments is now so easy. We can see who has paid, who owes, and generate reports instantly. This saves us hours every week.',
    avatar: '👨‍💼',
  },
  {
    name: 'Sandra Adeleke',
    role: 'Teacher, Ibadan',
    content:
      'Managing attendance and keeping parents informed has never been easier. SmartSchool Pro is intuitive and makes my job so much simpler.',
    avatar: '👩‍🏫',
  },
];

export function TestimonialsCarousel() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || !inView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, inView]);

  return (
    <section
      ref={ref}
      id="testimonials"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8"
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
            Loved by School Leaders
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            See what educators across Africa think about SmartSchool Pro
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-white to-muted/30 rounded-2xl p-8 md:p-12 border border-border shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="max-w-3xl mx-auto">
              {/* Star Rating */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex gap-1 mb-6"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                    className="text-2xl"
                  >
                    ⭐
                  </motion.span>
                ))}
              </motion.div>

              {/* Quote */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-lg md:text-xl text-foreground mb-8 leading-relaxed italic font-light"
              >
                &quot;{testimonials[currentIndex].content}&quot;
              </motion.p>

              {/* Author */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-3xl shadow-md">
                  {testimonials[currentIndex].avatar}
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">
                    {testimonials[currentIndex].name}
                  </p>
                  <p className="text-sm text-foreground/60">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Carousel Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex justify-center items-center gap-4 mt-8"
          >
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? testimonials.length - 1 : prev - 1
                )
              }
              className="w-12 h-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center font-bold text-lg hover:scale-110"
            >
              ←
            </button>

            {/* Indicator Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary'
                      : 'bg-border hover:bg-foreground/30'
                  }`}
                  animate={{
                    width: index === currentIndex ? 32 : 8,
                    height: 8,
                  }}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % testimonials.length)
              }
              className="w-12 h-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center font-bold text-lg hover:scale-110"
            >
              →
            </button>
          </motion.div>

          {/* Pause Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isPaused ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-center text-sm text-foreground/50 mt-4"
          >
            Paused • Click dot or arrows to navigate
          </motion.div>
        </div>
      </div>
    </section>
  );
}
