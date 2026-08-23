import type { RecommendedFirstAction } from '@/types/onboarding';

export interface CreationProgressStage {
  stepIndex: number;
  totalSteps: number;
  stageName: string;
  description: string;
  progressPercent: number;
}

export interface FunTransformTemplate {
  id: string;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  iconName: string;
  gradient: string;
  beforeSampleUrl: string;
  afterSampleUrl: string;
  promptExample: string;
}

export interface SampleAvatarOption {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export interface CreationResultData {
  id: string;
  toolId: string;
  mode: 'recommended' | 'fun';
  title: string;
  prompt?: string;
  imageUrl?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  videoUrl?: string;
  audioDurationSeconds?: number;
  audioVoiceName?: string;
  chatResponseText?: string;
  generationTimeSeconds: number;
  aspectRatio?: string;
  dimensions?: string;
  fileSizeBytes?: number;
  createdAt: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface QuickPromptPreset {
  id: string;
  toolId: string;
  label: string;
  prompt: string;
  sampleImageUrl?: string;
  category: string;
}

export const FUN_TRANSFORM_TEMPLATES: FunTransformTemplate[] = [
  {
    id: 'anime_ghibli',
    title: 'انیمه و استودیو جیبلی',
    tagline: 'سبک نقاشی دستی با رنگ‌های گرم و نوستالژیک',
    description: 'تصویرسازی آبرنگی با الهام از انیمیشن‌های کلاسیک با رنگ‌های لطیف و جزئیات زنده.',
    badge: 'طراحی هنری',
    iconName: 'PaintBrush',
    gradient: 'from-emerald-600/30 via-teal-600/20 to-blue-500/20',
    beforeSampleUrl: 'https://picsum.photos/seed/face_ghibli/600/600',
    afterSampleUrl: 'https://picsum.photos/seed/anime_art_ghibli/600/600',
    promptExample: 'Studio Ghibli style anime illustration, warm pastel color palette, soft watercolor texture, cozy atmosphere',
  },
  {
    id: 'pixar_3d',
    title: 'انیمیشن ۳ بعدی و پیکسار',
    tagline: 'کاراکتر سه‌بعدی با بافت نرم و چشمان زنده',
    description: 'مدل‌سازی سه‌بعدی نرم و فانتزی با نورپردازی متوازن استودیویی.',
    badge: 'مدل‌سازی ۳ بعدی',
    iconName: 'Sparkle',
    gradient: 'from-blue-600/30 via-cyan-600/20 to-indigo-500/20',
    beforeSampleUrl: 'https://picsum.photos/seed/face_pixar/600/600',
    afterSampleUrl: 'https://picsum.photos/seed/pixar_3d_char/600/600',
    promptExample: '3D Pixar style character render, cute facial expressions, soft subsurface scattering, studio lighting',
  },
  {
    id: 'cyberpunk_neon',
    title: 'سایبرپانک و نئونی',
    tagline: 'نورپردازی نئونی با اتمسفر آینده‌نگر',
    description: 'تبدیل پرتره یا عکس به کاراکتر سایبرپانک با هاله‌های نوری بنفش و فیروزه‌ای.',
    badge: 'نورپردازی نئون',
    iconName: 'Lightning',
    gradient: 'from-purple-600/30 via-indigo-600/20 to-sky-500/20',
    beforeSampleUrl: 'https://picsum.photos/seed/face_cyber/600/600',
    afterSampleUrl: 'https://picsum.photos/seed/cyber_neon_glow/600/600',
    promptExample: 'Cyberpunk portrait with purple and cyan neon rim lighting, holographic glow, detailed render',
  },
  {
    id: 'renaissance_art',
    title: 'نقاشی رنسانس و رنگ روغن',
    tagline: 'پرتره کلاسیک با قلم‌موی روغنی',
    description: 'تبدیل تصویر به تابلوی نقاشی رنگ روغن با نورپردازی کلاسیک و بافت کرباس.',
    badge: 'نقاشی کلاسیک',
    iconName: 'Crown',
    gradient: 'from-amber-600/30 via-orange-600/20 to-yellow-500/20',
    beforeSampleUrl: 'https://picsum.photos/seed/face_renaiss/600/600',
    afterSampleUrl: 'https://picsum.photos/seed/oil_painting_art/600/600',
    promptExample: 'Classic Renaissance oil painting, dramatic chiaroscuro lighting, rich canvas texture, masterwork fine art',
  },
  {
    id: 'pixel_art',
    title: 'پیکسل آرت و رترو گیم',
    tagline: 'استایل پیکسلی ۱۶ بیتی کنسول‌های نوستالژیک',
    description: 'تبدیل چهره یا محیط به نقاشی پیکسلی جذاب با پالت رنگی رترو و خطوط شارپ.',
    badge: 'سبک رترو',
    iconName: 'GameController',
    gradient: 'from-violet-600/30 via-fuchsia-600/20 to-pink-500/20',
    beforeSampleUrl: 'https://picsum.photos/seed/face_pixel/600/600',
    afterSampleUrl: 'https://picsum.photos/seed/pixel_art_retro/600/600',
    promptExample: '16-bit retro pixel art character sprite, vibrant limited color palette, clean grid alignment',
  },
  {
    id: 'claymation',
    title: 'استاپ‌موشن و مجسمه خمیری',
    tagline: 'استایل خمیری فانتزی و مینیاتوری',
    description: 'ساخت فیگور سه‌بعدی مینیاتوری با بافت خمیربازی، نورپردازی آتلیه‌ای و حس لمس فیزیکی.',
    badge: 'فانتزی خمیری',
    iconName: 'Smiley',
    gradient: 'from-pink-600/30 via-rose-600/20 to-purple-500/20',
    beforeSampleUrl: 'https://picsum.photos/seed/face_clay/600/600',
    afterSampleUrl: 'https://picsum.photos/seed/clay_animation_char/600/600',
    promptExample: 'Cute 3D claymation miniature figurine character, soft plasticine texture, studio lighting',
  },
];

export const SAMPLE_AVATARS: SampleAvatarOption[] = [
  {
    id: 'sample_avatar_1',
    title: 'پرتره شهری جوان',
    category: 'پرتره',
    imageUrl: 'https://picsum.photos/seed/avatar_city_1/500/500',
  },
  {
    id: 'sample_avatar_2',
    title: 'پرتره در طبیعت',
    category: 'طبیعت',
    imageUrl: 'https://picsum.photos/seed/avatar_nature_2/500/500',
  },
  {
    id: 'sample_avatar_3',
    title: 'استودیویی خلاق',
    category: 'آتلیه',
    imageUrl: 'https://picsum.photos/seed/avatar_studio_3/500/500',
  },
  {
    id: 'sample_avatar_4',
    title: 'کافه و لایف‌استایل',
    category: 'روزمره',
    imageUrl: 'https://picsum.photos/seed/avatar_cafe_4/500/500',
  },
];

export const QUICK_PROMPTS: Record<string, QuickPromptPreset[]> = {
  'generate-image': [
    {
      id: 'gi_1',
      toolId: 'generate-image',
      label: 'کاور مینیمال با نور استودیویی',
      prompt: 'پوستر مینیمالیستی و هندسی با گرادیان نوری بنفش و تایپوگرافی مدرن',
      category: 'طراحی',
    },
    {
      id: 'gi_2',
      toolId: 'generate-image',
      label: 'عکس استودیویی از محصول',
      prompt: 'عکاسی تبلیغاتی تجاری از بطری عطر روی پایه سنگ مرمر مشکی با نور ملایم',
      category: 'فروشگاه',
    },
    {
      id: 'gi_3',
      toolId: 'generate-image',
      label: 'صحنه آینده‌نگرانه و فناوری',
      prompt: 'نمایی از یک فضای فناورانه با خطوط نوری و المان‌های دیجیتال معلق',
      category: 'تکنولوژی',
    },
    {
      id: 'gi_4',
      toolId: 'generate-image',
      label: 'کاراکتر فانتزی برای بازی',
      prompt: 'طراحی کاراکتر فانتزی با لباس زرهی در محیط باران‌خورده شبانه',
      category: 'گیم و هنر',
    },
  ],
  'edit-image': [
    {
      id: 'ei_1',
      toolId: 'edit-image',
      label: 'تغییر پس‌زمینه به ساحل غروب',
      prompt: 'پس‌زمینه را به ساحل آرام هنگام غروب آفتاب با نور گرم طلایی تغییر بده',
      sampleImageUrl: 'https://picsum.photos/seed/watch_sample_prod/600/600',
      category: 'ادیت فضا',
    },
    {
      id: 'ei_2',
      toolId: 'edit-image',
      label: 'تنظیم نورپردازی به تم استودیویی',
      prompt: 'نورپردازی سوژه را به نور استودیویی ملایم تغییر بده و کنتراست را تنظیم کن',
      sampleImageUrl: 'https://picsum.photos/seed/headphone_prod/600/600',
      category: 'نورپردازی',
    },
  ],
  'image-to-video': [
    {
      id: 'itv_1',
      toolId: 'image-to-video',
      label: 'حرکت نرم دوربین و جریان باد',
      prompt: 'حرکت آهسته باد میان شاخه‌ها و زوم ملایم به جلو با عمق میدان طبیعی',
      sampleImageUrl: 'https://picsum.photos/seed/landscape_itv/600/400',
      category: 'طبیعت',
    },
    {
      id: 'itv_2',
      toolId: 'image-to-video',
      label: 'چرخش آرام محصول',
      prompt: 'حرکت ملایم دوربین در اطراف محصول با نورپردازی متحرک',
      sampleImageUrl: 'https://picsum.photos/seed/sneaker_itv/600/400',
      category: 'تبلیغاتی',
    },
  ],
  'text-to-video': [
    {
      id: 'ttv_1',
      toolId: 'text-to-video',
      label: 'پرواز آرام بر فراز کوهستان مه‌آلود',
      prompt: 'نمای متحرک از جنگل کاج مه‌آلود در صبح زود با تابش ملایم پرتوهای خورشید',
      category: 'طبیعت',
    },
    {
      id: 'ttv_2',
      toolId: 'text-to-video',
      label: 'انیمیشن موج‌های رنگی انتزاعی',
      prompt: 'حرکت نرم موج‌های رنگی بنفش و طلایی با جریان ارگانیک',
      category: 'موشن',
    },
  ],
  'remove-background': [
    {
      id: 'rb_1',
      toolId: 'remove-background',
      label: 'کفش ورزشی تجاری',
      prompt: 'جداسازی دقیق سوژه با حفظ سایه‌های طبیعی کف',
      sampleImageUrl: 'https://picsum.photos/seed/sneaker_rb/600/600',
      category: 'محصول',
    },
    {
      id: 'rb_2',
      toolId: 'remove-background',
      label: 'پرتره مدل عینک',
      prompt: 'حذف کامل پس‌زمینه با حفظ لبه‌های دقیق سوژه',
      sampleImageUrl: 'https://picsum.photos/seed/portrait_rb/600/600',
      category: 'فشن',
    },
  ],
  'upscale': [
    {
      id: 'up_1',
      toolId: 'upscale',
      label: 'افزایش وضوح و بازسازی جزئیات',
      prompt: 'افزایش وضوح تصویر و شفاف‌سازی خطوط و جزئیات',
      sampleImageUrl: 'https://picsum.photos/seed/art_upscale/600/600',
      category: 'کیفیت بالا',
    },
  ],
  'chat': [
    {
      id: 'ch_1',
      toolId: 'chat',
      label: 'ایده‌های سناریوی ویدیویی کوتاه',
      prompt: 'برای یک کسب‌وکار ۳ ایده سناریوی ویدیویی کوتاه با قلاب جذاب اولیه بنویس',
      category: 'تولید محتوا',
    },
    {
      id: 'ch_2',
      toolId: 'chat',
      label: 'طراحی ساختار کمپین فصلی',
      prompt: 'یک تقویم محتوای یک‌هفته‌ای با پیشنهاد تخفیف و متن پیام اطلاع‌رسانی تدوین کن',
      category: 'مارکتینگ',
    },
  ],
  'text-to-speech': [
    {
      id: 'tts_1',
      toolId: 'text-to-speech',
      label: 'خوانش متن معرفی',
      prompt: 'به پلتفرم لوما خوش آمدید. محیطی برای بهره‌مندی ساده و یکپارچه از هوش مصنوعی.',
      category: 'گویندگی',
    },
  ],
  'virtual-try-on': [
    {
      id: 'vto_1',
      toolId: 'virtual-try-on',
      label: 'پرو کت روی مدل',
      prompt: 'نمایش کت قهوه‌ای بر تن مدل با حفظ فرم پارچه و دوخت',
      sampleImageUrl: 'https://picsum.photos/seed/jacket_vto/600/600',
      category: 'پوشاک',
    },
  ],
};

/**
 * OnboardingCreationAdapter Interface
 * Defines the contract for all generation operations in onboarding.
 */
export interface OnboardingCreationAdapter {
  isSimulation: boolean;

