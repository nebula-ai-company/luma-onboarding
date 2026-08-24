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
  AssetIntegrationAdapter,
  UploadedAsset,
  AssetReference,
  NavigationIntegrationAdapter,
  OnboardingDestination,
  AnalyticsIntegrationAdapter,
  OnboardingAnalyticsEvent,
} from '../contracts';
import { createIntegrationError } from '../errors';

/**
 * Production-ready User Adapter connecting to LUMA Auth
 */
export class ProductionUserAdapter implements UserIntegrationAdapter {
  constructor(private fetchUserFn?: () => Promise<LumaOnboardingUser | null>) {}

  async getCurrentUser(): Promise<LumaOnboardingUser | null> {
    if (this.fetchUserFn) {
      return this.fetchUserFn();
    }
    // Fallback or API endpoint implementation
    return null;
  }
}

/**
 * Production Persistence Adapter connecting to LUMA Backend API
 */
export class ProductionPersistenceAdapter implements OnboardingPersistenceAdapter {
  constructor(private apiBaseUrl: string = '/api/v1/onboarding') {}

  async loadProfile(userId: string): Promise<PersistedOnboardingProfile | null> {
    try {
      const res = await fetch(`${this.apiBaseUrl}/profile?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`Failed to load onboarding profile: ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      console.error('[ProductionPersistenceAdapter] loadProfile error:', err);
      throw createIntegrationError('PERSISTENCE_FAILED', err);
    }
  }

  async saveProgress(userId: string, progress: PersistedOnboardingProgress): Promise<void> {
    try {
      const res = await fetch(`${this.apiBaseUrl}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, progress }),
      });
      if (!res.ok) {
        throw new Error(`Failed to save onboarding progress: ${res.statusText}`);
      }
    } catch (err) {
      console.error('[ProductionPersistenceAdapter] saveProgress error:', err);
      throw createIntegrationError('PERSISTENCE_FAILED', err);
    }
  }

  async complete(userId: string, profile: PersistedOnboardingProfile): Promise<void> {
    try {
      const res = await fetch(`${this.apiBaseUrl}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, profile }),
      });
      if (!res.ok) {
        throw new Error(`Failed to complete onboarding: ${res.statusText}`);
      }
    } catch (err) {
      console.error('[ProductionPersistenceAdapter] complete error:', err);
      throw createIntegrationError('PERSISTENCE_FAILED', err);
    }
  }

  async updatePreferences(userId: string, preferences: OnboardingPreferences): Promise<void> {
    try {
      const res = await fetch(`${this.apiBaseUrl}/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, preferences }),
      });
      if (!res.ok) {
        throw new Error(`Failed to update onboarding preferences: ${res.statusText}`);
      }
    } catch (err) {
      console.error('[ProductionPersistenceAdapter] updatePreferences error:', err);
      throw createIntegrationError('PERSISTENCE_FAILED', err);
    }
  }
}

/**
 * Production Asset Adapter connecting to LUMA Cloud Storage
 */
export class ProductionAssetAdapter implements AssetIntegrationAdapter {
  constructor(private uploadEndpoint: string = '/api/v1/assets/upload') {}

  async upload(
    file: File,
    options?: { signal?: AbortSignal; onProgress?: (percent: number) => void }
  ): Promise<UploadedAsset> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(this.uploadEndpoint, {
        method: 'POST',
        body: formData,
        signal: options?.signal,
      });

      if (!res.ok) {
        throw new Error(`Asset upload failed: ${res.statusText}`);
      }

      return await res.json();
    } catch (err) {
      throw createIntegrationError('UPLOAD_FAILED', err);
    }
  }

  async getAsset(assetId: string): Promise<AssetReference | null> {
    try {
      const res = await fetch(`/api/v1/assets/${encodeURIComponent(assetId)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error('[ProductionAssetAdapter] getAsset error:', err);
      return null;
    }
  }
}

/**
 * Production Creation Adapter connecting to real LUMA AI Engine / Workers
 */
export class ProductionCreationAdapter implements OnboardingCreationAdapter {
  readonly isSimulation = false;

  constructor(private generateEndpoint: string = '/api/v1/ai/create') {}

  async create(
    request: OnboardingCreationRequest,
    options?: {
      signal?: AbortSignal;
      onStatus?: (status: any, message?: string, progressPercent?: number) => void;
    }
  ): Promise<OnboardingCreationResult> {
    try {
      options?.onStatus?.('analyzing', 'در حال اتصال به سرور پردازش...', 20);

      const res = await fetch(this.generateEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: options?.signal,
      });

      if (!res.ok) {
        if (res.status === 402) {
          throw createIntegrationError('INSUFFICIENT_BALANCE');
        }
        if (res.status === 503) {
          throw createIntegrationError('SERVICE_UNAVAILABLE');
        }
        throw new Error(`Creation failed: ${res.statusText}`);
      }

      options?.onStatus?.('finalizing', 'دریافت خروجی...', 90);
      const result: OnboardingCreationResult = await res.json();
      options?.onStatus?.('completed', 'تکمیل شد', 100);

      return result;
    } catch (err: any) {
      if (err.code) throw err;
      throw createIntegrationError('GENERATION_FAILED', err);
    }
  }
}

/**
 * Production Router-based Navigation Adapter (e.g. Next.js router)
 */
export class ProductionNavigationAdapter implements NavigationIntegrationAdapter {
  constructor(private router: { push: (url: string) => void; replace?: (url: string) => void }) {}

  goToDashboard(): void {
    this.router.push('/dashboard');
  }

  goToTool(toolId: string): void {
    this.router.push(`/dashboard/tools/${encodeURIComponent(toolId)}`);
  }

  goToFiles(highlightAssetId?: string): void {
    if (highlightAssetId) {
      this.router.push(`/dashboard/files?asset=${encodeURIComponent(highlightAssetId)}`);
    } else {
      this.router.push('/dashboard/files');
    }
  }

  goToWorkflow(workflowId?: string): void {
    if (workflowId) {
      this.router.push(`/dashboard/workflow/${encodeURIComponent(workflowId)}`);
    } else {
      this.router.push('/dashboard/workflow');
    }
  }

  goToAssistant(): void {
    this.router.push('/dashboard/assistant');
  }

  goToDevelopers(): void {
    this.router.push('/dashboard/developers');
  }

  goToBilling(): void {
    this.router.push('/dashboard/billing');
  }

  navigate(destination: OnboardingDestination): void {
    switch (destination.type) {
      case 'dashboard':
        return this.goToDashboard();
      case 'tool':
        return this.goToTool(destination.toolId);
      case 'workflow':
        return this.goToWorkflow(destination.workflowId);
      case 'files':
        return this.goToFiles(destination.highlightAssetId);
      case 'assistant':
        return this.goToAssistant();
      case 'developers':
        return this.goToDevelopers();
      case 'billing':
        if (this.goToBilling) {
          this.goToBilling();
        } else {
          this.goToDashboard();
        }
        return;
    }
  }
}

/**
 * Production Analytics Adapter (e.g. Segment / PostHog / Google Analytics)
 */
export class ProductionAnalyticsAdapter implements AnalyticsIntegrationAdapter {
  constructor(private trackerFn?: (event: string, props?: Record<string, unknown>) => void) {}

  track(event: OnboardingAnalyticsEvent, properties?: Record<string, unknown>): void {
    try {
      if (this.trackerFn) {
        this.trackerFn(event, properties);
      } else if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track(event, properties);
      }
    } catch (err) {
      // Analytics error should NEVER break user onboarding flow
      console.warn('[Analytics Error Suppressed]', err);
    }
  }
}
