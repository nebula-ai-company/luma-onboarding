'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MagicWand,
  ChatCircleDots,
  CirclesThreePlus,
  Robot,
  FolderSimple,
  Code,
  Sparkle,
  User,
  Sliders,
  ArrowCounterClockwise,
  Play,
  DownloadSimple,
  Copy,
  Check,
  MagnifyingGlass,
  ArrowUpRight,
  Lightning,
  PaperPlaneRight,
  Plus,
  Trash,
  CheckCircle,
  Eye,
  PaintBrush,
  Images,
} from '@phosphor-icons/react';
import { useOnboarding } from '@/context/OnboardingContext';
import { LumaCore } from '@/components/core/LumaCore';
import { LUMA_SECTIONS, LUMA_TOOLS_CATALOG, PROFESSIONS_DATA, INTERESTS_DATA } from '@/lib/onboarding-data';
import type { LumaSectionId } from '@/types/onboarding';
import { resolveOnboardingDestination } from '@/lib/destination-resolver';
import { trackOnboardingEvent } from '@/lib/analytics';

export function LumaWorkspace() {
  const state = useOnboarding();
  const {
    activeWorkspaceSection,
    setActiveWorkspaceSection,
    activeWorkspaceToolId,
    setActiveWorkspaceToolId,
    selectedProfessions,
    selectedInterests,
    derivedArchetypes,
    primarySections,
    toolRecommendations,
    firstCreationResult,
    relaunchOnboarding,
    resetOnboarding,
    isSkipped,
  } = state;

  const destination = resolveOnboardingDestination(state);

  // Profile Drawer / Modal state
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [toolSearchQuery, setToolSearchQuery] = useState<string>('');
  const [selectedToolCategory, setSelectedToolCategory] = useState<string>('all');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [activeModalTool, setActiveModalTool] = useState<typeof LUMA_TOOLS_CATALOG[0] | null>(null);

  // Chat Tab State
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; text: string; time: string }[]
  >([
    {
      role: 'assistant',
      text: 'سلام! به چت هوشمند لوما خوش آمدید. من می‌توانم در ایده‌پردازی، نگارش سناریو، ترجمه و تولید محتوا همراه شما باشم. مایلید درباره چه موضوعی گفت‌وگو کنیم؟',
      time: 'همین الان',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatModel, setChatModel] = useState<string>('gemini-2.5-flash');

  // Interactive Quick Tool Runner State
  const [toolPromptInput, setToolPromptInput] = useState<string>('');
  const [toolRunning, setToolRunning] = useState<boolean>(false);
  const [toolResultImage, setToolResultImage] = useState<string | null>(null);

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    const now = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg, time: now }]);

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `پاسخ پردازش شده با مدل ${chatModel}:\n\nدرخواست شما با موفقیت بررسی شد. برای موضوع «${userMsg}»، بهترین ساختار شامل موارد زیر است:\n\n۱. تعیین هدف شفاف و مخاطب هدف\n۲. استفاده از ترکیب ابزارهای تولید تصویر و کپشن‌نویسی هوشمند\n۳. اجرای پیش‌نمایش در ورک‌فلو لوما برای دریافت سریع‌ترین بازدهی.`,
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  const handleRunTool = (tool: typeof LUMA_TOOLS_CATALOG[0]) => {
    setToolRunning(true);
    setToolResultImage(null);
    setTimeout(() => {
      setToolRunning(false);
      setToolResultImage('https://picsum.photos/seed/workspace_live_tool_res/1000/1000');
    }, 1200);
  };

  // Filter tools
  const filteredTools = LUMA_TOOLS_CATALOG.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(toolSearchQuery.toLowerCase());

    if (selectedToolCategory === 'all') return matchesSearch;
    if (selectedToolCategory === 'recommended') {
      return matchesSearch && toolRecommendations.some((r) => r.id === tool.id);
    }
    if (selectedToolCategory === 'image') return matchesSearch && tool.category === 'تصویر';
    if (selectedToolCategory === 'video') return matchesSearch && tool.category === 'ویدیو';
    if (selectedToolCategory === 'edit') return matchesSearch && tool.category === 'ویرایش';
    if (selectedToolCategory === 'voice') return matchesSearch && tool.category === 'صدا';
    return matchesSearch;
  });

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#07070b] text-zinc-100 flex flex-col font-sans">
      {/* ========================================================================= */}
      {/* TOP WORKSPACE NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand + Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.3)]">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-400 rotate-45 shadow-[0_0_6px_#c084fc]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-zinc-100 font-mono tracking-wider">LUMA</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/50 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>آنلاین</span>
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">میز کار هوش مصنوعی</span>
            </div>
          </div>

          {/* Section Navigation Tabs (6 LUMA Ecosystem Sections) */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1 rounded-full border border-white/[0.06]">
            {LUMA_SECTIONS.map((sec) => {
              const isActive = activeWorkspaceSection === sec.id;
              const isPrimary = primarySections.includes(sec.id);

              let Icon = MagicWand;
              if (sec.id === 'ai_chat') Icon = ChatCircleDots;
              if (sec.id === 'workflow') Icon = CirclesThreePlus;
              if (sec.id === 'smart_assistant') Icon = Robot;
              if (sec.id === 'my_files') Icon = FolderSimple;
              if (sec.id === 'api_developers') Icon = Code;

              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveWorkspaceSection(sec.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon weight={isActive ? 'fill' : 'regular'} className="w-3.5 h-3.5" />
                  <span>{sec.title}</span>
                  {isPrimary && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_4px_#c084fc]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: User Profile & Preferences Popover */}
          <div className="flex items-center gap-2.5">
            <button
              id="btn-workspace-preferences"
              type="button"
              onClick={() => {
                setShowProfileModal(true);
                trackOnboardingEvent('workspace_preferences_modal_opened');
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              <Sliders weight="bold" className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">پروفایل و اولویت‌ها</span>
            </button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 border border-purple-400/40 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              کاربر
            </div>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-white/[0.04] scrollbar-none">
          {LUMA_SECTIONS.map((sec) => {
            const isActive = activeWorkspaceSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveWorkspaceSection(sec.id)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50'
                }`}
              >
                {sec.title}
              </button>
            );
          })}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN WORKSPACE VIEWPORT */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Contextual Personalization Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 via-zinc-900/40 to-indigo-950/20 border border-purple-500/20 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 flex-shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.2)]">
              <Sparkle weight="duotone" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <span>فضای کاربری هوشمند شما</span>
                {selectedProfessions.length > 0 && (
                  <span className="text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30 font-medium">
                    شخصی‌سازی شده
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {selectedProfessions.length > 0
                  ? `بر اساس انتخاب‌های شما، ابزارهای تخصصی در اولویت دسترسی قرار دارند.`
                  : 'دسترسی کامل به تمام ابزارها و مدل‌های پیشرفته هوش مصنوعی لوما.'}
              </p>
            </div>
          </div>

          {/* Archetype / Profession Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            {selectedProfessions.slice(0, 3).map((pId) => {
              const prof = PROFESSIONS_DATA.find((p) => p.id === pId);
              if (!prof) return null;
              return (
                <span
                  key={pId}
                  className="text-[11px] font-medium text-zinc-300 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-lg"
                >
                  {prof.title}
                </span>
              );
            })}
          </div>
        </div>

        {/* Recent Creation Spotlight (if user made a first creation) */}
        {firstCreationResult && (
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/60 border border-white/10 flex-shrink-0">
                {firstCreationResult.imageUrl && (
                  <img
                    src={firstCreationResult.imageUrl}
                    alt={firstCreationResult.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {firstCreationResult.videoUrl && (
                  <video
                    src={firstCreationResult.videoUrl}
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                  />
                )}
                {firstCreationResult.chatResponseText && (
                  <div className="w-full h-full p-2 text-[8px] text-zinc-400 overflow-hidden">
                    {firstCreationResult.chatResponseText.slice(0, 60)}...
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-200">
                    خروجی آنبوردینگ شما: {firstCreationResult.title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1 max-w-md">
                  {firstCreationResult.prompt || 'فایل تولید شده در فایل‌های من آماده بهره‌برداری است.'}
                </p>
              </div>
            </div>

            {/* Direct Contextual Actions */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {firstCreationResult.prompt && (
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(firstCreationResult.prompt!)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'کپی شد' : 'کپی دستور'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveWorkspaceSection('my_files')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-colors cursor-pointer"
              >
                <FolderSimple weight="fill" className="w-3.5 h-3.5" />
                <span>مشاهده در فایل‌های من</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: AI TOOLS STUDIO */}
        {/* ========================================================================= */}
        {activeWorkspaceSection === 'ai_tools' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: 'همه ابزارها' },
                  { id: 'recommended', label: 'پیشنهادی شما' },
                  { id: 'image', label: 'تصویر' },
                  { id: 'video', label: 'ویدیو' },
                  { id: 'edit', label: 'ویرایش' },
                  { id: 'voice', label: 'صدا' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedToolCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      selectedToolCategory === cat.id
                        ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-white/[0.06]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <MagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="جستجوی ابزار..."
                  value={toolSearchQuery}
                  onChange={(e) => setToolSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl pr-9 pl-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => {
                const isRecommended = toolRecommendations.some((r) => r.id === tool.id);
                return (
                  <div
                    key={tool.id}
                    className="group relative p-5 rounded-2xl bg-zinc-900/40 border border-white/[0.06] hover:border-purple-500/30 hover:bg-zinc-900/70 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-950/50 border border-purple-500/20 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                          <MagicWand weight="duotone" className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isRecommended && (
                            <span className="text-[10px] font-medium text-purple-300 bg-purple-950/60 border border-purple-500/20 px-2 py-0.5 rounded-md">
                              پیشنهاد شده
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-500 font-mono bg-white/[0.04] px-2 py-0.5 rounded-md">
                            {tool.category}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-zinc-200 mb-1">{tool.title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                        {tool.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/[0.04] mt-4 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {tool.isFastResult ? 'پردازش سریع' : 'پردازش دقیق'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModalTool(tool);
                          setToolPromptInput('');
                          setToolResultImage(null);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:text-purple-300 transition-colors cursor-pointer"
                      >
                        <span>شروع کار</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: AI CHAT */}
        {/* ========================================================================= */}
        {activeWorkspaceSection === 'ai_chat' && (
          <div className="rounded-2xl bg-zinc-900/50 border border-white/[0.08] p-4 sm:p-6 flex flex-col h-[560px] justify-between">
            {/* Top Chat Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <ChatCircleDots weight="duotone" className="w-5 h-5 text-sky-400" />
                <span className="text-sm font-bold text-zinc-200">محیط گفت‌وگوی چندمدلی لوما</span>
              </div>

              {/* Model Selector */}
              <select
                value={chatModel}
                onChange={(e) => setChatModel(e.target.value)}
                className="bg-zinc-950 border border-white/10 rounded-xl px-3 py-1 text-xs text-zinc-300 font-mono focus:outline-none focus:border-purple-500/50 cursor-pointer"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gpt-4o">GPT-4o (OpenAI)</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                <option value="deepseek-v3">DeepSeek V3</option>
              </select>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-zinc-800/80 text-zinc-200 border border-white/[0.06] rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 font-mono">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
              <input
                type="text"
                placeholder="سوال، ایده یا پرامپت خود را بنویسید..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChat();
                }}
                className="flex-1 bg-zinc-950/80 border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
              />
              <button
                type="button"
                onClick={handleSendChat}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <PaperPlaneRight weight="bold" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: WORKFLOW */}
        {/* ========================================================================= */}
        {activeWorkspaceSection === 'workflow' && (
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-200 flex items-center gap-2">
                  <CirclesThreePlus weight="duotone" className="w-5 h-5 text-indigo-400" />
                  <span>ورک‌فلوهای چندمرحله‌ای لوما</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  اتصال خودکار ابزارها برای ساخت فرایندهای هوشمند و تولید دسته‌جمعی.
                </p>
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
              >
                + ساخت ورک‌فلو جدید
              </button>
            </div>

            {/* Workflow Pipeline Visual Node Card */}
            <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/[0.06] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200">
                  ورک‌فلو آماده: تولید خودکار پوستر محصول
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono">
                  آماده اجرا
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { step: '۱. ورودی عکس', desc: 'آپلود تصویر محصول', icon: Images },
                  { step: '۲. حذف پس‌زمینه', desc: 'تفکیک دقیق سوژه', icon: MagicWand },
                  { step: '۳. نورپردازی ۳D', desc: 'افزودن نور استودیویی', icon: Sparkle },
                  { step: '۴. نگارش کپشن', desc: 'تولید متن تبلیغاتی', icon: ChatCircleDots },
                ].map((node, idx) => {
                  const NodeIcon = node.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-zinc-900/80 border border-white/[0.04] text-center"
                    >
                      <NodeIcon weight="duotone" className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
                      <h4 className="text-xs font-bold text-zinc-200">{node.step}</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{node.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SMART ASSISTANT */}
        {/* ========================================================================= */}
        {activeWorkspaceSection === 'smart_assistant' && (
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-200 flex items-center gap-2">
                  <Robot weight="duotone" className="w-5 h-5 text-emerald-400" />
                  <span>دستیاران هوشمند اختصاصی</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  طراحی دستیار متصل به اسناد، کاتالوگ‌ها و اطلاعات اختصاصی شما.
                </p>
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
              >
                + ساخت دستیار هوشمند
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/[0.06]">
                <h4 className="text-xs font-bold text-zinc-200 mb-1">دستیار پشتیبانی و فروشگاه</h4>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                  پاسخ‌گویی هوشمند به سوالات مشتریان بر اساس کاتالوگ محصولات.
                </p>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                  <span>۳ سند متصل</span> • <span>مدل: Flash</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/[0.06]">
                <h4 className="text-xs font-bold text-zinc-200 mb-1">دستیار تحلیل اسناد و قراردادها</h4>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                  خلاصه‌سازی متون حقوقی، استخراج بندهای کلیدی و پاسخ سریع.
                </p>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                  <span>۵ فایل PDF</span> • <span>مدل: Pro</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MY FILES */}
        {/* ========================================================================= */}
        {activeWorkspaceSection === 'my_files' && (
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-200 flex items-center gap-2">
                  <FolderSimple weight="duotone" className="w-5 h-5 text-amber-400" />
                  <span>فایل‌های من و آرشیو خروجی‌ها</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  تمام تصاویر، ویدیوها و اسناد تولید شده در فضای ابری ایمن شما.
                </p>
              </div>

              <div className="text-xs text-zinc-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.06] font-mono">
                فضای استفاده شده: ۲.۴ مگابایت / ۱۰ گیگابایت
              </div>
            </div>

            {/* Files Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {firstCreationResult && (
                <div className="rounded-2xl bg-zinc-950 border border-purple-500/30 overflow-hidden group">
                  <div className="relative aspect-square bg-black/60">
                    {firstCreationResult.imageUrl && (
                      <img
                        src={firstCreationResult.imageUrl}
                        alt={firstCreationResult.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {firstCreationResult.videoUrl && (
                      <video
                        src={firstCreationResult.videoUrl}
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/30 text-[10px] text-purple-300 font-bold">
                      آنبوردینگ
                    </span>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-zinc-200 truncate">
                      {firstCreationResult.title}
                    </h4>
                    <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                      {firstCreationResult.dimensions || '2048 x 2048'}
                    </span>
                  </div>
                </div>
              )}

              {/* Sample archived files */}
              {[
                { title: 'کاور مینیمال بنفش', date: 'امروز', size: '1.2 MB' },
                { title: 'ویدیو متحرک محصول', date: 'دیروز', size: '4.8 MB' },
              ].map((f, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-zinc-950/60 border border-white/[0.06] overflow-hidden"
                >
                  <div className="aspect-square bg-zinc-900 flex items-center justify-center text-zinc-600">
                    <Images weight="duotone" className="w-8 h-8" />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-zinc-300 truncate">{f.title}</h4>
                    <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                      {f.size}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: API & DEVELOPERS */}
        {/* ========================================================================= */}
        {activeWorkspaceSection === 'api_developers' && (
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-6">
            <div>
              <h3 className="text-base font-bold text-zinc-200 flex items-center gap-2">
                <Code weight="duotone" className="w-5 h-5 text-rose-400" />
                <span>کلیدهای API و اتصال برنامه‌نویسان</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                قابلیت‌های لوما را با سرعت بالا در نرم‌افزار، وب‌سایت یا اپلیکیشن خود فراخوانی کنید.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-2">
              <span className="text-xs font-bold text-zinc-300">کلید API فعال شما:</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="luma_live_sk_948f98a28e9381716381bc"
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopyPrompt('luma_live_sk_948f98a28e9381716381bc')}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition-colors cursor-pointer"
                >
                  {copiedPrompt ? 'کپی شد' : 'کپی کلید'}
                </button>
              </div>
            </div>

            {/* cURL Snippet */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-2">
              <span className="text-xs font-bold text-zinc-300 font-mono">cURL Request Example:</span>
              <pre className="p-3 rounded-xl bg-black/80 text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed" dir="ltr">
{`curl -X POST https://api.lumai.ir/v1/generate \\
  -H "Authorization: Bearer luma_live_sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "A modern Persian architectural studio", "model": "luma-photo-v2"}'`}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* PROFILE & PREFERENCES RECONFIGURATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-white/10 p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Sliders weight="bold" className="w-4 h-4 text-purple-400" />
                  <span>پروفایل و اولویت‌های آنبوردینگ</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="text-zinc-500 hover:text-zinc-300 text-xs px-2 py-1 cursor-pointer"
                >
                  بستن
                </button>
              </div>

              {/* Archetypes */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-300">الگوهای شخصیتی شناسایی‌شده:</span>
                <div className="flex flex-wrap gap-1.5">
                  {derivedArchetypes.map((arch) => (
                    <span
                      key={arch}
                      className="text-xs font-mono px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/20 text-purple-300"
                    >
                      {arch}
                    </span>
                  ))}
                </div>
              </div>

              {/* Professions */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-300">تخصص‌های انتخاب‌شده:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfessions.map((pId) => {
                    const prof = PROFESSIONS_DATA.find((p) => p.id === pId);
                    return (
                      <span
                        key={pId}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300"
                      >
                        {prof?.title || pId}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row gap-2 justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileModal(false);
                    relaunchOnboarding(1);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
                >
                  ویرایش اولویت‌ها و تخصص
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileModal(false);
                    resetOnboarding();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-rose-400 text-xs font-medium cursor-pointer"
                >
                  شروع مجدد کامل آنبوردینگ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* INTERACTIVE TOOL RUNNER MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModalTool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-xl rounded-3xl bg-zinc-950 border border-white/10 p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <MagicWand weight="duotone" className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-zinc-100">{activeModalTool.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalTool(null)}
                  className="text-zinc-500 hover:text-zinc-300 text-xs px-2 py-1 cursor-pointer"
                >
                  بستن
                </button>
              </div>

              <p className="text-xs text-zinc-400">{activeModalTool.description}</p>

              {/* Prompt Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">دستور شما (پرامپت):</label>
                <textarea
                  rows={3}
                  value={toolPromptInput}
                  onChange={(e) => setToolPromptInput(e.target.value)}
                  placeholder="ایده یا مشخصات درخواست خود را بنویسید..."
                  className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 resize-none"
                />
              </div>

              {/* Result Preview Box if generated */}
              {toolRunning && (
                <div className="p-8 rounded-xl bg-zinc-900/60 border border-white/[0.06] flex flex-col items-center justify-center gap-2">
                  <span className="w-6 h-6 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                  <span className="text-xs text-purple-300">در حال پردازش درخواست با هوش مصنوعی...</span>
                </div>
              )}

              {toolResultImage && (
                <div className="rounded-xl overflow-hidden bg-black aspect-video border border-emerald-500/30">
                  <img src={toolResultImage} alt="Tool Result" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Run CTA */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveModalTool(null)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  disabled={toolRunning}
                  onClick={() => handleRunTool(activeModalTool)}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50 cursor-pointer"
                >
                  {toolRunning ? 'در حال تولید...' : 'تولید خروجی'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
