'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkle,
  Image as ImageIcon,
  VideoCamera,
  Microphone,
  MagicWand,
  ChatCircleDots,
  FolderOpen,
  GitBranch,
  Robot,
  Code,
  MagnifyingGlass,
  ArrowUpRight,
  SlidersHorizontal,
  CheckCircle,
  Lightning,
} from '@phosphor-icons/react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { RecommendationBanner } from '@/components/dashboard/RecommendationBanner';
import { LUMA_AVAILABLE_TOOLS } from '@/lib/onboarding-data';
import type { PersistedOnboardingProfile, LumaOnboardingUser } from '@/lib/integration/contracts';

export default function DashboardPage() {
  const [user, setUser] = useState<LumaOnboardingUser | null>(null);
  const [profile, setProfile] = useState<PersistedOnboardingProfile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, profileRes] = await Promise.all([
          fetch('/api/v1/user/me', { cache: 'no-store' }),
          fetch('/api/v1/onboarding/profile', { cache: 'no-store' }),
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }
      } catch (err) {
        console.warn('[Dashboard] Data load note:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const categories = [
    { id: 'all', label: 'همه ابزارها' },
    { id: 'image', label: 'تولید تصویر', icon: ImageIcon },
    { id: 'video', label: 'ویدیو و متحرک‌سازی', icon: VideoCamera },
    { id: 'audio', label: 'صدا و گویندگی', icon: Microphone },
    { id: 'edit', label: 'ویرایش هوشمند', icon: MagicWand },
    { id: 'chat', label: 'چت و دستیار', icon: ChatCircleDots },
  ];

  const recommendedToolIds = profile?.recommendedToolIds || ['generate-image', 'remove-background'];

  const filteredTools = LUMA_AVAILABLE_TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#07070b] text-zinc-100 flex flex-col font-sans" id="luma-dashboard-page">
      {/* Top Navigation */}
      <DashboardHeader user={user || undefined} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section & Personalized Recommendation Banner */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>میز کار هوش مصنوعی</span>
                <span className="text-sm font-normal text-zinc-400">| لوما</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                دسترسی سریع به ابزارهای ساخت تصویر، ویدیو، پردازش صوت و جریان‌های کاری هوشمند
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/onboarding?mode=preferences"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 hover:text-white transition-all"
                id="edit-preferences-top-btn"
              >
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                <span>شخصی‌سازی علایق</span>
              </Link>
            </div>
          </div>

          {/* Recommendation Banner */}
          <RecommendationBanner profile={profile} />
        </section>

        {/* Tools Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none" id="tool-categories-filter">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-white text-zinc-950 shadow-md'
                        : 'bg-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <MagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="جست‌وجوی ابزارها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#101018] border border-white/10 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                id="tools-search-input"
              />
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" id="tools-grid-list">
            {filteredTools.map((tool) => {
              const isRecommended = recommendedToolIds.includes(tool.id);
              return (
                <Link
                  key={tool.id}
                  href={`/dashboard/tools/${tool.id}`}
                  className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#0e0e16] hover:bg-[#13131e] border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] active:scale-[0.99]"
                  id={`tool-card-${tool.id}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                        <Sparkle weight="bold" className="w-5 h-5" />
                      </div>

                      {isRecommended && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          <CheckCircle weight="fill" className="w-3 h-3" />
                          پیشنهادی
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                        <span>{tool.title}</span>
                        <ArrowUpRight weight="bold" className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-emerald-400" />
                      </h3>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
                    <span className="font-mono">{tool.tagline}</span>
                    <span className="text-emerald-400/80 font-medium">۱ LUM</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Ecosystem Quick Hub */}
        <section className="pt-4 border-t border-white/5 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lightning weight="fill" className="w-4 h-4 text-teal-400" />
            <span>بخش‌های اکوسیستم لوما</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dashboard/chat"
              className="p-4 rounded-2xl bg-[#0c0c14] border border-white/5 hover:border-teal-500/30 hover:bg-[#11111c] transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-105 transition-transform">
                <ChatCircleDots weight="bold" className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-teal-300">چت و دستیار هوشمند</h3>
              <p className="text-[11px] text-zinc-400 mt-1">گفت‌وگو با مدل‌های زبانی پیشرفته فارسی</p>
            </Link>

            <Link
              href="/dashboard/workflow"
              className="p-4 rounded-2xl bg-[#0c0c14] border border-white/5 hover:border-purple-500/30 hover:bg-[#11111c] transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-105 transition-transform">
                <GitBranch weight="bold" className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-purple-300">پایپ‌لاین و ورک‌فلو</h3>
              <p className="text-[11px] text-zinc-400 mt-1">ترکیب زنجیره‌ای چند ابزار و اتوماسیون</p>
            </Link>

            <Link
              href="/dashboard/assistant"
              className="p-4 rounded-2xl bg-[#0c0c14] border border-white/5 hover:border-blue-500/30 hover:bg-[#11111c] transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-105 transition-transform">
                <Robot weight="bold" className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-blue-300">دستیارهای تخصصی</h3>
              <p className="text-[11px] text-zinc-400 mt-1">ربات‌های آموزش‌دیده برای سناریوهای حرفه‌ای</p>
            </Link>

            <Link
              href="/dashboard/files"
              className="p-4 rounded-2xl bg-[#0c0c14] border border-white/5 hover:border-emerald-500/30 hover:bg-[#11111c] transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                <FolderOpen weight="bold" className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-emerald-300">فایل‌ها و خروجی‌ها</h3>
              <p className="text-[11px] text-zinc-400 mt-1">مدیریت، ذخیره‌سازی و دانلود تولیدات شما</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
