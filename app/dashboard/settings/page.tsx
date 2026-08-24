'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GearSix,
  User,
  SlidersHorizontal,
  ArrowClockwise,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Sparkle,
  ArrowRight,
  TestTube,
} from '@phosphor-icons/react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { LUMA_PROFESSIONS, LUMA_INTERESTS } from '@/lib/onboarding-data';
import type { PersistedOnboardingProfile, LumaOnboardingUser } from '@/lib/integration/contracts';

export default function SettingsPage() {
  const [user, setUser] = useState<LumaOnboardingUser | null>(null);
  const [profile, setProfile] = useState<PersistedOnboardingProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'preferences' | 'account' | 'testing'>('preferences');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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
        console.warn('[Settings] Load note:', err);
      }
    }

    loadData();
  }, []);

  const handleSwitchUserRole = async (type: 'new_user' | 'existing_completed' | 'legacy_user') => {
    try {
      const res = await fetch('/api/v1/user/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_type', type }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setStatusMessage(
          type === 'new_user'
            ? 'وضعیت به «کاربر جدید (نیازمند آنبوردینگ)» تغییر یافت.'
            : type === 'existing_completed'
            ? 'وضعیت به «کاربر فعال (آنبوردینگ تکمیل شده)» تغییر یافت.'
            : 'وضعیت به «کاربر قدیمی (Legacy)» تغییر یافت؛ کاربران قدیمی هرگز اجبار به آنبوردینگ نمی‌شوند.'
        );
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err) {
      console.warn('[Settings] Role switch error:', err);
    }
  };

  const selectedProfessions = profile?.preferences?.professions || ['content_creator'];
  const selectedInterests = profile?.preferences?.interests || ['image_gen', 'video_edit'];

  const professionItems = LUMA_PROFESSIONS.filter((p) => selectedProfessions.includes(p.id));
  const interestItems = LUMA_INTERESTS.filter((i) => selectedInterests.includes(i.id));

  return (
    <div className="min-h-screen bg-[#07070b] text-zinc-100 flex flex-col font-sans" id="luma-settings-page">
      <DashboardHeader user={user || undefined} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Link href="/dashboard" className="hover:text-white">
                میز کار
              </Link>
              <span>/</span>
              <span className="text-emerald-400 font-medium">تنظیمات و ترجیحات</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <GearSix className="w-6 h-6 text-emerald-400" />
              <span>تنظیمات حساب و شخصی‌سازی</span>
            </h1>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-300 hover:text-white border border-white/5"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به میز کار</span>
          </Link>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle weight="fill" className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Settings Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'preferences'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>علایق و پیشنهادهای من</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'account'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-4 h-4 text-teal-400" />
            <span>اطلاعات حساب و اشتراک</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('testing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'testing'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TestTube className="w-4 h-4 text-purple-400" />
            <span>تست وضعیت و رول‌اوت</span>
          </button>
        </div>

        {/* Tab 1: Preferences & Recommendations */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0e0e16] border border-white/10 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">تخصص‌ها و زمینه‌های انتخابی</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    پیشنهادهای میز کار بر اساس این گزینه‌ها شخصی‌سازی می‌شوند.
                  </p>
                </div>

                <Link
                  href="/onboarding?mode=preferences"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all"
                  id="edit-preferences-settings-btn"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>ویرایش تخصص‌ها و علایق</span>
                </Link>
              </div>

              {/* Professions list */}
              <div className="space-y-2">
                <span className="text-xs text-zinc-400 font-medium">نقش‌ها و حرفه‌های فعال:</span>
                <div className="flex flex-wrap gap-2">
                  {professionItems.length > 0 ? (
                    professionItems.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-200"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{p.title}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500">تخصصی انتخاب نشده است.</span>
                  )}
                </div>
              </div>

              {/* Interests list */}
              <div className="space-y-2">
                <span className="text-xs text-zinc-400 font-medium">زمینه‌های علاقه‌مندی:</span>
                <div className="flex flex-wrap gap-2">
                  {interestItems.length > 0 ? (
                    interestItems.map((i) => (
                      <div
                        key={i.id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-200"
                      >
                        <span>{i.title}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500">موردی انتخاب نشده است.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Replay Onboarding Action Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0e0e16] to-[#121220] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ArrowClockwise className="w-4 h-4 text-teal-400" />
                  <span>اجرای دوباره راهنمای لوما (Replay Onboarding)</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  اگر می‌خواهید معرفی ابزارها و بخش‌های اکوسیستم لوما را مجدداً مشاهده کنید.
                </p>
              </div>

              <Link
                href="/onboarding?mode=replay"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-all self-start sm:self-auto shrink-0"
                id="replay-onboarding-settings-btn"
              >
                <span>شروع مجدد راهنما</span>
              </Link>
            </div>
          </div>
        )}

        {/* Tab 2: Account Information */}
        {activeTab === 'account' && (
          <div className="p-6 rounded-2xl bg-[#0e0e16] border border-white/10 space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-white/5">
              <img
                src={user?.avatarUrl || 'https://picsum.photos/seed/sara_luma_user/200/200'}
                alt={user?.displayName || 'کاربر'}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30"
              />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{user?.displayName || 'سارا رادمنش'}</h3>
                <p className="text-xs text-zinc-400">{user?.email || 'sara.radmanesh@luma.ir'}</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    پلن: {user?.tier?.toUpperCase() || 'PRO'}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    موجودی: {user?.lumBalance ?? 20} LUM
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#141420] border border-white/5 space-y-1">
                <span className="text-[11px] text-zinc-400">شناسه حساب لوما:</span>
                <p className="text-xs font-mono text-white">{user?.id || 'usr_luma_prod_98412'}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#141420] border border-white/5 space-y-1">
                <span className="text-[11px] text-zinc-400">تاریخ عضویت:</span>
                <p className="text-xs font-mono text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '۱۴۰۴/۱۲/۱۱'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Testing & Rollout Scenarios */}
        {activeTab === 'testing' && (
          <div className="p-6 rounded-2xl bg-[#0e0e16] border border-purple-500/20 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                <TestTube weight="bold" className="w-5 h-5 text-purple-400" />
                <span>بررسی سناریوهای کاربری و تست گیت روت‌ها</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                با انتخاب هر وضعیت می‌توانید رفتار هدایت خودکار (Eligibility Guard) را برای حالت‌های مختلف بدون نیاز به پاک‌کردن حافظه مرورگر آزمایش کنید.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSwitchUserRole('new_user')}
                className="p-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-right space-y-1 transition-all"
              >
                <span className="text-xs font-bold text-white block">۱. کاربر جدید (Fresh User)</span>
                <span className="text-[11px] text-purple-300 block">آنبوردینگ را تکمیل نکرده و به صفحه آنبوردینگ هدایت می‌شود.</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchUserRole('existing_completed')}
                className="p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-right space-y-1 transition-all"
              >
                <span className="text-xs font-bold text-white block">۲. کاربر تکمیل‌شده (Active)</span>
                <span className="text-[11px] text-emerald-300 block">آنبوردینگ را گذرانده و مستقیماً به داشبورد دسترسی دارد.</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchUserRole('legacy_user')}
                className="p-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-right space-y-1 transition-all"
              >
                <span className="text-xs font-bold text-white block">۳. کاربر قدیمی (Legacy User)</span>
                <span className="text-[11px] text-amber-300 block">کاربران ثبت‌نامی قبل از رول‌اوت؛ هرگز اجبار به آنبوردینگ نمی‌شوند.</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
