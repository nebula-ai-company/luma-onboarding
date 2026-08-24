'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkle,
  ArrowLeft,
  X,
  SlidersHorizontal,
  Lightbulb,
} from '@phosphor-icons/react';
import type { PersistedOnboardingProfile } from '@/lib/integration/contracts';
import { LUMA_AVAILABLE_TOOLS } from '@/lib/onboarding-data';

interface RecommendationBannerProps {
  profile: PersistedOnboardingProfile | null;
}

export function RecommendationBanner({ profile }: RecommendationBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  // Determine recommended tool
  const recommendedToolId = profile?.recommendedToolIds?.[0] || 'generate-image';
  const tool = LUMA_AVAILABLE_TOOLS.find((t) => t.id === recommendedToolId) || LUMA_AVAILABLE_TOOLS[0];
  const archetypes = profile?.preferences?.archetypes || ['content_creator'];

  const archetypeLabels: Record<string, string> = {
    content_creator: 'تولیدکننده محتوا',
    graphic_designer: 'طراح گرافیک و بصری',
    developer_tech: 'برنامه‌نویس و فناوری',
    marketing_growth: 'دیجیتال مارکتینگ',
    architect_3d: 'معماری و ۳ بعدی',
    general_explorer: 'کاوشگر هوش مصنوعی',
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-[#0d1117] border border-emerald-500/20 p-5 md:p-6 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.15)] mb-8 transition-all"
      id="personalized-recommendation-banner"
    >
      {/* Background glow orb */}
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left / Info Section */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <Sparkle weight="fill" className="w-3.5 h-3.5" />
              پیشنهاد اولویت‌دار برای شما
            </span>

            {archetypes.slice(0, 2).map((arch) => (
              <span
                key={arch}
                className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 text-[11px] font-medium border border-white/10"
              >
                بر اساس تخصص: {archetypeLabels[arch] || arch}
              </span>
            ))}
          </div>

          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{tool.title}</span>
              <span className="text-xs text-zinc-400 font-normal">({tool.category})</span>
            </h3>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
              {tool.description}
            </p>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <Link
              href="/onboarding?mode=preferences"
              className="inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>تغییر تخصص‌ها و علایق من</span>
            </Link>
          </div>
        </div>

        {/* Right / CTA Section */}
        <div className="flex items-center gap-3 w-full md:w-auto self-end md:self-center shrink-0">
          <Link
            href={`/dashboard/tools/${tool.id}?from=onboarding`}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.4)] active:scale-[0.98] transition-all"
            id="open-recommended-tool-btn"
          >
            <span>شروع کار با {tool.title}</span>
            <ArrowLeft weight="bold" className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 transition-all"
            title="بستن این بنر"
            id="dismiss-recommendation-banner-btn"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
