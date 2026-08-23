'use client';

import React from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { useOnboarding } from '@/context/OnboardingContext';
import { PROFESSIONS_DATA } from '@/lib/onboarding-data';

export type LumaCoreVariant = 'welcome' | 'profession' | 'interests' | 'confirmation' | 'ecosystem' | 'compact' | 'step' | 'creation' | 'generating';

interface LumaCoreProps {
  variant?: LumaCoreVariant;
  className?: string;
  showHints?: boolean;
}

export function LumaCore({
  variant = 'welcome',
  className = '',
  showHints = true,
}: LumaCoreProps) {
  const shouldReduceMotion = useReducedMotion();
  const { selectedProfessions, selectedInterests } = useOnboarding();

  const isWelcome = variant === 'welcome';
  const isProfession = variant === 'profession';
  const isInterests = variant === 'interests';
  const isConfirmation = variant === 'confirmation';
  const isEcosystem = variant === 'ecosystem';
  const isCreation = variant === 'creation';
  const isGenerating = variant === 'generating';

  // Gather active visual hints based on selected professions
  const activeHints = React.useMemo(() => {
    if (!showHints || selectedProfessions.length === 0) return [];
    const hints: string[] = [];
    for (const profId of selectedProfessions) {
      const found = PROFESSIONS_DATA.find((p) => p.id === profId);
      if (found) {
        hints.push(...found.visualHints);
      }
    }
    // Return max 4 unique hints to prevent visual clutter
    return Array.from(new Set(hints)).slice(0, 4);
  }, [selectedProfessions, showHints]);

  // Dimension scaling based on variant
  const coreSize = isWelcome
    ? 'w-48 h-48 md:w-56 md:h-56'
    : isConfirmation
    ? 'w-36 h-36 md:w-44 md:h-44'
    : isEcosystem
    ? 'w-32 h-32 md:w-40 md:h-40'
    : isInterests
    ? 'w-24 h-24 md:w-28 md:h-28'
    : isGenerating
    ? 'w-24 h-24 md:w-28 md:h-28'
    : isCreation
    ? 'w-20 h-20 md:w-24 md:h-24'
    : 'w-28 h-28 md:w-32 md:h-32';

  // Internal orb dimensions
  const orbSize = isWelcome
    ? 'w-11 h-11'
    : isConfirmation
    ? 'w-10 h-10'
    : isEcosystem
    ? 'w-9 h-9'
    : isInterests
    ? 'w-7 h-7'
    : isGenerating
    ? 'w-8 h-8'
    : isCreation
    ? 'w-6 h-6'
    : 'w-8 h-8';


  const selectionCount = selectedProfessions.length + selectedInterests.length;

  return (
    <motion.div
      layoutId="luma-core-system"
      transition={{
        type: 'spring',
        stiffness: 70,
        damping: 18,
        mass: 1,
      }}
      className={`relative flex items-center justify-center select-none pointer-events-none ${coreSize} ${className}`}
      aria-hidden="true"
    >
      {/* Outer ambient luminescence wash */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: isConfirmation
            ? 'radial-gradient(circle, rgba(192, 132, 252, 0.32) 0%, rgba(147, 51, 234, 0.18) 45%, rgba(15, 10, 30, 0) 75%)'
            : 'radial-gradient(circle, rgba(168, 85, 247, 0.24) 0%, rgba(124, 58, 237, 0.12) 40%, rgba(15, 10, 30, 0) 70%)',
          filter: 'blur(28px)',
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: isWelcome || isConfirmation ? [1, 1.08, 1] : [1, 1.04, 1],
                opacity: isWelcome || isConfirmation ? [0.8, 1, 0.8] : [0.6, 0.85, 0.6],
              }
        }
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Outermost faint dimensional ring */}
      <motion.div
        className="absolute rounded-full border border-purple-500/15"
        style={{
          width: '100%',
          height: '100%',
          boxShadow: '0 0 40px -10px rgba(168, 85, 247, 0.15)',
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                rotate: 360,
              }
        }
        transition={{
          duration: 48,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Subtle node marker on outer ring */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-300/40 shadow-[0_0_8px_rgba(216,180,254,0.6)]" />
        {selectionCount > 0 && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400/50 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
        )}
      </motion.div>

      {/* Intermediate dimensional ring */}
      <motion.div
        className="absolute rounded-full border border-purple-400/25"
        style={{
          width: '74%',
          height: '74%',
          borderStyle: 'dashed',
          borderWidth: '1px',
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                rotate: -360,
              }
        }
        transition={{
          duration: 36,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Inner concentric ring with subtle pulsation */}
      <motion.div
        className="absolute rounded-full border border-purple-300/30"
        style={{
          width: '50%',
          height: '50%',
          boxShadow: 'inset 0 0 16px rgba(168, 85, 247, 0.25)',
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [1, 1.04, 1],
              }
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Core luminous orb */}
      <motion.div
        key={`luma-orb-pulse-${selectionCount}`}
        className={`relative z-10 flex items-center justify-center rounded-full ${orbSize}`}
        style={{
          background: isConfirmation
            ? 'radial-gradient(circle at 35% 35%, #ffffff 0%, #f3e8ff 20%, #c084fc 50%, #6b21a8 100%)'
            : 'radial-gradient(circle at 35% 35%, #ffffff 0%, #e9d5ff 25%, #a855f7 60%, #581c87 100%)',
          boxShadow: isConfirmation
            ? '0 0 32px 6px rgba(216, 180, 254, 0.9), 0 0 60px 16px rgba(168, 85, 247, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.95)'
            : '0 0 24px 4px rgba(192, 132, 252, 0.8), 0 0 48px 12px rgba(147, 51, 234, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
        }}
        initial={selectionCount > 0 && !shouldReduceMotion ? { scale: 1.25 } : false}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      >
        {/* Diamond focal highlight */}
        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
      </motion.div>

      {/* Dynamic Floating Abstract Hints (Shown when user selects professions) */}
      <AnimatePresence>
        {(isProfession || isConfirmation) && activeHints.length > 0 && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {activeHints.map((hint, idx) => {
              // Distribute hints at offset angles around the core
              const angles = [-35, 35, -145, 145];
              const angle = angles[idx % angles.length];
              const rad = (angle * Math.PI) / 180;
              const radius = isProfession ? 78 : 92;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;

              return (
                <motion.div
                  key={`hint-${hint}`}
                  initial={{ opacity: 0, scale: 0.7, x: 0, y: 0 }}
                  animate={{ opacity: 1, scale: 1, x, y }}
                  exit={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute z-20 whitespace-nowrap px-2.5 py-1 rounded-full bg-zinc-950/85 border border-purple-500/30 text-[10px] sm:text-[11px] font-medium text-purple-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-md"
                >
                  <span className="w-1 h-1 inline-block rounded-full bg-purple-400 ml-1.5 shadow-[0_0_4px_#c084fc]" />
                  {hint}
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
