'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import {
  MagicWand,
  ChatCircleDots,
  CirclesThreePlus,
  Robot,
  FolderSimple,
  Code,
  ArrowLeft,
  ArrowRight,
  Sparkle,
  Compass,
} from '@phosphor-icons/react';
import { useOnboarding } from '@/context/OnboardingContext';
import {
  LUMA_SECTIONS,
  derivePrimarySections,
  getSpotlightInfo,
  getPersonalizedCtaText,
} from '@/lib/onboarding-data';
import type { LumaSectionId } from '@/types/onboarding';

const ICON_MAP: Record<string, React.ElementType> = {
  MagicWand,
  ChatCircleDots,
  CirclesThreePlus,
  Robot,
  FolderSimple,
  Code,
};

const SIDEBAR_LABEL_MAP: Record<LumaSectionId, string> = {
  ai_tools: 'ابزارهای هوش مصنوعی',
  ai_chat: 'چت هوش مصنوعی',
  workflow: 'ورک‌فلوها',
  smart_assistant: 'دستیار هوشمند',
  my_files: 'فایل‌های من',
  api_developers: 'توسعه‌دهندگان و API',
};

const SIDEBAR_LIST: { id: LumaSectionId; label: string; icon: React.ElementType }[] = [
  { id: 'ai_tools', label: 'ابزارهای هوش مصنوعی', icon: MagicWand },
  { id: 'ai_chat', label: 'چت هوش مصنوعی', icon: ChatCircleDots },
  { id: 'workflow', label: 'ورک‌فلوها', icon: CirclesThreePlus },
  { id: 'smart_assistant', label: 'دستیار هوشمند', icon: Robot },
  { id: 'my_files', label: 'فایل‌های من', icon: FolderSimple },
  { id: 'api_developers', label: 'توسعه‌دهندگان و API', icon: Code },
];

