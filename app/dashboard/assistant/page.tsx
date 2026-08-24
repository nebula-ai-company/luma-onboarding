'use client';

import React from 'react';
import Link from 'next/link';
import {
  Robot,
  ArrowRight,
  Sparkle,
  Plus,
  Star,
} from '@phosphor-icons/react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function AssistantPage() {
  const assistants = [
    {
      id: 'ast_content',
      title: 'استراتژیست محتوا و کپی‌رایتر',
      description: 'طراحی سناریوهای ویدیویی، قلاب‌های بصری اینستاگرام و متن‌های ترغیب‌کننده تبلیغاتی.',
      category: 'مارکتینگ و محتوا',
    },
    {
      id: 'ast_code',
      title: 'معمار نرم‌افزار و اشکال‌زدا',
      description: 'بررسی کدهای پایتون و تایپ‌اسکریپت، ریفکتورینگ و بهینه‌سازی کوئری‌ها.',
      category: 'فناوری و توسعه',
    },
    {
      id: 'ast_design',
      title: 'راهنمای هویت بصری و پرامپت آرت',
      description: 'فرمول‌بندی دقیق پرامپت‌های تولید تصویر، انتخاب پالت رنگی و نورپردازی استودیویی.',
      category: 'طراحی و هنر',
    },
  ];

  return (
    <div className="min-h-screen bg-[#07070b] text-zinc-100 flex flex-col font-sans">
      <DashboardHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Link href="/dashboard" className="hover:text-white">
                میز کار
              </Link>
              <span>/</span>
              <span className="text-blue-400 font-medium">دستیارهای تخصصی</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Robot className="w-6 h-6 text-blue-400" />
              <span>دستیارهای آموزش‌دیده هوش مصنوعی</span>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {assistants.map((ast) => (
            <div
              key={ast.id}
              className="p-5 rounded-2xl bg-[#0e0e16] border border-white/10 hover:border-blue-500/30 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Robot className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-blue-400 font-medium">{ast.category}</span>
                  <h3 className="text-sm font-bold text-white mt-1">{ast.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{ast.description}</p>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-blue-500/20 text-white hover:text-blue-300 text-xs font-semibold border border-white/5 transition-all text-center"
              >
                گفت‌وگو با این دستیار
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
