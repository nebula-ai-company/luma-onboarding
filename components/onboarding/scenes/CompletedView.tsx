'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkle, ArrowClockwise, CirclesThreePlus, Play, Images, MagicWand } from '@phosphor-icons/react';
import { useOnboarding } from '@/context/OnboardingContext';

export function CompletedView() {
  const { resetOnboarding, isSkipped } = useOnboarding();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 select-none"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-md mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <h2 className="text-xl font-bold text-zinc-100">
              {isSkipped ? 'فضای کاربری لوما (حالت سریع)' : 'فضای کاربری اختصاصی لوما'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            شما وارد داشبورد لوما شدید. می‌توانید در هر زمان آنبوردینگ مرحله‌به‌مرحله را مجدداً مشاهده و تست کنید.
          </p>
        </div>

        <button
          id="btn-restart-onboarding"
          type="button"
          onClick={resetOnboarding}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-medium transition-all duration-200 cursor-pointer shadow-[0_0_16px_rgba(168,85,247,0.2)]"
        >
          <ArrowClockwise weight="bold" className="w-3.5 h-3.5" />
          <span>تکرار آنبوردینگ (مرحله ۱)</span>
        </button>
      </div>

      {/* LUMA Platform Capabilities Quick Glance (Matches LUMA context) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            title: 'تولید تصویر و ویرایش',
            desc: 'مدل‌های فوق‌پیشرفته نسل تصویر، ویرایش هوشمند و Upscaling',
            icon: Images,
            badge: 'AI Image',
          },
          {
            title: 'تولید ویدیو و Image-to-Video',
            desc: 'تبدیل متن و تصاویر به ویدیوهای داینامیک با کیفیت سینمایی',
            icon: Play,
            badge: 'AI Video',
          },
          {
            title: 'دستیاران و خودکارسازی گردش‌کار',
            desc: 'طراحی Workflows اختصاصی، دستیاران هوشمند و ابزارهای توسعه‌دهندگان',
            icon: CirclesThreePlus,
            badge: 'Workflows',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-zinc-900/40 border border-white/[0.06] hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-500/20 flex items-center justify-center text-purple-300">
                  <Icon weight="duotone" className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.04]">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
