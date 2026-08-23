'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence, type Variants } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkle,
  Check,
  WarningCircle,
  MagicWand,
  Images,
  VideoCamera,
  PlayCircle,
  Palette,
  ShoppingBag,
  Megaphone,
  ShareNetwork,
  ChatCircleDots,
  BookOpenText,
  Robot,
  Gear,
  CirclesThreePlus,
  Code,
  Compass,
} from '@phosphor-icons/react';
import { useOnboarding } from '@/context/OnboardingContext';
import { LumaCore } from '@/components/core/LumaCore';
import {
  getSmartPrioritizedInterests,
  MAX_INTERESTS_SELECTION,
} from '@/lib/onboarding-data';

// Helper to map icon for each interest
function getInterestIcon(interestId: string) {
  const iconProps = { className: 'w-3.5 h-3.5', weight: 'duotone' as const };
  switch (interestId) {
    case 'image_gen':
      return <Images {...iconProps} />;
    case 'video_gen':
      return <VideoCamera {...iconProps} />;
    case 'img_to_video':
      return <PlayCircle {...iconProps} />;
    case 'image_edit':
      return <Palette {...iconProps} />;
    case 'ad_content':
      return <Megaphone {...iconProps} />;
    case 'product_photo':
      return <ShoppingBag {...iconProps} />;
    case 'social_content':
      return <ShareNetwork {...iconProps} />;
    case 'design_ideation':
      return <MagicWand {...iconProps} />;
    case 'ai_chat':
      return <ChatCircleDots {...iconProps} />;
    case 'research_writing':
      return <BookOpenText {...iconProps} />;
    case 'smart_assistant':
      return <Robot {...iconProps} />;
    case 'automation':
      return <Gear {...iconProps} />;
    case 'workflow':
      return <CirclesThreePlus {...iconProps} />;
    case 'api_dev':
      return <Code {...iconProps} />;
    case 'explore_all':
      return <Compass {...iconProps} />;
    default:
      return <Sparkle {...iconProps} />;
  }
}

export function InterestsScene() {
  const {
    selectedProfessions,
    selectedInterests,
    toggleInterest,
    nextStep,
    prevStep,
  } = useOnboarding();
  const shouldReduceMotion = useReducedMotion();
  const [showMaxLimitNotice, setShowMaxLimitNotice] = useState(false);

  // Derive prioritized list based on previously selected professions
  const prioritizedList = React.useMemo(() => {
    return getSmartPrioritizedInterests(selectedProfessions);
  }, [selectedProfessions]);

  const handleInterestClick = (id: string) => {
    const success = toggleInterest(id);
    if (!success) {
      setShowMaxLimitNotice(true);
      setTimeout(() => setShowMaxLimitNotice(false), 3500);
    } else {
      setShowMaxLimitNotice(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.03,
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
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.35,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const hasSelection = selectedInterests.length > 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative z-10 w-full max-w-4xl mx-auto px-4 py-2 sm:py-4 select-none"
    >
      {/* Header section with compact LumaCore */}
      <div className="flex flex-col items-center text-center mb-5 sm:mb-6">
        <motion.div variants={itemVariants} className="mb-2">
          <LumaCore variant="interests" />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-100 mb-2 tracking-tight"
        >
          بیشتر دوست داری با لوما چه کارهایی انجام بدی؟
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed"
        >
          هرچقدر دقیق‌تر انتخاب کنی، پیشنهادهای بهتری برات آماده می‌کنیم.
        </motion.p>

        {/* Dynamic counter & subtle notice */}
        <motion.div
          variants={itemVariants}
          className="mt-3 flex items-center gap-2 text-xs font-mono text-zinc-500"
        >
          <span>انتخاب شده:</span>
          <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 font-semibold">
            {selectedInterests.length} / {MAX_INTERESTS_SELECTION}
          </span>
        </motion.div>
      </div>

      {/* Maximum Selection Limit Notice */}
      <AnimatePresence>
        {showMaxLimitNotice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 p-3 rounded-xl bg-purple-950/80 border border-purple-400/40 text-purple-200 text-xs flex items-center justify-center gap-2 text-center shadow-[0_4px_20px_rgba(168,85,247,0.3)] backdrop-blur-md"
          >
            <WarningCircle weight="fill" className="w-4 h-4 text-purple-300 flex-shrink-0" />
            <span>برای اینکه پیشنهادها دقیق بمونن، فعلاً همین ۸ مورد کافیه.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fluid Interactive Chips / Cards Field */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5 mb-7"
        role="group"
        aria-label="انتخاب اهداف و علاقه‌مندی‌ها"
      >
        {prioritizedList.map(({ interest, isPrioritized }) => {
          const isSelected = selectedInterests.includes(interest.id);

          return (
            <button
              key={interest.id}
              id={`interest-card-${interest.id}`}
              type="button"
              role="button"
              aria-pressed={isSelected}
              onClick={() => handleInterestClick(interest.id)}
              className={`group relative flex items-center justify-between gap-2.5 p-3 rounded-xl text-right transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                isSelected
                  ? 'bg-purple-950/45 border border-purple-500/50 text-purple-100 shadow-[0_0_16px_-2px_rgba(168,85,247,0.3)] scale-[1.01]'
                  : isPrioritized
                  ? 'bg-zinc-900/70 hover:bg-zinc-800/80 border border-purple-500/20 hover:border-purple-500/40 text-zinc-200'
                  : 'bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/[0.05] hover:border-white/10 text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                    isSelected
                      ? 'bg-purple-600/30 text-purple-200 border border-purple-400/40'
                      : isPrioritized
                      ? 'bg-purple-950/30 text-purple-400 border border-purple-500/15'
                      : 'bg-zinc-800/60 text-zinc-400 group-hover:text-zinc-200'
                  }`}
                >
                  {getInterestIcon(interest.id)}
                </div>

                <span className="text-xs sm:text-sm font-medium truncate">
                  {interest.title}
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Prioritized badge */}
                {isPrioritized && !isSelected && (
                  <span className="text-[10px] text-purple-400/80 bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-500/15">
                    پیشنهادی
                  </span>
                )}

                {/* Selection check indicator */}
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-purple-500 text-white shadow-[0_0_8px_#c084fc]'
                      : 'border border-white/10 group-hover:border-white/20'
                  }`}
                >
                  {isSelected && <Check weight="bold" className="w-2.5 h-2.5" />}
                </div>
              </div>
            </button>
          );
        })}
      </motion.div>

      {/* Navigation and Action Bar */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/[0.04]"
      >
        {/* Back to Profession Selection */}
        <button
          id="btn-interests-back"
          type="button"
          onClick={prevStep}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <ArrowRight weight="bold" className="w-3.5 h-3.5" />
          <span>مرحله قبل (تخصص)</span>
        </button>

        {/* Primary & Skip Controls */}
        <div className="w-full sm:w-auto flex items-center justify-end gap-3">
          <button
            id="btn-interests-skip-later"
            type="button"
            onClick={nextStep}
            className="px-4 py-2.5 rounded-full text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            بعداً انتخاب می‌کنم
          </button>

          <button
            id="btn-interests-continue"
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