export function EcosystemScene() {
  const {
    selectedProfessions,
    selectedInterests,
    nextStep,
    prevStep,
  } = useOnboarding();

  const shouldReduceMotion = useReducedMotion();

  // Derive 3 personalized core sections
  const { primary } = derivePrimarySections(selectedProfessions, selectedInterests);
  const spotlight = getSpotlightInfo(selectedProfessions, selectedInterests);

  const [activeSectionId, setActiveSectionId] = useState<LumaSectionId>(
    primary.includes(spotlight.sectionId) ? spotlight.sectionId : primary[0] || 'ai_tools'
  );

  const primarySectionsData = primary.map((secId) => {
    const secData = LUMA_SECTIONS.find((s) => s.id === secId);
    return (
      secData || {
        id: secId,
        title: SIDEBAR_LABEL_MAP[secId],
        shortDescription: 'بخش کلیدی لوما',
        detailedExplanation: '',
        examples: ['امکانات کاربردی'],
        iconName: 'MagicWand',
        sidebarId: `nav-${secId}`,
        accentColor: '#c084fc',
      }
    );
  });

  const ctaText = getPersonalizedCtaText(selectedProfessions);

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
      className="relative z-10 w-full max-w-5xl mx-auto px-4 py-2 sm:py-6 select-none flex flex-col items-center"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-100 tracking-tight mb-2 sm:mb-3">
          لوما رو خیلی سریع بشناس
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-medium leading-relaxed">
          بیشتر کارهایی که با لوما انجام میدی، توی همین چند بخش اتفاق میافته.
        </p>
      </motion.div>

      {/* Main Grid: 3 Core Cards + Interactive Sidebar Location Preview */}
      <motion.div
        variants={itemVariants}
        className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 mb-6 sm:mb-8 items-start"
      >
        {/* The 3 Core Sections Cards (8 Cols on Desktop) */}
        <div className="lg:col-span-8 flex flex-col gap-3.5">
          {primarySectionsData.map((sec, idx) => {
            const IconComponent = ICON_MAP[sec.iconName] || MagicWand;
            const isSpotlight = sec.id === spotlight.sectionId;
            const isSelected = activeSectionId === sec.id;

            return (
              <motion.div
                key={`core-sec-${sec.id}`}
                id={`card-core-section-${sec.id}`}
                onClick={() => setActiveSectionId(sec.id)}
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer text-right border ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/40 shadow-[0_0_24px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/30'
                    : 'bg-zinc-900/50 hover:bg-zinc-900/80 border-white/[0.07] hover:border-white/[0.15]'
                }`}
              >
                {/* Spotlight Badge */}
                {isSpotlight && (
                  <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-purple-600/90 text-[10px] font-bold text-white shadow-[0_0_12px_rgba(168,85,247,0.5)] border border-purple-400/40 flex items-center gap-1">
                    <Sparkle weight="fill" className="w-3 h-3 text-amber-300" />
                    <span>احتمالاً بیشتر از اینجا شروع می‌کنی</span>
                  </div>
                )}

                <div className="flex items-start gap-3.5 sm:gap-4">
                  {/* Section Icon */}
                  <div
                    className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : 'bg-zinc-800/80 text-zinc-400 border border-white/[0.06] group-hover:text-zinc-200'
                    }`}
                  >
                    <IconComponent weight="duotone" className="w-6 h-6" />
                  </div>

                  {/* Body Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-base sm:text-lg font-bold text-zinc-100">
                        {sec.title}
                      </h3>
                      {/* Sidebar indicator tag */}
                      <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.05]">
                        منوی کناری: {SIDEBAR_LABEL_MAP[sec.id]}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-3">
                      {sec.detailedExplanation || sec.shortDescription}
                    </p>

                    {/* Example output tags */}
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[11px] text-zinc-400 ml-1">نمونه‌ها:</span>
                      {sec.examples.slice(0, 3).map((ex, exIdx) => (
                        <span
                          key={`ex-${sec.id}-${exIdx}`}
                          className="px-2 py-0.5 rounded-md text-[11px] bg-white/[0.04] border border-white/[0.06] text-zinc-300"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sidebar Location Preview Card (4 Cols on Desktop) */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl bg-zinc-950/80 border border-white/[0.08] p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Compass weight="duotone" className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-zinc-200">
                  محل قرارگیری در داشبورد
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded-full">
                Sidebar
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
              هر وقت به این بخش نیاز داشتی، از منوی سمت راست داشبورد لوما می‌تونی بهش دسترسی پیدا کنی:
            </p>

            {/* Simulated Sidebar List */}
            <div className="space-y-1.5" role="list">
              {SIDEBAR_LIST.map((item) => {
                const isActive = activeSectionId === item.id;
                const isPrimarySection = primary.includes(item.id);
                const ItemIcon = item.icon;

                return (
                  <div
                    key={`mini-sidebar-${item.id}`}
                    onClick={() => {
                      if (isPrimarySection) {
                        setActiveSectionId(item.id);
                      }
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-950/80 text-purple-200 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.25)] font-bold'
                        : isPrimarySection
                        ? 'text-zinc-300 bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06] cursor-pointer'
                        : 'text-zinc-400 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ItemIcon weight={isActive ? 'fill' : 'regular'} className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>

                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
                    ) : isPrimarySection ? (
                      <span className="text-[9px] text-purple-400/80 font-mono">پیشنهادی</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Secondary Platform Sections note */}
      <motion.p
        variants={itemVariants}
        className="text-xs text-zinc-400 text-center mb-6 sm:mb-8 font-medium"
      >
        بخش‌های دیگه لوما هم همیشه در دسترست هستن: چت، دستیار هوشمند، API و ...
      </motion.p>

      {/* Action Controls */}
      <motion.div
        variants={itemVariants}
        className="w-full flex flex-col-reverse sm:flex-row items-center justify-center gap-3"
      >
        <button
          id="btn-ecosystem-back"
          type="button"
          onClick={prevStep}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <ArrowRight weight="bold" className="w-3.5 h-3.5" />
          <span>تغییر انتخاب‌هام</span>
        </button>

        <button
          id="btn-ecosystem-proceed"
          type="button"
          onClick={nextStep}
          className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white font-medium text-sm sm:text-base shadow-[0_0_24px_-4px_rgba(168,85,247,0.5)] hover:shadow-[0_0_32px_0px_rgba(192,132,252,0.65)] ring-1 ring-white/20 hover:scale-[1.015] active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer"
        >
          <span>{ctaText || 'حالا ابزارهای مناسب من رو نشون بده'}</span>
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm group-hover:-translate-x-1 transition-transform duration-300">
            <ArrowLeft weight="bold" className="w-3.5 h-3.5 text-white" />
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}
