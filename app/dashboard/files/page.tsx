'use client';

import React from 'react';
import Link from 'next/link';
import {
  FolderOpen,
  ArrowRight,
  UploadSimple,
  Image as ImageIcon,
  DownloadSimple,
} from '@phosphor-icons/react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function FilesPage() {
  const sampleFiles = [
    {
      id: 'f_1',
      name: 'luma_generated_artwork_1.png',
      type: 'تصویر PNG',
      size: '2.4 MB',
      date: 'امروز',
      preview: 'https://picsum.photos/seed/sample_art_1/300/300',
    },
    {
      id: 'f_2',
      name: 'product_background_removed.png',
      type: 'تصویر بدون بک‌گراند',
      size: '1.8 MB',
      date: 'دیروز',
      preview: 'https://picsum.photos/seed/sample_art_2/300/300',
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
              <span className="text-emerald-400 font-medium">مدیریت فایل‌ها</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-emerald-400" />
              <span>فایل‌ها و آرشیو تولیدات هوش مصنوعی</span>
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

        <div className="p-6 rounded-2xl bg-[#0e0e16] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">فایل‌های اخیر شما</h2>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
            >
              <UploadSimple className="w-4 h-4" />
              <span>بارگذاری فایل جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleFiles.map((file) => (
              <div
                key={file.id}
                className="p-3 rounded-xl bg-[#141420] border border-white/5 space-y-2 group"
              >
                <div className="aspect-square rounded-lg overflow-hidden relative">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-white truncate">{file.name}</p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                    <span>{file.size}</span>
                    <span>{file.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
