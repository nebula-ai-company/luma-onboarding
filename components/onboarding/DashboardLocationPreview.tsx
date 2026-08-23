'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  MagicWand,
  ChatCircleDots,
  CirclesThreePlus,
  Robot,
  FolderSimple,
  Code,
  Compass,
} from '@phosphor-icons/react';
import type { LumaSectionId } from '@/types/onboarding';

interface DashboardLocationPreviewProps {
  activeSectionId: LumaSectionId | null;
  onSelectSection?: (id: LumaSectionId) => void;
  className?: string;
}

const SIDEBAR_ITEMS: {
  id: LumaSectionId;
  label: string;
  Icon: React.ElementType;
}[] = [
  { id: 'ai_tools', label: 'ابزارهای هوش مصنوعی', Icon: MagicWand },
  { id: 'ai_chat', label: 'چت هوش مصنوعی', Icon: ChatCircleDots },
  { id: 'workflow', label: 'ورک‌فلوها', Icon: CirclesThreePlus },
  { id: 'smart_assistant', label: 'دستیار هوشمند', Icon: Robot },
  { id: 'my_files', label: 'فایل‌های من', Icon: FolderSimple },
  { id: 'api_developers', label: 'توسعه‌دهندگان و API', Icon: Code },
];

export function DashboardLocationPreview({
  activeSectionId,
  onSelectSection,
  className = '',
}: DashboardLocationPreviewProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`relative rounded-2xl bg-zinc-950/90 border border-white/[0.08] p-3 shadow-[0_12px_32px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-hidden ${className}`}
    >
      {/* Header bar of mini dashboard preview */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          {/* Simulated mini mac traffic lights */}
          <div className="flex items-center gap-1 opacity-60">
            <div className="w-2 h-2 rounded-full bg-red-500/70" />
            <div className="w-2 h-2 rounded-full bg-amber-500/70" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-[11px] font-medium text-zinc-300 mr-1 flex items-center gap-1">
            <Compass weight="bold" className="w-3 h-3 text-purple-400" />
            <span>محل قرارگیری در داشبورد لوما</span>
          </span>
        </div>
        <span className="text-[9px] uppercase tracking-wider font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded-full">
          Sidebar Map
        </span>
      </div>

      {/* Mini Sidebar items representation */}
      <div className="space-y-1" role="list">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = activeSectionId === item.id;
          const { Icon } = item;

          return (
            <motion.button
              key={`sidebar-preview-${item.id}`}
              id={`sidebar-preview-${item.id}`}
              type="button"
              onClick={() => onSelectSection?.(item.id)}
              className={`group relative w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-right transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? 'bg-purple-950/70 text-purple-100 ring-1 ring-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active Indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute right-0 top-1 bottom-1 w-1 rounded-l-full bg-purple-400 shadow-[0_0_8px_#c084fc]"
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                />
              )}

              <div className="flex items-center gap-2 pr-1">
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-md ${
                    isActive
                      ? 'bg-purple-500/30 text-purple-300'
                      : 'bg-white/[0.03] text-zinc-400 group-hover:text-zinc-300'
                  }`}
                >
                  <Icon weight={isActive ? 'fill' : 'regular'} className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[11px] ${isActive ? 'font-semibold text-white' : 'font-normal'}`}>
                  {item.label}
                </span>
              </div>

              {isActive && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[9px] font-medium text-purple-300 bg-purple-900/60 px-1.5 py-0.5 rounded border border-purple-400/30 font-mono"
                >
                  فعال
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Mini caption footer */}
      <div className="mt-2.5 pt-2 border-t border-white/[0.04] text-[10px] text-zinc-400 text-center leading-relaxed">
        با انتخاب هر بخش، مکان دسترسی سریع آن در منوی کناری لوما مشخص می‌شود.
      </div>
    </div>
  );
}
