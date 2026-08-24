/**
 * Metrics Aggregation and Telemetry for LUMA Onboarding Phase 11 Experimentation
 */

export interface FunnelStageData {
  id: string;
  name: string;
  treatmentCount: number;
  treatmentPercent: number;
  controlCount?: number;
  controlPercent?: number;
  dropOffRate?: number;
}

export interface ProfessionMetrics {
  id: string;
  name: string;
  userCount: number;
  completionRate: number;
  firstCreationRate: number;
  successRate: number;
  medianTimeToResultSec: number;
  skipRate: number;
}

export interface ToolEffectivenessMetrics {
  toolId: string;
  name: string;
  category: string;
  recommendedCount: number;
  openedCount: number;
  generationStartedCount: number;
  generationSucceededCount: number;
  conversionRate: number;
}

export interface GuardrailMetricItem {
  metric: string;
  target: string;
  currentValue: number | string;
  status: 'healthy' | 'warning' | 'critical';
  details: string;
}

export interface SupportTicketCategory {
  category: 'ONBOARDING' | 'ONBOARDING_GENERATION' | 'ONBOARDING_BILLING' | 'ONBOARDING_UPLOAD';
  name: string;
  count: number;
  percentage: number;
  sampleComplaint: string;
  status: 'monitoring' | 'resolved';
}

export interface RolloutReportData {
  period: string;
  experimentId: string;
  currentStage: string;
  rolloutPercentage: number;
  totalEligibleNewUsers: number;
  treatmentCohortSize: number;
  controlCohortSize: number;
  
  // Primary Metrics
  primaryActivation: {
    treatmentSuccessRate: number; // e.g. 48.6%
    controlSuccessRate: number; // e.g. 29.4%
    lift: number; // +65.3%
    statisticalSignificance: number; // 99.4%
  };
  timeToFirstResult: {
    treatmentMedianSec: number; // e.g. 138s
    controlMedianSec: number; // e.g. 472s
    reductionPercent: number; // -70.7% faster
  };

  // Secondary Product Metrics
  treatmentMetrics: {
    completionRate: number;
    skipRate: number;
    firstCreationStartRate: number;
    firstCreationSuccessRate: number;
    recommendationAcceptanceRate: number;
    medianOnboardingDurationSec: number;
    secondGenerationRate: number;
    d1RetentionRate: number;
    d7RetentionRate: number;
    firstPurchaseRate: number;
    avgPurchaseLUM: number;
  };

  controlMetrics: {
    dashboardToToolRate: number;
    firstCreationStartRate: number;
    firstCreationSuccessRate: number;
    secondGenerationRate: number;
    d1RetentionRate: number;
    d7RetentionRate: number;
    firstPurchaseRate: number;
    avgPurchaseLUM: number;
  };

  // Funnel Data
  treatmentFunnel: FunnelStageData[];
  controlFunnel: FunnelStageData[];

  // Skip Location Breakdown
  skipBreakdown: { location: string; name: string; count: number; percentage: number }[];

  // Guardrails
  guardrails: GuardrailMetricItem[];

  // Billing Telemetry
  billingTelemetry: {
    onboardingCreationStarted: number;
    lumChargedEvents: number;
    generationJobsCreated: number;
    duplicateCharges: number;
    anomaliesDetected: number;
    billingIntegrityStatus: '100% Verified' | 'Anomaly Detected';
  };

  // Profession Analysis
  professionBreakdown: ProfessionMetrics[];

  // Tool Recommendation Effectiveness
  toolEffectiveness: ToolEffectivenessMetrics[];

  // Support Feedback Monitoring
  supportCategories: SupportTicketCategory[];

  // Generation Latency by Media Type
  latencyByMediaType: {
    type: string;
    avgLatencySec: number;
    medianLatencySec: number;
    abandonmentWhileWaitingRate: number;
  }[];
}

