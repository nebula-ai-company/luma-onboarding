'use client';

import React, { Component, type ReactNode } from 'react';
import { ArrowRight, ArrowClockwise, WarningCircle } from '@phosphor-icons/react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
  onPrevStep?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SceneErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[LUMA Scene Error Caught]:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="relative z-10 w-full max-w-md mx-auto p-6 sm:p-8 rounded-2xl bg-zinc-950/90 border border-white/[0.08] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] text-center select-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <WarningCircle weight="duotone" className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            این بخش درست بارگذاری نشد.
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-6">
            مشکلی در بارگذاری اطلاعات رخ داد. می‌توانید مجدداً تلاش کنید یا به مرحله قبل بازگردید.
          </p>
          <div className="flex items-center justify-center gap-3">
            {this.props.onPrevStep && (
              <button
                type="button"
                onClick={this.props.onPrevStep}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                <ArrowRight weight="bold" className="w-3.5 h-3.5" />
                <span>برگرد</span>
              </button>
            )}
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all shadow-[0_0_16px_rgba(168,85,247,0.3)] cursor-pointer"
            >
              <ArrowClockwise weight="bold" className="w-3.5 h-3.5" />
              <span>دوباره امتحان کن</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
