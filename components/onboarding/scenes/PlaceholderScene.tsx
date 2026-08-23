'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle, Sparkle } from '@phosphor-icons/react';
import { useOnboarding } from '@/context/OnboardingContext';
import { LumaCore } from '@/components/core/LumaCore';

export function PlaceholderScene() {
  const { prevStep, nextStep, skipOnboarding } = useOnboarding();
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
      transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] as const },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.45,
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
      className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto px-4 sm:px-6 py-4 md:py-8 select-none"
    >
      {/* Persistent LumaCore in compact upper position */}
      <motion.div variants={itemVariants} className="mb-4">
        <LumaCore variant="step" />
      </motion.div>

      {/* Stage Badge */}
      <motion.div
        variants={itemVariants}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/20 text-purple-300 text-xs font-medium mb-3"
      >
        <Sparkle weight="fill" className="w-3.5 h-3.5 text-purple-400" />
        <span>مرحله دوم: شخصی‌سازی مهارت و ابزارها</span>
      </motion.div>

      {/* Step Heading */}
      <motion.h2
        variants={itemVariants}
        className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3"
      >
        فضای کار لوما در حال انطباق با شماست
      </motion.h2>

      {/* Description */}
      <motion.p
        variants={itemVariants}
        className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-md mb-8"
      >
        هسته هوشمند لوما آماده دریافت انتخاب تخصص و سبک تولید محتوای شما در فاز بعدی است.
      </motion.p>

      {/* Architectural Verification Card */}
      <motion.div
        variants={itemVariants}
        className="w-full p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5)] mb-8 text-right backdrop-blur-sm"
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle weight="fill" className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-zinc-200">
              معماری انتقال پیوسته LumaCore
            </span>
          </div>
          <span className="text-[11px] text-purple-400 font-mono">
            Phase 1 Foundation
          </span>
        </div>
        <p className="text-xs text-zinc-400 leading-normal">
          هسته نوری لوما بدون پرش صفحه‌ای به این مرحله منتقل شد و فریم‌ورک انیمیشن برای گام‌های بعدی کاملاً آماده است.
        </p>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        variants={itemVariants}
        className="w-full flex items-center justify-between gap-3"
      >
        <button
          id="btn-back-step"
          type="button"
          onClick={prevStep}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800/80 border border-white/[0.08] text-zinc-300 hover:text-white text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <ArrowRight weight="bold" className="w-3.5 h-3.5" />
          <span>بازگشت به ابتدا</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="btn-skip-stage-2"
            type="button"
            onClick={skipOnboarding}
            className="px-4 py-2.5 rounded-full text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            ورود به داشبورد
          </button>
          <button
            id="btn-next-mock"
            type="button"
            onClick={nextStep}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium shadow-[0_0_16px_rgba(168,85,247,0.4)] hover:shadow-[0_0_24px_rgba(168,85,247,0.6)] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            <span>ادامه</span>
            <ArrowLeft weight="bold" className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