export const INITIAL_ROLLOUT_REPORT: RolloutReportData = {
  period: 'آخرین ۷ روز پایش آزمایشی',
  experimentId: 'new-user-onboarding-v1',
  currentStage: 'STAGE_0_INTERNAL',
  rolloutPercentage: 0,
  totalEligibleNewUsers: 1420,
  treatmentCohortSize: 710,
  controlCohortSize: 710,

  primaryActivation: {
    treatmentSuccessRate: 48.6,
    controlSuccessRate: 29.4,
    lift: 65.3,
    statisticalSignificance: 99.4,
  },
  timeToFirstResult: {
    treatmentMedianSec: 138,
    controlMedianSec: 472,
    reductionPercent: 70.7,
  },

  treatmentMetrics: {
    completionRate: 84.2,
    skipRate: 15.8,
    firstCreationStartRate: 72.4,
    firstCreationSuccessRate: 94.8,
    recommendationAcceptanceRate: 68.7,
    medianOnboardingDurationSec: 84,
    secondGenerationRate: 38.2,
    d1RetentionRate: 44.1,
    d7RetentionRate: 29.8,
    firstPurchaseRate: 14.6,
    avgPurchaseLUM: 120,
  },

  controlMetrics: {
    dashboardToToolRate: 42.1,
    firstCreationStartRate: 33.8,
    firstCreationSuccessRate: 87.0,
    secondGenerationRate: 18.5,
    d1RetentionRate: 26.3,
    d7RetentionRate: 16.4,
    firstPurchaseRate: 8.2,
    avgPurchaseLUM: 95,
  },

  treatmentFunnel: [
    { id: '1_eligible', name: 'کاربران جدید واجد شرایط', treatmentCount: 710, treatmentPercent: 100, dropOffRate: 0 },
    { id: '2_started', name: 'ورود به صفحه آنبوردینگ', treatmentCount: 702, treatmentPercent: 98.8, dropOffRate: 1.2 },
    { id: '3_profession', name: 'انتخاب تخصص و حوزه کاری', treatmentCount: 674, treatmentPercent: 94.9, dropOffRate: 3.9 },
    { id: '4_interests', name: 'انتخاب علایق و ابزارها', treatmentCount: 651, treatmentPercent: 91.7, dropOffRate: 3.4 },
    { id: '5_intro', name: 'مشاهده معرفی اکوسیستم لوما', treatmentCount: 629, treatmentPercent: 88.6, dropOffRate: 3.4 },
    { id: '6_recommendation', name: 'مشاهده ابزار پیشنهادی لوما', treatmentCount: 618, treatmentPercent: 87.0, dropOffRate: 1.8 },
    { id: '7_creation_start', name: 'شروع اولین تولید هوش مصنوعی', treatmentCount: 514, treatmentPercent: 72.4, dropOffRate: 16.8 },
    { id: '8_creation_success', name: 'موفقیت در تولید اولین خروجی', treatmentCount: 487, treatmentPercent: 68.6, dropOffRate: 5.2 },
    { id: '9_completed', name: 'تکمیل نهایی و ورود به میز کار', treatmentCount: 598, treatmentPercent: 84.2, dropOffRate: 0 },
  ],

  controlFunnel: [
    { id: 'c1_eligible', name: 'کاربران جدید واجد شرایط', controlCount: 710, controlPercent: 100, treatmentCount: 710, treatmentPercent: 100 },
    { id: 'c2_dashboard', name: 'ورود مستقیم به میز کار', controlCount: 710, controlPercent: 100, treatmentCount: 702, treatmentPercent: 98.8 },
    { id: 'c3_tool_open', name: 'کلیک و بازکردن یکی از ابزارها', controlCount: 299, controlPercent: 42.1, treatmentCount: 618, treatmentPercent: 87.0 },
    { id: 'c4_creation_start', name: 'ثبت پرامپت / آپلود برای ساخت', controlCount: 240, controlPercent: 33.8, treatmentCount: 514, treatmentPercent: 72.4 },
    { id: 'c5_creation_success', name: 'دریافت اولین خروجی موفق هوش مصنوعی', controlCount: 209, controlPercent: 29.4, treatmentCount: 487, treatmentPercent: 68.6 },
  ],

  skipBreakdown: [
    { location: 'skip_from_welcome', name: 'صفحه خوش‌آمدگویی اولیه', count: 8, percentage: 7.1 },
    { location: 'skip_from_profession', name: 'صفحه انتخاب تخصص', count: 23, percentage: 20.5 },
    { location: 'skip_from_interests', name: 'صفحه انتخاب علایق', count: 18, percentage: 16.1 },
    { location: 'skip_from_intro', name: 'صفحه معرفی اکوسیستم', count: 11, percentage: 9.8 },
    { location: 'skip_from_recommendation', name: 'صفحه ابزار پیشنهادی', count: 32, percentage: 28.6 },
    { location: 'skip_from_creation', name: 'صفحه تجربه ساخت اولیه', count: 20, percentage: 17.9 },
  ],

  guardrails: [
    {
      metric: 'نرخ خطای فرانت‌اند (Frontend JS Errors)',
      target: '< ۰.۲٪',
      currentValue: '۰.۰۴٪',
      status: 'healthy',
      details: 'عدم ثبت ارورهای کرش یا انسداد رندر کامپوننت‌ها',
    },
    {
      metric: 'عدم تکرار درخواست تولید (Duplicate Job Requests)',
      target: '۰ مورد',
      currentValue: '۰',
      status: 'healthy',
      details: 'مکانیزم Idempotency کلاینت از ثبت دوباره تسک در کلیک‌های پیاپی جلوگیری کرده است.',
    },
    {
      metric: 'صحت کسر اعتبار (Billing Deduction Anomalies)',
      target: '۰ ناهماهنگی',
      currentValue: '۰',
      status: 'healthy',
      details: 'تطابق ۱۰۰ درصدی بین رویداد کسر اعتبار و ایجاد تسک سرور.',
    },
    {
      metric: 'لوپ‌های هدایت روت (Navigation Redirect Loops)',
      target: '۰ مورد',
      currentValue: '۰',
      status: 'healthy',
      details: 'گارد روت‌ها و مقادیر Fallback انتقال سالم به میز کار را تضمین می‌کنند.',
    },
    {
      metric: 'نرخ شکست آپلود فایل (Upload Failures)',
      target: '< ۱.۵٪',
      currentValue: '۰.۳٪',
      status: 'healthy',
      details: 'پردازش فرمت‌های تصویری WebP، PNG و JPEG در محدوده مجاز.',
    },
    {
      metric: 'پایداری اجرای ورک‌فلوهای سرور (Workflow Engine)',
      target: '> ۹۶٪',
      currentValue: '۹۷.۸٪',
      status: 'healthy',
      details: 'تمام تمپلیت‌های ۳ بعدی و انیمه با موفقیت در صف اجرا شدند.',
    },
  ],

  billingTelemetry: {
    onboardingCreationStarted: 514,
    lumChargedEvents: 514,
    generationJobsCreated: 514,
    duplicateCharges: 0,
    anomaliesDetected: 0,
    billingIntegrityStatus: '100% Verified',
  },

  professionBreakdown: [
    {
      id: 'content_creator',
      name: 'تولیدکننده محتوا و شبکه‌های اجتماعی',
      userCount: 248,
      completionRate: 88.3,
      firstCreationRate: 79.4,
      successRate: 96.2,
      medianTimeToResultSec: 112,
      skipRate: 11.7,
    },
    {
      id: 'designer',
      name: 'طراح گرافیک و هویت بصری',
      userCount: 165,
      completionRate: 85.4,
      firstCreationRate: 75.1,
      successRate: 95.0,
      medianTimeToResultSec: 124,
      skipRate: 14.6,
    },
    {
      id: 'ecommerce',
      name: 'فروشگاه اینترنتی و عکاسی محصول',
      userCount: 122,
      completionRate: 86.8,
      firstCreationRate: 74.5,
      successRate: 93.8,
      medianTimeToResultSec: 146,
      skipRate: 13.2,
    },
    {
      id: 'marketing',
      name: 'بازاریابی دیجیتال و تبلیغات',
      userCount: 89,
      completionRate: 81.0,
      firstCreationRate: 67.4,
      successRate: 92.1,
      medianTimeToResultSec: 155,
      skipRate: 19.0,
    },
    {
      id: 'developer',
      name: 'برنامه‌نویس و توسعه‌دهنده API',
      userCount: 48,
      completionRate: 75.0,
      firstCreationRate: 58.3,
      successRate: 96.4,
      medianTimeToResultSec: 180,
      skipRate: 25.0,
    },
    {
      id: 'other',
      name: 'سایر تخصص‌ها و کاوش عمومی',
      userCount: 38,
      completionRate: 73.6,
      firstCreationRate: 52.6,
      successRate: 90.0,
      medianTimeToResultSec: 195,
      skipRate: 26.4,
    },
  ],

  toolEffectiveness: [
    {
      toolId: 'generate-image',
      name: 'تولید تصویر از متن (Studio Gen)',
      category: 'تصویر',
      recommendedCount: 312,
      openedCount: 268,
      generationStartedCount: 236,
      generationSucceededCount: 228,
      conversionRate: 73.1,
    },
    {
      toolId: 'remove-background',
      name: 'حذف پس‌زمینه هوشمند (Magic Cut)',
      category: 'ویرایش',
      recommendedCount: 145,
      openedCount: 124,
      generationStartedCount: 110,
      generationSucceededCount: 106,
      conversionRate: 73.1,
    },
    {
      toolId: 'image-to-video',
      name: 'تبدیل تصویر به ویدیو (Motion AI)',
      category: 'ویدیو',
      recommendedCount: 98,
      openedCount: 81,
      generationStartedCount: 68,
      generationSucceededCount: 62,
      conversionRate: 63.3,
    },
    {
      toolId: 'fun_cinematic_3d',
      name: 'ورک‌فلو مجسمه ۳ بعدی (Fun Mode)',
      category: 'ورک‌فلو',
      recommendedCount: 85,
      openedCount: 78,
      generationStartedCount: 64,
      generationSucceededCount: 61,
      conversionRate: 71.8,
    },
    {
      toolId: 'text-to-speech',
      name: 'تبدیل متن به گفتار و دوبله',
      category: 'صدا',
      recommendedCount: 42,
      openedCount: 32,
      generationStartedCount: 24,
      generationSucceededCount: 23,
      conversionRate: 54.8,
    },
  ],

  supportCategories: [
    {
      category: 'ONBOARDING',
      name: 'ابهام در مراحل یا نیاز به راهنمایی رابط',
      count: 7,
      percentage: 38.8,
      sampleComplaint: 'کاربر سوال داشت که بعد از انتخاب علایق آیا امکان تغییر آن در آینده وجود دارد؟',
      status: 'resolved',
    },
    {
      category: 'ONBOARDING_GENERATION',
      name: 'تاخیر در تکمیل یا پرامپت‌های پیچیده',
      count: 5,
      percentage: 27.7,
      sampleComplaint: 'مدت انتظار در ساخت ویدیو ۱۰ ثانیه طول کشید و کاربر فکر کرد سیستم متوقف شده است.',
      status: 'monitoring',
    },
    {
      category: 'ONBOARDING_BILLING',
      name: 'استعلام هدیه خوش‌آمدگویی ۲۰ لوم',
      count: 4,
      percentage: 22.2,
      sampleComplaint: 'کاربر سوال داشت آیا ۵ لوم استفاده شده در آنبوردینگ از اعتبار هدیه کسر می‌شود یا رایگان است.',
      status: 'resolved',
    },
    {
      category: 'ONBOARDING_UPLOAD',
      name: 'محدودیت حجم فایل یا فرمت نامعتبر',
      count: 2,
      percentage: 11.1,
      sampleComplaint: 'تلاش برای آپلود فایل با فرمت BMP پشتیبانی‌نشده.',
      status: 'resolved',
    },
  ],

  latencyByMediaType: [
    {
      type: 'تولید تصویر از متن (Image Gen)',
      avgLatencySec: 3.8,
      medianLatencySec: 3.4,
      abandonmentWhileWaitingRate: 0.8,
    },
    {
      type: 'حذف بک‌گراند و ادیت (Image Edit)',
      avgLatencySec: 2.1,
      medianLatencySec: 1.9,
      abandonmentWhileWaitingRate: 0.4,
    },
    {
      type: 'ورک‌فلو هوشمند انیمه / سه‌بعدی',
      avgLatencySec: 4.6,
      medianLatencySec: 4.2,
      abandonmentWhileWaitingRate: 1.1,
    },
    {
      type: 'تولید ویدیو از تصویر (Video Gen)',
      avgLatencySec: 14.2,
      medianLatencySec: 12.8,
      abandonmentWhileWaitingRate: 4.6,
    },
  ],
};
