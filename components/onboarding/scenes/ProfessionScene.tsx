'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  VideoCamera,
  PaintBrush,
  ShareNetwork,
  Megaphone,
  ShoppingBag,
  Camera,
  Buildings,
  Code,
  GraduationCap,
  Sparkle,
  DotsThreeOutline,
  Check,
} from '@phosphor-icons/react';
import { useOnboarding } from '@/context/OnboardingContext';
import { LumaCore } from '@/components/core/LumaCore';
import { PROFESSIONS_DATA } from '@/lib/onboarding-data';

// Icon resolver helper
function getProfessionIcon(iconName: string) {
  const iconProps = { className: 'w-4 h-4', weight: 'duotone' as const };
  switch (iconName) {
    case 'VideoCamera':
      return <VideoCamera {...iconProps} />;
    case 'PaintBrush':
      return <PaintBrush {...iconProps} />;
    case 'ShareNetwork':
      return <ShareNetwork {...iconProps} />;
    case 'Megaphone':
      return <Megaphone {...iconProps} />;
    case 'ShoppingBag':
      return <ShoppingBag {...iconProps} />;
    case 'Camera':
      return <Camera {...iconProps} />;
    case 'Buildings':
      return <Buildings {...iconProps} />;
    case 'Code':
      return <Code {...iconProps} />;
    case 'GraduationCap':
      return <GraduationCap {...iconProps} />;
    case 'DotsThreeOutline':
      return <DotsThreeOutline {...iconProps} />;
    default:
      return <Sparkle {...iconProps} />;
  }
}

export function ProfessionScene() {
  const {
    selectedProfessions,
    toggleProfession,
    nextStep,
    prevStep,
    skipOnboarding,
  } = useOnboarding();
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.04,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -16,
      transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] as const },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const hasSelection = selectedProfessions.length > 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative z-10 w-full max-w-4xl mx-auto px-4 py-2 sm:py-4 select-none"
    >
      {/* Header section with persistent LumaCore */}
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
        <motion.div variants={itemVariants} className="mb-3">
          <LumaCore variant="profession" />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-100 mb-2 tracking-tight"
        >
          اول از خودت بگو
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base text-zinc-400 max-w-md leading-relaxed"
        >
          بیشتر توی چه زمینه‌ای فعالیت می‌کنی؟
        </motion.p>
      </div>

      {/* Grid of Interactive Profession Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 mb-8"
        role="group"
        aria-label="انتخاب تخصص و حوزه فعالیت"
      >
        {PROFESSIONS_DATA.map((profession) => {
          const isSelected = selectedProfessions.includes(profession.id);
          const isPrimary = selectedProfessions[0] === profession.id;

          return (
            <button
              key={profession.id}
              id={`prof-card-${profession.id}`}
              type="button"
              role="button"
              aria-pressed={isSelected}
              onClick={() => toggleProfession(profession.id)}
              className={`group relative flex items-start gap-3 p-3.5 sm:p-4 rounded-xl text-right transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                isSelected
                  ? 'bg-purple-950/40 border border-purple-500/50 shadow-[0_0_20px_-4px_rgba(168,85,247,0.35)] scale-[1.01]'
                  : 'bg-zinc-900/50 hover:bg-zinc-800/60 border border-white/[0.06] hover:border-purple-500/25 hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
              }`}
            >
              {/* Luminous indicator bar on selection */}
              {isSelected && (
                <div className="absolute right-0 top-3 bottom-3 w-1 rounded-l-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
              )}

              {/* Icon container */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                  isSelected
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-400/40 shadow-[0_0_10px_rgba(192,132,252,0.4)]'
                    : 'bg-zinc-800/80 text-zinc-400 group-hover:text-purple-300 group-hover:bg-zinc-800 border border-white/[0.04]'
                }`}
              >
                {getProfessionIcon(profession.iconName)}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span
                    className={`text-sm font-semibold truncate ${
                      isSelected ? 'text-purple-100' : 'text-zinc-200 group-hover:text-zinc-100'
                    }`}
                  >
                    {profession.title}
                  </span>
                  {isSelected && (
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center">
                      <Check weight="bold" className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-snug line-clamp-2">
                  {profession.description}
                </p>
              </div>

              {/* Primary badge if it's the first selected item */}
              {isPrimary && selectedProfessions.length > 1 && (
                <span className="absolute left-2.5 top-2 text-[9px] font-mono text-purple-300 px-1.5 py-0.5 rounded bg-purple-900/60 border border-purple-500/30">
                  اصلی
                </span>
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Navigation and Action Bar */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/[0.04]"
      >
        {/* Back Button */}
        <button
          id="btn-prof-back"
          type="button"
          onClick={prevStep}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <ArrowRight weight="bold" className="w-3.5 h-3.5" />
          <span>بازگشت به ابتدا</span>
        </button>

        {/* Primary & Skip Controls */}
        <div className="w-full sm:w-auto flex items-center justify-end gap-3">
          <button
            id="btn-prof-skip-later"
            type="button"
            onClick={nextStep}
            className="px-4 py-2.5 rounded-full text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            بعداً انتخاب می‌کنم
          </button>

          <button
            id="btn-prof-continue"
            type="button"
            disabled={!hasSelection}
            onClick={nextStep}
            className={`inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
              hasSelection
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.45)] hover:shadow-[0_0_28px_rgba(168,85,247,0.6)] cursor-pointer hover:scale-[1.015] active:scale-[0.98]'
                : 'bg-zinc-800/50 text-zinc-500 border border-white/[0.04] cursor-not-allowed'
            }`}
          >
            <span>ادامه</span>
            <ArrowLeft weight="bold" className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
