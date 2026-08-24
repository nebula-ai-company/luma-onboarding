'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LumaOnboardingIntegrationProvider,
  LumaOnboarding,
  createProductionIntegration,
} from '@/lib/integration';
import { isOnboardingRequired } from '@/lib/auth/user-service';
import type { LumaOnboardingUser, LumaOnboardingIntegration } from '@/lib/integration/contracts';

export default function RootEntryPage() {
  const router = useRouter();
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const [integration, setIntegration] = useState<LumaOnboardingIntegration | null>(null);

  useEffect(() => {
    async function evaluateEligibility() {
      try {
        const prodIntegration = createProductionIntegration(undefined, (url: string) => {
          router.push(url);
        });
        setIntegration(prodIntegration);

        const res = await fetch('/api/v1/user/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const user: LumaOnboardingUser = data.user;
          const required = isOnboardingRequired(user, prodIntegration.featureFlags);

          if (!required) {
            // Existing or completed user -> direct handoff to dashboard
            router.replace('/dashboard');
            return;
          }

          setNeedsOnboarding(true);
        } else {
          setNeedsOnboarding(true);
        }
      } catch (err) {
        console.warn('[RootEntry] Eligibility check error, fallback to onboarding:', err);
        setNeedsOnboarding(true);
      } finally {
        setCheckingEligibility(false);
      }
    }

    evaluateEligibility();
  }, [router]);

  if (checkingEligibility || needsOnboarding === null || !integration) {
    return (
      <main className="min-h-screen bg-[#07070b] flex items-center justify-center text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
          <span className="text-xs font-medium tracking-wide text-zinc-300">در حال بررسی حساب و بارگذاری لوما...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07070b] text-zinc-100 overflow-x-hidden" id="luma-root-entry">
      <LumaOnboardingIntegrationProvider integration={integration}>
        <LumaOnboarding
          mode="resume"
          onComplete={(_data) => {
            router.push('/dashboard');
          }}
          onSkip={(_reason) => {
            router.push('/dashboard');
          }}
        />
      </LumaOnboardingIntegrationProvider>
    </main>
  );
}
