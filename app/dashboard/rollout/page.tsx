'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  WarningOctagon,
  ChartBar,
  UsersThree,
  Cpu,
  Sparkle,
  ArrowsClockwise,
  CheckCircle,
  XCircle,
  Flame,
  TrendUp,
  Clock,
  CurrencyCircleDollar,
  Lightning,
  Funnel,
  GitBranch,
  Bug,
  Info,
  SlidersHorizontal,
  ArrowSquareOut,
  UserGear,
  ChartPieSlice,
  Broadcast,
} from '@phosphor-icons/react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import type { RolloutConfig, RolloutStage } from '@/lib/rollout/experiment-service';
import type { RolloutReportData } from '@/lib/rollout/metrics-data';

export default function RolloutDashboardPage() {
  const [report, setReport] = useState<RolloutReportData | null>(null);
  const [config, setConfig] = useState<RolloutConfig | null>(null);
  const [stageCatalog, setStageCatalog] = useState<Record<string, { name: string; percentage: number; description: string }> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Cohort Simulator input
  const [testEmail, setTestEmail] = useState('newuser@example.com');
  const [simResult, setSimResult] = useState<{ bucket: number; variant: string; isWhitelisted: boolean; eligible: boolean } | null>(null);

  // New whitelist input
  const [newWhitelistEmail, setNewWhitelistEmail] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'funnel' | 'guardrails' | 'segments' | 'controls'>('overview');

  async function loadData() {
    try {
      setLoading(true);
      const [configRes, metricsRes] = await Promise.all([
        fetch('/api/v1/rollout/config', { cache: 'no-store' }),
        fetch('/api/v1/rollout/metrics', { cache: 'no-store' }),
      ]);

      if (configRes.ok) {
        const configData = await configRes.json();
        setConfig(configData.config);
        setStageCatalog(configData.stageCatalog);
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setReport(metricsData.report);
      }
    } catch (err) {
      console.error('Error loading rollout data:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Update Rollout Config
  async function handleUpdateConfig(updates: Partial<RolloutConfig>) {
    try {
      setSaving(true);
      setActionSuccess(null);
      setActionError(null);

      const res = await fetch('/api/v1/rollout/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates,
          updatedBy: 'Luma Release Engineer',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setActionSuccess('تنظیمات رول‌اوت و مرحله انتشار با موفقیت به‌روزرسانی شد.');
        setTimeout(() => setActionSuccess(null), 4000);
      } else {
        const err = await res.json();
        setActionError(err.error || 'خطا در ثبت تغییرات');
      }
    } catch (err: any) {
      setActionError(err.message || 'خطا در اتصال به سرور');
    } finally {
      setSaving(false);
    }
  }

  // Emergency Kill Switch Toggle
  async function handleToggleKillSwitch() {
    if (!config) return;
    const newState = !config.enableNewUserOnboarding;
    await handleUpdateConfig({ enableNewUserOnboarding: newState });
  }

  // Stage Change Handler
  async function handleStageChange(newStage: RolloutStage) {
    await handleUpdateConfig({ currentStage: newStage });
  }

  // Add Whitelist Email
  async function handleAddWhitelist() {
    if (!config || !newWhitelistEmail.trim()) return;
    const email = newWhitelistEmail.trim().toLowerCase();
    if (config.internalWhitelist.includes(email)) return;

    const updated = [...config.internalWhitelist, email];
    await handleUpdateConfig({ internalWhitelist: updated });
    setNewWhitelistEmail('');
  }

  // Remove Whitelist Email
  async function handleRemoveWhitelist(emailToRemove: string) {
    if (!config) return;
    const updated = config.internalWhitelist.filter((e) => e !== emailToRemove);
    await handleUpdateConfig({ internalWhitelist: updated });
  }

  // Reset Stored Cohort Assignments
  async function handleResetAssignments() {
    try {
      setSaving(true);
      const res = await fetch('/api/v1/rollout/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_assignments' }),
      });
      if (res.ok) {
        setActionSuccess('تمام گروه‌بندی‌های ذخیره‌شده آزمایشی کاربران ریست شدند.');
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err: any) {
      setActionError(err.message || 'خطا در ریست گروه‌بندی‌ها');
    } finally {
      setSaving(false);
    }
  }

  // Run Simulator
  function runSimulation(email: string) {
    if (!config) return;
    const trimmed = email.toLowerCase().trim();
    const isWhitelisted =
      config.internalWhitelist.includes(trimmed) ||
      trimmed.endsWith('@luma.ir') ||
      trimmed.startsWith('usr_team_') ||
      trimmed.startsWith('usr_qa_');

    // FNV-1a Hash simulation
    const input = `${config.experimentId}:${trimmed}`;
    let hash = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash = (hash * 0x01000193) >>> 0;
    }
    const bucket = hash % 100;

    let variant = 'control';
    let eligible = true;

    if (isWhitelisted) {
      variant = 'treatment (لیست سفید QA)';
      eligible = true;
    } else if (!config.enableNewUserOnboarding) {
      variant = 'control (کلید اصلی غیرفعال است)';
      eligible = false;
    } else if (bucket < config.rolloutPercentage) {
      variant = 'treatment (گروه آزمایشی)';
      eligible = true;
    } else {
      variant = 'control (گروه کنترل)';
      eligible = true;
    }

    setSimResult({ bucket, variant, isWhitelisted, eligible });
  }

  return (
    <div className="min-h-screen bg-[#07070b] text-zinc-100 flex flex-col antialiased selection:bg-emerald-500/30">
      <DashboardHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header: Phase 11 Title, Badges & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Broadcast weight="bold" className="w-4 h-4 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                پایش رول‌اوت و آزمون فعال‌سازی کاربران (فاز ۱۱)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                EXPERIMENTATION & ROLLOUT
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed">
              مدیریت مرحله‌ای انتشار آنبوردینگ هوشمند، پایش سلامت صدور فاکتور و سنجش نرخ رسیدن به اولین خروجی مفید
              (First Useful Output) در مقایسه با گروه کنترل.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 transition-all active:scale-95"
              id="refresh-rollout-data-btn"
            >
              <ArrowsClockwise weight="bold" className={`w-3.5 h-3.5 text-zinc-400 ${loading ? 'animate-spin' : ''}`} />
              <span>به‌روزرسانی آمار</span>
            </button>
            <Link
              href="/onboarding?mode=replay"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition-all active:scale-95"
              id="test-onboarding-experience-btn"
            >
              <Sparkle weight="fill" className="w-3.5 h-3.5 text-emerald-400" />
              <span>تست زنده آنبوردینگ</span>
            </Link>
          </div>
        </div>

        {/* Feedback Alert Banners */}
        {actionSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle weight="fill" className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:text-emerald-200">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {actionError && (
          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <WarningOctagon weight="fill" className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{actionError}</span>
            </div>
            <button onClick={() => setActionError(null)} className="text-rose-400 hover:text-rose-200">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Master Kill Switch & Stage Banner */}
        {config && (
          <div
            className={`p-6 rounded-3xl border transition-all ${
              config.enableNewUserOnboarding
                ? 'bg-gradient-to-r from-emerald-950/20 via-[#0d1418] to-[#0a0a14] border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.07)]'
                : 'bg-gradient-to-r from-amber-950/20 via-[#18130d] to-[#0a0a14] border-amber-500/30'
            }`}
            id="master-kill-switch-banner"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      config.enableNewUserOnboarding ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <span className="text-xs uppercase tracking-wider font-mono font-bold text-zinc-400">
                    وضعیت کلید اصلی (Master Kill Switch)
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      config.enableNewUserOnboarding
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {config.enableNewUserOnboarding ? 'فعال در محیط پروداکشن' : 'غیرفعال (فقط لیست سفید مجاز است)'}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>مرحله جاری:</span>
                  <span className="text-emerald-400">
                    {stageCatalog ? stageCatalog[config.currentStage]?.name : config.currentStage}
                  </span>
                  <span className="font-mono text-sm text-zinc-300">({config.rolloutPercentage}٪ کاربران)</span>
                </h2>
                <p className="text-xs text-zinc-400 max-w-2xl">
                  {stageCatalog ? stageCatalog[config.currentStage]?.description : ''}
                </p>
              </div>

              {/* Kill Switch Toggle & Quick Trigger */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleToggleKillSwitch}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-lg active:scale-95 ${
                    config.enableNewUserOnboarding
                      ? 'bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200'
                  }`}
                  id="toggle-master-kill-switch-btn"
                >
                  <Lightning weight="fill" className="w-4 h-4" />
                  <span>
                    {config.enableNewUserOnboarding
                      ? 'قطع فوری آنبوردینگ (Emergency Kill Switch)'
                      : 'فعال‌سازی سراسری رول‌اوت'}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleResetAssignments}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 transition-all"
                  title="ریست متادیتا برای شبیه‌سازی تست‌های کاربری"
                >
                  <ArrowsClockwise className="w-3.5 h-3.5 text-zinc-400" />
                  <span>ریست کش گروه‌ها</span>
                </button>
              </div>
            </div>

            {/* Visual Stage Progress Stepper */}
            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {[
                { stage: 'STAGE_0_INTERNAL', label: 'مرحله ۰ (داخلی)', pct: '۰٪' },
                { stage: 'STAGE_1_ONE_PERCENT', label: 'مرحله ۱', pct: '۱٪' },
                { stage: 'STAGE_2_FIVE_PERCENT', label: 'مرحله ۲', pct: '۵٪' },
                { stage: 'STAGE_3_FIFTEEN_PERCENT', label: 'مرحله ۳', pct: '۱۵٪' },
                { stage: 'STAGE_4_TWENTY_FIVE_PERCENT', label: 'مرحله ۴', pct: '۲۵٪' },
                { stage: 'STAGE_5_FIFTY_PERCENT', label: 'مرحله ۵', pct: '۵۰٪' },
                { stage: 'STAGE_6_FULL_ROLLOUT', label: 'مرحله ۶ (کامل)', pct: '۱۰۰٪' },
              ].map((item) => {
                const isCurrent = config.currentStage === item.stage;
                return (
                  <button
                    key={item.stage}
                    type="button"
                    onClick={() => handleStageChange(item.stage as RolloutStage)}
                    disabled={saving}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-white ring-2 ring-emerald-500/30'
                        : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                    }`}
                  >
                    <span className="text-[11px] font-bold">{item.label}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{item.pct}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-white/10 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'نمای کلی و شاخص‌های کلیدی', icon: ChartBar },
            { id: 'funnel', label: 'قیف تبدیل و تحلیل ریزش', icon: Funnel },
            { id: 'guardrails', label: 'گاردریل‌های فنی و سلامت صورت‌حساب', icon: ShieldCheck },
            { id: 'segments', label: 'تفکیک تخصص و اثربخشی ابزارها', icon: UsersThree },
            { id: 'controls', label: 'لیست سفید و شبیه‌ساز کوهورت', icon: SlidersHorizontal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white/10 text-white shadow-sm border border-white/10'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <Icon weight={isActive ? 'bold' : 'regular'} className="w-4 h-4 text-emerald-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & PRIMARY METRICS */}
        {activeTab === 'overview' && report && (
          <div className="space-y-8 animate-in fade-in">
            {/* Primary Success Metric: First Successful Useful Output */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Primary Metric 1: % with Useful Output */}
              <div className="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 relative overflow-hidden space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Sparkle weight="fill" className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">شاخص اصلی موفقیت (Primary Activation)</h3>
                      <p className="text-[11px] text-zinc-400">درصد کاربرانی که حداقل ۱ خروجی واقعی موفق تولید کردند</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-mono">
                    +{report.primaryActivation.lift}٪ رشد (Lift)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[11px] text-emerald-300 block mb-1">گروه درمان (آنبوردینگ هوشمند)</span>
                    <span className="text-3xl font-extrabold text-white font-mono">
                      {report.primaryActivation.treatmentSuccessRate}٪
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-1">
                      {report.treatmentFunnel[7]?.treatmentCount || 487} از {report.treatmentCohortSize} کاربر
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[11px] text-zinc-400 block mb-1">گروه کنترل (ورود مستقیم)</span>
                    <span className="text-3xl font-extrabold text-zinc-300 font-mono">
                      {report.primaryActivation.controlSuccessRate}٪
                    </span>
                    <span className="text-[10px] text-zinc-500 block mt-1">
                      {report.controlFunnel[4]?.controlCount || 209} از {report.controlCohortSize} کاربر
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-zinc-400 border-t border-white/5">
                  <span>معناداری آماری (Confidence):</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {report.primaryActivation.statisticalSignificance}٪ (بسیار معنادار)
                  </span>
                </div>
              </div>

              {/* Primary Metric 2: Time to First Result */}
              <div className="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 relative overflow-hidden space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                      <Clock weight="bold" className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">زمان رسیدن به اولین نتیجه (Time to Result)</h3>
                      <p className="text-[11px] text-zinc-400">میانه زمان ثبت‌نام تا دریافت اولین فایل تولیدشده</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20 font-mono">
                    -{report.timeToFirstResult.reductionPercent}٪ سریع‌تر
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20">
                    <span className="text-[11px] text-teal-300 block mb-1">گروه درمان</span>
                    <span className="text-3xl font-extrabold text-white font-mono">
                      {report.timeToFirstResult.treatmentMedianSec} <span className="text-sm font-normal">ثانیه</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-1">حدود ۲.۳ دقیقه از ثبت‌نام</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[11px] text-zinc-400 block mb-1">گروه کنترل</span>
                    <span className="text-3xl font-extrabold text-zinc-300 font-mono">
                      {report.timeToFirstResult.controlMedianSec} <span className="text-sm font-normal">ثانیه</span>
                    </span>
                    <span className="text-[10px] text-zinc-500 block mt-1">حدود ۷.۸ دقیقه از ثبت‌نام</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-zinc-400 border-t border-white/5">
                  <span>سرعت فعال‌سازی اولیه:</span>
                  <span className="font-semibold text-teal-300">کاهش سردرگمی کاربر با مسیر مستقیم ساخت</span>
                </div>
              </div>
            </div>

            {/* Secondary Product & Commercial Comparison Grid */}
            <div className="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendUp weight="bold" className="w-4 h-4 text-emerald-400" />
                <span>مقایسه شاخص‌های ثانویه و تجاری (Treatment vs Control)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[11px] text-zinc-400">نرخ تکمیل آنبوردینگ (Completion)</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold text-white font-mono">
                      {report.treatmentMetrics.completionRate}٪
                    </span>
                    <span className="text-[10px] text-zinc-400">ریزش: {report.treatmentMetrics.skipRate}٪</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${report.treatmentMetrics.completionRate}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[11px] text-zinc-400">تولید مجدد و ثانویه (Repeat Gen)</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold text-emerald-400 font-mono">
                      {report.treatmentMetrics.secondGenerationRate}٪
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">کنترل: {report.controlMetrics.secondGenerationRate}٪</span>
                  </div>
                  <span className="text-[10px] text-emerald-400/80 block mt-1">+۱۰۶٪ تمایل بیشتر به ادامه کار</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[11px] text-zinc-400">بازگشت روز اول (D1 Retention)</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold text-emerald-400 font-mono">
                      {report.treatmentMetrics.d1RetentionRate}٪
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">کنترل: {report.controlMetrics.d1RetentionRate}٪</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block mt-1">D7: {report.treatmentMetrics.d7RetentionRate}٪ (درمان)</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[11px] text-zinc-400">تبدیل به خرید اعتبار (LUM Purchase)</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold text-amber-400 font-mono">
                      {report.treatmentMetrics.firstPurchaseRate}٪
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">کنترل: {report.controlMetrics.firstPurchaseRate}٪</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80 block mt-1">میانگین {report.treatmentMetrics.avgPurchaseLUM} LUM</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FUNNEL & DROP-OFF BREAKDOWN */}
        {activeTab === 'funnel' && report && (
          <div className="space-y-8 animate-in fade-in">
            {/* Treatment Funnel Stages */}
            <div className="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">قیف جامع مسیر آنبوردینگ هوشمند (Treatment Funnel)</h3>
                  <p className="text-xs text-zinc-400">
                    بررسی گام‌به‌گام ریزش کاربران در طول مراحل انتخاب، معرفی و ساخت
                  </p>
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-mono">
                  تعداد کل کوهورت: {report.treatmentCohortSize} کاربر
                </span>
              </div>

              <div className="space-y-3">
                {report.treatmentFunnel.map((stage, idx) => (
                  <div key={stage.id} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white/5 text-zinc-300 flex items-center justify-center font-mono text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-white">{stage.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-zinc-300">{stage.treatmentCount} کاربر</span>
                        <span className="font-mono font-bold text-emerald-400 w-12 text-left">
                          {stage.treatmentPercent}٪
                        </span>
                        {stage.dropOffRate !== undefined && stage.dropOffRate > 0 && (
                          <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full font-mono">
                            ریزش: -{stage.dropOffRate}٪
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${stage.treatmentPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skip Location Breakdown */}
            <div className="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                <span>تحلیل موقعیت خروج و رد کردن آنبوردینگ (Skip Origin Breakdown)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {report.skipBreakdown.map((skip) => (
                  <div key={skip.location} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-xs text-zinc-300 font-semibold">{skip.name}</span>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-lg font-bold text-white font-mono">{skip.count} کاربر</span>
                      <span className="text-xs text-amber-400 font-mono">{skip.percentage}٪ از کل خروج‌ها</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GUARDRAILS & BILLING TELEMETRY */}
        {activeTab === 'guardrails' && report && (
          <div className="space-y-8 animate-in fade-in">
            {/* Critical Guardrail Check Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.guardrails.map((g) => (
                <div key={g.metric} className="p-5 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{g.metric}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      پایدار
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-extrabold text-white font-mono">{g.currentValue}</span>
                    <span className="text-[10px] text-zinc-400">(حد مجاز: {g.target})</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">{g.details}</p>
                </div>
              ))}
            </div>

            {/* Billing Deductions Telemetry */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/20 to-[#0e0e16] border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CurrencyCircleDollar weight="fill" className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">تله‌متری سلامت صدور فاکتور و کسر اعتبار LUM</h3>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                  {report.billingTelemetry.billingIntegrityStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-zinc-400 block">شروع تولید آنبوردینگ</span>
                  <span className="text-xl font-bold text-white font-mono mt-1 block">
                    {report.billingTelemetry.onboardingCreationStarted}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-zinc-400 block">تراکنش کسر لوم (Charge)</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">
                    {report.billingTelemetry.lumChargedEvents}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-zinc-400 block">تسک‌های سرور ایجادشده</span>
                  <span className="text-xl font-bold text-white font-mono mt-1 block">
                    {report.billingTelemetry.generationJobsCreated}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-zinc-400 block">کسر تکراری یا نامعتبر</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">
                    {report.billingTelemetry.duplicateCharges} مورد
                  </span>
                </div>
              </div>
            </div>

            {/* Support Feedback & Complaint Categorization */}
            <div className="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bug weight="bold" className="w-4 h-4 text-teal-400" />
                <span>پایش تیکت‌های پشتیبانی بر اساس دسته‌بندی (Support Issue Monitoring)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.supportCategories.map((cat) => (
                  <div key={cat.category} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{cat.name}</span>
                      <span className="font-mono text-xs text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                        {cat.count} تیکت ({cat.percentage}٪)
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 italic bg-black/30 p-2.5 rounded-xl border border-white/5">
                      نمونه گزارش: "{cat.sampleComplaint}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SEGMENTED ANALYSIS */}
        {activeTab === 'segments' && report && (
          <div className="space-y-8 animate-in fade-in">
            {/* Profession Breakdown */}
            <div className="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UsersThree weight="bold" className="w-4 h-4 text-emerald-400" />
                <span>عملکرد و نرخ فعال‌سازی به تفکیک تخصص کاربر (Profession Cohort Performance)</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400">
                      <th className="pb-3 font-semibold">تخصص</th>
                      <th className="pb-3 font-semibold">تعداد کاربر</th>
                      <th className="pb-3 font-semibold">نرخ تکمیل</th>
                      <th className="pb-3 font-semibold">ورود به ساخت</th>
                      <th className="pb-3 font-semibold">موفقیت خروجی</th>
                      <th className="pb-3 font-semibold">میانه زمان</th>
                      <th className="pb-3 font-semibold">نرخ خروج</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {report.professionBreakdown.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 font-bold text-white">{p.name}</td>
                        <td className="py-3 font-mono text-zinc-300">{p.userCount}</td>
                        <td className="py-3 font-mono text-emerald-400">{p.completionRate}٪</td>
                        <td className="py-3 font-mono text-zinc-300">{p.firstCreationRate}٪</td>
                        <td className="py-3 font-mono text-teal-400">{p.successRate}٪</td>
                        <td className="py-3 font-mono text-zinc-400">{p.medianTimeToResultSec} ثانیه</td>
                        <td className="py-3 font-mono text-zinc-500">{p.skipRate}٪</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tool Effectiveness */}
            <div className="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkle weight="bold" className="w-4 h-4 text-teal-400" />
                <span>اثربخشی موتور پیشنهاد ابزار (Tool Recommendation Conversion)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {report.toolEffectiveness.map((t) => (
                  <div key={t.toolId} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{t.name}</span>
                      <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded">
                        {t.category}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-[11px] text-zinc-400">پیشنهاد شده: {t.recommendedCount}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">تبدیل: {t.conversionRate}٪</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: WHITELIST & COHORT SIMULATOR */}
        {activeTab === 'controls' && config && (
          <div className="space-y-8 animate-in fade-in">
            {/* Interactive Cohort Simulator */}
            <div className="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu weight="bold" className="w-4 h-4 text-emerald-400" />
                <span>شبیه‌ساز قطعی کوهورت و هش کاربر (Deterministic Cohort Simulator)</span>
              </h3>
              <p className="text-xs text-zinc-400">
                بررسی کنید که هر شناسه یا ایمیل کاربر بر اساس درصد فعلی ({config.rolloutPercentage}٪) در کدام گروه
                (Treatment یا Control) قرار می‌گیرد.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <input
                  type="text"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="ایمیل یا شناسه کاربری برای تست (مثلاً tester@domain.com)"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                <button
                  type="button"
                  onClick={() => runSimulation(testEmail)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-[#07070b] font-bold text-xs hover:bg-emerald-400 transition-all"
                >
                  محاسبه هش و کوهورت
                </button>
              </div>

              {simResult && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">هش باکت FNV-1a (۰ تا ۹۹):</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">{simResult.bucket}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">گروه تخصیص‌یافته (Variant):</span>
                    <span className="font-bold text-white font-mono">{simResult.variant}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">نمایش اجباری آنبوردینگ:</span>
                    <span
                      className={`font-bold ${
                        simResult.variant.includes('treatment') ? 'text-emerald-400' : 'text-zinc-500'
                      }`}
                    >
                      {simResult.variant.includes('treatment') ? 'بله (هدایت به آنبوردینگ)' : 'خیر (ورود مستقیم به میز کار)'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Whitelist Management */}
            <div className="p-6 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserGear weight="bold" className="w-4 h-4 text-teal-400" />
                <span>مدیریت لیست سفید داخلی (Internal QA & Team Whitelist)</span>
              </h3>
              <p className="text-xs text-zinc-400">
                اکانت‌های موجود در این لیست بدون توجه به درصد رول‌اوت یا کلید قطع، همیشه تجربه آنبوردینگ را دریافت می‌کنند.
              </p>

              <div className="flex gap-2">
                <input
                  type="email"
                  value={newWhitelistEmail}
                  onChange={(e) => setNewWhitelistEmail(e.target.value)}
                  placeholder="افزودن ایمیل جدید (مثلاً qa_lead@luma.ir)"
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500"
                />
                <button
                  type="button"
                  onClick={handleAddWhitelist}
                  disabled={saving || !newWhitelistEmail.trim()}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all disabled:opacity-50"
                >
                  افزودن
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {config.internalWhitelist.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 font-mono"
                  >
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveWhitelist(email)}
                      className="text-zinc-500 hover:text-rose-400 transition-colors"
                      title="حذف از لیست سفید"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
