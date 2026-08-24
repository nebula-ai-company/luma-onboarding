import type {
  ProfessionOption,
  InterestOption,
  PersonalizationArchetype,
  LumaSectionId,
  LumaEcosystemSection,
  ToolRecommendation,
  RecommendedFirstAction,
} from '@/types/onboarding';

export const LUMA_SECTIONS: LumaEcosystemSection[] = [
  {
    id: 'ai_tools',
    title: 'ابزارهای هوش مصنوعی',
    shortDescription: 'تصویر، ویدئو، ویرایش و ابزارهای خلاقانه',
    detailedExplanation: 'از ساخت تصویر و ویدئو تا ویرایش، افزایش کیفیت و ابزارهای خلاقانه.',
    examples: ['ساخت تصویر', 'ساخت ویدئو', 'ویرایش تصویر', 'افزایش کیفیت'],
    iconName: 'MagicWand',
    sidebarId: 'nav-ai-tools',
    accentColor: '#c084fc', // purple
  },
  {
    id: 'ai_chat',
    title: 'چت با هوش مصنوعی',
    shortDescription: 'گفت‌وگو با مدل‌های مختلف هوش مصنوعی',
    detailedExplanation: 'با مدل‌های مختلف هوش مصنوعی در یک محیط گفت‌وگو کن.',
    examples: ['گفت‌وگو با مدل‌های روز', 'تحلیل و ترجمه اسناد', 'ایده‌پردازی متنی و سناریو'],
    iconName: 'ChatCircleDots',
    sidebarId: 'nav-ai-chat',
    accentColor: '#38bdf8', // sky blue
  },
  {
    id: 'workflow',
    title: 'ورک‌فلو',
    shortDescription: 'ساخت فرایندهای چندمرحله‌ای و ابزارهای اختصاصی',
    detailedExplanation: 'چند ابزار و مدل رو به هم وصل کن و فرایند اختصاصی خودت رو بساز.',
    examples: ['زنجیره چند ابزار هوش مصنوعی', 'تولید دسته‌جمعی محتوا', 'خودکارسازی کارهای تکراری'],
    iconName: 'CirclesThreePlus',
    sidebarId: 'nav-workflow',
    accentColor: '#818cf8', // indigo
  },
  {
    id: 'smart_assistant',
    title: 'دستیار هوشمند',
    shortDescription: 'ساخت دستیار مبتنی بر اطلاعات و فایل‌های خودت',
    detailedExplanation: 'با فایل‌ها و اطلاعات خودت یک دستیار برای کسب‌وکار یا پروژه‌ات بساز.',
    examples: ['پایگاه دانش اختصاصی', 'پاسخ‌گویی به مشتریان', 'دستیار تحلیل اسناد سازمانی'],
    iconName: 'Robot',
    sidebarId: 'nav-smart-assistant',
    accentColor: '#34d399', // emerald
  },
  {
    id: 'my_files',
    title: 'فایل‌های من',
    shortDescription: 'همه ورودی‌ها و خروجی‌هات یکجا',
    detailedExplanation: 'فایل‌هایی که آپلود یا با لوما تولید می‌کنی اینجا در دسترست می‌مونن.',
    examples: ['آرشیو خروجی‌های تصویری و ویدیویی', 'مدیریت فایل‌های آپلود شده', 'اشتراک‌گذاری و سازمان‌دهی'],
    iconName: 'FolderSimple',
    sidebarId: 'nav-my-files',
    accentColor: '#fbbf24', // amber
  },
  {
    id: 'api_developers',
    title: 'API و توسعه‌دهندگان',
    shortDescription: 'اتصال قابلیت‌های لوما به محصول یا نرم‌افزار خودت',
    detailedExplanation: 'قابلیت‌های لوما رو داخل سایت، اپ یا سیستم خودت استفاده کن.',
    examples: ['کلیدهای API سریع و ایمن', 'اسناد جامع و SDKها', 'وب‌هوک‌ها و رویدادهای زنده'],
    iconName: 'Code',
    sidebarId: 'nav-api-dev',
    accentColor: '#f43f5e', // rose
  },
];

