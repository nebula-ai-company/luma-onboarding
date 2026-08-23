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
    id: 'cyberpunk_neon',
    title: 'سایبرپانک و نئونی',
    tagline: 'نورپردازی نئونی با اتمسفر آینده‌نگر',
    description: 'تبدیل پرتره یا عکس به کاراکتر سایبرپانک با هاله‌های بنفش و فیروزه‌ای و جزئیات سایبرنتیک.',
    badge: 'ترند شبکه‌های اجتماعی',
    iconName: 'Lightning',
    gradient: 'from-purple-600/30 via-indigo-600/20 to-sky-500/20',
    beforeSampleUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    afterSampleUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    promptExample: 'Cyberpunk futuristic portrait with vibrant purple and cyan neon rim lighting, holographic glow, detailed octane render 8k',
  },
  {
    id: 'ghibli_anime',
    title: 'انیمه و استودیو جیبلی',
    tagline: 'سبک نقاشی دستی گرم و نوستالژیک',
    description: 'تصویرسازی آبرنگی و روح‌نواز شبیه به انیمیشن‌های هایائو میازاکی با رنگ‌های لطیف و جزئیات زنده.',
    badge: 'محبوب کاربران خلاق',
    iconName: 'PaintBrush',
    gradient: 'from-emerald-600/30 via-teal-600/20 to-blue-500/20',
    beforeSampleUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    afterSampleUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    promptExample: 'Studio Ghibli style anime illustration, warm pastel color palette, soft watercolor texture, nostalgic cozy atmosphere',
  },
  {
    id: 'renaissance_oil',
    title: 'نقاشی رنسانس و ژورنالی',
    tagline: 'پرتره کلاسیک با قلم‌موی روغنی',
    description: 'تبدیل تصویر به شاهکار نقاشی رنگ روغن با نورپردازی رامبراند و جلوه موزه هنرهای کلاسیک.',
    badge: 'هنری و لوکس',
    iconName: 'Crown',
    gradient: 'from-amber-600/30 via-orange-600/20 to-yellow-500/20',
    beforeSampleUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    afterSampleUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    promptExample: 'Classic Renaissance oil painting, dramatic chiaroscuro Rembrandt lighting, rich canvas texture, masterwork fine art',
  },
  {
    id: 'clay_miniature',
    title: 'مجسمه سه‌بعدی و مینیاتور',
    tagline: 'استایل خمیری فانتزی و خنده‌دار',
    description: 'ساخت فیگور سه‌بعدی مینیاتوری شبیه به استاپ‌موشن با بافت خمیری، چشمان درشت و نورپردازی استودیویی.',
    badge: 'طنز و فانتزی',
    iconName: 'Smiley',
    gradient: 'from-pink-600/30 via-rose-600/20 to-purple-500/20',
    beforeSampleUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    afterSampleUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    promptExample: 'Cute 3D claymation miniature figurine character, soft plasticine texture, tilt-shift camera lens, studio lighting',
  },
];

export const SAMPLE_AVATARS: SampleAvatarOption[] = [
  {
    id: 'sample_avatar_1',
    title: 'پرتره شهری جوان',
    category: 'پرتره',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample_avatar_2',
    title: 'پرتره در طبیعت',
    category: 'طبیعت',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample_avatar_3',
    title: 'استودیویی خلاق',
    category: 'آتلیه',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample_avatar_4',
    title: 'کافه و لایف‌استایل',
    category: 'روزمره',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
  },
];

