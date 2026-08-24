import type {
  LumaOnboardingIntegration,
  LumaOnboardingUser,
  UserIntegrationAdapter,
  OnboardingPersistenceAdapter,
  PersistedOnboardingProfile,
  PersistedOnboardingProgress,
  OnboardingPreferences,
  NavigationIntegrationAdapter,
  AnalyticsIntegrationAdapter,
  OnboardingAnalyticsEvent,
  AssetIntegrationAdapter,
  UploadedAsset,
  CreationIntegrationAdapter,
  CreationExecuteParams,
  CreationExecuteOptions,
  CreationJobResult,
  OnboardingFeatureFlags,
} from '../contracts';
import { DEFAULT_FEATURE_FLAGS } from '../constants';
import { createIntegrationError } from '../errors';

/**
 * Production User Adapter
 * Reads authenticated user profile and onboarding flag from real user endpoints.
 */
export class ProductionUserAdapter implements UserIntegrationAdapter {
  private cachedUser: LumaOnboardingUser | null = null;

  constructor(initialUser?: LumaOnboardingUser) {
    if (initialUser) {
      this.cachedUser = initialUser;
    }
  }

  async getCurrentUser(): Promise<LumaOnboardingUser | null> {
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/api/v1/user/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          this.cachedUser = data.user || null;
          return this.cachedUser;
        }
      }
      return this.cachedUser;
    } catch (err) {
      console.warn('[LUMA ProductionUserAdapter] Failed to fetch current user session:', err);
      return this.cachedUser;
    }
  }
}

/**
 * Production Persistence Adapter
 * Syncs in-flight progress and completed profile with real API endpoints.
 */
export class ProductionPersistenceAdapter implements OnboardingPersistenceAdapter {
  private fallbackCache: PersistedOnboardingProfile | null = null;
  private inFlightProgress: PersistedOnboardingProgress | null = null;

  async loadProfile(): Promise<PersistedOnboardingProfile | null> {
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/api/v1/onboarding/profile', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          this.fallbackCache = data;
          return data;
        }
      }
      return this.fallbackCache;
    } catch (err) {
      console.warn('[LUMA ProductionPersistenceAdapter] Load profile error:', err);
      return this.fallbackCache;
    }
  }

  async saveProgress(progress: PersistedOnboardingProgress): Promise<void> {
    this.inFlightProgress = progress;
    try {
      if (typeof window !== 'undefined') {
        await fetch('/api/v1/onboarding/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(progress),
        });
      }
    } catch (err) {
      console.warn('[LUMA ProductionPersistenceAdapter] Save progress error:', err);
    }
  }

  async complete(profile: PersistedOnboardingProfile): Promise<void> {
    this.fallbackCache = profile;
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/api/v1/onboarding/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
        });
        if (!res.ok) {
          throw new Error(`Failed to complete onboarding: status ${res.status}`);
        }
      }
    } catch (err) {
      console.error('[LUMA ProductionPersistenceAdapter] Complete onboarding error:', err);
      throw err;
    }
  }

  async updatePreferences(preferences: OnboardingPreferences): Promise<void> {
    if (this.fallbackCache) {
      this.fallbackCache.preferences = preferences;
      this.fallbackCache.lastCompletedAt = new Date().toISOString();
    }
    try {
      if (typeof window !== 'undefined') {
        await fetch('/api/v1/onboarding/preferences', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preferences),
        });
      }
    } catch (err) {
      console.warn('[LUMA ProductionPersistenceAdapter] Update preferences error:', err);
    }
  }

  async clear(): Promise<void> {
    this.fallbackCache = null;
    this.inFlightProgress = null;
    try {
      if (typeof window !== 'undefined') {
        await fetch('/api/v1/onboarding/reset', { method: 'POST' });
      }
    } catch (err) {
      console.warn('[LUMA ProductionPersistenceAdapter] Clear error:', err);
    }
  }
}

/**
 * Production Navigation Adapter
 * Uses Next.js App Router or standard window navigation.
 */
