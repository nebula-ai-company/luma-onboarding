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
  OnboardingDestination,
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

  async loadProfile(_userId?: string): Promise<PersistedOnboardingProfile | null> {
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

  async loadProgress?(_userId?: string): Promise<PersistedOnboardingProgress | null> {
    return this.inFlightProgress;
  }

  async saveProgress(_userId: string, progress: PersistedOnboardingProgress): Promise<void> {
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

  async complete(_userId: string, profile: PersistedOnboardingProfile): Promise<void> {
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

  async updatePreferences(_userId: string, preferences: OnboardingPreferences): Promise<void> {
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

  async reset(_userId?: string): Promise<void> {
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

  private navigatePath(path: string) {
    if (this.routerPush) {
      this.routerPush(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  }

  navigate(destination: OnboardingDestination): void {
    switch (destination.type) {
      case 'dashboard':
        this.goToDashboard();
        break;
      case 'tool':
        this.goToTool(destination.toolId);
        break;
      case 'workflow':
        this.goToWorkflow(destination.workflowId);
        break;
      case 'files':
        this.goToFiles(destination.highlightAssetId);
        break;
      case 'assistant':
        this.goToAssistant();
        break;
      case 'developers':
        this.goToDevelopers();
        break;
      case 'billing':
        this.goToBilling();
        break;
    }
  }

  goToDashboard(): void {
    this.navigatePath('/dashboard');
  }

  goToTool(toolId: string): void {
    this.navigatePath(`/dashboard/tools/${encodeURIComponent(toolId)}?from=onboarding`);
  }

  goToFiles(highlightAssetId?: string): void {
    const query = highlightAssetId ? `?highlight=${encodeURIComponent(highlightAssetId)}` : '';
    this.navigatePath(`/dashboard/files${query}`);
  }

  goToWorkflow(templateId?: string): void {
    const query = templateId ? `?template=${encodeURIComponent(templateId)}` : '';
    this.navigatePath(`/dashboard/workflow${query}`);
  }

  goToAssistant(): void {
    this.navigatePath('/dashboard/assistant');
  }

  goToDevelopers(): void {
    this.navigatePath('/dashboard/developers');
  }

  goToBilling(): void {
    this.navigatePath('/dashboard/billing');
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
  private assetStore = new Map<string, { id: string; url: string; mimeType?: string; createdAt?: string }>();

  async upload(
    file: File,
    options?: {
      signal?: AbortSignal;
      onProgress?: (percent: number) => void;
    }
  ): Promise<UploadedAsset> {
    const id = `ast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const objectUrl = URL.createObjectURL(file);
    this.assetStore.set(id, {
      id,
      url: objectUrl,
      mimeType: file.type,
      createdAt: new Date().toISOString(),
    });
    if (options?.onProgress) {
      options.onProgress(100);
    }
    return {
      id,
      previewUrl: objectUrl,
      fileSizeBytes: file.size,
      mimeType: file.type,
    };
  }

  async getAsset(assetId: string) {
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
      'SERVICE_UNAVAILABLE',
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
