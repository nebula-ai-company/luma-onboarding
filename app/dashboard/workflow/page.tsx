'use client';

import React from 'react';
import Link from 'next/link';
import {
  GitBranch,
  ArrowRight,
  Sparkle,
  Plus,
  Play,
} from '@phosphor-icons/react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FUN_WORKFLOW_TEMPLATES } from '@/lib/integration/constants';

export default function WorkflowPage() {
  return (
    <div className="min-h-screen bg-[#07070b] text-zinc-100 flex flex-col font-sans">
      <DashboardHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Link href="/dashboard" className="hover:text-white">
                میز کار
              </Link>
              <span>/</span>
              <span className="text-purple-400 font-medium">ورک‌فلوها و پایپ‌لاین‌ها</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-purple-400" />
              <span>جریان‌های کاری و پایپ‌لاین هوش مصنوعی</span>
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

        {/* Workflow Templates Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">قالب‌های آماده زنجیره هوش مصنوعی (Templates)</h2>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ساخت ورک‌فلو جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FUN_WORKFLOW_TEMPLATES.map((wf) => (
              <div
                key={wf.onboardingTemplateId}
                className="p-5 rounded-2xl bg-[#0e0e16] border border-white/10 hover:border-purple-500/30 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                      {wf.badge}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {wf.productionWorkflowId}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{wf.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{wf.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500">۳ گام خودکار</span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
                  >
                    <Play className="w-3 h-3 text-purple-400" />
                    <span>اجرای پایپ‌لاین</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