  generateRecommended: (
    toolId: string,
    input: {
      prompt: string;
      sourceImageUrl?: string;
      options?: Record<string, unknown>;
    },
    onProgress?: (stage: CreationProgressStage) => void
  ) => Promise<CreationResultData>;

  generateFunTransform: (
    templateId: string,
    sourceImageUrl: string,
    onProgress?: (stage: CreationProgressStage) => void
  ) => Promise<CreationResultData>;
}

/**
 * Development Simulation Adapter
 * Provides reliable, interactive, multi-stage client-side generation
 * with high-quality themed outputs for design testing and onboarding demo.
 */
export class DevelopmentSimulationAdapter implements OnboardingCreationAdapter {
  public readonly isSimulation = true;

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async generateRecommended(
    toolId: string,
    input: {
      prompt: string;
      sourceImageUrl?: string;
      options?: Record<string, unknown>;
    },
    onProgress?: (stage: CreationProgressStage) => void
  ): Promise<CreationResultData> {
    const startTime = Date.now();

    // Stage 1: Initializing & analyzing inputs (35%)
    onProgress?.({
      stepIndex: 1,
      totalSteps: 3,
      stageName: 'تحلیل دستور و آماده‌سازی موتور هوش مصنوعی',
      description: 'در حال بررسی پارامترهای درخواست و بارگذاری مدل...',
      progressPercent: 35,
    });
    await this.delay(650);

    // Stage 2: Processing & detail generation (75%)
    onProgress?.({
      stepIndex: 2,
      totalSteps: 3,
      stageName: 'تولید و شکل‌دهی جزئیات',
      description: 'اعمال فیلترهای تفکیک لایه‌ای و تنظیم ساختار...',
      progressPercent: 75,
    });
    await this.delay(850);

    // Stage 3: Finalizing output (100%)
    onProgress?.({
      stepIndex: 3,
      totalSteps: 3,
      stageName: 'نهایی‌سازی خروجی',
      description: 'آماده‌سازی پیش‌نمایش نهایی...',
      progressPercent: 100,
    });
    await this.delay(450);

    const elapsedSeconds = parseFloat(((Date.now() - startTime) / 1000).toFixed(1));

    switch (toolId) {
      case 'generate-image':
        return {
          id: `res_${Date.now()}`,
          toolId,
          mode: 'recommended',
          title: 'تصویر تولید شده با لوما',
          prompt: input.prompt || 'طراحی مینیمال با نور استودیویی',
          imageUrl: 'https://picsum.photos/seed/generated_artwork_luma/1200/1200',
          aspectRatio: '1:1',
          dimensions: '2048 x 2048',
          fileSizeBytes: 2450000,
          generationTimeSeconds: elapsedSeconds,
          createdAt: new Date().toISOString(),
        };

      case 'edit-image':
        return {
          id: `res_${Date.now()}`,
          toolId,
          mode: 'recommended',
          title: 'تصویر ویرایش‌شده با لوما',
          prompt: input.prompt || 'تغییر پس‌زمینه و نورپردازی',
          beforeImageUrl: input.sourceImageUrl || 'https://picsum.photos/seed/watch_sample_prod/800/800',
          afterImageUrl: 'https://picsum.photos/seed/edited_luma_result/800/800',
          imageUrl: 'https://picsum.photos/seed/edited_luma_result/800/800',
          aspectRatio: '16:9',
          dimensions: '1920 x 1080',
          fileSizeBytes: 1890000,
          generationTimeSeconds: elapsedSeconds,
          createdAt: new Date().toISOString(),
        };

      case 'image-to-video':
      case 'text-to-video':
      case 'reference-to-video':
        return {
          id: `res_${Date.now()}`,
          toolId,
          mode: 'recommended',
          title: 'ویدئوی متحرک تولید شده با لوما',
          prompt: input.prompt || 'حرکت نرم دوربین با عمق میدان طبیعی',
          imageUrl: 'https://picsum.photos/seed/video_poster_luma/1000/600',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-nebula-in-deep-space-32001-large.mp4',
          aspectRatio: '16:9',
          dimensions: '1080p HD',
          generationTimeSeconds: elapsedSeconds,
          createdAt: new Date().toISOString(),
          metadata: {
            durationSeconds: 4,
          },
        };

      case 'remove-background':
        return {
          id: `res_${Date.now()}`,
          toolId,
          mode: 'recommended',
          title: 'خروجی تفکیک سوژه (PNG)',
          beforeImageUrl: input.sourceImageUrl || 'https://picsum.photos/seed/sneaker_rb/800/800',
          afterImageUrl: 'https://picsum.photos/seed/sneaker_rb_transparent/800/800',
          imageUrl: 'https://picsum.photos/seed/sneaker_rb_transparent/800/800',
          dimensions: '2048 x 2048 PNG',
          fileSizeBytes: 2100000,
          generationTimeSeconds: elapsedSeconds,
          createdAt: new Date().toISOString(),
        };

      case 'upscale':
        return {
          id: `res_${Date.now()}`,
          toolId,
          mode: 'recommended',
          title: 'تصویر با کیفیت بالا (افزایش رزولوشن)',
          beforeImageUrl: input.sourceImageUrl || 'https://picsum.photos/seed/art_upscale/400/400',
          afterImageUrl: 'https://picsum.photos/seed/art_upscale/1400/1400',
          imageUrl: 'https://picsum.photos/seed/art_upscale/1400/1400',
          dimensions: '3840 x 2160',
          generationTimeSeconds: elapsedSeconds,
          createdAt: new Date().toISOString(),
        };

      case 'chat':
      case 'assistant':
        return {
          id: `res_${Date.now()}`,
          toolId,
          mode: 'recommended',
          title: 'پاسخ هوشمند لوما',
          prompt: input.prompt || 'ایده‌های سناریو و استراتژی محتوا',
          chatResponseText: `این یک خروجی نمونه آماده برای اجرا است:\n\n۱. **قلاب بصری (۰ تا ۳ ثانیه):** نمایش مستقیم نتیجه قبل/بعد برای توقف اسکرول مخاطب.\n۲. **معرفی موضوع (۳ تا ۸ ثانیه):** بیان چالش یا ایده با لحنی شفاف.\n۳. **ارائه راهکار (۸ تا ۱۲ ثانیه):** نمایش نتیجه سریع با ابزار هوش مصنوعی.\n۴. **فراخوان اقدام (۱۲ تا ۱۵ ثانیه):** دعوت از مخاطب برای نظردهی یا آزمایش نمونه.`,
          generationTimeSeconds: elapsedSeconds,
          createdAt: new Date().toISOString(),
        };

      case 'text-to-speech':
        return {
          id: `res_${Date.now()}`,
          toolId,
          mode: 'recommended',
          title: 'فایل صوتی هوشمند (Voice Synthesis)',
          prompt: input.prompt || 'به لوما خوش آمدید...',
          audioDurationSeconds: 4.2,
          audioVoiceName: 'آریا (گوینده فارسی)',
          generationTimeSeconds: elapsedSeconds,
          createdAt: new Date().toISOString(),
        };

      default:
        return {
          id: `res_${Date.now()}`,
          toolId,
          mode: 'recommended',
          title: 'نتیجه خلق اولیه در لوما',
          prompt: input.prompt || 'درخواست تولید نمونه',
          imageUrl: 'https://picsum.photos/seed/default_creation_res/1000/800',
          generationTimeSeconds: elapsedSeconds,
          createdAt: new Date().toISOString(),
        };
    }
  }

