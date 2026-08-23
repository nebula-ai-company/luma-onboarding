'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useOnboarding } from '@/context/OnboardingContext';

const STEP_LABELS = [
  'خوش‌آمدید',
  'انتخاب تخصص',
  'اهداف و علاقه‌مندی‌ها',
  'شخصی‌سازی',
  'اکوسیستم لوما',
  'ابزارهای پیشنهادی',
  'اولین خروجی',
];


export function ProgressIndicator({ className = '' }: { className?: string }) {
  const { currentStep, totalSteps } = useOnboarding();

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-950/40 border border-white/[0.06] backdrop-blur-md ${className}`}
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`مرحله ${currentStep + 1} از ${totalSteps}: ${STEP_LABELS[currentStep] || ''}`}
    >
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep;
        const isPast = index < currentStep;

        return (
          <div
            key={index}
            className="relative flex items-center justify-center"
            title={STEP_LABELS[index]}
          >
            <div
              className={`h-1 rounded-full transition-all duration-500 ${
                isActive
                  ? 'w-6 bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]'
                  : isPast
                  ? 'w-3.5 bg-purple-500/45'
                  : 'w-2 bg-zinc-800/80'
              }`}
            />
            {isActive && (
              <motion.div
                layoutId="progress-active-glow"
                className="absolute inset-0 rounded-full bg-purple-300/30 blur-[2px]"
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
