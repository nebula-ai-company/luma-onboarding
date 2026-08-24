'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkle,
  ChatCircleDots,
  GitBranch,
  Robot,
  FolderOpen,
  Code,
  CreditCard,
  GearSix,
  ArrowClockwise,
  List,
  X,
  CaretDown,
} from '@phosphor-icons/react';

interface DashboardHeaderProps {
  user?: {
    displayName?: string;
    email?: string;
    avatarUrl?: string;
    tier?: string;
    lumBalance?: number;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { label: 'ابزارهای هوش مصنوعی', href: '/dashboard', icon: Sparkle },
    { label: 'چت و متن', href: '/dashboard/chat', icon: ChatCircleDots },
    { label: 'ورک‌فلوها', href: '/dashboard/workflow', icon: GitBranch },
    { label: 'دستیارها', href: '/dashboard/assistant', icon: Robot },
    { label: 'فایل‌ها', href: '/dashboard/files', icon: FolderOpen },
    { label: 'توسعه‌دهندگان', href: '/dashboard/developers', icon: Code },
  ];

  const displayName = user?.displayName || 'سارا رادمنش';
  const avatarUrl = user?.avatarUrl || 'https://picsum.photos/seed/sara_luma_user/200/200';
  const balance = user?.lumBalance ?? 20;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#09090f]/90 backdrop-blur-xl border-b border-white/5" id="luma-dashboard-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-3 group focus:outline-none" id="brand-logo-link">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1px] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.25)] group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#09090f] rounded-[11px] flex items-center justify-center">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  L
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">لوما</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 hidden sm:inline">پلتفرم هوش مصنوعی</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" id="desktop-nav-links">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <Icon weight={isActive ? 'bold' : 'regular'} className="w-4 h-4 text-emerald-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Balance, Replay Onboarding, Settings & User Profile */}
        <div className="flex items-center gap-3">
          {/* Balance Pill */}
          <Link
            href="/dashboard/billing"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all text-xs text-emerald-300 font-medium group"
            id="credit-balance-pill"
          >
            <Sparkle weight="fill" className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            <span className="font-mono font-bold text-white">{balance}</span>
            <span className="text-[11px] text-emerald-400/90">اعتبار LUM</span>
            <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300 hidden sm:inline">
              شارژ +
            </span>
          </Link>

          {/* Replay Onboarding Button */}
          <Link
            href="/onboarding?mode=replay"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 hover:text-white transition-all"
            id="replay-onboarding-btn"
            title="مشاهده دوباره راهنمای لوما"
          >
            <ArrowClockwise weight="bold" className="w-3.5 h-3.5 text-teal-400" />
            <span>راهنما و شخصی‌سازی</span>
          </Link>

          {/* User Profile Button / Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-emerald-500/40 transition-all focus:outline-none"
              id="user-profile-menu-btn"
            >
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20"
                referrerPolicy="no-referrer"
              />
              <CaretDown weight="bold" className="w-3 h-3 text-zinc-400 hidden sm:inline" />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-56 bg-[#101018] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                id="user-dropdown-panel"
              >
                <div className="px-4 py-2 border-b border-white/5">
                  <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                  <p className="text-[11px] text-zinc-400 truncate">{user?.email || 'sara.radmanesh@luma.ir'}</p>
                </div>

                <div className="py-1">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5"
                  >
                    <GearSix className="w-4 h-4 text-zinc-400" />
                    <span>تنظیمات حساب و علایق</span>
                  </Link>
                  <Link
                    href="/dashboard/billing"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5"
                  >
                    <CreditCard className="w-4 h-4 text-zinc-400" />
                    <span>مدیریت اشتراک و اعتبار</span>
                  </Link>
                  <Link
                    href="/onboarding?mode=preferences"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5"
                  >
                    <Sparkle className="w-4 h-4 text-emerald-400" />
                    <span>ویرایش تخصص‌ها و علایق</span>
                  </Link>
                  <Link
                    href="/dashboard/rollout"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 font-medium"
                    id="nav-rollout-dashboard-link"
                  >
                    <Sparkle className="w-4 h-4 text-amber-400" />
                    <span>پایش و رول‌اوت آنبوردینگ (فاز ۱۱)</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-white/5">
                  <Link
                    href="/onboarding?mode=replay"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-teal-300 hover:text-teal-200 hover:bg-teal-500/10"
                  >
                    <ArrowClockwise className="w-4 h-4 text-teal-400" />
                    <span>اجرای مجدد آنبوردینگ</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white"
            id="mobile-nav-toggle-btn"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/5 bg-[#09090f] px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-emerald-500/15 text-emerald-300' : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5 text-emerald-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/onboarding?mode=replay"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-teal-300 bg-teal-500/10 rounded-xl"
            >
              <ArrowClockwise className="w-4 h-4" />
              <span>مشاهده دوباره راهنمای لوما</span>
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 rounded-xl"
            >
              <GearSix className="w-4 h-4" />
              <span>تنظیمات</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
