'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkle, Sliders, CheckCircle, Lightbulb, Target } from '@phosphor-icons/react';
import type { ToolRecommendation } from '@/types/onboarding';

interface WhyTheseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditPreferences: () => void;
  selectedProfessions: string[];
  selectedInterests: string[];
  recommendations: ToolRecommendation[];
  professionLabels: Record<string, string>;
  interestLabels: Record<string, string>;
}

export function WhyTheseModal({
  isOpen,
  onClose,
  onEditPreferences,
  selectedProfessions,
  selectedInterests,
  recommendations,
  professionLabels,
  interestLabels,
}: WhyTheseModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative w-full max-w-lg rounded-3xl bg-zinc-950/95 border border-white/10 p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] z-10 text-right overflow-hidden"
            dir="rtl"
          >
            {/* Ambient subtle glow inside modal */}
            <div
              className="absolute top-0 right-0 w-64 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Lightbulb weight="fill" className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    چرا این ابزارها پیشنهاد شدند؟
                  </h3>
                  <p className="text-xs text-zinc-400">
                    منطق تحلیل و تطبیق هوشمند لوما
                  </p>
                </div>
              </div>

              <button
                id="btn-close-why-modal"
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="بستن"
              >
                <X weight="bold" className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pl-1 text-xs sm:text-sm">
              {/* How it works note */}
              <div className="p-3.5 rounded-2xl bg-purple-950/25 border border-purple-500/20 text-purple-200/90 leading-relaxed text-xs">
                لوما به جای پیشنهادهای عمومی، بر اساس تخصص کاری و اولویت‌های خلاقانه‌ای که مشخص کردید ابزارهایی را که سریع‌ترین و باکیفیت‌ترین خروجی را می‌دهند رتبه‌بندی کرده است.
              </div>

              {/* Selected Criteria Summary */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                  <Target weight="bold" className="w-3.5 h-3.5 text-purple-400" />
                  ورودی‌های پروفایل شما:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfessions.map((p) => (
                    <span
                      key={p}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-300 text-xs"
                    >
                      تخصص: {professionLabels[p] || p}
                    </span>
                  ))}
                  {selectedInterests.map((i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs"
                    >
                      علاقه: {interestLabels[i] || i}
                    </span>
                  ))}
                </div>
              </div>

              {/* Top recommendations breakdown */}
              <div className="space-y-2.5 pt-1">
                <span className="text-xs font-semibold text-zinc-400">
                  دلیل رتبه‌بندی ابزارها:
                </span>
                {recommendations.slice(0, 3).map((rec, idx) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] flex items-start gap-2.5"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-md bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-mono font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-100 text-xs">
                          {rec.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {rec.categoryTitle}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {rec.personalizedReason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
              <button
                id="btn-edit-preferences-from-modal"
                type="button"
                onClick={() => {
                  onClose();
                  onEditPreferences();
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <Sliders weight="bold" className="w-3.5 h-3.5 text-purple-400" />
                <span>ویرایش انتخاب‌های اولیه</span>
              </button>

              <button
                id="btn-confirm-why-modal"
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
              >
                متوجه شدم
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