export const PROFESSIONS_DATA: ProfessionOption[] = [
  {
    id: 'content_creator',
    title: 'تولیدکننده محتوا',
    description: 'تولید ویدیو، پست‌های شبکه‌های اجتماعی و محتوای خلاقانه',
    iconName: 'VideoCamera',
    archetypes: ['creative', 'video', 'social' as PersonalizationArchetype],
    visualHints: ['تولید ویدیو', 'محتوای ترند', 'استوری‌بورد'],
  },
  {
    id: 'graphic_designer',
    title: 'طراح گرافیک',
    description: 'طراحی بصری، ادیت حرفه‌ای و ایده‌پردازی گرافیکی',
    iconName: 'PaintBrush',
    archetypes: ['creative'],
    visualHints: ['طراحی بصری', 'ویرایش تصویر', 'ایده‌پردازی'],
  },
  {
    id: 'social_media',
    title: 'مدیریت شبکه‌های اجتماعی',
    description: 'مدیریت صفحات اینستاگرام، کانال‌ها و تولید منظم پست',
    iconName: 'ShareNetwork',
    archetypes: ['marketing', 'creative', 'video'],
    visualHints: ['تقویم محتوا', 'کپشن‌نویسی', 'کاور پست'],
  },
  {
    id: 'marketing',
    title: 'تبلیغات و بازاریابی',
    description: 'طراحی کمپین، ساخت بنر و تیزرهای تبلیغاتی پربازده',
    iconName: 'Megaphone',
    archetypes: ['marketing', 'commerce'],
    visualHints: ['کمپین تبلیغاتی', 'بنر دیجیتال', 'تیزر معرفی'],
  },
  {
    id: 'ecommerce',
    title: 'فروشگاه و کسب‌وکار آنلاین',
    description: 'عکاسی و ادیت محصول، مدلینگ لباس و فروش اینترنتی',
    iconName: 'ShoppingBag',
    archetypes: ['commerce', 'creative'],
    visualHints: ['عکس محصول', 'پرو مجازی', 'کاتالوگ آنلاین'],
  },
  {
    id: 'photo_video',
    title: 'عکاسی و ویدئو',
    description: 'عکاسی تبلیغاتی، تدوین، تبدیل عکس به ویدیو و روتوش',
    iconName: 'Camera',
    archetypes: ['video', 'creative'],
    visualHints: ['روتوش چهره', 'کیفیت بالا (4K)', 'موشن تصویر'],
  },
  {
    id: 'business',
    title: 'شرکت و کسب‌وکار',
    description: 'اتوماسیون سازمانی، پشتیبانی و دستیاران هوشمند سازمانی',
    iconName: 'Buildings',
    archetypes: ['business', 'automation'],
    visualHints: ['دستیار سازمانی', 'گزارش‌گیری', 'اتوماسیون'],
  },
  {
    id: 'developer',
    title: 'برنامه‌نویسی',
    description: 'اتصال به API، ساخت ورک‌فلوهای خودکار و توسعه ابزار',
    iconName: 'Code',
    archetypes: ['developer', 'automation'],
    visualHints: ['API Endpoint', 'ورک‌فلو هوشمند', 'اسکریپت خودکار'],
  },
  {
    id: 'education',
    title: 'آموزش و پژوهش',
    description: 'تولید محتوای آموزشی، خلاصه مقالات و ارائه علمی',
    iconName: 'GraduationCap',
    archetypes: ['research', 'business'],
    visualHints: ['اسلایدهای آموزشی', 'خلاصه‌سازی', 'پژوهش هوشمند'],
  },
  {
    id: 'personal',
    title: 'استفاده شخصی',
    description: 'خلق تصاویر فانتزی، آزمایش مدل‌ها و سرگرمی با هوش مصنوعی',
    iconName: 'Sparkle',
    archetypes: ['creative'],
    visualHints: ['خلاقیت آزاد', 'عکس‌های هنری', 'آزمایش مدل‌ها'],
  },
  {
    id: 'other',
    title: 'سایر',
    description: 'کاربردهای ویژه یا ترکیب تخصص‌های متنوع',
    iconName: 'DotsThreeOutline',
    archetypes: ['creative', 'business'],
    visualHints: ['شخصی‌سازی باز', 'ابزارهای ترکیبی'],
  },
];

export const INTERESTS_DATA: InterestOption[] = [
  {
    id: 'image_gen',
    title: 'ساخت تصویر',
    category: 'visual',
    relevantProfessions: ['content_creator', 'graphic_designer', 'marketing', 'ecommerce', 'photo_video', 'personal'],
  },
  {
    id: 'video_gen',
    title: 'ساخت ویدئو',
    category: 'video',
    relevantProfessions: ['content_creator', 'social_media', 'marketing', 'photo_video'],
  },
  {
    id: 'img_to_video',
    title: 'تبدیل عکس به ویدئو',
    category: 'video',
    relevantProfessions: ['photo_video', 'content_creator', 'ecommerce', 'marketing'],
  },
  {
    id: 'image_edit',
    title: 'ویرایش تصویر',
    category: 'visual',
    relevantProfessions: ['graphic_designer', 'photo_video', 'ecommerce', 'content_creator'],
  },
  {
    id: 'ad_content',
    title: 'ساخت محتوای تبلیغاتی',
    category: 'commerce',
    relevantProfessions: ['marketing', 'ecommerce', 'social_media', 'content_creator', 'business'],
  },
  {
    id: 'product_photo',
    title: 'عکس محصول',
    category: 'commerce',
    relevantProfessions: ['ecommerce', 'marketing', 'photo_video'],
  },
  {
    id: 'social_content',
    title: 'تولید محتوای شبکه‌های اجتماعی',
    category: 'social',
    relevantProfessions: ['content_creator', 'social_media', 'marketing', 'ecommerce'],
  },
  {
    id: 'design_ideation',
    title: 'طراحی و ایده‌پردازی',
    category: 'visual',
    relevantProfessions: ['graphic_designer', 'creative', 'content_creator', 'education'],
  },
  {
    id: 'ai_chat',
    title: 'گفت‌وگو با هوش مصنوعی',
    category: 'intelligence',
    relevantProfessions: ['developer', 'education', 'business', 'personal', 'other'],
  },
  {
    id: 'research_writing',
    title: 'تحقیق و نوشتن',
    category: 'intelligence',
    relevantProfessions: ['education', 'business', 'social_media', 'content_creator'],
  },
  {
    id: 'smart_assistant',
    title: 'ساخت دستیار هوشمند',
    category: 'intelligence',
    relevantProfessions: ['business', 'developer', 'education', 'marketing'],
  },
  {
    id: 'automation',
    title: 'خودکارسازی کارها',
    category: 'automation',
    relevantProfessions: ['developer', 'business', 'marketing', 'social_media'],
  },
  {
    id: 'workflow',
    title: 'ساخت Workflow',
    category: 'automation',
    relevantProfessions: ['developer', 'business', 'marketing', 'graphic_designer'],
  },
  {
    id: 'api_dev',
    title: 'استفاده از API و ابزارهای توسعه',
    category: 'developer',
    relevantProfessions: ['developer', 'business'],
  },
  {
    id: 'explore_all',
    title: 'فقط می‌خوام امکانات لوما رو کشف کنم',
    category: 'general',
    relevantProfessions: ['personal', 'other', 'education'],
  },
];

export const MAX_INTERESTS_SELECTION = 8;

/**
 * Derives dynamic prioritization of interests based on chosen professions.
 * Returns sorted list where prioritized items appear first.
 */
