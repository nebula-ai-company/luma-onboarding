'use client';

import React from 'react';
import { OnboardingProvider, type OnboardingProviderProps } from '@/context/OnboardingContext';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';

export interface LumaOnboardingProps extends Omit<OnboardingProviderProps, 'children'> {
  className?: string;
}

/**
 * LumaOnboarding
 * 
 * Top-level entry component for the LUMA Onboarding flow.
 * Must be wrapped with `<LumaOnboardingIntegrationProvider>`.
 *
 * @example
 * ```tsx
 * <LumaOnboardingIntegrationProvider integration={myProductionIntegration}>
 *   <LumaOnboarding mode="first-run" onComplete={(profile) => console.log('Done', profile)} />
 * </LumaOnboardingIntegrationProvider>
 * ```
 */
export function LumaOnboarding({
  mode = 'resume',
  onComplete,
  onSkip,
  onIntegrationError,
  className,
}: LumaOnboardingProps) {
  return (
    <OnboardingProvider
      mode={mode}
      onComplete={onComplete}
      onSkip={onSkip}
      onIntegrationError={onIntegrationError}
    >
      <div className={className}>
        <OnboardingShell />
      </div>
    </OnboardingProvider>
  );
}