export const QUICK_PROMPTS: Record<string, QuickPromptPreset[]> = {
  'generate-image': [
    {
      id: 'gi_1',
      toolId: 'generate-image',
      label: 'کاور مینیمال با نور استودیویی',
      prompt: 'پوستر مینیمالیستی و هندسی با گرادیان نوری بنفش و ارگانیک، تایپوگرافی مدرن، نورپردازی باکیفیت 8K',
      category: 'طراحی',
    },
    {
      id: 'gi_2',
      toolId: 'generate-image',
      label: 'عکس استودیویی از محصول لوکس',
      prompt: 'عکاسی تبلیغاتی تجاری از بطری عطر لوکس روی پایه سنگ مرمر مشکی با قطرات آب شفاف و نور پس‌زمینه نرم',
      category: 'فروشگاه',
    },
    {
      id: 'gi_3',
      toolId: 'generate-image',
      label: 'صحنه آینده‌نگرانه و فناوری',
      prompt: 'نمایی سینمایی از یک آزمایشگاه هوش مصنوعی معلق در فضا با هولوگرام‌های نوری داده و معماری مدرن',
      category: 'تکنولوژی',
    },
    {
      id: 'gi_4',
      toolId: 'generate-image',
      label: 'کاراکتر فانتزی برای بازی',
      prompt: 'کاراکتر شوالیه نئونی در کوچه باران‌خورده توکیو با زره متالیک براق و جلوه نوری سینمایی',
      category: 'گیم و هنر',
    },
  ],
  'edit-image': [
    {
      id: 'ei_1',
      toolId: 'edit-image',
      label: 'تغییر پس‌زمینه به ساحل غروب',
      prompt: 'پس‌زمینه را به ساحل آرام هنگام غروب آفتاب با نور گرم طلایی و انعکاس روی آب تغییر بده',
      sampleImageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      category: 'ادیت فضا',
    },
    {
      id: 'ei_2',
      toolId: 'edit-image',
      label: 'تبدیل نورپردازی به تم استودیویی نئون',
      prompt: 'نورپردازی سوژه را به نور جانبی بنفش و فیروزه‌ای آتلیه‌ای تغییر بده و کنتراست را شارپ کن',
      sampleImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      category: 'نورپردازی',
    },
  ],
  'image-to-video': [
    {
      id: 'itv_1',
      toolId: 'image-to-video',
      label: 'حرکت نرم دوربین و جریان باد',
      prompt: 'حرکت آهسته باد میان شاخه‌ها و زوم ملایم سینمایی به جلو با عمق میدان طبیعی',
      sampleImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      category: 'طبیعت',
    },
    {
      id: 'itv_2',
      toolId: 'image-to-video',
      label: 'چرخش ۳۶۰ درجه‌ای محصول',
      prompt: 'چرخش نرم و لوکس محصول با درخشش نور متحرک روی لبه‌های فلزی برای تیزر تبلیغاتی',
      sampleImageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      category: 'تبلیغاتی',
    },
  ],
  'text-to-video': [
    {
      id: 'ttv_1',
      toolId: 'text-to-video',
      label: 'پرواز پهپاد بر فراز کوهستان مه‌آلود',
      prompt: 'نمای پهپادی سینمایی و فراگیر از جنگل کاج مه‌آلود در صبح زود با نفوذ پرتوهای آفتاب',
      category: 'سینمایی',
    },
    {
      id: 'ttv_2',
      toolId: 'text-to-video',
      label: 'انیمیشن انتزاعی جریان مایع نئونی',
      prompt: 'حرکت موج‌های رنگی ژئودئیک بنفش و طلایی به صورت ارگانیک با کیفیت 4K و سرعت نرم',
      category: 'موشن',
    },
  ],
  'remove-background': [
    {
      id: 'rb_1',
      toolId: 'remove-background',
      label: 'کفش ورزشی تجاری',
      prompt: 'جداسازی دقیق سوژه با حفظ سایه‌های کف و لبه‌های نامحسوس',
      sampleImageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      category: 'محصول',
    },
    {
      id: 'rb_2',
      toolId: 'remove-background',
      label: 'پرتره مدل عینک',
      prompt: 'حذف کامل پس‌زمینه شلوغ آتلیه با حفظ ظرافت تارهای مو و فریم عینک',
      sampleImageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
      category: 'فشن',
    },
  ],
  'upscale': [
    {
      id: 'up_1',
      toolId: 'upscale',
      label: 'ارتقای ۴ برابری پوستر با بازسازی بافت',
      prompt: 'افزایش وضوح تا رزولوشن 4K، بازیابی خطوط تار و وضوح متون ریز',
      sampleImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      category: 'کیفیت بالا',
    },
  ],
  'chat': [
    {
      id: 'ch_1',
      toolId: 'chat',
      label: 'سناریوی ۵ قسمتی ریلز پربازدید',
      prompt: 'برای یک کسب‌وکار آنلاین ۵ ایده سناریوی ریلز ۱۵ ثانیه‌ای با قلاب جذاب اولیه (Hook) و فراخوان اقدام بنویس',
      category: 'تولید محتوا',
    },
    {
      id: 'ch_2',
      toolId: 'chat',
      label: 'طراحی ساختار کمپین فروش فصلی',
      prompt: 'یک تقویم محتوای یک‌هفته‌ای با استراتژی تخفیف پله‌ای و متن ایمیل مارکتینگ برام تدوین کن',
      category: 'مارکتینگ',
    },
  ],
  'text-to-speech': [
    {
      id: 'tts_1',
      toolId: 'text-to-speech',
      label: 'نریشن مستند و انگیزشی',
      prompt: 'به لوما خوش آمدید. جایی که مرزهای هوش مصنوعی و خلاقیت انسانی به هم می‌رسند.',
      category: 'گویندگی',
    },
  ],
  'virtual-try-on': [
    {
      id: 'vto_1',
      toolId: 'virtual-try-on',
      label: 'پرو کت چرم روی مدل مردانه',
      prompt: 'نمایش کت چرم قهوه‌ای بر تن مدل در فضای خیابانی میلان با حفظ فرم دوخت',
      sampleImageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
      category: 'پوشاک',
    },
  ],
};

