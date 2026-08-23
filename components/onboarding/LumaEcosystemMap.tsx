'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  MagicWand,
  ChatCircleDots,
  CirclesThreePlus,
  Robot,
  FolderSimple,
  Code,
  Sparkle,
  ArrowLeft,
  CheckCircle,
  Eye,
  Info,
} from '@phosphor-icons/react';
import type { LumaSectionId, LumaEcosystemSection } from '@/types/onboarding';
import { LumaCore } from '@/components/core/LumaCore';
import {
  LUMA_SECTIONS,
  getSpotlightInfo,
} from '@/lib/onboarding-data';
import { useOnboarding } from '@/context/OnboardingContext';
import { trackOnboardingEvent } from '@/lib/analytics';

interface LumaEcosystemMapProps {
  activeSectionId: LumaSectionId | null;
  onSectionSelect: (sectionId: LumaSectionId) => void;
  isTouring?: boolean;
}

const ICONS_MAP: Record<string, React.ElementType> = {
  MagicWand,
  ChatCircleDots,
  CirclesThreePlus,
  Robot,
  FolderSimple,
  Code,
};

export function LumaEcosystemMap({
  activeSectionId,
  onSectionSelect,
  isTouring = false,
}: LumaEcosystemMapProps) {
  const {
    selectedProfessions,
    selectedInterests,
    primarySections,
    exploredSections,
    markSectionExplored,
  } = useOnboarding();

  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax mouse coordinates for subtle ambient tilt on desktop
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const spotlight = getSpotlightInfo(selectedProfessions, selectedInterests);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || window.innerWidth < 768) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);
    setMouseOffset({
      x: Math.max(-1, Math.min(1, offsetX)) * 6,
      y: Math.max(-1, Math.min(1, offsetY)) * 6,
    });
  }, [shouldReduceMotion]);

  const handleMouseLeave = useCallback(() => {
    setMouseOffset({ x: 0, y: 0 });
  }, []);

  const handleSelect = (sectionId: LumaSectionId) => {
    onSectionSelect(sectionId);
    markSectionExplored(sectionId);
    trackOnboardingEvent('onboarding_section_opened', {
      sectionId,
      isPrimary: primarySections.includes(sectionId),
    });
  };

  // Group sections into Primary (3) and Secondary (3)
  const primaryList = LUMA_SECTIONS.filter((s) => primarySections.includes(s.id));
  const secondaryList = LUMA_SECTIONS.filter((s) => !primarySections.includes(s.id));

  // Active section data for expanded details
  const activeSectionData = LUMA_SECTIONS.find((s) => s.id === activeSectionId) || primaryList[0];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full select-none"
    >
      {/* ========================================================================= */}
      {/* DESKTOP CONSTELLATION MAP (Visible on md and above) */}
      {/* ========================================================================= */}
      <div className="hidden md:block relative w-full min-h-[460px] lg:min-h-[500px] rounded-3xl bg-zinc-950/70 border border-white/[0.08] p-6 lg:p-8 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md">
        {/* Subtle grid background layer */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(168, 85, 247, 0.4) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />

        {/* Ambient glow behind central core */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none opacity-40 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(124,58,237,0.1) 50%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Dynamic SVG Energy Connection Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Central radial concentric faint orbit rings */}
          <circle cx="50%" cy="48%" r="140" fill="none" stroke="rgba(168, 85, 247, 0.08)" strokeDasharray="4 6" />
          <circle cx="50%" cy="48%" r="220" fill="none" stroke="rgba(255, 255, 255, 0.04)" />
        </svg>

        {/* Central LumaCore with Parallax */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: mouseOffset.x * 0.5,
                  y: mouseOffset.y * 0.5,
                }
          }
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none"
        >
          <LumaCore variant="ecosystem" />
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-1 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-400/30 text-[10px] text-purple-200 font-mono"
          >
            هسته هوشمند لوما
          </motion.div>
        </motion.div>

        {/* 3 Primary Orbiting Nodes (Top Tier) */}
        <div className="relative z-20 grid grid-cols-3 gap-4 lg:gap-6 mb-8">
          {primaryList.map((section, idx) => {
            const isSelected = activeSectionId === section.id;
            const isSpotlight = spotlight.sectionId === section.id;
            const isExplored = exploredSections.includes(section.id);
            const Icon = ICONS_MAP[section.iconName] || Sparkle;

            return (
              <motion.button
                key={`primary-node-${section.id}`}
                id={`ecosystem-node-${section.id}`}
                type="button"
                onClick={() => handleSelect(section.id)}
                onMouseEnter={() => {
                  trackOnboardingEvent('onboarding_section_highlighted', { sectionId: section.id });
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: shouldReduceMotion ? 0 : mouseOffset.x * (idx === 0 ? -1 : idx === 2 ? 1 : 0),
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 * idx,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ scale: 1.025, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative text-right p-4 lg:p-5 rounded-2xl transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                  isSelected
                    ? 'bg-gradient-to-b from-purple-950/90 via-zinc-900/90 to-zinc-950/90 border-2 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.35)]'
                    : 'bg-zinc-900/70 hover:bg-zinc-900/90 border border-purple-500/30 hover:border-purple-400/60 shadow-[0_8px_24px_rgba(0,0,0,0.4)]'
                }`}
                aria-expanded={isSelected}
              >
                {/* Spotlight Badge */}
                {isSpotlight && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-300/40 text-white text-[10px] font-semibold flex items-center gap-1 shadow-[0_2px_10px_rgba(168,85,247,0.5)]">
                    <Sparkle weight="fill" className="w-2.5 h-2.5 text-yellow-300" />
                    <span>پیشنهاد اول برای شما</span>
                  </div>
                )}

                {/* Header row with Icon and status */}
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-200 ${
                      isSelected
                        ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(192,132,252,0.6)]'
                        : 'bg-purple-950/60 text-purple-300 border border-purple-500/30 group-hover:bg-purple-900/70'
                    }`}
                  >
                    <Icon weight="bold" className="w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isExplored && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                        <CheckCircle weight="fill" className="w-2.5 h-2.5" />
                        <span>مشاهده شد</span>
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-purple-500/15 border border-purple-400/20 text-purple-300">
                      بخش کلیدی {idx + 1}
                    </span>
                  </div>
                </div>

                {/* Section Title */}
                <h3 className="text-sm lg:text-base font-bold text-zinc-100 group-hover:text-purple-200 mb-1 flex items-center justify-between">
                  <span>{section.title}</span>
                  <ArrowLeft
                    weight="bold"
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isSelected ? 'text-purple-300 -translate-x-1' : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}
                  />
                </h3>

                {/* Short description */}
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {section.shortDescription}
                </p>

                {/* Active Indicator Bar */}
                {isSelected && (
                  <motion.div
                    layoutId="desktop-active-bar"
                    className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 shadow-[0_0_8px_#c084fc]"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Central Gap for LumaCore visibility */}
        <div className="h-20 lg:h-24 pointer-events-none" />

        {/* 3 Secondary Orbiting Nodes (Bottom Tier) */}
        <div className="relative z-20 grid grid-cols-3 gap-3 lg:gap-5">
          {secondaryList.map((section, idx) => {
            const isSelected = activeSectionId === section.id;
            const isExplored = exploredSections.includes(section.id);
            const Icon = ICONS_MAP[section.iconName] || Sparkle;

            return (
              <motion.button
                key={`secondary-node-${section.id}`}
                id={`ecosystem-node-${section.id}`}
                type="button"
                onClick={() => handleSelect(section.id)}
                onMouseEnter={() => {
                  trackOnboardingEvent('onboarding_section_highlighted', { sectionId: section.id });
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: shouldReduceMotion ? 0 : mouseOffset.x * (idx === 0 ? -0.6 : idx === 2 ? 0.6 : 0),
                }}
                transition={{
                  duration: 0.45,
                  delay: 0.25 + 0.08 * idx,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative text-right p-3.5 lg:p-4 rounded-xl transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                  isSelected
                    ? 'bg-zinc-900/95 border-2 border-purple-400/80 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                    : 'bg-zinc-900/40 hover:bg-zinc-900/70 border border-white/[0.06] hover:border-purple-500/30'
                }`}
                aria-expanded={isSelected}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center justify-center w-7 h-7 rounded-lg ${
                        isSelected
                          ? 'bg-purple-500/30 text-purple-300'
                          : 'bg-white/[0.04] text-zinc-400 group-hover:text-zinc-300'
                      }`}
                    >
                      <Icon weight="regular" className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                      {section.title}
                    </h4>
                  </div>

                  {isExplored && (
                    <CheckCircle weight="fill" className="w-3 h-3 text-emerald-400" />
                  )}
                </div>

                <p className="text-[11px] text-zinc-400 line-clamp-1 pr-9">
                  {section.shortDescription}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE VERTICAL STREAM (Visible on screens < md) */}
      {/* Purpose-built vertical flow: Core at top, Primary cards, Secondary cards */}
      {/* ========================================================================= */}
      <div className="md:hidden space-y-4">
        {/* Mobile Header with Mini LumaCore */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/80 border border-purple-500/20 shadow-md">
          <div className="flex items-center gap-3">
            <LumaCore variant="step" className="w-12 h-12" />
            <div>
              <div className="text-xs font-bold text-zinc-100">اکوسیستم هوشمند لوما</div>
              <div className="text-[10px] text-purple-300">طراحی‌شده بر اساس تخصص شما</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.05] px-2 py-1 rounded-full">
            {exploredSections.length} از ۶ بخش
          </span>
        </div>

        {/* Primary Sections on Mobile */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-semibold text-purple-300 pr-1 flex items-center gap-1.5">
            <Sparkle weight="bold" className="w-3 h-3 text-purple-400" />
            <span>بخش‌های کلیدی متناسب با نیاز شما:</span>
          </div>

          {primaryList.map((section, idx) => {
            const isSelected = activeSectionId === section.id;
            const isSpotlight = spotlight.sectionId === section.id;
            const isExplored = exploredSections.includes(section.id);
            const Icon = ICONS_MAP[section.iconName] || Sparkle;

            return (
              <motion.button
                key={`mobile-primary-${section.id}`}
                id={`mobile-node-${section.id}`}
                type="button"
                onClick={() => handleSelect(section.id)}
                whileTap={{ scale: 0.98 }}
                className={`relative w-full text-right p-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-950/80 border-2 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                    : 'bg-zinc-900/80 border border-purple-500/25'
                }`}
              >
                {isSpotlight && (
                  <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-bold shadow">
                    پیشنهاد اول
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-xl ${
                        isSelected ? 'bg-purple-500 text-white' : 'bg-purple-950/80 text-purple-300'
                      }`}
                    >
                      <Icon weight="bold" className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-100">{section.title}</h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">{section.shortDescription}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-0.5">
                    {isExplored && <CheckCircle weight="fill" className="w-3.5 h-3.5 text-emerald-400" />}
                    <ArrowLeft
                      weight="bold"
                      className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-300' : 'text-zinc-500'}`}
                    />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Secondary Sections Collapsible / Mini Grid on Mobile */}
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-semibold text-zinc-400 pr-1">سایر امکانات پلتفرم لوما:</div>
          <div className="grid grid-cols-1 gap-2">
            {secondaryList.map((section) => {
              const isSelected = activeSectionId === section.id;
              const isExplored = exploredSections.includes(section.id);
              const Icon = ICONS_MAP[section.iconName] || Sparkle;

              return (
                <button
                  key={`mobile-secondary-${section.id}`}
                  type="button"
                  onClick={() => handleSelect(section.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-right transition-all duration-150 ${
                    isSelected
                      ? 'bg-zinc-900 border border-purple-400 text-white'
                      : 'bg-zinc-900/40 border border-white/[0.06] text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon weight="regular" className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-xs">{section.title}</span>
                  </div>
                  {isExplored && <CheckCircle weight="fill" className="w-3 h-3 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* IN-PLACE EXPANDED SECTION DETAILS CARD */}
      {/* Displays detailed Persian explanation + concrete examples */}
      {/* ========================================================================= */}
      <AnimatePresence mode="wait">
        {activeSectionData && (
          <motion.div
            key={`detail-card-${activeSectionData.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 p-4 sm:p-5 rounded-2xl bg-zinc-900/80 border border-purple-500/30 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  <Info weight="bold" className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="text-xs text-purple-400 font-mono">بررسی جزئیات بخش:</span>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {activeSectionData.title}
                  </h4>
                </div>
              </div>

              <span className="text-[11px] text-zinc-400 bg-white/[0.04] px-2.5 py-1 rounded-full w-fit">
                {activeSectionData.shortDescription}
              </span>
            </div>

            {/* Detailed Persian Explanation */}
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed mb-4">
              {activeSectionData.detailedExplanation}
            </p>

            {/* Concrete Examples Tag Stream */}
            <div>
              <div className="text-[11px] font-medium text-zinc-400 mb-2">
                قابلیت‌ها و خروجی‌های این بخش:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeSectionData.examples.map((ex, i) => (
                  <span
                    key={`example-tag-${i}`}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-950/50 border border-purple-500/30 text-purple-200"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
