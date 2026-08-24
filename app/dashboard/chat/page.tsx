'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChatCircleDots,
  PaperPlaneRight,
  Sparkle,
  ArrowRight,
  Robot,
} from '@phosphor-icons/react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'سلام! من دستیار هوشمند لوما هستم. می‌توانم در نوشتن متن، بازنویسی، تولید ایده سناریو، کدنویسی و ترجمه دقیق فارسی به شما کمک کنم. چه کاری برایتان انجام دهم؟',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `درخواست شما برای «${userText}» دریافت شد. به عنوان یک نمونه، این خروجی ساختاریافته برای اجرای سریع شما طراحی شده است:

۱. **مرحله اول:** تعریف چارچوب اصلی و مخاطبان هدف.
۲. **مرحله دوم:** ایجاد نسخه اولیه با لحن ترغیب‌کننده و خلاق.
۳. **مرحله سوم:** آماده‌سازی خروجی نهایی برای انتشار در کانال‌های ارتباطی.`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-zinc-100 flex flex-col font-sans">
      <DashboardHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Link href="/dashboard" className="hover:text-white">
                میز کار
              </Link>
              <span>/</span>
              <span className="text-emerald-400 font-medium">چت هوشمند</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ChatCircleDots className="w-6 h-6 text-teal-400" />
              <span>گفت‌وگو با هوش مصنوعی لوما</span>
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

        {/* Chat Window */}
        <div className="flex-1 min-h-[480px] bg-[#0e0e16] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col justify-between space-y-4">
          {/* Messages */}
          <div className="space-y-4 overflow-y-auto max-h-[440px] pr-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    m.sender === 'user'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-teal-500/20 text-teal-300'
                  }`}
                >
                  {m.sender === 'user' ? <Sparkle className="w-4 h-4" /> : <Robot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-emerald-600/20 border border-emerald-500/30 text-white rounded-tr-none'
                      : 'bg-[#141420] border border-white/10 text-zinc-200 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="پیام یا دستور خود را بنویسید..."
              className="flex-1 bg-[#141420] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
            <button
              type="button"
              onClick={handleSend}
              className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-bold hover:opacity-90 active:scale-95 transition-all shrink-0"
            >
              <PaperPlaneRight weight="fill" className="w-5 h-5 -scale-x-100" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
