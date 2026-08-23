'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'motion/react';
import {
  Sparkle,
  MagicWand,
  PaintBrush,
  ArrowRight,
  ArrowsClockwise,
  Rocket,
  DownloadSimple,
  Copy,
  Check,
  Play,
  Pause,
  SpeakerHigh,
  ChatCircleDots,
  Lightning,
  UploadSimple,
  Smiley,
  CheckCircle,
  CirclesThreePlus,
  Eye,
  Sliders,
  FolderSimple,
} from '@phosphor-icons/react';
import { useOnboarding } from '@/context/OnboardingContext';
import { LumaCore } from '@/components/core/LumaCore';
import { LUMA_TOOLS_CATALOG, type LumaToolDefinition } from '@/lib/onboarding-data';
import {
  creationAdapter,
  FUN_TRANSFORM_TEMPLATES,
  SAMPLE_AVATARS,
  QUICK_PROMPTS,
  type CreationProgressStage,
  type CreationResultData,
  type FunTransformTemplate,
  type SampleAvatarOption,
} from '@/lib/creation-adapter';
import { trackOnboardingEvent } from '@/lib/analytics';
import { BeforeAfterSlider } from '@/components/onboarding/creation/BeforeAfterSlider';

export function FirstCreationScene() {
  const {
    prevStep,
    completeOnboarding,
    selectedRecommendedTool,
    firstCreationMode,
    setFirstCreationMode,
    setSelectedRecommendedTool,
    toolRecommendations,
    selectedProfessions,
  } = useOnboarding();

  const shouldReduceMotion = useReducedMotion();
  const [, startTransition] = useTransition();

  // Active mode state
  const currentMode = firstCreationMode || 'recommended';

  // Resolved active tool for recommended mode
  const activeTool: LumaToolDefinition =
    LUMA_TOOLS_CATALOG.find((t) => t.id === selectedRecommendedTool) ||
    LUMA_TOOLS_CATALOG.find((t) => t.id === toolRecommendations[0]?.id) ||
    LUMA_TOOLS_CATALOG[0];

  // Generation status: 'idle' | 'generating' | 'success' | 'error'
  const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [progressStage, setProgressStage] = useState<CreationProgressStage | null>(null);
  const [result, setResult] = useState<CreationResultData | null>(null);

  // Recommended Mode inputs
  const toolQuickPrompts = QUICK_PROMPTS[activeTool.id] || QUICK_PROMPTS['generate-image'] || [];
  const [prompt, setPrompt] = useState<string>(toolQuickPrompts[0]?.prompt || '');
  const [selectedSourceImage, setSelectedSourceImage] = useState<string>(
    toolQuickPrompts[0]?.sampleImageUrl || SAMPLE_AVATARS[0].imageUrl
  );

  // Fun Mode inputs
  const [selectedFunTemplate, setSelectedFunTemplate] = useState<FunTransformTemplate>(
    FUN_TRANSFORM_TEMPLATES[0]
  );
  const [selectedFunAvatar, setSelectedFunAvatar] = useState<SampleAvatarOption>(
    SAMPLE_AVATARS[0]
  );
  const [customUploadedImage, setCustomUploadedImage] = useState<string | null>(null);

  // UI helpers
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Telemetry time tracking
  const sceneLoadTimeRef = useRef<number>(0);
  const generationStartTimeRef = useRef<number>(0);

  // Track initial scene view
  useEffect(() => {
    if (sceneLoadTimeRef.current === 0) {
      sceneLoadTimeRef.current = Date.now();
    }
    trackOnboardingEvent('onboarding_creation_viewed', {
      mode: currentMode,
      toolId: activeTool.id,
      selectedProfessions,
    });
  }, [currentMode, activeTool.id, selectedProfessions]);

  // Handle custom file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomUploadedImage(imageUrl);
      setSelectedSourceImage(imageUrl);
      trackOnboardingEvent('onboarding_creation_input_added', {
        type: 'file_upload',
        mode: currentMode,
        fileSize: file.size,
      });
    }
  };

  // Trigger generation handler
  const handleGenerate = async () => {
    if (status === 'generating') return;

    setStatus('generating');
    generationStartTimeRef.current = Date.now();
    const timeToFirstCreation = Math.round((Date.now() - sceneLoadTimeRef.current) / 1000);

    trackOnboardingEvent('onboarding_creation_started', {
      mode: currentMode,
      toolId: currentMode === 'recommended' ? activeTool.id : 'fun-transform',
      templateId: currentMode === 'fun' ? selectedFunTemplate.id : undefined,
      promptLength: prompt.length,
      timeToFirstCreation,
    });

    try {
      let genResult: CreationResultData;

      if (currentMode === 'fun') {
        const sourceUrl = customUploadedImage || selectedFunAvatar.imageUrl;
        genResult = await creationAdapter.generateFunTransform(
          selectedFunTemplate.id,
          sourceUrl,
          (stage) => setProgressStage(stage)
        );
      } else {
        genResult = await creationAdapter.generateRecommended(
          activeTool.id,
          {
            prompt,
            sourceImageUrl: selectedSourceImage,
          },
          (stage) => setProgressStage(stage)
        );
      }

      const timeToFirstResult = Math.round((Date.now() - sceneLoadTimeRef.current) / 1000);
      setResult(genResult);
      setStatus('success');

      trackOnboardingEvent('onboarding_creation_succeeded', {
        mode: currentMode,
        toolId: activeTool.id,
        durationMs: Date.now() - generationStartTimeRef.current,
        timeToFirstResult,
      });
    } catch (err) {
      console.error('Creation error:', err);
      setStatus('error');
      trackOnboardingEvent('onboarding_creation_failed', {
        mode: currentMode,
        toolId: activeTool.id,
      });
    }
  };

  // Copy prompt handler
  const handleCopyPrompt = () => {
    if (result?.prompt) {
      navigator.clipboard.writeText(result.prompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Complete onboarding from creation
  const handleFinalSaveAndEnter = () => {
    trackOnboardingEvent('onboarding_completed_from_creation', {
      mode: currentMode,
      toolId: activeTool.id,
      savedAssetId: result?.id,
    });
    completeOnboarding();
  };

  // Restart/retry handler
  const handleRetry = () => {
    trackOnboardingEvent('onboarding_creation_retried', {
      mode: currentMode,
      toolId: activeTool.id,
    });
    setStatus('idle');
    setResult(null);
    setProgressStage(null);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 16,
      transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] as const },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const isImageTool = [
    'edit-image',
    'image-to-video',
    'remove-background',
    'upscale',
    'virtual-try-on',
  ].includes(activeTool.id);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center select-none"
      dir="rtl"
    >
      {/* Hidden file input for custom uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Top Experience Sub-Bar: Mode Switcher & LumaCore Reaction */}
      <motion.div
        variants={itemVariants}
        className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.06]"
      >
        {/* Left: Compact LumaCore with real-time status indication */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <LumaCore
              variant={status === 'generating' ? 'generating' : 'creation'}
              showHints={false}
            />
          </div>
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-100">
                {status === 'generating'
                  ? 'در حال پردازش هوشمند...'
                  : status === 'success'
                  ? 'خروجی آماده شد'
                  : 'محیط کاربری سریع لوما'}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  status === 'generating'
                    ? 'bg-amber-400 animate-ping'
                    : status === 'success'
                    ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                    : 'bg-purple-400'
                }`}
              />
            </div>
            <span className="text-[11px] text-zinc-400">
              {currentMode === 'recommended'
                ? `ابزار اختصاصی شما: ${activeTool.title}`
                : 'تست سریع و فان با سبک‌های تصویری'}
            </span>
          </div>
        </div>

        {/* Right: Mode Toggle Capsule */}
        <div className="flex items-center p-1 rounded-full bg-zinc-900/80 border border-white/[0.08] backdrop-blur-md text-xs">
          <button
            id="btn-mode-recommended"
            type="button"
            onClick={() => {
              if (status === 'generating') return;
              startTransition(() => {
                setFirstCreationMode('recommended');
                trackOnboardingEvent('onboarding_creation_mode_changed', { mode: 'recommended' });
              });
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 cursor-pointer ${
              currentMode === 'recommended'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MagicWand weight={currentMode === 'recommended' ? 'fill' : 'regular'} className="w-3.5 h-3.5" />
            <span>ابزار اختصاصی ({activeTool.title})</span>
          </button>

          <button
            id="btn-mode-fun"
            type="button"
            onClick={() => {
              if (status === 'generating') return;
              startTransition(() => {
                setFirstCreationMode('fun');
                trackOnboardingEvent('onboarding_creation_mode_changed', { mode: 'fun' });
              });
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 cursor-pointer ${
              currentMode === 'fun'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smiley weight={currentMode === 'fun' ? 'fill' : 'regular'} className="w-3.5 h-3.5" />
            <span>تست سریع و فان</span>
          </button>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 1. IDLE / INPUT CONFIGURATION STATE */}
      {/* ========================================================================= */}
      {status === 'idle' && (
        <motion.div
          key={`input-panel-${currentMode}`}
          variants={itemVariants}
          className="w-full flex flex-col gap-4"
        >
          {/* RECOMMENDED MODE WORKSPACE */}
          {currentMode === 'recommended' && (
            <div className="w-full rounded-2xl bg-zinc-950/70 border border-purple-500/20 p-5 md:p-6 shadow-xl backdrop-blur-md space-y-4">
              {/* Tool Header & Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkle weight="fill" className="w-4 h-4 text-purple-400" />
                    <span>خلق اولین نمونه با {activeTool.title}</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {activeTool.description} — یک پرامپت آماده را انتخاب کن یا متن دلخواهت را بنویس.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-1 text-[11px] text-purple-300 hover:text-purple-200 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <span>انتخاب ابزار دیگر</span>
                  <ArrowRight weight="bold" className="w-3 h-3" />
                </button>
              </div>

              {/* Source image selector for image-based tools */}
              {isImageTool && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <span>تصویر ورودی برای پردازش:</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer text-[11px]"
                    >
                      <UploadSimple className="w-3.5 h-3.5" />
                      <span>آپلود تصویر اختصاصی</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SAMPLE_AVATARS.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => {
                          setSelectedSourceImage(sample.imageUrl);
                          setCustomUploadedImage(null);
                          trackOnboardingEvent('onboarding_fun_sample_selected', { sampleId: sample.id });
                        }}
                        className={`relative aspect-[4/3] rounded-xl overflow-hidden border transition-all cursor-pointer group ${
                          selectedSourceImage === sample.imageUrl && !customUploadedImage
                            ? 'border-purple-400 ring-2 ring-purple-500/40'
                            : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={sample.imageUrl}
                          alt={sample.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] text-zinc-200 font-medium">
                          {sample.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Smart Quick Prompt Chips */}
              <div className="space-y-2">
                <span className="text-xs text-zinc-300 block">
                  پیشنهادهای آماده متناسب با حوزه شما:
                </span>
                <div className="flex flex-wrap gap-2">
                  {toolQuickPrompts.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setPrompt(preset.prompt);
                        if (preset.sampleImageUrl) {
                          setSelectedSourceImage(preset.sampleImageUrl);
                          setCustomUploadedImage(null);
                        }
                        trackOnboardingEvent('onboarding_creation_preset_selected', {
                          presetId: preset.id,
                          toolId: activeTool.id,
                        });
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer text-right flex items-center gap-1.5 ${
                        prompt === preset.prompt
                          ? 'bg-purple-950/80 border-purple-400 text-purple-200 font-medium shadow-[0_0_10px_rgba(168,85,247,0.25)]'
                          : 'bg-zinc-900/60 border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/20'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Textarea */}
              <div className="space-y-1.5">
                <div className="relative rounded-xl bg-zinc-900/90 border border-white/10 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
                  <textarea
                    id="input-creation-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    placeholder="دستور یا ایده خود را اینجا بنویسید..."
                    className="w-full p-3.5 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none leading-relaxed"
                  />
                  <div className="px-3.5 pb-2.5 flex items-center justify-between text-[11px] text-zinc-500 border-t border-white/[0.04] pt-2">
                    <span>موتور هوش مصنوعی: LUMA Core Pro v3</span>
                    <span>{prompt.length} کاراکتر</span>
                  </div>
                </div>
              </div>

              {/* Generate Trigger Button */}
              <div className="pt-2 flex items-center justify-end">
                <button
                  id="btn-trigger-generation"
                  type="button"
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lightning weight="fill" className="w-4 h-4 text-purple-200" />
                  <span>تولید اولین نتیجه (رایگان)</span>
                </button>
              </div>
            </div>
          )}

          {/* FUN MODE WORKSPACE */}
          {currentMode === 'fun' && (
            <div className="w-full rounded-2xl bg-zinc-950/70 border border-purple-500/20 p-5 md:p-6 shadow-xl backdrop-blur-md space-y-5">
              {/* Header */}
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Smiley weight="fill" className="w-4 h-4 text-purple-400" />
                  <span>تست سریع و هیجان‌انگیز سبک‌های هنری</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  یک پرتره انتخاب کن یا عکس دلخواهت رو آپلود کن و استایل هنری مورد نظرت رو اعمال کن.
                </p>
              </div>

              {/* Step 1: Pick Image (Samples + Upload) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span className="font-semibold">۱. انتخاب تصویر مبدا:</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer text-[11px]"
                  >
                    <UploadSimple className="w-3.5 h-3.5" />
                    <span>آپلود عکس از سیستم</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SAMPLE_AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => {
                        setSelectedFunAvatar(avatar);
                        setCustomUploadedImage(null);
                        trackOnboardingEvent('onboarding_fun_sample_selected', { avatarId: avatar.id });
                      }}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden border transition-all cursor-pointer group ${
                        selectedFunAvatar.id === avatar.id && !customUploadedImage
                          ? 'border-purple-400 ring-2 ring-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                          : 'border-white/10 opacity-75 hover:opacity-100 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={avatar.imageUrl}
                        alt={avatar.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-zinc-200 font-medium">
                        {avatar.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Pick Fun Transform Style */}
              <div className="space-y-2">
                <span className="text-xs text-zinc-300 font-semibold block">
                  ۲. انتخاب سبک تبدیل هوشمند:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FUN_TRANSFORM_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => {
                        setSelectedFunTemplate(template);
                        trackOnboardingEvent('onboarding_fun_template_selected', { templateId: template.id });
                      }}
                      className={`p-3.5 rounded-xl border text-right transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2 ${
                        selectedFunTemplate.id === template.id
                          ? 'bg-purple-950/50 border-purple-400 ring-1 ring-purple-500/40 shadow-[0_0_14px_rgba(168,85,247,0.2)]'
                          : 'bg-zinc-900/60 border-white/[0.08] hover:border-white/20 hover:bg-zinc-900/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-400" />
                          <span className="text-xs font-bold text-white">{template.title}</span>
                        </div>
                        <span className="text-[10px] text-purple-300 bg-purple-950/70 px-2 py-0.5 rounded-full border border-purple-500/20">
                          {template.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        {template.tagline}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fun Generate Action */}
              <div className="pt-2 flex items-center justify-end">
                <button
                  id="btn-trigger-fun-generation"
                  type="button"
                  onClick={handleGenerate}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-[0_0_24px_rgba(168,85,247,0.5)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  <Sparkle weight="fill" className="w-4 h-4 text-purple-200" />
                  <span>اجرای تبدیل استایل ({selectedFunTemplate.title})</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 2. ACTIVE GENERATING STATE (Rich Multi-Stage Micro-Interactions) */}
      {/* ========================================================================= */}
      {status === 'generating' && (
        <motion.div
          key="generating-panel"
          variants={itemVariants}
          className="w-full max-w-lg mx-auto my-6 p-8 rounded-3xl bg-zinc-950/90 border border-purple-500/30 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center space-y-6"
        >
          {/* LumaCore Centered Radiating Energy */}
          <div className="relative py-2">
            <LumaCore variant="generating" showHints={false} />
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl animate-pulse pointer-events-none" />
          </div>

          {/* Dynamic Stage Title & Subtitle */}
          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight animate-pulse">
              {progressStage?.stageName || 'در حال آماده‌سازی و ترکیب هوشمند...'}
            </h3>
            <p className="text-xs text-purple-300/80">
              {progressStage?.description || 'موتور عصبی لوما در حال ترسیم پیکسل‌هاست...'}
            </p>
          </div>

          {/* Smooth Progress Bar */}
          <div className="w-full space-y-1.5">
            <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-pink-500 rounded-full shadow-[0_0_12px_#c084fc]"
                initial={{ width: '10%' }}
                animate={{ width: `${progressStage?.progressPercent || 50}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span>گام {progressStage?.stepIndex || 1} از {progressStage?.totalSteps || 3}</span>
              <span>{progressStage?.progressPercent || 50}% تکمیل</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUCCESS / RESULT PRESENTATION STATE */}
      {/* ========================================================================= */}
      {status === 'success' && result && (
        <motion.div
          key="result-panel"
          variants={itemVariants}
          className="w-full rounded-2xl bg-zinc-950/80 border border-purple-500/30 p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-5"
        >
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle weight="fill" className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {result.title}
                </h3>
                <span className="text-[11px] text-purple-300">
                  تولید شده در {result.generationTimeSeconds} ثانیه با لوما
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-full border border-white/10">
                {result.dimensions || '2048 x 2048'}
              </span>
            </div>
          </div>

          {/* Main Visual Output Canvas */}
          <div className="w-full flex flex-col items-center">
            {/* Case A: Before/After Slider (for edit, upscale, remove-bg, fun) */}
            {result.beforeImageUrl && result.afterImageUrl ? (
              <BeforeAfterSlider
                beforeImageUrl={result.beforeImageUrl}
                afterImageUrl={result.afterImageUrl}
                beforeLabel={currentMode === 'fun' ? 'عکس مبدا' : 'قبل از ادیت'}
                afterLabel={currentMode === 'fun' ? result.metadata?.templateTitle as string || 'خروجی استایل لوما' : 'خروجی ادیت لوما'}
              />
            ) : result.videoUrl ? (
              /* Case B: Video Player */
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <video
                  ref={videoRef}
                  src={result.videoUrl}
                  poster={result.imageUrl}
                  loop
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (videoRef.current) {
                      if (isVideoPlaying) {
                        videoRef.current.pause();
                        setIsVideoPlaying(false);
                      } else {
                        videoRef.current.play();
                        setIsVideoPlaying(true);
                      }
                    }
                  }}
                  className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-colors cursor-pointer border border-white/10"
                >
                  {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-400/30 text-[10px] text-purple-200">
                  HD 60 FPS
                </div>
              </div>
            ) : result.chatResponseText ? (
              /* Case C: Chat Response Card */
              <div className="w-full p-5 rounded-2xl bg-zinc-900/90 border border-white/10 text-right space-y-3">
                <div className="flex items-center justify-between text-xs text-purple-300 pb-2 border-b border-white/[0.06]">
                  <span className="flex items-center gap-1.5">
                    <ChatCircleDots weight="fill" className="w-4 h-4 text-purple-400" />
                    <span>پاسخ مشاور هوشمند لوما</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(result.chatResponseText || '');
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'کپی شد' : 'کپی متن'}</span>
                  </button>
                </div>
                <div className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-line font-sans">
                  {result.chatResponseText}
                </div>
              </div>
            ) : result.audioVoiceName ? (
              /* Case D: Audio Voice Player */
              <div className="w-full p-6 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-purple-950/70 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <SpeakerHigh weight="fill" className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{result.audioVoiceName}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">مدت زمان: {result.audioDurationSeconds} ثانیه</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg transition-colors cursor-pointer"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlayingAudio ? 'توقف پخش' : 'پخش صدای خروجی'}</span>
                </button>
              </div>
            ) : (
              /* Case E: Standard High-Res Image Result */
              <div className="relative w-full aspect-[16/10] max-h-[380px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950 group">
                <img
                  src={result.imageUrl}
                  alt={result.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-xs text-zinc-200 line-clamp-2 text-right">
                    {result.prompt}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Result Metadata & Quick Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs">
              {result.prompt && (
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'پرامپت کپی شد' : 'کپی پرامپت'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowsClockwise className="w-3.5 h-3.5" />
                <span>تغییر پرامپت / خروجی جدید</span>
              </button>
            </div>

            {/* Final CTA to save and proceed into LUMA workspace */}
            <button
              id="btn-creation-complete"
              type="button"
              onClick={handleFinalSaveAndEnter}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <Rocket weight="bold" className="w-4 h-4" />
              <span>ذخیره در پنل و ورود به محیط کامل لوما</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 4. ERROR STATE (Safe & Reassuring Recovery) */}
      {/* ========================================================================= */}
      {status === 'error' && (
        <motion.div
          key="error-panel"
          variants={itemVariants}
          className="w-full max-w-md mx-auto my-6 p-6 rounded-2xl bg-zinc-950/90 border border-rose-500/30 text-center space-y-4"
        >
          <div className="w-10 h-10 rounded-full bg-rose-950/50 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <ArrowsClockwise className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">خطایی در پردازش رخ داد</h4>
            <p className="text-xs text-zinc-400">
              ارتباط با سرویس موقتاً قطع شد. می‌توانید دوباره تلاش کنید یا وارد لوما شوید.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleRetry}
              className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium cursor-pointer"
            >
              تلاش مجدد
            </button>
            <button
              type="button"
              onClick={handleFinalSaveAndEnter}
              className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium cursor-pointer"
            >
              ورود مستقیم به لوما
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
