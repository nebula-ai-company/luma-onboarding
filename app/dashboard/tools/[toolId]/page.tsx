'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkle,
  ArrowRight,
  Lightbulb,
  X,
  Play,
  Sliders,
  Image as ImageIcon,
  CheckCircle,
  Copy,
  DownloadSimple,
  ClockCounterClockwise,
} from '@phosphor-icons/react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { LUMA_AVAILABLE_TOOLS } from '@/lib/onboarding-data';
import { QUICK_PROMPTS } from '@/lib/creation-adapter';
import type { LumaOnboardingUser } from '@/lib/integration/contracts';

export default function ToolDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const toolId = (params.toolId as string) || 'generate-image';
  const fromOnboarding = searchParams.get('from') === 'onboarding';

  const [user, setUser] = useState<LumaOnboardingUser | null>(null);
  const [showOnboardingHint, setShowOnboardingHint] = useState<boolean>(true);
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [model, setModel] = useState<string>('luma_imagen_v3');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);

  const tool = LUMA_AVAILABLE_TOOLS.find((t) => t.id === toolId) || LUMA_AVAILABLE_TOOLS[0];
  const presets = QUICK_PROMPTS[toolId] || QUICK_PROMPTS['generate-image'] || [];

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/v1/user/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.warn('[Tool Detail] User load note:', err);
      }
    }
    loadUser();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Simulate interactive generation in tool workspace
    setTimeout(() => {
      setGeneratedOutput('https://picsum.photos/seed/luma_result_' + Date.now() + '/1000/1000');
      setIsGenerating(false);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-zinc-100 flex flex-col font-sans" id={`tool-workspace-${toolId}`}>
      {/* Top Header */}
      <DashboardHeader user={user || undefined} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Link href="/dashboard" className="hover:text-white transition-colors">
                میز کار
              </Link>
              <span>/</span>
              <span>ابزارها</span>
              <span>/</span>
              <span className="text-emerald-400 font-medium">{tool.title}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sparkle weight="bold" className="w-4 h-4" />
              </div>
              <span>{tool.title}</span>
              <span className="text-xs font-normal text-zinc-400">({tool.tagline})</span>
            </h1>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-300 hover:text-white border border-white/5 transition-all self-start sm:self-auto"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به میز کار</span>
          </Link>
        </div>

        {/* Post-Onboarding Contextual Hint Banner */}
        {showOnboardingHint && (
          <div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-[#0e121a] border border-emerald-500/30 p-4 sm:p-5 shadow-lg animate-in fade-in duration-300"
            id="post-onboarding-hint-banner"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Lightbulb weight="fill" className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      از اینجا شروع کن؛ تنظیمات کامل ابزار همینجا در دسترسته
                    </h3>
                    {fromOnboarding && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                        ورود از آنبوردینگ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    متن یا ایده خود را در کادر زیر بنویسید، نسبت تصویر و مدل را مشخص کنید، و با زدن دکمه تولید، خروجی باکیفیت تحویل بگیرید.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowOnboardingHint(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all shrink-0"
                title="بستن راهنما"
                id="dismiss-tool-hint-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Workspace Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Input Controls Column */}
          <div className="lg:col-span-7 space-y-5">
            {/* Prompt Input Box */}
            <div className="p-5 rounded-2xl bg-[#0e0e16] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                  <span>توصیف و دستور متنی (Prompt)</span>
                </label>
                <span className="text-[11px] text-zinc-500">پشتیبانی از فارسی و انگلیسی</span>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="توصیف دقیقی از تصویری که می‌خواهید بسازید بنویسید..."
                rows={4}
                className="w-full bg-[#141420] border border-white/10 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-all resize-none leading-relaxed"
                id="tool-prompt-textarea"
              />

              {/* Quick Presets */}
              {presets.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] text-zinc-400 font-medium">ایده‌های پیشنهادی سریع:</span>
                  <div className="flex flex-wrap gap-2">
                    {presets.slice(0, 3).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPrompt(p.prompt)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/20 text-[11px] text-zinc-300 hover:text-emerald-300 transition-all text-right"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Parameters / Settings Box */}
            <div className="p-5 rounded-2xl bg-[#0e0e16] border border-white/10 space-y-5">
              <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                <span>تنظیمات و نسبت ابعاد</span>
              </h3>

              {/* Aspect Ratio Picker */}
              <div className="space-y-2">
                <span className="text-[11px] text-zinc-400">نسبت ابعاد تصویر:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: '1:1', label: 'مربع (1:1)' },
                    { id: '16:9', label: 'افقی (16:9)' },
                    { id: '9:16', label: 'استوری (9:16)' },
                    { id: '4:3', label: 'کلاسیک (4:3)' },
                  ].map((ratio) => (
                    <button
                      key={ratio.id}
                      type="button"
                      onClick={() => setAspectRatio(ratio.id)}
                      className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        aspectRatio === ratio.id
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-[#141420] border-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Selector */}
              <div className="space-y-2">
                <span className="text-[11px] text-zinc-400">موتور و مدل هوش مصنوعی:</span>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#141420] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="luma_imagen_v3">Luma Ultra Engine v3 (پیشنهادی و پرسرعت)</option>
                  <option value="luma_flux_pro">Luma Flux Pro (بیشترین جزئیات و فوتورئال)</option>
                  <option value="luma_anime_v2">Luma Anime & Artistic (سبک‌های نقاشی)</option>
                </select>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-between">
                <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <span>هزینه تولید:</span>
                  <span className="text-emerald-400 font-bold font-mono">۱ LUM</span>
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition-all ${
                    isGenerating || !prompt.trim()
                      ? 'bg-white/10 text-zinc-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 shadow-[0_4px_20px_rgba(16,185,129,0.3)] active:scale-[0.98]'
                  }`}
                  id="start-tool-generation-btn"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
                      <span>در حال تولید خروجی...</span>
                    </>
                  ) : (
                    <>
                      <Sparkle weight="fill" className="w-4 h-4" />
                      <span>شروع تولید هوشمند</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right / Preview & Result Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-[#0e0e16] border border-white/10 h-full flex flex-col justify-between space-y-4 min-h-[380px]">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>پیش‌نمایش خروجی</span>
                </h3>
                <span className="text-[10px] text-zinc-500">وضوح: 2048 × 2048</span>
              </div>

              {/* Output Canvas */}
              <div className="flex-1 flex items-center justify-center rounded-xl bg-[#141420] border border-white/5 overflow-hidden relative min-h-[260px]">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-3 p-6 text-center">
                    <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
                    <span className="text-xs text-zinc-300 font-medium">موتور لوما در حال پردازش تصویر...</span>
                    <span className="text-[10px] text-zinc-500">تفکیک نور و شکل‌دهی لایه‌ها</span>
                  </div>
                ) : generatedOutput ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={generatedOutput}
                      alt="خروجی تولید شده"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => alert('لینک دانلود کپی شد')}
                        className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur transition-all"
                        title="دانلود"
                      >
                        <DownloadSimple className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 p-6 text-center text-zinc-500">
                    <ImageIcon className="w-10 h-10 text-zinc-600" />
                    <span className="text-xs font-medium">هنوز خروجی تولید نشده است</span>
                    <span className="text-[10px]">دستور خود را در کادر روبرو بنویسید و دکمه تولید را بزنید.</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  کیفیت خروجی: Studio HD
                </span>
                <span className="font-mono">{aspectRatio}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