  async generateFunTransform(
    templateId: string,
    sourceImageUrl: string,
    onProgress?: (stage: CreationProgressStage) => void
  ): Promise<CreationResultData> {
    const startTime = Date.now();
    const template = FUN_TRANSFORM_TEMPLATES.find((t) => t.id === templateId) || FUN_TRANSFORM_TEMPLATES[0];

    onProgress?.({
      stepIndex: 1,
      totalSteps: 3,
      stageName: 'اسکن ویژگی‌های تصویر ورودی',
      description: 'تشخیص زوایا، فرم سوژه و پالت رنگی مبدا...',
      progressPercent: 30,
    });
    await this.delay(600);

    onProgress?.({
      stepIndex: 2,
      totalSteps: 3,
      stageName: `اعمال استایل هنری «${template.title}»`,
      description: 'ترکیب بافت‌ها و اعمال تم نورپردازی...',
      progressPercent: 70,
    });
    await this.delay(800);

    onProgress?.({
      stepIndex: 3,
      totalSteps: 3,
      stageName: 'تکمیل و رندر خروجی',
      description: 'آماده‌سازی تصویر خروجی نهایی...',
      progressPercent: 100,
    });
    await this.delay(400);

    const elapsedSeconds = parseFloat(((Date.now() - startTime) / 1000).toFixed(1));

    return {
      id: `res_fun_${Date.now()}`,
      toolId: 'fun-transform',
      mode: 'fun',
      title: `تبدیل: ${template.title}`,
      prompt: template.promptExample,
      beforeImageUrl: sourceImageUrl || template.beforeSampleUrl,
      afterImageUrl: template.afterSampleUrl,
      imageUrl: template.afterSampleUrl,
      aspectRatio: '1:1',
      dimensions: '2048 x 2048',
      fileSizeBytes: 2800000,
      generationTimeSeconds: elapsedSeconds,
      createdAt: new Date().toISOString(),
      metadata: {
        templateTitle: template.title,
        styleBadge: template.badge,
      },
    };
  }
}

/**
 * Production LUMA Creation Adapter
 * Connects to live LUMA backend API endpoints.
 */
export class ProductionLumaCreationAdapter implements OnboardingCreationAdapter {
  public readonly isSimulation = false;

