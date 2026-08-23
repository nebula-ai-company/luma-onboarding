'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import {
  ArrowRight,
  Sparkle,
  Rocket,
  ArrowClockwise,
  MagicWand,
  Coins,
  CheckCircle,
} from '@phosphor-icons/react';
import { useOnboarding } from '@/context/OnboardingContext';
import { LumaCore } from '@/components/core/LumaCore';
import { LUMA_TOOLS_CATALOG } from '@/lib/onboarding-data';

export function Phase5PlaceholderScene() {
  const {
    prevStep,
    resetOnboarding,
    completeOnboarding,
    selectedRecommendedTool,
    firstCreationMode,
    toolRecommendations,
  } = useOnboarding();
  const shouldReduceMotion = useReducedMotion();

  const selectedTool =
    LUMA_TOOLS_CATALOG.find((t) => t.id === selectedRecommendedTool) ||
    toolRecommendations[0];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
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
      dir="rtl"
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
        <span>مقصد بعدی: فاز ۵ — سندباکس و خلق اولین خروجی</span>
      </motion.div>

      {/* Headline */}
      <motion.h2
        variants={itemVariants}
        className="text-2xl sm:text-3xl font-extrabold text-zinc-100 mb-2 tracking-tight"
      >
        {firstCreationMode === 'fun'
          ? 'آماده‌سازی تست سریع و فان'
          : `آماده‌سازی ابزار ${selectedTool?.title || 'خلق هوشمند'}`}
      </motion.h2>

      {/* Selection context card */}
      <motion.div
        variants={itemVariants}
        className="w-full my-4 p-4 rounded-2xl bg-zinc-950/80 border border-purple-500/20 text-right space-y-2"
      >
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>ابزار انتخاب‌شده برای اولین خروجی:</span>
          <span className="font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
            {selectedTool?.categoryTitle}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <CheckCircle weight="fill" className="w-4 h-4 text-purple-400" />
          <span>{selectedTool?.title}</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          {selectedTool?.description}
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center pt-2"
      >
        <button
          id="btn-phase5-back"
          type="button"
          onClick={prevStep}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <ArrowRight weight="bold" className="w-3.5 h-3.5" />
          <span>تغییر ابزار انتخابی</span>
        </button>

        <button
          id="btn-phase5-complete"
          type="button"
          onClick={completeOnboarding}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-[0_0_16px_rgba(168,85,247,0.4)] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <Rocket weight="bold" className="w-3.5 h-3.5" />
          <span>ورود نهایی به لوما</span>
        </button>

        <button
          id="btn-phase5-restart"
          type="button"
          onClick={resetOnboarding}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-zinc-500 hover:text-zinc-300 text-xs transition-colors cursor-pointer hover:bg-white/[0.03]"
        >
          <ArrowClockwise weight="bold" className="w-3.5 h-3.5" />
          <span>شروع مجدد</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
