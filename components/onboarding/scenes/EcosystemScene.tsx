'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkle,
  Compass,
  Play,
  Stop,
  CheckCircle,
  Eye,
  Sliders,
} from '@phosphor-icons/react';
import { useOnboarding } from '@/context/OnboardingContext';
import { LumaEcosystemMap } from '@/components/onboarding/LumaEcosystemMap';
import { DashboardLocationPreview } from '@/components/onboarding/DashboardLocationPreview';
import {
  getPersonalizedCtaText,
  derivePrimarySections,
} from '@/lib/onboarding-data';
import type { LumaSectionId } from '@/types/onboarding';
import { trackOnboardingEvent } from '@/lib/analytics';

export function EcosystemScene() {
  const {
    selectedProfessions,
    selectedInterests,
    primarySections,
    exploredSections,
    nextStep,
    prevStep,
    setGuidedExplorationSkipped,
    setEcosystemTourCompleted,
  } = useOnboarding();

  const shouldReduceMotion = useReducedMotion();

  // Active highlighted section (defaults to the first primary section)
  const [activeSectionId, setActiveSectionId] = useState<LumaSectionId>(
    primarySections[0] || 'ai_tools'
  );

  // Guided Quick Tour State ("یه نگاه سریع بندازیم")
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourTimerRef = useRef<NodeJS.Timeout | null>(null);

  const personalizedCta = getPersonalizedCtaText(selectedProfessions);

  // Stop tour if user manual clicks another section
  const handleSelectSection = (sectionId: LumaSectionId) => {
    if (isTourRunning) {
      stopTour(false);
    }
    setActiveSectionId(sectionId);
  };

  // Start the automated quick tour through the 3 primary sections
  const startTour = () => {
    if (primarySections.length === 0) return;
    trackOnboardingEvent('onboarding_quick_tour_started');
    setIsTourRunning(true);
    setTourIndex(0);
    setActiveSectionId(primarySections[0]);
  };

  // Stop tour
  const stopTour = useCallback((completed = false) => {
    if (tourTimerRef.current) {
      clearTimeout(tourTimerRef.current);
      tourTimerRef.current = null;
    }
    setIsTourRunning(false);
    if (completed) {
      setEcosystemTourCompleted(true);
      trackOnboardingEvent('onboarding_quick_tour_completed');
    } else {
      trackOnboardingEvent('onboarding_quick_tour_skipped');
    }
  }, [setEcosystemTourCompleted]);

  // Tour progression loop
  useEffect(() => {
    if (!isTourRunning) return;

    tourTimerRef.current = setTimeout(() => {
      const nextIdx = tourIndex + 1;
      if (nextIdx < primarySections.length) {
        setTourIndex(nextIdx);
        setActiveSectionId(primarySections[nextIdx]);
      } else {
        stopTour(true);
      }
    }, 1800);

    return () => {
      if (tourTimerRef.current) clearTimeout(tourTimerRef.current);
    };
  }, [isTourRunning, tourIndex, primarySections, stopTour]);

  const handleProceed = () => {
    trackOnboardingEvent('onboarding_recommendations_requested', {
      primarySections,
      exploredCount: exploredSections.length,
    });
    nextStep();
  };

  const handleSelfExplore = () => {
    setGuidedExplorationSkipped(true);
    handleProceed();
  };

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
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
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
      className="relative z-10 w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 select-none"
    >
      {/* ========================================================================= */}
      {/* TOP REVEAL BANNER & HEADLINE */}
      {/* ========================================================================= */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-400/30 text-purple-200 text-xs font-semibold mb-3 shadow-[0_0_12px_rgba(168,85,247,0.3)]"
        >
          <Sparkle weight="fill" className="w-3.5 h-3.5 text-yellow-300" />
          <span>اکوسیستم شخصی‌سازی‌شده لوما</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-100 mb-2.5 tracking-tight"
        >
          این لوماست؛ برای تو.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base text-zinc-300 leading-relaxed font-medium"
        >
          بر اساس چیزهایی که انتخاب کردی، این بخش‌ها احتمالاً بیشتر به کارت میان.
        </motion.p>
      </div>

      {/* ========================================================================= */}
      {/* QUICK TOUR CONTROLS BAR */}
      {/* ========================================================================= */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md mb-6 max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <Compass weight="bold" className="w-4 h-4 text-purple-400" />
          <span>می‌خوای با بخش‌های اصلی سریع آشنا بشی؟</span>
        </div>

        {isTourRunning ? (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-purple-300 animate-pulse">
              بخش {tourIndex + 1} از {primarySections.length}
            </span>
            <button
              id="btn-stop-tour"
              type="button"
              onClick={() => stopTour(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-semibold hover:bg-red-900 transition-colors cursor-pointer"
            >
              <Stop weight="fill" className="w-3 h-3 text-red-300" />
              <span>توقف تور</span>
            </button>
          </div>
        ) : (
          <button
            id="btn-start-tour"
            type="button"
            onClick={startTour}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-600/80 hover:bg-purple-600 border border-purple-400/40 text-white text-xs font-medium transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play weight="fill" className="w-3 h-3 text-purple-200" />
            <span>یه نگاه سریع بندازیم</span>
          </button>
        )}
      </motion.div>

      {/* ========================================================================= */}
      {/* MAIN ECOSYSTEM INTERACTIVE GRID */}
      {/* 2-Column Desktop Architecture: Left Interactive Map, Right Real Dashboard Preview */}
      {/* ========================================================================= */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
        {/* Main Map Constellation Canvas (8 cols on lg) */}
        <div className="lg:col-span-8">
          <LumaEcosystemMap
            activeSectionId={activeSectionId}
            onSectionSelect={handleSelectSection}
            isTouring={isTourRunning}
          />
        </div>

        {/* Real Product Location Preview (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <DashboardLocationPreview
            activeSectionId={activeSectionId}
            onSelectSection={handleSelectSection}
          />

          {/* Real-time exploration progress pill */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-white/[0.06] flex items-center justify-between text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <Eye weight="bold" className="w-4 h-4 text-purple-400" />
              <span>وضعیت آشنایی:</span>
            </div>
            <span className="font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/20">
              {exploredSections.length} بخش بررسی شد
            </span>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* CONTEXTUAL ACTION CONTROLS */}
      {/* Back, Self-Explore, and Personalized Dynamic CTA */}
      {/* ========================================================================= */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.06]"
      >
        {/* Back Button to Confirmation */}
        <button
          id="btn-ecosystem-back"
          type="button"
          onClick={prevStep}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <ArrowRight weight="bold" className="w-3.5 h-3.5" />
          <span>تغییر اولویت‌ها</span>
        </button>

        {/* Right CTA Actions */}
        <div className="w-full sm:w-auto flex flex-col-reverse sm:flex-row items-center gap-3">
          {/* Secondary Self-Explore CTA */}
          <button
            id="btn-self-explore"
            type="button"
            onClick={handleSelfExplore}
            className="w-full sm:w-auto px-5 py-3 rounded-full text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-colors cursor-pointer hover:bg-white/[0.04]"
          >
            خودم می‌گردم
          </button>

          {/* Primary Personalized Contextual CTA */}
          <button
            id="btn-ecosystem-proceed"
            type="button"
            onClick={handleProceed}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white font-medium text-sm sm:text-base shadow-[0_0_24px_-4px_rgba(168,85,247,0.5)] hover:shadow-[0_0_32px_0px_rgba(192,132,252,0.65)] ring-1 ring-white/20 hover:scale-[1.015] active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer"
          >
            <span>{personalizedCta}</span>
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm group-hover:-translate-x-1 transition-transform duration-300">
              <ArrowLeft weight="bold" className="w-3.5 h-3.5 text-white" />
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
