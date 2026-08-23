'use client';

import React, { useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { useOnboarding } from '@/context/OnboardingContext';
import { ProgressIndicator } from '@/components/onboarding/ProgressIndicator';
import { WelcomeScene } from '@/components/onboarding/scenes/WelcomeScene';
import { ProfessionScene } from '@/components/onboarding/scenes/ProfessionScene';
import { InterestsScene } from '@/components/onboarding/scenes/InterestsScene';
import { ConfirmationScene } from '@/components/onboarding/scenes/ConfirmationScene';
import { EcosystemScene } from '@/components/onboarding/scenes/EcosystemScene';
import { PersonalizedToolsScene } from '@/components/onboarding/scenes/PersonalizedToolsScene';
import { FirstCreationScene } from '@/components/onboarding/scenes/FirstCreationScene';
import { CompletedView } from '@/components/onboarding/scenes/CompletedView';

export function OnboardingShell() {
  const { currentStep, onboardingCompleted, skipOnboarding } = useOnboarding();

  // Keyboard navigation support: Escape to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (onboardingCompleted) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        skipOnboarding();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onboardingCompleted, skipOnboarding]);

  const renderScene = () => {
    if (onboardingCompleted) {
      return <CompletedView key="completed-view" />;
    }

    switch (currentStep) {
      case 0:
        return <WelcomeScene key="welcome-scene" />;
      case 1:
        return <ProfessionScene key="profession-scene" />;
      case 2:
        return <InterestsScene key="interests-scene" />;
      case 3:
        return <ConfirmationScene key="confirmation-scene" />;
      case 4:
        return <EcosystemScene key="ecosystem-scene" />;
      case 5:
        return <PersonalizedToolsScene key="personalized-tools-scene" />;
      case 6:
      default:
        return <FirstCreationScene key="first-creation-scene" />;
    }
  };


  return (
    <div
      dir="rtl"
      className="relative min-h-[100dvh] w-full bg-[#07070b] text-zinc-100 flex flex-col justify-between overflow-x-hidden font-sans selection:bg-purple-500/30 selection:text-purple-200"
    >
      {/* Background Architectural Ambient Light - Controlled & subtle */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      >
        {/* Subtle upper center purple bloom */}
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-35 blur-[130px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(147, 51, 234, 0.28) 0%, rgba(76, 29, 149, 0.12) 50%, transparent 80%)',
          }}
        />

        {/* Ambient bottom-right subtle horizon aura */}
        <div
          className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[400px] rounded-full opacity-20 blur-[120px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(192, 132, 252, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* Fine background grid or hairline noise pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Top Header Shell */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-4 sm:pt-6 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-900/40 border border-purple-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.25)]">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-400 rotate-45 shadow-[0_0_6px_#c084fc]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wider text-zinc-100 uppercase font-mono">
              LUMA
            </span>
            <span className="text-[10px] text-purple-300/60 font-medium">
              پلتفرم هوش مصنوعی
            </span>
          </div>
        </div>

        {/* Minimal Understated Progression Indicator (Visible during active steps) */}
        {!onboardingCompleted && (
          <div className="flex items-center gap-4">
            <ProgressIndicator />
          </div>
        )}

        {/* Skip button in header for quick dismissal */}
        {!onboardingCompleted ? (
          <button
            id="btn-header-skip"
            type="button"
            onClick={skipOnboarding}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.04] cursor-pointer"
          >
            رد کردن
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>آماده به کار</span>
          </div>
        )}
      </header>

      {/* Main Experience Content Stage */}
      <main className="relative z-10 w-full max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6">
        <AnimatePresence mode="wait">
          {renderScene()}
        </AnimatePresence>
      </main>

      {/* Subtle Footer Bar */}
      <footer className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-8 pb-4 sm:pb-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500 border-t border-white/[0.04] pt-3">
        <div className="flex items-center gap-2">
          <span className="text-zinc-600 font-mono">LUMA v2.4</span>
          <span className="text-zinc-700">•</span>
          <span>طراحی شده برای حرفه‌ای‌ها و تولیدکنندگان محتوا</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-500 text-[11px]">
          <span>کلید میانبر: <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/10 font-mono text-[10px] text-zinc-400">Esc</kbd> برای رد شدن</span>
        </div>
      </footer>
    </div>
  );
}