export function getSmartPrioritizedInterests(selectedProfessionIds: string[]): {
  interest: InterestOption;
  isPrioritized: boolean;
}[] {
  if (!selectedProfessionIds || selectedProfessionIds.length === 0) {
    return INTERESTS_DATA.map((interest) => ({ interest, isPrioritized: false }));
  }

  // Calculate score for each interest based on matches with selected professions
  const scored = INTERESTS_DATA.map((interest) => {
    let matchCount = 0;
    for (const profId of selectedProfessionIds) {
      if (interest.relevantProfessions.includes(profId)) {
        matchCount += 1;
      }
    }
    return {
      interest,
      score: matchCount,
      isPrioritized: matchCount > 0,
    };
  });

  // Sort by score descending, preserving natural list order for ties
  scored.sort((a, b) => b.score - a.score);

  return scored.map((item) => ({
    interest: item.interest,
    isPrioritized: item.isPrioritized,
  }));
}

/**
 * Derives personalization archetypes from selected professions and interests.
 */
export function deriveArchetypes(
  selectedProfessions: string[],
  selectedInterests: string[]
): PersonalizationArchetype[] {
  const archetypeSet = new Set<PersonalizationArchetype>();

  // Add from professions
  for (const profId of selectedProfessions) {
    const found = PROFESSIONS_DATA.find((p) => p.id === profId);
    if (found) {
      found.archetypes.forEach((arc) => archetypeSet.add(arc));
    }
  }

  // Add from interests
  for (const interestId of selectedInterests) {
    const found = INTERESTS_DATA.find((i) => i.id === interestId);
    if (found) {
      if (['image_gen', 'image_edit', 'design_ideation'].includes(found.id)) archetypeSet.add('creative');
      if (['video_gen', 'img_to_video'].includes(found.id)) archetypeSet.add('video');
      if (['product_photo', 'ad_content'].includes(found.id)) archetypeSet.add('commerce');
      if (['social_content'].includes(found.id)) archetypeSet.add('marketing');
      if (['automation', 'workflow'].includes(found.id)) archetypeSet.add('automation');
      if (['api_dev'].includes(found.id)) archetypeSet.add('developer');
      if (['research_writing', 'ai_chat'].includes(found.id)) archetypeSet.add('research');
      if (['smart_assistant'].includes(found.id)) archetypeSet.add('business');
    }
  }

  return Array.from(archetypeSet);
}

/**
 * Generates personalized dynamic micro-copy for the completion screen (Step 3).
 */
export function getPersonalizedConfirmationCopy(selectedProfessions: string[]): {
  headline: string;
  subtext: string;
} {
  const headline = 'گرفتم.';

  if (!selectedProfessions || selectedProfessions.length === 0) {
    return {
      headline,
      subtext: 'بریم ابزارهایی رو پیدا کنیم که بیشتر به کارت میان.',
    };
  }

  const primaryProf = selectedProfessions[0];

  switch (primaryProf) {
    case 'content_creator':
    case 'social_media':
      return {
        headline,
        subtext: 'بریم ابزارهایی رو بچینیم که تولید محتوات رو سریع‌تر و جذاب‌تر می‌کنن.',
      };
    case 'graphic_designer':
    case 'photo_video':
      return {
        headline,
        subtext: 'بریم سراغ ابزارهایی که به فرایند طراحی، ساخت تصویر و روتوش خلاقانه‌ت کمک می‌کنن.',
      };
    case 'ecommerce':
      return {
        headline,
        subtext: 'بریم ابزارهایی رو پیدا کنیم که برای عکس محصول و تبلیغات فروشگاهت کاربردی‌ترن.',
      };
    case 'marketing':
      return {
        headline,
        subtext: 'بریم سراغ تولید محتوای تبلیغاتی پربازده، تیزرها و بنرهای اختصاصی.',
      };
    case 'developer':
      return {
        headline,
        subtext: 'بریم محیط توسعه، API و ورک‌فلوهای خودکار لوما رو برات آماده کنیم.',
      };
    case 'business':
      return {
        headline,
        subtext: 'بریم دستیاران هوشمند و ابزارهای خودکارسازی سازمانی رو متناسب با کارت بچینیم.',
      };
    case 'education':
      return {
        headline,
        subtext: 'بریم ابزارهای پژوهشی، خلاصه‌سازی و تولید محتوای آموزشی رو مرتب کنیم.',
      };
    default:
      return {
        headline,
        subtext: 'حالا می‌تونیم لوما رو بر اساس کارهایی که برات مهم‌تره بچینیم.',
      };
  }
}

/**
 * Derives the personalized primary sections (Top 3) and ordered remaining sections
 * based on selected professions and interests according to LUMA Phase 3 rules.
 */
