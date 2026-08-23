'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import { ArrowLeft, Sparkle } from '@phosphor-icons/react';
import { useOnboarding } from '@/context/OnboardingContext';
import { LumaCore } from '@/components/core/LumaCore';

export function WelcomeScene() {
  const { nextStep, skipOnboarding } = useOnboarding();
  const shouldReduceMotion = useReducedMotion();

  // Animation timings tailored for < 1.5s total perceived staging
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -20,
      transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] as const },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const coreVariants: Variants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.6 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.65,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative z-10 flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 sm:px-6 py-6 md:py-12 select-none"
    >
      {/* Central LumaCore representation */}
      <motion.div variants={coreVariants} className="mb-6 md:mb-8">
        <LumaCore variant="welcome" />
      </motion.div>

      {/* Main Persian Heading */}
      <motion.h1
        variants={itemVariants}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight md:leading-tight mb-4"
      >
        به لوما خوش اومدی
      </motion.h1>

      {/* Primary Supporting Text */}
      <motion.p
        variants={itemVariants}
        className="text-lg sm:text-xl font-medium text-purple-200/90 leading-relaxed mb-3 max-w-lg"
      >
        بیایید لوما رو برای خودت آماده کنیم.
      </motion.p>

      {/* Secondary Descriptive Line */}
      <motion.p
        variants={itemVariants}
        className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-8 md:mb-10 max-w-md"
      >
        فقط چند سؤال کوتاه؛ بعدش ابزارهایی که واقعاً به کارت میان رو نشونت میدیم.
      </motion.p>

      {/* Action Controls */}
      <motion.div
        variants={itemVariants}
        className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
      >
        {/* Primary Action Button */}
        <button
          id="btn-start-onboarding"
          type="button"
          onClick={nextStep}
          className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white font-medium text-base shadow-[0_0_24px_-4px_rgba(168,85,247,0.45)] hover:shadow-[0_0_32px_0px_rgba(192,132,252,0.6)] ring-1 ring-white/20 hover:scale-[1.015] active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080c] cursor-pointer"
        >
          <span>شروع کنیم</span>
          {/* Nested icon wrapper for button-in-button tactile feel */}
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm group-hover:-translate-x-1 transition-transform duration-300">
            <ArrowLeft weight="bold" className="w-3.5 h-3.5 text-white" />
          </span>
        </button>

        {/* Secondary Action / Skip */}
        <button
          id="btn-skip-onboarding"
          type="button"
          onClick={skipOnboarding}
          className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-normal text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 cursor-pointer"
        >
          فعلاً ردش کن
        </button>
      </motion.div>

      {/* Micro indicator badge */}
      <motion.div
        variants={itemVariants}
        className="mt-8 md:mt-12 flex items-center gap-2 text-xs text-zinc-500"
      >
        <Sparkle weight="fill" className="w-3.5 h-3.5 text-purple-400/70" />
        <span>شخصی‌سازی هوشمند ابزارها و مدل‌های تولید محتوا</span>
      </motion.div>
    </motion.div>
  );
}
