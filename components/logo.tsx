'use client';

import { motion } from 'framer-motion';

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ rotate: [0, -5, 5, 0] }}
      transition={{ duration: 0.5 }}
    >
      <motion.rect
        width="40"
        height="40"
        rx="8"
        fill="url(#logo-gradient)"
      />
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <motion.path
        d="M20 8L8 16V28C8 30 10 32 12 32H28C30 32 32 30 32 28V16L20 8Z"
        fill="white"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      />
      <motion.path
        d="M14 22H26"
        stroke="#2563eb"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      />
      <motion.path
        d="M14 26H20"
        stroke="#2563eb"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      />
      <motion.circle
        cx="26"
        cy="14"
        r="3"
        fill="#60a5fa"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

export function AnimatedLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo size={40} />
      <div>
        <motion.span
          className="font-bold text-lg text-foreground"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          SmartSchool
        </motion.span>
        <motion.span
          className="text-lg font-bold text-primary"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          Pro
        </motion.span>
      </div>
    </div>
  );
}