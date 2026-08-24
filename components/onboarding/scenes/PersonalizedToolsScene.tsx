'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkle,
  Sliders,
  Lightbulb,
  Lightning,
  Clock,
  Coins,
  CheckCircle,
  Smiley,
  MagicWand,
  Image as ImageIcon,
  FilmStrip,
  ChatCircleDots,
  Palette,
  Eye,
  Play,
  ShareNetwork,
} from '@phosphor-icons/react';
import { useOnboarding } from '@/context/OnboardingContext';
import { LumaCore } from '@/components/core/LumaCore';
import { WhyTheseModal } from '@/components/onboarding/WhyTheseModal';
import {
  PROFESSIONS_DATA,
  INTERESTS_DATA,
  deriveToolRecommendations,
} from '@/lib/onboarding-data';
import type { ToolRecommendation } from '@/types/onboarding';
import { trackOnboardingEvent } from '@/lib/analytics';

// Map tool icon strings to phosphor icons
function getToolIcon(iconName: string, className = 'w-5 h-5') {
  switch (iconName) {
    case 'palette':
    case 'image':
      return <ImageIcon weight="duotone" className={className} />;
    case 'magic-wand':
      return <MagicWand weight="duotone" className={className} />;
    case 'video-camera':
    case 'film-strip':
      return <FilmStrip weight="duotone" className={className} />;
    case 'chat-circle-dots':
      return <ChatCircleDots weight="duotone" className={className} />;
    default:
      return <Sparkle weight="duotone" className={className} />;
  }
}

