import type {
  LumaOnboardingIntegration,
  LumaOnboardingUser,
  UserIntegrationAdapter,
  OnboardingPersistenceAdapter,
  PersistedOnboardingProfile,
  PersistedOnboardingProgress,
  OnboardingPreferences,
  OnboardingCreationAdapter,
  OnboardingCreationRequest,
  OnboardingCreationResult,
  CreationSemanticStatus,
  AssetIntegrationAdapter,
  UploadedAsset,
  AssetReference,
  NavigationIntegrationAdapter,
  OnboardingDestination,
  AnalyticsIntegrationAdapter,
  OnboardingAnalyticsEvent,
} from '../contracts';
import { ONBOARDING_SCHEMA_VERSION, DEFAULT_FEATURE_FLAGS } from '../constants';
import { migrateOnboardingProfile } from '../validation';

const DEV_STORAGE_KEY_PREFIX = 'luma_onboarding_dev_';

// ============================================================================
// 1. DEVELOPMENT USER ADAPTER
// ============================================================================

export class DevelopmentUserAdapter implements UserIntegrationAdapter {
  private user: LumaOnboardingUser;

  constructor(user?: Partial<LumaOnboardingUser>) {
    this.user = {
      id: user?.id || 'demo_user_1',
      displayName: user?.displayName || 'کاربر دمو لوما',
      email: user?.email || 'user@luma.ir',
      avatarUrl: user?.avatarUrl,
    };
  }

  async getCurrentUser(): Promise<LumaOnboardingUser | null> {
    return this.user;
  }
}

// ============================================================================
// 2. DEVELOPMENT PERSISTENCE ADAPTER (LocalStorage)
// ============================================================================

export class DevelopmentPersistenceAdapter implements OnboardingPersistenceAdapter {
  private getStorageKey(userId: string): string {
    return `${DEV_STORAGE_KEY_PREFIX}${userId}`;
  }

  async loadProfile(userId: string): Promise<PersistedOnboardingProfile | null> {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(this.getStorageKey(userId));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return migrateOnboardingProfile(parsed);
    } catch (err) {
      console.warn('[DevelopmentPersistenceAdapter] Failed to read from localStorage:', err);
      return null;
    }
  }

  async saveProgress(userId: string, progress: PersistedOnboardingProgress): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const key = `${this.getStorageKey(userId)}_progress`;
      localStorage.setItem(key, JSON.stringify(progress));
    } catch (err) {
      console.warn('[DevelopmentPersistenceAdapter] Failed to save progress:', err);
    }
  }

  async complete(userId: string, profile: PersistedOnboardingProfile): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(profile));
    } catch (err) {
      console.warn('[DevelopmentPersistenceAdapter] Failed to save completed profile:', err);
    }
  }

  async updatePreferences(userId: string, preferences: OnboardingPreferences): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const existing = await this.loadProfile(userId);
      if (existing) {
        existing.preferences = preferences;
        existing.lastCompletedAt = new Date().toISOString();
        await this.complete(userId, existing);
      }
    } catch (err) {
      console.warn('[DevelopmentPersistenceAdapter] Failed to update preferences:', err);
    }
  }
}

// ============================================================================
// 3. DEVELOPMENT ASSET ADAPTER
// ============================================================================

export class DevelopmentAssetAdapter implements AssetIntegrationAdapter {
  private inMemoryAssets = new Map<string, AssetReference>();