/**
 * OnboardingCreationAdapter Interface
 * Defines the contract for all generation operations in onboarding.
 */
export interface OnboardingCreationAdapter {
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
 * Production-ready mock implementation for Onboarding Creation.
 * Simulates high-precision, sub-second to realistic 2.5s multi-stage generation loops
 * with beautiful curated output assets matching the exact tool/prompt context.
 */
export class ClientSimulationCreationAdapter implements OnboardingCreationAdapter {
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

    // Stage 1: Ingestion & Prompt semantic analysis (35%)
    onProgress?.({
      stepIndex: 1,
      totalSteps: 3,
      stageName: 'تحلیل دستور و آماده‌سازی موتور هوش مصنوعی',
      description: 'در حال رمزگشایی پرامپت و بارگذاری وزن‌های بهینه مدل...',
      progressPercent: 35,
    });
    await this.delay(650);

    // Stage 2: Synthesis & Detail refinement (75%)
    onProgress?.({
      stepIndex: 2,
      totalSteps: 3,
      stageName: 'تولید و شکل‌دهی جزئیات با کیفیت بالا',
      description: 'اعمال فیلترهای تفکیک لایه‌ای و تنظیم نورپردازی...',
      progressPercent: 75,
    });
    await this.delay(850);

    // Stage 3: Post-processing & Output compilation (100%)
    onProgress?.({
      stepIndex: 3,
      totalSteps: 3,
      stageName: 'نهایی‌سازی و ذخیره‌سازی در حافظه موقت',
      description: 'رندر نهایی و ساخت پیش‌نمایش شفاف...',
      progressPercent: 100,
    });
    await this.delay(450);

    const elapsedSeconds = parseFloat(((Date.now() - startTime) / 1000).toFixed(1));