export function derivePrimarySections(
  selectedProfessions: string[],
  selectedInterests: string[] = []
): {
  primary: LumaSectionId[];
  secondary: LumaSectionId[];
  allOrdered: LumaSectionId[];
} {
  const primaryProf = selectedProfessions[0] || 'other';

  // Rule 1: Developer
  if (primaryProf === 'developer' || selectedProfessions.includes('developer')) {
    const primary: LumaSectionId[] = ['api_developers', 'workflow', 'ai_chat'];
    const secondary: LumaSectionId[] = ['smart_assistant', 'ai_tools', 'my_files'];
    return { primary, secondary, allOrdered: [...primary, ...secondary] };
  }

  // Rule 2: Business / Company
  if (primaryProf === 'business' || selectedProfessions.includes('business')) {
    const primary: LumaSectionId[] = ['smart_assistant', 'workflow', 'ai_chat'];
    const secondary: LumaSectionId[] = ['ai_tools', 'my_files', 'api_developers'];
    return { primary, secondary, allOrdered: [...primary, ...secondary] };
  }

  // Rule 3: Research / Education
  if (primaryProf === 'education' || selectedProfessions.includes('education')) {
    const primary: LumaSectionId[] = ['ai_chat', 'smart_assistant', 'my_files'];
    const secondary: LumaSectionId[] = ['workflow', 'ai_tools', 'api_developers'];
    return { primary, secondary, allOrdered: [...primary, ...secondary] };
  }

  // Rule 4: Marketing
  if (primaryProf === 'marketing') {
    const primary: LumaSectionId[] = ['ai_tools', 'workflow', 'ai_chat'];
    const secondary: LumaSectionId[] = ['my_files', 'smart_assistant', 'api_developers'];
    return { primary, secondary, allOrdered: [...primary, ...secondary] };
  }

  // Rule 5: Online Store / Commerce
  if (primaryProf === 'ecommerce') {
    const primary: LumaSectionId[] = ['ai_tools', 'my_files', 'workflow'];
    const secondary: LumaSectionId[] = ['ai_chat', 'smart_assistant', 'api_developers'];
    return { primary, secondary, allOrdered: [...primary, ...secondary] };
  }

  // Rule 6: Content Creator / Social Media
  if (primaryProf === 'content_creator' || primaryProf === 'social_media') {
    const primary: LumaSectionId[] = ['ai_tools', 'my_files', 'ai_chat'];
    const secondary: LumaSectionId[] = ['workflow', 'smart_assistant', 'api_developers'];
    return { primary, secondary, allOrdered: [...primary, ...secondary] };
  }

  // Rule 7: Creative / Graphic Designer / Photography
  if (
    primaryProf === 'graphic_designer' ||
    primaryProf === 'photo_video' ||
    primaryProf === 'personal'
  ) {
    const primary: LumaSectionId[] = ['ai_tools', 'my_files', 'workflow'];
    const secondary: LumaSectionId[] = ['ai_chat', 'smart_assistant', 'api_developers'];
    return { primary, secondary, allOrdered: [...primary, ...secondary] };
  }

  // Fallback if no specific match
  const primary: LumaSectionId[] = ['ai_tools', 'my_files', 'ai_chat'];
  const secondary: LumaSectionId[] = ['workflow', 'smart_assistant', 'api_developers'];
  return { primary, secondary, allOrdered: [...primary, ...secondary] };
}

/**
 * Returns the highest-priority section to spotlight and its contextual tooltip text.
 */
export function getSpotlightInfo(
  selectedProfessions: string[],
  selectedInterests: string[] = []
): {
  sectionId: LumaSectionId;
  badgeText: string;
} {
  const primaryProf = selectedProfessions[0] || 'other';

  if (primaryProf === 'developer' || selectedInterests.includes('api_dev')) {
    return {
      sectionId: 'api_developers',
      badgeText: 'احتمالاً از اینجا بیشتر استفاده می‌کنی',
    };
  }

  if (primaryProf === 'business' || selectedInterests.includes('smart_assistant')) {
    return {
      sectionId: 'smart_assistant',
      badgeText: 'احتمالاً از اینجا بیشتر استفاده می‌کنی',
    };
  }

  if (primaryProf === 'education' || selectedInterests.includes('research_writing')) {
    return {
      sectionId: 'ai_chat',
      badgeText: 'احتمالاً از اینجا بیشتر استفاده می‌کنی',
    };
  }

  return {
    sectionId: 'ai_tools',
    badgeText: 'احتمالاً از اینجا بیشتر استفاده می‌کنی',
  };
}

/**
 * Returns contextual CTA wording according to user profile.
 */
export function getPersonalizedCtaText(selectedProfessions: string[]): string {
  if (!selectedProfessions || selectedProfessions.length === 0) {
    return 'ابزارهای مناسب من رو نشون بده';
  }

  const primaryProf = selectedProfessions[0];

  switch (primaryProf) {
    case 'graphic_designer':
    case 'photo_video':
    case 'personal':
      return 'ابزارهای خلاقانه من رو نشون بده';
    case 'ecommerce':
      return 'ابزارهای مناسب فروشگاهم رو نشون بده';
    case 'developer':
      return 'ابزارهای فنی من رو نشون بده';
    case 'business':
      return 'راهکارهای مناسب کارم رو نشون بده';
    case 'content_creator':
    case 'social_media':
    case 'marketing':
      return 'ابزارهای تولید محتوای من رو نشون بده';
    default:
      return 'ابزارهای مناسب من رو نشون بده';
  }
}

// ============================================================================
// REAL LUMA TOOLS CATALOG & SPECIFICATIONS
// ============================================================================

export interface LumaToolDefinition {
  id: string;
  actionId: RecommendedFirstAction;
  title: string;
  description: string;
  route: string;
  category: string;
  iconName: string;
  isFastResult: boolean;
  examples: string[];
  primaryCtaText: string;
  previewType: 'image_gen' | 'image_edit' | 'video_gen' | 'img_to_video' | 'ref_video' | 'upscale' | 'bg_remove' | 'try_on' | 'tts' | 'chat' | 'workflow' | 'assistant' | 'api';
}

