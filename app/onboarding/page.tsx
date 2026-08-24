'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  LumaOnboardingIntegrationProvider,
  LumaOnboarding,
  createProductionIntegration,
} from '@/lib/integration';
import type { LumaOnboardingIntegration } from '@/lib/integration/contracts';

export default function OnboardingRoutePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [integration, setIntegration] = useState<LumaOnboardingIntegration | null>(null);
  const [isPending, startTransition] = useTransition();

  const rawMode = searchParams.get('mode');
  const mode = rawMode === 'replay' || rawMode === 'preferences' || rawMode === 'first-run'
    ? rawMode
    : 'resume';

  useEffect(() => {
    // Create the production integration bundle bound to Next.js App Router
    const prodIntegration = createProductionIntegration(undefined, (url: string) => {
      startTransition(() => {
        router.push(url);
      });
    });
    setIntegration(prodIntegration);
  }, [router]);

  if (!integration) {
    return (
      <div className="min-h-screen bg-[#07070b] flex items-center justify-center text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
          <span className="text-sm font-medium">در حال بارگذاری تجربه لوما...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#07070b] text-zinc-100 overflow-x-hidden" id="luma-onboarding-root">
      <LumaOnboardingIntegrationProvider integration={integration}>
        <LumaOnboarding
          mode={mode}
          onComplete={(_data) => {
            // Handled automatically via NavigationAdapter, fallback just in case:
            startTransition(() => {
              router.push('/dashboard');
            });
          }}
          onSkip={(_reason) => {
            startTransition(() => {
              router.push('/dashboard');
            });
          }}
        />
      </LumaOnboardingIntegrationProvider>
    </main>
  );
}
