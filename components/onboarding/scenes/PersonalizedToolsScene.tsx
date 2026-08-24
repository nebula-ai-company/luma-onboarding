'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import {
  MagicWand,
  PaintBrush,
  FilmStrip,
  PlayCircle,
  VideoCamera,
  ArrowsOutSimple,
  Scissors,
  TShirt,
  SpeakerHigh,
  ChatCircleDots,
  CirclesThreePlus,
  Robot,
  Code,
  Sparkle,
  ArrowLeft,
  ArrowRight,
  Smiley,
  CheckCircle,
} from '@phosphor-icons/react';
import { useOnboarding } from '@/context/OnboardingContext';
import { useLumaFeatureFlags } from '@/context/LumaIntegrationContext';
import {
  deriveToolRecommendations,
  LUMA_TOOLS_CATALOG,
} from '@/lib/onboarding-data';
import type { ToolRecommendation } from '@/types/onboarding';

const ICON_MAP: Record<string, React.ElementType> = {
  MagicWand,
  PaintBrush,
  FilmStrip,
  PlayCircle,
  VideoCamera,
  ArrowsOutSimple,
  Scissors,
  TShirt,
  SpeakerHigh,
  ChatCircleDots,
  CirclesThreePlus,
  Robot,
  Code,
};

export function PersonalizedToolsScene() {
  const {
    selectedProfessions = [],
    selectedInterests = [],
    toolRecommendations = [],
    selectedRecommendedTool,
    setSelectedRecommendedTool,
    proceedToFirstCreation,
    completeOnboarding,
    prevStep,
  } = useOnboarding();

  const featureFlags = useLumaFeatureFlags();
  const shouldReduceMotion = useReducedMotion();

  // Crash-safe recommendation calculation with fallback guarantee
  const computedFallback = deriveToolRecommendations(
    selectedProfessions || [],
    selectedInterests || []
  );

  const safeRecommendations: ToolRecommendation[] =
    toolRecommendations && toolRecommendations.length > 0
      ? toolRecommendations
      : computedFallback.recommendations && computedFallback.recommendations.length > 0
      ? computedFallback.recommendations
      : deriveToolRecommendations([], []).recommendations;

  // Active primary tool determination
  const primaryRecommendation: ToolRecommendation =
    safeRecommendations.find((t) => t.id === selectedRecommendedTool) ||
    safeRecommendations[0] || {
      id: 'generate-image',
      actionId: 'generate-image',
      title: 'ساخت تصویر',
      description: 'ساخت تصویر از توضیح متنی',
      route: '/service/generate-image',
      score: 100,
      reasons: ['مناسب برای شروع کار در لوما'],
      primaryReason: 'به خاطر علاقه‌ات به ساخت محتوای تصویری با هوش مصنوعی',
      category: 'تولید تصویر',
      iconName: 'MagicWand',
      examples: [
        'ایده‌ات رو با یک توضیح کوتاه به تصویر تبدیل کنی',
        'کاورها و تصاویر جذاب برای شبکه‌های اجتماعی تولید کنی',
      ],
      previewType: 'image_gen',
      primaryCtaText: 'اولین تصویرم رو بسازیم',
      isFastResult: true,
    };

  // Up to 3 secondary recommendations
  const secondaryRecommendations: ToolRecommendation[] = safeRecommendations
    .filter((t) => t.id !== primaryRecommendation.id)
    .slice(0, 3);

  const PrimaryIcon = ICON_MAP[primaryRecommendation.iconName] || MagicWand;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
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
      className="relative z-10 w-full max-w-4xl mx-auto px-4 py-2 sm:py-6 select-none flex flex-col items-center"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-100 tracking-tight mb-2 sm:mb-3">
          از این ابزار شروع کن
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-medium leading-relaxed">
          با توجه به چیزهایی که انتخاب کردی، این سریع‌ترین مسیر برای شروعه.
        </p>
      </motion.div>

      {/* Main Recommended Tool Showcase Card */}
      <motion.div
        variants={itemVariants}
        className="w-full max-w-2xl p-6 sm:p-7 rounded-3xl bg-zinc-900/80 border border-purple-500/30 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] ring-1 ring-purple-500/20 mb-6 relative overflow-hidden"
      >
        {/* Subtle Ambient Radial Highlight */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-purple-950/90 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)] shrink-0">
              <PrimaryIcon weight="duotone" className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-zinc-100">
                  {primaryRecommendation.title}
                </h2>
                <span className="text-[10px] font-medium text-purple-300 bg-purple-950/80 border border-purple-400/30 px-2 py-0.5 rounded-full">
                  پیشنهاد اول
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 mt-0.5">
                {primaryRecommendation.description}
              </p>
            </div>
          </div>
        </div>

        {/* Personalized reason */}
        {primaryRecommendation.primaryReason && (
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 mb-4 text-xs text-purple-200/90 flex items-center gap-2">
            <Sparkle weight="fill" className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong>دلیل پیشنهاد:</strong> {primaryRecommendation.primaryReason}
            </span>
          </div>
        )}

        {/* Practical Example Outputs */}
        {primaryRecommendation.examples && primaryRecommendation.examples.length > 0 && (
          <div className="space-y-1.5 mb-6">
            <span className="text-[11px] font-medium text-zinc-400">با این ابزار می‌تونی:</span>
            {primaryRecommendation.examples.slice(0, 2).map((example, idx) => (
              <div
                key={`primary-ex-${idx}`}
                className="flex items-center gap-2 text-xs text-zinc-300 bg-white/[0.03] border border-white/[0.05] px-3 py-2 rounded-lg"
              >
                <CheckCircle weight="bold" className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{example}</span>
              </div>
            ))}
          </div>
        )}

        {/* Primary CTA */}
        <button
          id="btn-primary-tool-start"
          type="button"
          onClick={() => {
            if (featureFlags.enableFirstCreation) {
              proceedToFirstCreation('recommended', primaryRecommendation.id);
            } else {
              completeOnboarding();
            }
          }}
          className="group relative w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white font-semibold text-sm sm:text-base shadow-[0_0_24px_-4px_rgba(168,85,247,0.5)] hover:shadow-[0_0_32px_0px_rgba(192,132,252,0.65)] ring-1 ring-white/20 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 cursor-pointer"
        >
          <span>
            {featureFlags.enableFirstCreation
              ? primaryRecommendation.primaryCtaText || 'اولین خروجی رو بسازیم'
              : `شروع کار با ${primaryRecommendation.title}`}
          </span>
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm group-hover:-translate-x-1 transition-transform duration-300">
            <ArrowLeft weight="bold" className="w-3.5 h-3.5 text-white" />
          </span>
        </button>
      </motion.div>

      {/* Secondary Tools Section */}
      {secondaryRecommendations.length > 0 && (
        <motion.div variants={itemVariants} className="w-full max-w-2xl mb-6">
          <h3 className="text-xs font-bold text-zinc-400 mb-3 text-right">
            بعداً این‌ها هم به کارت میان:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {secondaryRecommendations.map((tool) => {
              const ToolIcon = ICON_MAP[tool.iconName] || MagicWand;

              return (
                <div
                  key={`sec-tool-${tool.id}`}
                  id={`card-sec-tool-${tool.id}`}
                  onClick={() => setSelectedRecommendedTool(tool.id)}
                  className="p-3.5 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/90 border border-white/[0.06] hover:border-purple-500/30 transition-all duration-200 cursor-pointer text-right group"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-purple-300 group-hover:bg-purple-950/60 transition-colors flex items-center justify-center shrink-0">
                      <ToolIcon weight="duotone" className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                      {tool.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Fun Path Alternative Card (Conditionally rendered by feature flag) */}
      {featureFlags.enableFunCreation && (
        <motion.div
          variants={itemVariants}
          className="w-full max-w-2xl p-4 sm:p-5 rounded-2xl bg-zinc-950/60 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-3 text-right w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Smiley weight="duotone" className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-200">
                یه چیز سرگرم‌کننده امتحان کنیم
              </h4>
              <p className="text-[11px] text-zinc-400">
                عکست رو بده و یکی از قالب‌های خلاقانه لوما رو امتحان کن.
              </p>
            </div>
          </div>

          <button
            id="btn-fun-mode-start"
            type="button"
            onClick={() => proceedToFirstCreation('fun')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-zinc-200 hover:text-white transition-all duration-200 cursor-pointer shrink-0"
          >
            شروع قالب سرگرم‌کننده
          </button>
        </motion.div>
      )}

      {/* Back Button */}
      <motion.div variants={itemVariants} className="w-full flex justify-center">
        <button
          id="btn-personalized-tools-back"
          type="button"
          onClick={prevStep}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all duration-200 cursor-pointer"
        >
          <ArrowRight weight="bold" className="w-3.5 h-3.5" />
          <span>مرحله قبل</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
