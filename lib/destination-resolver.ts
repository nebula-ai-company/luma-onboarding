import type {
  OnboardingState,
  LumaSectionId,
} from '@/types/onboarding';
import type { CreationResultData } from '@/lib/creation-adapter';

export interface OnboardingDestination {
  targetSection: LumaSectionId;
  targetToolId: string | null;
  route: string;
  reasonPersian: string;
  activeAsset: CreationResultData | null;
  recommendedNextActions: {
    id: string;
    label: string;
    toolId?: string;
    sectionId?: LumaSectionId;
    iconName: string;
  }[];
}

/**
 * Pure destination resolver that computes the user's landing location,
 * active contextual assets, and personalized primary action in LUMA workspace.
 */
export function resolveOnboardingDestination(state: OnboardingState): OnboardingDestination {
  const hasResult = Boolean(state.firstCreationResult);
  const result = state.firstCreationResult as CreationResultData | null;
  const activeToolId = state.firstCreationTool || state.selectedRecommendedTool || state.toolRecommendations[0]?.id || 'generate-image';

  // Pathway 1: User created a first result
  if (hasResult && result) {
    const nextActions = [];

    if (result.imageUrl && !result.videoUrl) {
      nextActions.push(
        {
          id: 'action-animate',
          label: 'متحرک‌سازی و تبدیل به ویدیو',
          toolId: 'image-to-video',
          sectionId: 'ai_tools' as LumaSectionId,
          iconName: 'Play',
        },
        {
          id: 'action-upscale',
          label: 'افزایش کیفیت به 4K',
          toolId: 'upscale',
          sectionId: 'ai_tools' as LumaSectionId,
          iconName: 'Sparkle',
        },
        {
          id: 'action-edit',
          label: 'ویرایش نور و پس‌زمینه',
          toolId: 'edit-image',
          sectionId: 'ai_tools' as LumaSectionId,
          iconName: 'PaintBrush',
        }
      );
    } else if (result.videoUrl) {
      nextActions.push(
        {
          id: 'action-workflow',
          label: 'افزودن به ورک‌فلو محتوا',
          sectionId: 'workflow' as LumaSectionId,
          iconName: 'CirclesThreePlus',
        },
        {
          id: 'action-download',
          label: 'دانلود ویدیو HD',
          sectionId: 'my_files' as LumaSectionId,
          iconName: 'DownloadSimple',
        }
      );
    } else {
      nextActions.push(
        {
          id: 'action-chat-continue',
          label: 'ادامه گفت‌وگو و تولید تکمیلی',
          sectionId: 'ai_chat' as LumaSectionId,
          iconName: 'ChatCircleDots',
        }
      );
    }

    return {
      targetSection: 'ai_tools',
      targetToolId: activeToolId,
      route: `/tools/${activeToolId}`,
      reasonPersian: 'خروجی اولیه شما در «فایل‌های من» ذخیره شد و ابزار فعال برای کارهای بعدی در دسترس است.',
      activeAsset: result,
      recommendedNextActions: nextActions,
    };
  }

  // Pathway 2: User completed personalization questionnaire (without creation)
  if (state.onboardingCompleted && !state.isSkipped) {
    const primarySection = state.primarySections[0] || 'ai_tools';
    const topTool = state.toolRecommendations[0]?.id || 'generate-image';

    return {
      targetSection: primarySection,
      targetToolId: topTool,
      route: `/tools/${topTool}`,
      reasonPersian: 'بر اساس تخصص و علایق شما، ابزارهای پیشنهادی در اولویت دسترسی داشبورد شما قرار گرفتند.',
      activeAsset: null,
      recommendedNextActions: [
        {
          id: 'action-start-top-tool',
          label: 'شروع کار با ابزار پیشنهادی اول',
          toolId: topTool,
          sectionId: 'ai_tools' as LumaSectionId,
          iconName: 'MagicWand',
        },
        {
          id: 'action-explore-chat',
          label: 'گفت‌وگو با مدل‌های هوش مصنوعی',
          sectionId: 'ai_chat' as LumaSectionId,
          iconName: 'ChatCircleDots',
        },
        {
          id: 'action-explore-workflows',
          label: 'بررسی ورک‌فلوهای آماده',
          sectionId: 'workflow' as LumaSectionId,
          iconName: 'CirclesThreePlus',
        },
      ],
    };
  }

  // Pathway 3: User skipped onboarding
  return {
    targetSection: 'ai_tools',
    targetToolId: null,
    route: '/workspace',
    reasonPersian: 'فضای کاربری استاندارد لوما با دسترسی به تمام ابزارها و مدل‌های هوش مصنوعی آماده است.',
    activeAsset: null,
    recommendedNextActions: [
      {
        id: 'action-browse-tools',
        label: 'مشاهده تمام ابزارهای هوش مصنوعی',
        sectionId: 'ai_tools' as LumaSectionId,
        iconName: 'MagicWand',
      },
      {
        id: 'action-new-chat',
        label: 'شروع چت هوشمند',
        sectionId: 'ai_chat' as LumaSectionId,
        iconName: 'ChatCircleDots',
      },
    ],
  };
}
