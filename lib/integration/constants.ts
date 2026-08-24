import type { FunWorkflowTemplate, OnboardingFeatureFlags } from './contracts';
import { ONBOARDING_SCHEMA_VERSION } from './contracts';

export { ONBOARDING_SCHEMA_VERSION };

export const DEFAULT_FEATURE_FLAGS: OnboardingFeatureFlags = {
  enableFirstCreation: true,
  enableFunCreation: true,
  enableResume: true,
  enableDashboardPersonalization: true,
};

export const FUN_WORKFLOW_TEMPLATES: FunWorkflowTemplate[] = [
  {
    onboardingTemplateId: 'cinematic_3d',
    title: 'تبدیل ۳ بعدی سینمایی',
    tagline: 'تبدیل عکس به مجسمه و کاراکتر ۳ بعدی استودیویی',
    description: 'مدل‌سازی سه‌بعدی پیشرفته با متریال دیجیتال، نورپردازی والپیپری و افکت عمق میدان سینمایی.',
    previewAsset: 'https://picsum.photos/seed/fun_3d_cinema/800/800',
    beforeSampleUrl: 'https://picsum.photos/seed/fun_user_source/800/800',
    afterSampleUrl: 'https://picsum.photos/seed/fun_3d_cinema/800/800',
    promptExample: 'مجسمه ۳ بعدی فوتورئالیستی با رزولوشن 8K و افکت نور نئونی بنفش',
    badge: 'محبوب‌ترین',
    iconName: 'Cube',
    gradient: 'from-purple-500/20 to-indigo-600/30',
    productionWorkflowId: 'wf_3d_cinematic_avatar',
  },
  {
    onboardingTemplateId: 'anime_illustration',
    title: 'تصویرسازی انیمه و استیکر',
    tagline: 'طراحی استایلیش ژاپنی با رنگ‌های غنی و خطوط برداری',
    description: 'خلق کاراکتر انیمیشنی به سبک استودیو گیبلی با جزئیات نقاشی دیجیتال و پالت رنگی گرم.',
    previewAsset: 'https://picsum.photos/seed/fun_anime_art/800/800',
    beforeSampleUrl: 'https://picsum.photos/seed/fun_user_source/800/800',
    afterSampleUrl: 'https://picsum.photos/seed/fun_anime_art/800/800',
    promptExample: 'پرتره انیمه‌ای ظریف با بک‌گراند بارانی توکیو و رنگ‌های پاستلی',
    badge: 'ترند',
    iconName: 'PaintBrush',
    gradient: 'from-pink-500/20 to-rose-600/30',
    productionWorkflowId: 'wf_anime_stylize',
  },
  {
    onboardingTemplateId: 'cyber_avatar',
    title: 'آواتار سایبرپانک فوتورئال',
    tagline: 'نورپردازی نئونی استودیویی و گجت‌های هوشمند آینده',
    description: 'ترکیب تکنولوژی و سبک طراحی نئونی با نور بنفش و فیروزه‌ای مناسب عکس پروفایل و برند شخصی.',
    previewAsset: 'https://picsum.photos/seed/fun_cyberpunk/800/800',
    beforeSampleUrl: 'https://picsum.photos/seed/fun_user_source/800/800',
    afterSampleUrl: 'https://picsum.photos/seed/fun_cyberpunk/800/800',
    promptExample: 'آواتار هایپررئال با هودی مشکی، خطوط نئونی بنفش و عینک هولوگرافیک',
    badge: 'پروفایل حرفه‌ای',
    iconName: 'Lightning',
    gradient: 'from-cyan-500/20 to-purple-600/30',
    productionWorkflowId: 'wf_cyber_avatar_gen',
  },
];