  async generateRecommended(
    toolId: string,
    input: {
      prompt: string;
      sourceImageUrl?: string;
      options?: Record<string, unknown>;
    },
    onProgress?: (stage: CreationProgressStage) => void
  ): Promise<CreationResultData> {
    onProgress?.({
      stepIndex: 1,
      totalSteps: 3,
      stageName: 'ارسال درخواست به سرور لوما',
      description: 'برقراری اتصال امن با سرویس...',
      progressPercent: 30,
    });

    const res = await fetch('/api/creation/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId, input }),
    });

    if (!res.ok) {
      throw new Error(`Creation failed with status ${res.status}`);
    }

    onProgress?.({
      stepIndex: 3,
      totalSteps: 3,
      stageName: 'دریافت خروجی',
      description: 'خروجی نهایی آماده نمایش شد.',
      progressPercent: 100,
    });

    return await res.json();
  }

  async generateFunTransform(
    templateId: string,
    sourceImageUrl: string,
    onProgress?: (stage: CreationProgressStage) => void
  ): Promise<CreationResultData> {
    onProgress?.({
      stepIndex: 1,
      totalSteps: 3,
      stageName: 'ارسال تصویر به سرور',
      description: 'در حال پردازش فیلتر استایل...',
      progressPercent: 30,
    });

    const res = await fetch('/api/creation/transform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId, sourceImageUrl }),
    });

    if (!res.ok) {
      throw new Error(`Transform failed with status ${res.status}`);
    }

    onProgress?.({
      stepIndex: 3,
      totalSteps: 3,
      stageName: 'دریافت خروجی',
      description: 'استایل با موفقیت اعمال شد.',
      progressPercent: 100,
    });

    return await res.json();
  }
}

// Select adapter strategy based on configuration
const useSimulation = process.env.NEXT_PUBLIC_LUMA_USE_SIMULATION !== 'false';

export const creationAdapter: OnboardingCreationAdapter = useSimulation
  ? new DevelopmentSimulationAdapter()
  : new ProductionLumaCreationAdapter();

export const isSimulationMode = creationAdapter.isSimulation;