export const LUMA_TOOLS_CATALOG: LumaToolDefinition[] = [
  {
    id: 'generate-image',
    actionId: 'generate-image',
    title: 'ساخت تصویر',
    description: 'ساخت تصویر از توضیح متنی',
    route: '/service/generate-image',
    category: 'تولید تصویر',
    iconName: 'MagicWand',
    isFastResult: true,
    examples: [
      'ایده‌ات رو با یک توضیح کوتاه به تصویر تبدیل کنی',
      'سبک‌های مختلف هنری، طراحی محصول و واقع‌گرایانه رو بسازی',
      'کاورها و تصاویر جذاب برای شبکه‌های اجتماعی تولید کنی',
    ],
    primaryCtaText: 'اولین تصویرم رو بسازیم',
    previewType: 'image_gen',
  },
  {
    id: 'edit-image',
    actionId: 'edit-image',
    title: 'ویرایش تصویر',
    description: 'تغییر و اصلاح تصویر با دستور متنی',
    route: '/service/edit-image',
    category: 'اصلاح تصویر',
    iconName: 'PaintBrush',
    isFastResult: true,
    examples: [
      'پس‌زمینه رو با یک دستور متنی ساده تغییر بدی',
      'بخشی از تصویر رو بازطراحی یا اصلاح کنی',
      'ظاهر محصول و کادربندی تصویر رو بهبود بدی',
    ],
    primaryCtaText: 'اولین ادیت تصویر رو بسازیم',
    previewType: 'image_edit',
  },
  {
    id: 'text-to-video',
    actionId: 'text-to-video',
    title: 'ساخت ویدئو',
    description: 'ساخت ویدئو از توضیح متنی',
    route: '/service/text-to-video',
    category: 'تولید ویدئو',
    iconName: 'FilmStrip',
    isFastResult: false,
    examples: [
      'صحنه‌های متحرک و جذاب از سناریوی متنی بسازی',
      'تیزرهای ویدیویی کوتاه برای تبلیغات و استوری تولید کنی',
      'نورپردازی و زاویه دید دوربین رو کنترل کنی',
    ],
    primaryCtaText: 'اولین ویدئوم رو بسازیم',
    previewType: 'video_gen',
  },
  {
    id: 'image-to-video',
    actionId: 'image-to-video',
    title: 'تبدیل تصویر به ویدئو',
    description: 'جان‌دادن به تصویر و تبدیل آن به ویدئو',
    route: '/service/image-to-video',
    category: 'تولید ویدئو',
    iconName: 'PlayCircle',
    isFastResult: true,
    examples: [
      'به عکس‌های ثابت حرکت و جان واقع‌گرایانه ببخشی',
      'ویدیوهای کوتاه ترند برای ریلز و شبکه‌های اجتماعی بسازی',
      'جلوه‌های سینمایی و پویایی تصویر اضافه کنی',
    ],
    primaryCtaText: 'یک عکس رو زنده کنیم',
    previewType: 'img_to_video',
  },
  {
    id: 'reference-to-video',
    actionId: 'reference-to-video',
    title: 'ویدئوساز مرجع‌محور',
    description: 'ساخت ویدئو با استفاده از چند مرجع تصویری، ویدئویی یا صوتی',
    route: '/service/reference-to-video',
    category: 'تولید ویدئو',
    iconName: 'VideoCamera',
    isFastResult: false,
    examples: [
      'از چند تصویر و فریم به عنوان مرجع برای حفظ پیوستگی استفاده کنی',
      'کاراکتر ثابت در زوایای مختلف و صحنه‌های پیوسته بسازی',
      'ویدیوهای روایی با ترکیب چند منبع تولید کنی',
    ],
    primaryCtaText: 'اولین ویدئوی مرجع‌محور رو بسازیم',
    previewType: 'ref_video',
  },
  {
    id: 'upscale-image',
    actionId: 'upscale',
    title: 'افزایش کیفیت تصویر',
    description: 'افزایش وضوح و جزئیات تصویر',
    route: '/service/upscale-image',
    category: 'ارتقای کیفیت',
    iconName: 'ArrowsOutSimple',
    isFastResult: true,
    examples: [
      'وضوح تصویر رو تا ۴ برابر بالا ببری',
      'جزئیات تار و کم‌کیفیت رو بدون افت بازسازی کنی',
      'فایل‌های آماده برای چاپ و رزولوشن بالا تولید کنی',
    ],
    primaryCtaText: 'کیفیت اولین عکس رو بالا ببریم',
    previewType: 'upscale',
  },
  {
    id: 'remove-background',
    actionId: 'remove-background',
    title: 'حذف پس‌زمینه',
    description: 'جداکردن سوژه و ساخت خروجی با پس‌زمینه شفاف',
    route: '/service/remove-background',
    category: 'اصلاح تصویر',
    iconName: 'Scissors',
    isFastResult: true,
    examples: [
      'سوژه رو با یک کلیک از پس‌زمینه جدا کنی',
      'خروجی با پس‌زمینه شفاف (PNG) و تمیز بگیری',
      'عکس‌های محصول رو برای فروشگاه و بنرها آماده کنی',
    ],
    primaryCtaText: 'پس‌زمینه اولین عکس رو حذف کنیم',
    previewType: 'bg_remove',
  },
  {
    id: 'virtual-try-on',
    actionId: 'virtual-try-on',
    title: 'پرو مجازی لباس',
    description: 'نمایش بصری لباس روی مدل مجازی',
    route: '/service/virtual-try-on',
    category: 'فروشگاه و فشن',
    iconName: 'TShirt',
    isFastResult: true,
    examples: [
      'لباس‌ها رو روی تن مدل‌های مجازی مختلف امتحان کنی',
      'عکس‌های حرفه‌ای برای کاتالوگ فروشگاه پوشاک بسازی',
      'بدون نیاز به عکاسی مدلینگ ژورنال لباس تولید کنی',
    ],
    primaryCtaText: 'اولین پرو مجازی رو بسازیم',
    previewType: 'try_on',
  },
  {
    id: 'text-to-speech',
    actionId: 'text-to-speech',
    title: 'تبدیل متن به گفتار',
    description: 'ساخت صدای طبیعی برای متن',
    route: '/service/text-to-speech',
    category: 'صدا و گفتار',
    iconName: 'SpeakerHigh',
    isFastResult: true,
    examples: [
      'صداگذاری طبیعی و دلنشین برای ویدیوها بسازی',
      'لحن‌ها و لهجه‌های متنوع صوتی رو امتحان کنی',
      'متن‌های آموزشی و مقالات رو به فایل صوتی تبدیل کنی',
    ],
    primaryCtaText: 'اولین صدای هوشمند رو بسازیم',
    previewType: 'tts',
  },
  {
    id: 'chat',
    actionId: 'chat',
    title: 'چت با هوش مصنوعی',
    description: 'گفت‌وگو با مدل‌های مختلف هوش مصنوعی',
    route: '/chat',
    category: 'گفت‌وگو و تحلیل',
    iconName: 'ChatCircleDots',
    isFastResult: true,
    examples: [
      'با برترین مدل‌های زبانی جهان هم‌زمان مشورت کنی',
      'متن‌ها، مقالات و سناریوها رو خلاصه و بازنویسی کنی',
      'ایده‌پردازی و حل مسئله رو با سرعت بالا پیش ببری',
    ],
    primaryCtaText: 'اولین گفت‌وگو رو شروع کنیم',
    previewType: 'chat',
  },
  {
    id: 'workflow',
    actionId: 'workflow',
    title: 'ورک‌فلو',
    description: 'ترکیب چند مرحله و ساخت فرایند اختصاصی',
    route: '/workflow',
    category: 'اتوماسیون',
    iconName: 'CirclesThreePlus',
    isFastResult: false,
    examples: [
      'چند ابزار رو در یک زنجیره خودکار به هم متصل کنی',
      'فرایندهای تکراری تولید محتوا یا ادیت رو خودکار کنی',
      'ابزار و خط لوله اختصاصی برای کارت طراحی کنی',
    ],
    primaryCtaText: 'اولین ورک‌فلو رو ببینیم',
    previewType: 'workflow',
  },
  {
    id: 'assistant',
    actionId: 'assistant',
    title: 'دستیار هوشمند',
    description: 'ساخت دستیار مبتنی بر اطلاعات و فایل‌های خودت',
    route: '/assistant',
    category: 'دستیار هوشمند',
    iconName: 'Robot',
    isFastResult: false,
    examples: [
      'فایل‌ها، کاتالوگ و اسناد کسب‌وکارت رو بارگذاری کنی',
      'دستیار پاسخ‌گویی دقیق و سفارشی برای مشتریان بسازی',
      'گزارش‌گیری و تحلیل داده‌های سازمان رو انجام بدی',
    ],
    primaryCtaText: 'اولین دستیار رو بسازیم',
    previewType: 'assistant',
  },
  {
    id: 'api',
    actionId: 'api',
    title: 'API و توسعه‌دهندگان',
    description: 'استفاده از قابلیت‌های لوما داخل محصول یا نرم‌افزار',
    route: '/api',
    category: 'توسعه نرم‌افزار',
    iconName: 'Code',
    isFastResult: false,
    examples: [
      'کلیدهای API رو به سادگی دریافت و مدیریت کنی',
      'قابلیت‌های هوش مصنوعی رو مستقیماً در نرم‌افزارت فراخوانی کنی',
      'از اسکریپت‌های نمونه و وب‌هوک‌ها بهره ببری',
    ],
    primaryCtaText: 'تنظیمات API رو ببینیم',
    previewType: 'api',
  },
];