  async upload(
    file: File,
    options?: {
      signal?: AbortSignal;
      onProgress?: (percent: number) => void;
    }
  ): Promise<UploadedAsset> {
    const assetId = `dev_asset_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    // Simulate progress
    for (let p = 20; p <= 100; p += 25) {
      if (options?.signal?.aborted) {
        throw new Error('Upload aborted by user');
      }
      options?.onProgress?.(p);
      await new Promise((r) => setTimeout(r, 100));
    }

    const previewUrl = URL.createObjectURL(file);
    const assetRef: AssetReference = {
      id: assetId,
      url: previewUrl,
      mimeType: file.type,
      createdAt: new Date().toISOString(),
    };

    this.inMemoryAssets.set(assetId, assetRef);

    return {
      id: assetId,
      previewUrl,
      fileSizeBytes: file.size,
      mimeType: file.type,
    };
  }

  async getAsset(assetId: string): Promise<AssetReference | null> {
    return this.inMemoryAssets.get(assetId) || null;
  }
}

// ============================================================================
// 4. DEVELOPMENT CREATION ADAPTER (Simulation)
// ============================================================================

export class DevelopmentCreationAdapter implements OnboardingCreationAdapter {
  readonly isSimulation = true;

  async create(
    request: OnboardingCreationRequest,
    options?: {
      signal?: AbortSignal;
      onStatus?: (
        status: CreationSemanticStatus,
        message?: string,
        progressPercent?: number
      ) => void;
    }
  ): Promise<OnboardingCreationResult> {
    const { onStatus, signal } = options || {};

    const steps: { status: CreationSemanticStatus; msg: string; percent: number; delay: number }[] = [
      { status: 'analyzing', msg: 'تحلیل پرامپت و انتخاب مدل بهینه...', percent: 15, delay: 500 },
      { status: 'uploading', msg: 'آماده‌سازی ورودی و ارسال به موتور رندر...', percent: 35, delay: 600 },
      { status: 'processing', msg: 'پردازش نور، بافت و جزئیات با هوش مصنوعی...', percent: 70, delay: 900 },
      { status: 'finalizing', msg: 'بهینه‌سازی رزولوشن و آماده‌سازی فایل نهایی...', percent: 95, delay: 600 },
    ];

    for (const step of steps) {
      if (signal?.aborted) {
        return {
          success: false,
          errorCode: 'UNKNOWN',
          errorMessage: 'عملیات توسط کاربر متوقف شد.',
        };
      }
      onStatus?.(step.status, step.msg, step.percent);
      await new Promise((resolve) => setTimeout(resolve, step.delay));
    }

    onStatus?.('completed', 'تولید با موفقیت به پایان رسید!', 100);

    const assetId = `dev_gen_asset_${Date.now()}`;
    const isFun = request.mode === 'fun';

    if (isFun) {
      const templateId = request.workflowTemplateId || 'cinematic_3d';
      let outputUrl = 'https://picsum.photos/seed/fun_3d_cinema/1000/1000';
      let title = 'خروجی کاراکتر ۳ بعدی سینمایی';

      if (templateId === 'anime_illustration') {
        outputUrl = 'https://picsum.photos/seed/fun_anime_art/1000/1000';
        title = 'خروجی تصویرسازی انیمه';
      } else if (templateId === 'cyber_avatar') {
        outputUrl = 'https://picsum.photos/seed/fun_cyberpunk/1000/1000';
        title = 'خروجی آواتار سایبرپانک';
      }

      return {
        success: true,
        jobId: `job_${Date.now()}`,
        assetId,
        outputType: 'image',
        outputUrl,
        beforeImageUrl: 'https://picsum.photos/seed/fun_user_source/800/800',
        afterImageUrl: outputUrl,
        title,
        dimensions: '2048 x 2048',
        generationTimeSeconds: 2.6,
        estimatedCostLum: 4,
      };
    }

    // Recommended Tool Creation
    const toolId = request.toolId;
    let outputUrl = 'https://picsum.photos/seed/tool_recommended_result/1200/800';
    let outputType: 'image' | 'video' | 'audio' | 'text' = 'image';
    let title = 'خروجی استودیویی هوش مصنوعی';

    if (toolId.includes('video')) {
      outputType = 'video';
      title = 'ویدیو متحرک باکیفیت 4K';
    } else if (toolId.includes('speech') || toolId.includes('voice')) {
      outputType = 'audio';
      title = 'فایل صوتی دوبله هوشمند';
    }

    return {
      success: true,
      jobId: `job_${Date.now()}`,
      assetId,
      outputType,
      outputUrl,
      title,
      aspectRatio: '16:9',
      dimensions: '1920 x 1080',
      fileSizeBytes: 2450000,
      generationTimeSeconds: 2.8,
      estimatedCostLum: 3,
    };
  }

  isWorkflowAvailable(): boolean {
    return true;
  }
}

// ============================================================================
// 5. DEVELOPMENT NAVIGATION ADAPTER
// ============================================================================

export class DevelopmentNavigationAdapter implements NavigationIntegrationAdapter {
  private onNavigateCallback?: (destination: OnboardingDestination) => void;

  constructor(onNavigate?: (destination: OnboardingDestination) => void) {
    this.onNavigateCallback = onNavigate;
  }

  navigate(destination: OnboardingDestination): void {
    if (this.onNavigateCallback) {
      this.onNavigateCallback(destination);
    } else {
      console.log('[DevelopmentNavigationAdapter] Navigated to:', destination);
    }
  }

  goToDashboard(): void {
    this.navigate({ type: 'dashboard' });
  }

  goToTool(toolId: string): void {
    this.navigate({ type: 'tool', toolId });
  }

  goToFiles(highlightAssetId?: string): void {
    this.navigate({ type: 'files', highlightAssetId });
  }

  goToWorkflow(workflowId?: string): void {
    this.navigate({ type: 'workflow', workflowId });
  }

  goToAssistant(): void {
    this.navigate({ type: 'assistant' });
  }

  goToDevelopers(): void {
    this.navigate({ type: 'developers' });
  }

  goToBilling(): void {
    this.navigate({ type: 'billing' });
  }
}

// ============================================================================
// 6. DEVELOPMENT ANALYTICS ADAPTER
// ============================================================================

export class DevelopmentAnalyticsAdapter implements AnalyticsIntegrationAdapter {
  track(event: OnboardingAnalyticsEvent, properties?: Record<string, unknown>): void {
    // Isolated safe logging in dev
    if (process.env.NODE_ENV !== 'test') {
      console.debug(`[Analytics] ${event}`, properties || {});
    }
  }
}

// ============================================================================
// 7. FACTORY
// ============================================================================

export function createDevelopmentIntegration(
  overrides?: Partial<LumaOnboardingIntegration>
): LumaOnboardingIntegration {
  return {
    user: overrides?.user || new DevelopmentUserAdapter(),
    persistence: overrides?.persistence || new DevelopmentPersistenceAdapter(),
    creation: overrides?.creation || new DevelopmentCreationAdapter(),
    assets: overrides?.assets || new DevelopmentAssetAdapter(),
    navigation: overrides?.navigation || new DevelopmentNavigationAdapter(),
    analytics: overrides?.analytics || new DevelopmentAnalyticsAdapter(),
    featureFlags: {
      ...DEFAULT_FEATURE_FLAGS,
      ...(overrides?.featureFlags || {}),
    },
    environment: overrides?.environment || 'development',
  };
}