export class ProductionNavigationAdapter implements NavigationIntegrationAdapter {
  private routerPush?: (url: string) => void;

  constructor(customPush?: (url: string) => void) {
    this.routerPush = customPush;
  }

  setRouterPush(push: (url: string) => void) {
    this.routerPush = push;
  }

  private navigate(path: string) {
    if (this.routerPush) {
      this.routerPush(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  }

  goToDashboard(): void {
    this.navigate('/dashboard');
  }

  goToTool(toolId: string): void {
    this.navigate(`/dashboard/tools/${encodeURIComponent(toolId)}?from=onboarding`);
  }

  goToFiles(): void {
    this.navigate('/dashboard/files');
  }

  goToWorkflow(templateId?: string): void {
    const query = templateId ? `?template=${encodeURIComponent(templateId)}` : '';
    this.navigate(`/dashboard/workflow${query}`);
  }

  goToAssistant(): void {
    this.navigate('/dashboard/assistant');
  }

  goToDevelopers(): void {
    this.navigate('/dashboard/developers');
  }

  goToBilling(): void {
    this.navigate('/dashboard/billing');
  }
}

/**
 * Production Analytics Adapter
 * Structured telemetry emitter for onboarding funnel events.
 */
export class ProductionAnalyticsAdapter implements AnalyticsIntegrationAdapter {
  track(event: OnboardingAnalyticsEvent, payload?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    if (typeof window !== 'undefined') {
      // Structured logging for production observability
      console.info(`[LUMA Analytics] ${event}`, {
        event,
        payload,
        timestamp,
        url: window.location.pathname,
      });

      // Dispatch custom browser event for micro-frontend / tag managers
      window.dispatchEvent(
        new CustomEvent('luma:onboarding:analytics', {
          detail: { event, payload, timestamp },
        })
      );
    }
  }
}

/**
 * Production Asset Adapter
 */
export class ProductionAssetAdapter implements AssetIntegrationAdapter {
  private assetStore = new Map<string, UploadedAsset>();

  async upload(file: File): Promise<UploadedAsset> {
    const assetId = `ast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const objectUrl = URL.createObjectURL(file);
    const asset: UploadedAsset = {
      assetId,
      url: objectUrl,
      fileName: file.name,
      fileSizeBytes: file.size,
      mimeType: file.type,
      createdAt: new Date().toISOString(),
    };
    this.assetStore.set(assetId, asset);
    return asset;
  }

  async getAsset(assetId: string): Promise<UploadedAsset | null> {
    return this.assetStore.get(assetId) || null;
  }
}

/**
 * Production Creation Adapter (Phase 10A Safe Foundation)
 * Generation is decoupled until Phase 10B.
 */
export class ProductionCreationAdapter implements CreationIntegrationAdapter {
  public readonly isSimulation = false;

  async create(
    params: CreationExecuteParams,
    options?: CreationExecuteOptions
  ): Promise<CreationJobResult> {
    throw createIntegrationError(
      'CREATION_QUOTA_EXCEEDED',
      'تولید هوش مصنوعی در این مرحله از طریق صفحه اختصاصی ابزار انجام می‌شود.'
    );
  }
}

/**
 * Factory for complete production integration bundle
 */
export function createProductionIntegration(
  overrides?: Partial<LumaOnboardingIntegration>,
  routerPush?: (url: string) => void
): LumaOnboardingIntegration {
  return {
    environment: 'production',
    featureFlags: {
      ...DEFAULT_FEATURE_FLAGS,
      ...overrides?.featureFlags,
    },
    user: overrides?.user || new ProductionUserAdapter(),
    persistence: overrides?.persistence || new ProductionPersistenceAdapter(),
    navigation: overrides?.navigation || new ProductionNavigationAdapter(routerPush),
    analytics: overrides?.analytics || new ProductionAnalyticsAdapter(),
    assets: overrides?.assets || new ProductionAssetAdapter(),
    creation: overrides?.creation || new ProductionCreationAdapter(),
  };
}
