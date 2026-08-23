'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Rocket,
  CheckCircle,
  Sparkle,
  ArrowLeft,
  FolderSimple,
  MagicWand,
  CirclesThreePlus,
  Play,
  Copy,
  Check,
} from '@phosphor-icons/react';
import { useOnboarding } from '@/context/OnboardingContext';
import { LumaCore } from '@/components/core/LumaCore';
import { resolveOnboardingDestination } from '@/lib/destination-resolver';
import { LUMA_TOOLS_CATALOG } from '@/lib/onboarding-data';

export function OnboardingHandoff() {
  const state = useOnboarding();
  const {
    finishTransitionToWorkspace,
    isSkipped,
    firstCreationResult,
    firstCreationTool,
    selectedProfessions,
    selectedInterests,
    primarySections,
    toolRecommendations,
  } = state;

  const destination = resolveOnboardingDestination(state);
  const hasResult = Boolean(firstCreationResult);

  // Progressive transition staging (0 to 100%)
  const [progress, setProgress] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const steps = [
    {
      id: 'step-1',
      title: 'همگام‌سازی تخصص و اولویت‌های کاری',
      desc: `${selectedProfessions.length > 0 ? selectedProfessions.length : 0} تخصص و ${selectedInterests.length} زمینه کاری تحلیل شدند.`,
    },
    {
      id: 'step-2',
      title: 'چیدمان ابزارهای هوش مصنوعی و اولویت‌های دسترسی',
      desc: `${toolRecommendations.length} ابزار هوشمند در میز کار شخصی‌سازی شدند.`,
    },
    {
      id: 'step-3',
      title: hasResult
        ? 'ثبت خروجی اولیه در «فایل‌های من» و آماده‌سازی فضای ابزار'
        : 'آماده‌سازی دسترسی‌های اختصاصی و پیکربندی میز کار',
      desc: hasResult
        ? 'خروجی شما با بالاترین کیفیت برای استفاده در دسترس است.'
        : 'تمامی مدل‌ها و ابزارها آماده پردازش سریع هستند.',
    },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(40);
      setCurrentStepIndex(1);
    }, 450);

    const timer2 = setTimeout(() => {
      setProgress(80);
      setCurrentStepIndex(2);
    }, 950);

    const timer3 = setTimeout(() => {
      setProgress(100);
    }, 1450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleCopyPrompt = () => {
    if (firstCreationResult?.prompt) {
      navigator.clipboard.writeText(firstCreationResult.prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const matchedTool = LUMA_TOOLS_CATALOG.find((t) => t.id === firstCreationTool) || LUMA_TOOLS_CATALOG[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 select-none"
    >
      {/* Container Hardware Frame */}
      <div className="relative rounded-3xl bg-zinc-950/80 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Glow backdrop accent */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 blur-[100px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
          }}
        />

        {/* Top Header Transition Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-4 text-center sm:text-right">
            {/* LumaCore Transition Anchor */}
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.25)]">
                <LumaCore size="sm" interactive={false} />
              </div>
              <span className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-zinc-950 shadow-[0_0_8px_#10b981]" />
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
                  {hasResult
                    ? 'خروجی آماده شد؛ در حال اتصال به میز کار لوما'
                    : isSkipped
                    ? 'در حال راه‌اندازی میز کار لوما'
                    : 'پیکربندی شخصی‌سازی تکمیل شد'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg">
                {destination.reasonPersian}
              </p>
            </div>
          </div>

          {/* Quick Immediate Enter CTA */}
          <button
            id="btn-handoff-enter-now"
            type="button"
            onClick={finishTransitionToWorkspace}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-[0_0_25px_rgba(168,85,247,0.4)] active:scale-[0.98] transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <span>ورود مستقیم به میز کار</span>
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:-translate-x-0.5 transition-transform">
              <ArrowLeft weight="bold" className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

        {/* Dynamic Transition Canvas Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Left Column: Result or Ecosystem Showcase */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {hasResult && firstCreationResult ? (
              /* Result-based Transition Display */
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" />
                    <span className="text-xs font-bold text-zinc-200">
                      خروجی تولید شده: {firstCreationResult.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 border border-purple-500/20 px-2 py-0.5 rounded-md">
                    {firstCreationResult.dimensions || 'HD Resolution'}
                  </span>
                </div>

                {/* Media Container */}
                <div className="relative rounded-xl overflow-hidden bg-black/60 border border-white/[0.06] aspect-video flex items-center justify-center">
                  {firstCreationResult.imageUrl && (
                    <img
                      src={firstCreationResult.imageUrl}
                      alt={firstCreationResult.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {firstCreationResult.videoUrl && (
                    <video
                      src={firstCreationResult.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  )}
                  {firstCreationResult.chatResponseText && (
                    <div className="p-4 text-xs text-zinc-300 leading-relaxed overflow-y-auto max-h-48">
                      {firstCreationResult.chatResponseText}
                    </div>
                  )}

                  {/* Stored in files badge */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-md border border-white/10 text-[10px] text-zinc-300">
                    <FolderSimple weight="fill" className="w-3.5 h-3.5 text-amber-400" />
                    <span>ذخیره شده در «فایل‌های من»</span>
                  </div>
                </div>

                {/* Prompt Info */}
                {firstCreationResult.prompt && (
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/40 border border-white/[0.04] text-xs">
                    <p className="text-zinc-400 line-clamp-1 text-right flex-1 font-mono text-[11px]">
                      {firstCreationResult.prompt}
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className="text-zinc-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                      title="کپی پرامپت"
                    >
                      {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Ecosystem / Recommended sections showcase */
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] flex flex-col justify-between gap-4 h-full">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkle weight="duotone" className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-zinc-200">
                      بخش‌های در دسترس و اولویت‌دار لوما
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    میز کار شما شامل ۶ بخش یکپارچه است که بر اساس پاسخ‌های شما پیکربندی شده است.
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { title: 'ابزارهای هوش مصنوعی', icon: MagicWand, color: 'text-purple-400' },
                      { title: 'چت هوشمند چندمدلی', icon: Sparkle, color: 'text-sky-400' },
                      { title: 'ورک‌فلو و خودکارسازی', icon: CirclesThreePlus, color: 'text-indigo-400' },
                      { title: 'فایل‌ها و آرشیو خروجی', icon: FolderSimple, color: 'text-amber-400' },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]"
                        >
                          <Icon weight="duotone" className={`w-4 h-4 ${item.color}`} />
                          <span className="text-xs font-medium text-zinc-200">{item.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 bg-purple-950/30 border border-purple-500/20 p-3 rounded-xl">
                  <span>ابزار پیشنهادی اصلی شما: </span>
                  <span className="font-bold text-purple-200">{toolRecommendations[0]?.title || 'تولید تصویر'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Progressive Checklist Pipeline */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4 p-5 rounded-2xl bg-zinc-900/40 border border-white/[0.06]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-zinc-300">مراحل آماده‌سازی نهایی</span>
                <span className="text-xs font-mono font-bold text-purple-400">{progress}٪</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden mb-5">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-emerald-400"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>

              {/* Checklist items */}
              <div className="space-y-3.5">
                {steps.map((step, idx) => {
                  const isDone = progress >= ((idx + 1) / steps.length) * 100;
                  const isActive = currentStepIndex === idx && !isDone;

                  return (
                    <div
                      key={step.id}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 ${
                        isDone
                          ? 'bg-emerald-950/20 border border-emerald-500/20'
                          : isActive
                          ? 'bg-purple-950/30 border border-purple-500/30'
                          : 'bg-white/[0.02] border border-white/[0.03] opacity-60'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <CheckCircle weight="fill" className="w-4 h-4 text-emerald-400" />
                        ) : isActive ? (
                          <span className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin inline-block" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-zinc-600 inline-block" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`text-xs font-bold ${
                            isDone ? 'text-emerald-200' : isActive ? 'text-purple-200' : 'text-zinc-400'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ready indicator */}
            <div className="pt-2">
              <button
                type="button"
                onClick={finishTransitionToWorkspace}
                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer text-center"
              >
                شروع کار با لوما
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
