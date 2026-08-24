'use client';

import React from 'react';
import Link from 'next/link';
import {
  CreditCard,
  ArrowRight,
  Sparkle,
  CheckCircle,
} from '@phosphor-icons/react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-[#07070b] text-zinc-100 flex flex-col font-sans">
      <DashboardHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Link href="/dashboard" className="hover:text-white">
                میز کار
              </Link>
              <span>/</span>
              <span className="text-emerald-400 font-medium">افزایش اعتبار و پلن‌ها</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-emerald-400" />
              <span>مدیریت اشتراک و بسته‌های اعتباری LUM</span>
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

        {/* Current Balance */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0e0e16] to-[#121220] border border-emerald-500/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-emerald-400 font-semibold">موجودی فعال حساب شما:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">20</span>
              <span className="text-sm text-zinc-300">واحد اعتبار LUM</span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            طرح حرفه‌ای (PRO)
          </span>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'بسته پایه', credits: '۱۰۰ LUM', price: '۱۹۰,۰۰۰ تومان', desc: 'مناسب استفاده روزانه و تفکیک پس‌زمینه' },
            { title: 'بسته حرفه‌ای', credits: '۵۰۰ LUM', price: '۷۹۰,۰۰۰ تومان', desc: 'تولید ویدیو و رندرهای باکیفیت 4K', popular: true },
            { title: 'بسته سازمانی', credits: '۲,۰۰۰ LUM', price: '۲,۴۹۰,۰۰۰ تومان', desc: 'دسترسی نامحدود و اولویت پردازش API' },
          ].map((pkg, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-[#0e0e16] border flex flex-col justify-between space-y-5 ${
                pkg.popular ? 'border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)]' : 'border-white/10'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">{pkg.title}</h3>
                  {pkg.popular && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      محبوب‌ترین
                    </span>
                  )}
                </div>
                <div className="text-2xl font-black text-emerald-400 font-mono">{pkg.credits}</div>
                <p className="text-xs text-zinc-400 leading-relaxed">{pkg.desc}</p>
                <div className="text-sm font-semibold text-white pt-2 border-t border-white/5">{pkg.price}</div>
              </div>

              <button
                type="button"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-zinc-950 text-white font-bold text-xs transition-all"
              >
                انتخاب و پرداخت
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
