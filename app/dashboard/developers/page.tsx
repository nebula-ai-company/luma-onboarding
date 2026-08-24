'use client';

import React from 'react';
import Link from 'next/link';
import {
  Code,
  ArrowRight,
  Key,
  Copy,
  Terminal,
} from '@phosphor-icons/react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function DevelopersPage() {
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
              <span className="text-cyan-400 font-medium">توسعه‌دهندگان و API</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Code className="w-6 h-6 text-cyan-400" />
              <span>مستندات و کلیدهای دسترسی API لوما</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#0e0e16] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>کلیدهای API فعال (API Keys)</span>
            </h2>
            <p className="text-xs text-zinc-400">
              برای فراخوانی ابزارهای تولید تصویر و پردازش صوت در اپلیکیشن‌های خود از کلیدهای زیر استفاده کنید:
            </p>

            <div className="p-3 bg-[#141420] border border-white/5 rounded-xl flex items-center justify-between font-mono text-xs text-zinc-300">
              <span>luma_live_sec_9941a87b2...</span>
              <button
                type="button"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                title="کپی کلید"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0e0e16] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>نمونه درخواست cURL</span>
            </h2>
            <pre className="p-3 bg-[#141420] border border-white/5 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto">
{`curl -X POST https://api.luma.ir/v1/generate/image \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "A modern Persian artwork", "model": "luma_imagen_v3"}'`}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