// ============================================================================
// DETERMINISTIC RECOMMENDATION ENGINE WITH INTERESTS OVERRIDE
// ============================================================================

/**
 * Returns contextual reason text in natural Persian for why a tool was chosen.
 */
function getPersonalizedReasonForTool(
  toolId: string,
  selectedProfessions: string[],
  selectedInterests: string[]
): string {
  const primaryProf = selectedProfessions[0] || 'other';

  switch (toolId) {
    case 'generate-image':
      if (selectedInterests.includes('product_photo') || primaryProf === 'ecommerce') {
        return 'برای ساخت و ایده‌پردازی عکس‌های باکیفیت محصول';
      }
      if (selectedInterests.includes('ad_content') || primaryProf === 'marketing') {
        return 'برای ساخت سریع بنرهای تبلیغاتی و کمپین‌های جذاب';
      }
      if (selectedInterests.includes('social_content') || primaryProf === 'content_creator' || primaryProf === 'social_media') {
        return 'برای تولید منظم پست‌ها، استوری‌ها و کاورهای ترند';
      }
      if (selectedInterests.includes('design_ideation') || primaryProf === 'graphic_designer') {
        return 'برای طراحی، کانسپت‌آرت و تصویرسازی سریع ایده‌ها';
      }
      return 'به خاطر علاقه‌ات به ساخت محتوای تصویری با هوش مصنوعی';

    case 'edit-image':
      if (primaryProf === 'photo_video' || primaryProf === 'graphic_designer') {
        return 'برای اصلاح سریع جزئیات و روتوش هوشمند تصاویر';
      }
      if (primaryProf === 'ecommerce' || selectedInterests.includes('product_photo')) {
        return 'برای تغییر پس‌زمینه و اصلاح ظاهر عکس‌های محصول';
      }
      return 'مناسب برای طراحی، تغییر و اصلاح آسان تصاویر';

    case 'text-to-video':
      if (primaryProf === 'marketing' || selectedInterests.includes('ad_content')) {
        return 'برای ساخت تیزرها و صحنه‌های ویدیویی تبلیغاتی';
      }
      if (primaryProf === 'content_creator' || selectedInterests.includes('social_content')) {
        return 'برای تولید سریع محتوای ویدیویی برای شبکه‌های اجتماعی';
      }
      return 'برای ساخت ویدیوهای خلاقانه از روی متن و سناریو';

    case 'image-to-video':
      if (primaryProf === 'photo_video') {
        return 'برای جان‌دادن به عکس‌های ثابت و ساخت ریلز جذاب';
      }
      if (primaryProf === 'ecommerce') {
        return 'برای تبدیل عکس محصول به موشن ویدیویی جذاب فروشگاهی';
      }
      return 'برای متحرک‌کردن تصاویر بدون نیاز به ابزار پیچیده';

    case 'reference-to-video':
      return 'برای حفظ پیوستگی کاراکتر و ترکیب چند منبع تصویری در ویدیو';

    case 'upscale-image':
      if (primaryProf === 'photo_video' || primaryProf === 'graphic_designer') {
        return 'برای آماده‌سازی فایل‌های چاپی با بالاترین وضوح ممکن';
      }
      return 'برای افزایش شفافیت و بازیابی جزئیات تصاویر کم‌کیفیت';

    case 'remove-background':
      if (primaryProf === 'ecommerce' || selectedInterests.includes('product_photo')) {
        return 'برای جداسازی سریع کالا از پس‌زمینه و ساخت کاتالوگ فروشگاه';
      }
      return 'برای ساخت آسان تصاویر با پس‌زمینه شفاف (PNG)';

    case 'virtual-try-on':
      return 'مناسب برای فروشگاه آنلاین جهت نمایش واقع‌گرایانه لباس روی مدل';

    case 'text-to-speech':
      if (primaryProf === 'education' || selectedInterests.includes('research_writing')) {
        return 'برای تبدیل اسلایدهای آموزشی و مقالات به فایل صوتی روان';
      }
      return 'برای صداگذاری طبیعی و تولید گویندگی محتواها';

    case 'chat':
      if (primaryProf === 'education' || selectedInterests.includes('research_writing')) {
        return 'برای تحلیل مقالات، خلاصه‌سازی و پژوهش متنی هوشمند';
      }
      if (primaryProf === 'business') {
        return 'برای مشاوره سازمانی، نگارش ایمیل و گزارش‌نویسی سریع';
      }
      return 'برای هم‌فکری، خلاصه‌سازی و ایده‌پردازی با مدل‌های زبانی';

    case 'workflow':
      if (selectedInterests.includes('automation') || primaryProf === 'business') {
        return 'برای کارهای تکراری و خودکارسازی فرایندهای کاری';
      }
      return 'برای ترکیب چند ابزار و ساخت جریان کاری اختصاصی';

    case 'assistant':
      if (primaryProf === 'business') {
        return 'برای پاسخ‌گویی به مشتریان و تحلیل اطلاعات سازمانی';
      }
      if (primaryProf === 'education') {
        return 'برای ساخت پایگاه دانش هوشمند بر روی فایل‌ها و جزوات';
      }
      return 'برای ساخت دستیار هوشمند با اطلاعات و اسناد اختصاصی خودت';

    case 'api':
      return 'برای اتصال مستقیم هوش مصنوعی لوما به نرم‌افزار یا وب‌سایتت';

    default:
      return 'مناسب برای اولویت‌ها و اهداف انتخابی شما در لوما';
  }
}

