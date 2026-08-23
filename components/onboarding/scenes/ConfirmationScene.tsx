'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ArrowLeft, ArrowRight, Sparkle, CheckCircle, Sliders } from '@phosphor-icons/react';
import { useOnboarding } from '@/context/OnboardingContext';
import { LumaCore } from '@/components/core/LumaCore';
import {
  getPersonalizedConfirmationCopy,
  PROFESSIONS_DATA,
  INTERESTS_DATA,
} from '@/lib/onboarding-data';

export function ConfirmationScene() {
  const {
    selectedProfessions,
    selectedInterests,
    nextStep,
    prevStep,
  } = useOnboarding();
  const shouldReduceMotion = useReducedMotion();

  const { headline, subtext } = getPersonalizedConfirmationCopy(selectedProfessions);

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
      y: shouldReduceMotion ? 0 : -20,
      transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] as const },
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

  // Find human-readable titles for selections
  const professionTitles = selectedProfessions.map(
    (id) => PROFESSIONS_DATA.find((p) => p.id === id)?.title || id
  );

  const interestTitles = selectedInterests.map(
    (id) => INTERESTS_DATA.find((i) => i.id === id)?.title || id
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative z-10 w-full max-w-2xl mx-auto px-4 py-4 sm:py-8 text-center select-none"
    >
      {/* Synthesized LumaCore representing absorbed knowledge */}
      <motion.div variants={itemVariants} className="mb-6 flex justify-center">
        <LumaCore variant="confirmation" />
      </motion.div>

      {/* Main Persian Confirmation Header */}
      <motion.h1
        variants={itemVariants}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-100 mb-3 tracking-tight"
      >
        {headline}
      </motion.h1>

      {/* Dynamic Subtext */}
      <motion.p
        variants={itemVariants}
        className="text-base sm:text-lg text-purple-200/90 leading-relaxed mb-6 max-w-lg mx-auto font-medium"
      >
        {subtext}
      </motion.p>

      {/* Personalized Profile Summary Pill Deck */}
      {(professionTitles.length > 0 || interestTitles.length > 0) && (
        <motion.div
          variants={itemVariants}
          className="p-4 rounded-2xl bg-zinc-900/60 border border-purple-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md mb-8 max-w-md mx-auto"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
              <Sliders weight="bold" className="w-3.5 h-3.5 text-purple-400" />
              <span>پروفایل شکل‌گرفته برای شما:</span>
            </div>
            <span className="text-[10px] text-purple-400 font-mono">
              {professionTitles.length} تخصص • {interestTitles.length} اولویت
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center">
            {professionTitles.map((title, idx) => (
              <span
                key={`prof-pill-${idx}`}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-950/80 border border-purple-400/40 text-purple-200 shadow-[0_0_8px_rgba(168,85,247,0.2)]"
              >
                {title}
              </span>
            ))}
            {interestTitles.slice(0, 5).map((title, idx) => (
              <span
                key={`interest-pill-${idx}`}
                className="px-2 py-0.5 rounded-full text-[11px] bg-zinc-800/80 border border-white/[0.08] text-zinc-300"
              >
                {title}
              </span>
            ))}
            {interestTitles.length > 5 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-zinc-800/50 text-zinc-500">
                +{interestTitles.length - 5} مورد دیگر
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Action Controls */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3"
      >
        <button
          id="btn-confirm-back"
          type="button"
          onClick={prevStep}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <ArrowRight weight="bold" className="w-3.5 h-3.5" />
          <span>تغییر انتخاب‌ها</span>
        </button>

        <button
          id="btn-confirm-proceed"
          type="button"
          onClick={nextStep}
          className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white font-medium text-sm sm:text-base shadow-[0_0_24px_-4px_rgba(168,85,247,0.5)] hover:shadow-[0_0_32px_0px_rgba(192,132,252,0.65)] ring-1 ring-white/20 hover:scale-[1.015] active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer"
        >
          <span>لوما رو برام آماده کن</span>
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm group-hover:-translate-x-1 transition-transform duration-300">
            <ArrowLeft weight="bold" className="w-3.5 h-3.5 text-white" />
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}