    // Formulate tailored result by toolId
    switch (toolId) {
      case 'generate-image':
        return {
          id: `res_${Date.now()}`,
          toolId,
          mode: 'recommended',
          title: 'تصویر اختصاصی تولید شده با لوما',
          prompt: input.prompt || 'طراحی مینیمال با نور استودیویی',
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=90',
          aspectRatio: '1:1',
          dimensions: '2048 x 2048',
          fileSizeBytes: 2450000,
          generationTimeSeconds: elapsedSeconds,
          createdAt: new Date().toISOString(),
          metadata: {
            engine: 'LUMA Vision Core v3',
            cfgScale: 7.5,
            steps: 30,
          },
        };

      case 'edit-image':
        return {
          id: `res_${Date.now()}`,
          toolId,
          mode: 'recommended',
          title: 'تصویر ویرایش‌شده با لوما',
          prompt: input.prompt || 'تغییر پس‌زمینه و نورپردازی',
          beforeImageUrl: input.sourceImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
          afterImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=90',
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=90',
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
          title: 'ویدئوی حرکتی سینمایی لوما',
          prompt: input.prompt || 'حرکت نرم دوربین با عمق میدان طبیعی',
          imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-nebula-in-deep-space-32001-large.mp4',
          aspectRatio: '16:9',
          dimensions: '1080p Full HD (60fps)',
          generationTimeSeconds: elapsedSeconds,
          createdAt: new Date().toISOString(),
          metadata: {
            durationSeconds: 4.5,
            fps: 60,
          },
        };

      case 'remove-background':
        return {
          id: `res_${Date.now()}`,
          toolId,
          mode: 'recommended',
          title: 'خروجی تفکیک سوژه (PNG شفاف)',
          beforeImageUrl: input.sourceImageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
          afterImageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
          imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
          dimensions: '3000 x 2000 PNG',
          fileSizeBytes: 3100000,
          generationTimeSeconds: elapsedSeconds,
          createdAt: new Date().toISOString(),
        };

      case 'upscale':
        return {
          id: `res_${Date.now()}`,
          toolId,
          mode: 'recommended',
          title: 'تصویر با کیفیت 4K شارپ',
          beforeImageUrl: input.sourceImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=50',
          afterImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&auto=format&fit=crop&q=95',
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&auto=format&fit=crop&q=95',
          dimensions: '3840 x 2160 Ultra HD',
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
          chatResponseText: `این یک خروجی استراتژیک آماده برای اجرا است:\n\n۱. **قلاب بصری (۰ تا ۳ ثانیه):** نمایش مستقیم نتیجه قبل/بعد برای توقف اسکرول مخاطب.\n۲. **معرفی چالش (۳ تا ۸ ثانیه):** بیان نیاز روزمره با لحنی صمیمی و بدون تکلف.\n۳. **راهکار با لوما (۸ تا ۱۲ ثانیه):** نمایش ۱ کلیکی سرعت اجرای فرایند.\n۴. **فراخوان اقدام (۱۲ تا ۱۵ ثانیه):** هدایت مخاطب برای تست یا دریافت رایگان قالب.`,
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
          audioVoiceName: 'آریا (گوینده استودیویی فارسی)',
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
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
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
      stageName: 'اسکن ویژگی‌های چهره و ترکیب‌بندی تصویر',
      description: 'تشخیص زوایا، فرم سوژه و پالت رنگی مبدا...',
      progressPercent: 30,
    });
    await this.delay(600);

    onProgress?.({
      stepIndex: 2,
      totalSteps: 3,
      stageName: `اعمال استایل هنری «${template.title}»`,
      description: 'ترکیب قلم‌موهای هوشمند و اعمال تم نورپردازی...',
      progressPercent: 70,
    });
    await this.delay(800);

    onProgress?.({
      stepIndex: 3,
      totalSteps: 3,
      stageName: 'تکمیل نورهای نئونی و رندر سه‌بعدی',
      description: 'آماده‌سازی تصویر خروجی نهایی...',
      progressPercent: 100,
    });
    await this.delay(400);

    const elapsedSeconds = parseFloat(((Date.now() - startTime) / 1000).toFixed(1));

    return {
      id: `res_fun_${Date.now()}`,
      toolId: 'fun-transform',
      mode: 'fun',
      title: `خلق فان: ${template.title}`,
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

export const creationAdapter = new ClientSimulationCreationAdapter();