/**
 * Calculates deterministic weighted scores for all tools and returns top recommendations.
 * Weight hierarchy:
 * 1. Interests (Weight: 50-65 points per match) -> STRONGEST signal, overrides profession
 * 2. Profession (Weight: 15-35 points) -> Contextual base
 * 3. Fast First-Result (Weight: +5 points) -> Smooth low-friction onboarding tie-breaker
 */
export function deriveToolRecommendations(
  selectedProfessions: string[],
  selectedInterests: string[]
): {
  recommendations: ToolRecommendation[];
  primaryRecommendation: ToolRecommendation;
  secondaryRecommendations: ToolRecommendation[];
  recommendedFirstAction: RecommendedFirstAction;
} {
  const scores: Record<string, number> = {};
  const reasonsMap: Record<string, string[]> = {};

  // Initialize
  for (const tool of LUMA_TOOLS_CATALOG) {
    scores[tool.id] = 0;
    reasonsMap[tool.id] = [];
    if (tool.isFastResult) {
      scores[tool.id] += 5; // Slight bonus for quick first gratification
    }
  }

  // 1. EVALUATE USER INTERESTS (STRONGEST WEIGHT)
  for (const interest of selectedInterests) {
    switch (interest) {
      case 'image_gen':
        scores['generate-image'] += 70;
        scores['edit-image'] += 25;
        scores['upscale-image'] += 20;
        reasonsMap['generate-image'].push('علاقه‌مندی به ساخت تصویر');
        break;

      case 'video_gen':
        scores['text-to-video'] += 70;
        scores['image-to-video'] += 45;
        scores['reference-to-video'] += 35;
        reasonsMap['text-to-video'].push('علاقه‌مندی به ساخت ویدئو');
        break;

      case 'img_to_video':
        scores['image-to-video'] += 75;
        scores['text-to-video'] += 35;
        scores['generate-image'] += 20;
        reasonsMap['image-to-video'].push('علاقه‌مندی به تبدیل عکس به ویدیو');
        break;

      case 'image_edit':
        scores['edit-image'] += 70;
        scores['remove-background'] += 35;
        scores['upscale-image'] += 35;
        scores['generate-image'] += 25;
        reasonsMap['edit-image'].push('علاقه‌مندی به ویرایش تصویر');
        break;

      case 'ad_content':
        scores['generate-image'] += 50;
        scores['text-to-video'] += 45;
        scores['edit-image'] += 35;
        scores['workflow'] += 30;
        reasonsMap['generate-image'].push('ساخت محتوای تبلیغاتی');
        break;

      case 'product_photo':
        scores['remove-background'] += 60;
        scores['generate-image'] += 55;
        scores['edit-image'] += 50;
        scores['virtual-try-on'] += 45;
        scores['upscale-image'] += 35;
        reasonsMap['remove-background'].push('عکس محصول و آماده‌سازی فروشگاه');
        break;

      case 'social_content':
        scores['generate-image'] += 50;
        scores['text-to-video'] += 45;
        scores['image-to-video'] += 45;
        scores['chat'] += 30;
        reasonsMap['generate-image'].push('تولید محتوای شبکه‌های اجتماعی');
        break;

      case 'design_ideation':
        scores['generate-image'] += 60;
        scores['edit-image'] += 45;
        scores['upscale-image'] += 30;
        reasonsMap['generate-image'].push('طراحی و ایده‌پردازی بصری');
        break;

      case 'ai_chat':
        scores['chat'] += 75;
        scores['assistant'] += 35;
        scores['text-to-speech'] += 25;
        reasonsMap['chat'].push('علاقه‌مندی به گفت‌وگو با هوش مصنوعی');
        break;

      case 'research_writing':
        scores['chat'] += 65;
        scores['assistant'] += 55;
        scores['text-to-speech'] += 35;
        reasonsMap['chat'].push('تحقیق و خلاصه‌نویسی متنی');
        break;

      case 'smart_assistant':
        scores['assistant'] += 75;
        scores['workflow'] += 40;
        scores['chat'] += 35;
        reasonsMap['assistant'].push('علاقه‌مندی به ساخت دستیار هوشمند');
        break;

      case 'automation':
        scores['workflow'] += 75;
        scores['assistant'] += 45;
        scores['api'] += 35;
        reasonsMap['workflow'].push('خودکارسازی کارهای تکراری');
        break;

      case 'workflow':
        scores['workflow'] += 75;
        scores['assistant'] += 40;
        scores['api'] += 30;
        reasonsMap['workflow'].push('ساخت و اجرای ورک‌فلو');
        break;

      case 'api_dev':
        scores['api'] += 80;
        scores['workflow'] += 45;
        scores['chat'] += 25;
        reasonsMap['api'].push('استفاده از API و ابزارهای توسعه');
        break;

      case 'explore_all':
        scores['generate-image'] += 35;
        scores['chat'] += 30;
        scores['image-to-video'] += 30;
        scores['workflow'] += 25;
        break;
    }
  }

  // 2. EVALUATE USER PROFESSIONS (MEDIUM WEIGHT)
  for (const prof of selectedProfessions) {
    switch (prof) {
      case 'graphic_designer':
        scores['generate-image'] += 25;
        scores['edit-image'] += 25;
        scores['upscale-image'] += 20;
        scores['remove-background'] += 20;
        scores['workflow'] += 15;
        break;

      case 'content_creator':
        scores['generate-image'] += 25;
        scores['text-to-video'] += 25;
        scores['image-to-video'] += 25;
        scores['chat'] += 20;
        scores['text-to-speech'] += 15;
        break;

      case 'social_media':
        scores['generate-image'] += 25;
        scores['text-to-video'] += 25;
        scores['image-to-video'] += 20;
        scores['edit-image'] += 20;
        scores['chat'] += 15;
        break;

      case 'marketing':
        scores['generate-image'] += 25;
        scores['text-to-video'] += 25;
        scores['edit-image'] += 20;
        scores['workflow'] += 20;
        scores['chat'] += 15;
        break;

      case 'ecommerce':
        scores['generate-image'] += 25;
        scores['edit-image'] += 25;
        scores['remove-background'] += 25;
        scores['image-to-video'] += 20;
        scores['workflow'] += 15;
        // If clothing/fashion indicator
        if (selectedInterests.includes('product_photo')) {
          scores['virtual-try-on'] += 30;
        }
        break;

      case 'photo_video':
        scores['edit-image'] += 30;
        scores['upscale-image'] += 25;
        scores['image-to-video'] += 25;
        scores['text-to-video'] += 20;
        scores['reference-to-video'] += 20;
        break;

      case 'business':
        scores['assistant'] += 30;
        scores['workflow'] += 25;
        scores['chat'] += 25;
        scores['generate-image'] += 15;
        // Only prioritize API if developer interest exists
        if (selectedInterests.includes('api_dev') || selectedInterests.includes('automation')) {
          scores['api'] += 20;
        }
        break;

      case 'developer':
        scores['api'] += 35;
        scores['workflow'] += 30;
        scores['chat'] += 25;
        scores['assistant'] += 20;
        break;

      case 'education':
        scores['chat'] += 30;
        scores['assistant'] += 25;
        scores['text-to-speech'] += 25;
        scores['workflow'] += 15;
        break;

      case 'personal':
        scores['generate-image'] += 30;
        scores['image-to-video'] += 25;
        scores['chat'] += 20;
        break;

      default:
        scores['generate-image'] += 20;
        scores['chat'] += 20;
        scores['image-to-video'] += 15;
        break;
    }
  }

  // Sort tools by descending score
  const sortedCatalog = [...LUMA_TOOLS_CATALOG].sort((a, b) => {
    const scoreDiff = (scores[b.id] || 0) - (scores[a.id] || 0);
    if (scoreDiff !== 0) return scoreDiff;
    // Tie-breaker: prefer fast-result tool
    if (a.isFastResult && !b.isFastResult) return -1;
    if (!a.isFastResult && b.isFastResult) return 1;
    return 0;
  });

  // Pick top 4-5 tools max
  const topTools = sortedCatalog.slice(0, 5);

  const mappedRecommendations: ToolRecommendation[] = topTools.map((tool) => ({
    id: tool.id,
    actionId: tool.actionId,
    title: tool.title,
    description: tool.description,
    route: tool.route,
    score: scores[tool.id] || 0,
    reasons: reasonsMap[tool.id] || [],
    primaryReason: getPersonalizedReasonForTool(tool.id, selectedProfessions, selectedInterests),
    category: tool.category,
    iconName: tool.iconName,
    examples: tool.examples,
    previewType: tool.previewType,
    primaryCtaText: tool.primaryCtaText,
    isFastResult: tool.isFastResult,
  }));

  const primaryRecommendation = mappedRecommendations[0];
  const secondaryRecommendations = mappedRecommendations.slice(1);

  // Derive recommendedFirstAction
  let recommendedFirstAction = primaryRecommendation?.actionId || 'generate-image';

  // Specific high-intent overrides if user selected explicit specialized visual intents
  if (selectedInterests.includes('img_to_video') && !selectedInterests.includes('image_gen')) {
    recommendedFirstAction = 'image-to-video';
  } else if (selectedInterests.includes('image_edit') && !selectedInterests.includes('image_gen')) {
    recommendedFirstAction = 'edit-image';
  }

  return {
    recommendations: mappedRecommendations,
    primaryRecommendation,
    secondaryRecommendations,
    recommendedFirstAction,
  };
}

export const LUMA_PROFESSIONS = PROFESSIONS_DATA;
export const LUMA_INTERESTS = INTERESTS_DATA;
export const LUMA_AVAILABLE_TOOLS = LUMA_TOOLS_CATALOG;