export function PersonalizedToolsScene() {
  const {
    selectedProfessions,
    selectedInterests,
    toolRecommendations,
    recommendedFirstAction,
    selectedRecommendedTool,
    setSelectedRecommendedTool,
    proceedToFirstCreation,
    prevStep,
    goToStep,
  } = useOnboarding();

  const shouldReduceMotion = useReducedMotion();
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [activeSelectedToolId, setActiveSelectedToolId] = useState<string>(
    selectedRecommendedTool || toolRecommendations[0]?.id || 'generate-image'
  );

  // Dictionaries for human labels in Persian
  const professionLabels = React.useMemo(() => {
    return PROFESSIONS_DATA.reduce<Record<string, string>>((acc, p) => {
      acc[p.id] = p.title;
      return acc;
    }, {});
  }, []);

  const interestLabels = React.useMemo(() => {
    return INTERESTS_DATA.reduce<Record<string, string>>((acc, i) => {
      acc[i.id] = i.title;
      return acc;
    }, {});
  }, []);

  // Primary recommendation is the active selected one or top 1
  const primaryRecommendation =
    toolRecommendations.find((t) => t.id === activeSelectedToolId) ||
    toolRecommendations[0];

  // Secondary recommendations are the rest
  const secondaryRecommendations = toolRecommendations.filter(
    (t) => t.id !== primaryRecommendation?.id
  );

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
      y: shouldReduceMotion ? 0 : -16,
      scale: shouldReduceMotion ? 1 : 0.98,
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

  const handleSelectSecondaryTool = (tool: ToolRecommendation) => {
    setActiveSelectedToolId(tool.id);
    setSelectedRecommendedTool(tool.id);
  };

  const handleOpenWhyModal = () => {
    trackOnboardingEvent('onboarding_recommendation_reason_viewed');
    setIsWhyModalOpen(true);
  };

  const handleStartPrimary = () => {
    trackOnboardingEvent('onboarding_primary_recommendation_clicked', {
      toolId: primaryRecommendation.id,
      title: primaryRecommendation.title,
    });
    proceedToFirstCreation('recommended', primaryRecommendation.id);
  };

  const handleStartFunPath = () => {
    proceedToFirstCreation('fun');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-2 sm:py-4 flex flex-col justify-between select-none"
      dir="rtl"
    >
      {/* ========================================================================= */}
      {/* 1. TOP ANCHOR: LumaCore & Stage Context */}
      {/* ========================================================================= */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/[0.06]"
      >
        {/* Left: Compact LumaCore anchor with delicate connected resonance */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <LumaCore variant="step" />
            <motion.div
              className="absolute -inset-2 rounded-full border border-purple-500/20 pointer-events-none"
              animate={
                shouldReduceMotion
                  ? {}
                  : { scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }
              }
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-purple-300">
                گام چهارم: انتخاب اولین خروجی
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/20 text-purple-200">
                پیشنهاد هوشمند
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              بهترین ابزارهای شروع برای شما
            </h2>
          </div>
        </div>

        {/* Right: Quick Context Controls (Why These + Edit Selections) */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-why-these-tools"
            type="button"
            onClick={handleOpenWhyModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm hover:border-purple-500/30"
          >
            <Lightbulb weight="bold" className="w-3.5 h-3.5 text-purple-400" />
            <span>چرا این ابزارها؟</span>
          </button>

          <button
            id="btn-edit-preferences-from-p4"
            type="button"
            onClick={() => goToStep(2)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900/40 hover:bg-zinc-900 border border-white/[0.06] text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
          >
            <Sliders weight="bold" className="w-3.5 h-3.5" />
            <span>ویرایش انتخاب‌ها</span>
          </button>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. EDITORIAL COMPOSITION: Primary Dominant Card + Secondary Cards */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-5 sm:my-6 items-start">
        {/* ===================================================================== */}
        {/* DOMINANT HERO RECOMMENDATION (7 cols on Desktop) */}
        {/* Double-Bezel hardware architecture */}
        {/* ===================================================================== */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-7 rounded-[2rem] bg-white/[0.04] p-1.5 ring-1 ring-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]"
        >
          <div className="rounded-[calc(2rem-0.375rem)] bg-zinc-950/90 border border-white/[0.06] p-6 sm:p-8 space-y-6 relative overflow-hidden">
            {/* Ambient inner card aura */}
            <div
              className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-purple-600/15 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Top Match Tag & Meta */}
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-medium">
                <Sparkle weight="fill" className="w-3.5 h-3.5 text-purple-400" />
                <span>بهترین نقطه شروع اختصاصی شما</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                <span className="flex items-center gap-1">
                  <Clock weight="bold" className="w-3.5 h-3.5 text-zinc-500" />
                  {primaryRecommendation?.isFastResult ? 'سریع (کمتر از ۱۰ ثانیه)' : 'کیفیت فوق‌العاده'}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-[0_0_16px_rgba(168,85,247,0.25)]">
                  {getToolIcon(primaryRecommendation?.iconName || 'sparkle', 'w-6 h-6')}
                </div>
                <div>
                  <span className="text-[11px] font-medium text-zinc-400 block">
                    {primaryRecommendation?.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {primaryRecommendation?.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed pt-1">
                {primaryRecommendation?.description}
              </p>
            </div>

            {/* Personalized Context Reason */}
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-purple-300">
                <CheckCircle weight="fill" className="w-4 h-4 text-purple-400" />
                <span>دلیل پیشنهاد به شما:</span>
              </div>
              <p className="leading-relaxed text-zinc-300">
                {primaryRecommendation?.primaryReason}
              </p>
            </div>

            {/* Practical Prompt / Action Examples */}
            {primaryRecommendation?.examples &&
              primaryRecommendation.examples.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                    <Lightning weight="bold" className="w-3.5 h-3.5 text-purple-400" />
                    نمونه ایده‌های کاربردی:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {primaryRecommendation.examples.map((exampleText, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.04] text-xs text-zinc-300 flex items-start gap-2 hover:border-purple-500/20 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                        <span className="line-clamp-2">{exampleText}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Dominant Primary CTA: Button-in-Button Pattern */}
            <div className="pt-2">
              <button
                id="btn-start-primary-recommendation"
                type="button"
                onClick={handleStartPrimary}
                className="group relative w-full inline-flex items-center justify-between px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white font-semibold text-sm sm:text-base shadow-[0_0_28px_-4px_rgba(168,85,247,0.5)] hover:shadow-[0_0_36px_0px_rgba(192,132,252,0.65)] ring-1 ring-white/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Play weight="fill" className="w-4 h-4 text-purple-200" />
                  <span>
                    شروع و ساخت اولین خروجی با {primaryRecommendation?.title}
                  </span>
                </div>

                {/* Nested trailing icon circular pill */}
                <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform duration-300 shadow-inner">
                  <ArrowLeft weight="bold" className="w-4 h-4 text-white" />
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* ===================================================================== */}
        {/* SECONDARY RECOMMENDATIONS (5 cols on Desktop) */}
        {/* Curated alternatives */}
        {/* ===================================================================== */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-5 space-y-3.5 flex flex-col justify-between h-full"
        >
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-400 block px-1">
              سایر ابزارهای منتخب متناسب با شما:
            </span>

            <div className="space-y-2.5">
              {secondaryRecommendations.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => handleSelectSecondaryTool(tool)}
                  className="group relative p-4 rounded-2xl bg-zinc-950/70 hover:bg-zinc-900/90 border border-white/[0.06] hover:border-purple-500/30 transition-all duration-200 cursor-pointer text-right space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-zinc-900 group-hover:bg-purple-950/40 border border-white/[0.08] group-hover:border-purple-500/30 flex items-center justify-center text-zinc-300 group-hover:text-purple-300 transition-colors">
                        {getToolIcon(tool.iconName, 'w-4 h-4')}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors">
                          {tool.title}
                        </h4>
                        <span className="text-[11px] text-zinc-400">
                          {tool.category}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-zinc-400">
                      {tool.isFastResult ? 'سریع' : 'پیشرفته'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {tool.primaryReason}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-purple-300/80 group-hover:text-purple-300">
                    <span>کلیک برای انتخاب به عنوان خروجی اول</span>
                    <ArrowLeft
                      weight="bold"
                      className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* QUICK FUN / PLAYFUL ALTERNATIVE PATH CARD */}
          {/* ===================================================================== */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/30 via-zinc-950 to-zinc-950 border border-purple-500/20 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
              <Smiley weight="bold" className="w-4 h-4 text-purple-400" />
              <span>دنبال یه تجربه سریع و فان هستید؟</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              اگر هنوز نمی‌خواهید وارد پروژه‌های کاری شوید، می‌توانید با ساخت یک آواتار یا تصویر فانتزی در کمتر از ۱۰ ثانیه شروع کنید.
            </p>
            <button
              id="btn-start-fun-path"
              type="button"
              onClick={handleStartFunPath}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-xs font-medium text-purple-200 hover:text-white transition-all cursor-pointer"
            >
              <MagicWand weight="bold" className="w-3.5 h-3.5 text-purple-300" />
              <span>شروع با تست تصویری سریع و فان</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM NAV ACTIONS */}
      {/* ========================================================================= */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between gap-4 pt-4 border-t border-white/[0.06]"
      >
        <button
          id="btn-recommendations-back"
          type="button"
          onClick={prevStep}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <ArrowRight weight="bold" className="w-3.5 h-3.5" />
          <span>بازگشت به نقشه اکوسیستم</span>
        </button>

        <span className="text-xs text-zinc-500 hidden sm:inline-block">
          لوما برای تمام تخصص‌های شما ابزار مجزا فراهم کرده است
        </span>
      </motion.div>

      {/* Why These Explanation Modal */}
      <WhyTheseModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
        onEditPreferences={() => goToStep(2)}
        selectedProfessions={selectedProfessions}
        selectedInterests={selectedInterests}
        recommendations={toolRecommendations}
        professionLabels={professionLabels}
        interestLabels={interestLabels}
      />
    </motion.div>
  );
}
