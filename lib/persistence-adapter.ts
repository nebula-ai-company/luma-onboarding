import type {
  OnboardingState,
  PersonalizationArchetype,
  LumaSectionId,
  RecommendedFirstAction,
  FirstCreationMode,
  ToolRecommendation,
} from '@/types/onboarding';
import type { CreationResultData } from '@/lib/creation-adapter';
import { trackOnboardingEvent } from '@/lib/analytics';

export const ONBOARDING_STORAGE_KEY = 'luma_onboarding_v1';
export const ONBOARDING_VERSION = '1';

export type OnboardingCompletionPath = 'created_result' | 'completed_flow' | 'skipped';

export interface PersistedOnboardingData {
  version: string;
  userId?: string;
  completedAt: string | null;
  isSkipped: boolean;
  completionPath: OnboardingCompletionPath;
  profile: {
    professions: string[];
    interests: string[];
    archetypes: PersonalizationArchetype[];
  };
  ecosystem: {
    primarySections: LumaSectionId[];
    exploredSections: LumaSectionId[];
    ecosystemTourCompleted: boolean;
  };
  recommendations: {
    recommendedToolIds: string[];
    recommendedFirstAction: RecommendedFirstAction;
    selectedRecommendedTool: string | null;
    toolRecommendations: ToolRecommendation[];
  };
  creation: {
    mode: FirstCreationMode;
    hasCreatedResult: boolean;
    toolId: string | null;
    prompt: string | null;
    templateId: string | null;
    result: CreationResultData | null;
    inputUrl: string | null;
    durationSeconds?: number;
  };
  destination: {
    targetSection: LumaSectionId;
    targetToolId: string | null;
    actionParam?: string;
    route: string;
    reason: string;
  };
  metadata: {
    lastUpdated: string;
    clientTimestamp: number;
    userAgent?: string;
  };
}

export interface OnboardingPersistenceAdapter {
  isAvailable: () => boolean;
  save: (data: PersistedOnboardingData) => Promise<void>;
  load: () => Promise<PersistedOnboardingData | null>;
  clear: () => Promise<void>;
  hasCompleted: () => Promise<boolean>;
}

/**
 * In-memory fallback if localStorage is disabled or throws QuotaExceeded
 */
let inMemoryFallback: PersistedOnboardingData | null = null;

/**
 * LocalStorage Adapter for Web & Development
 */
export class LocalDevelopmentPersistenceAdapter implements OnboardingPersistenceAdapter {
  isAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const testKey = '__luma_test_storage__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  async save(data: PersistedOnboardingData): Promise<void> {
    inMemoryFallback = data;
    if (typeof window === 'undefined') return;

    try {
      const serialized = JSON.stringify(data);
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, serialized);
      trackOnboardingEvent('onboarding_persisted', {
        completionPath: data.completionPath,
        hasCreatedResult: data.creation.hasCreatedResult,
        targetSection: data.destination.targetSection,
      });
    } catch (err) {
      console.warn('[LUMA Persistence] LocalStorage write failed, falling back to memory store:', err);
    }
  }

  async load(): Promise<PersistedOnboardingData | null> {
    if (typeof window === 'undefined') {
      return inMemoryFallback;
    }

    try {
      const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!raw) {
        return inMemoryFallback;
      }

      const parsed: PersistedOnboardingData = JSON.parse(raw);
      if (parsed && parsed.version === ONBOARDING_VERSION) {
        return parsed;
      }
      return null;
    } catch (err) {
      console.warn('[LUMA Persistence] LocalStorage read failed:', err);
      return inMemoryFallback;
    }
  }

  async clear(): Promise<void> {
    inMemoryFallback = null;
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } catch (err) {
      console.warn('[LUMA Persistence] LocalStorage clear failed:', err);
    }
  }

  async hasCompleted(): Promise<boolean> {
    const data = await this.load();
    return Boolean(data && data.completedAt);
  }
}

/**
 * Production Persistence Adapter
 * In a real production deployment, this synchronizes with user profile endpoints
 * with local cache fallback.
 */
export class ProductionLumaPersistenceAdapter implements OnboardingPersistenceAdapter {
  private localAdapter = new LocalDevelopmentPersistenceAdapter();

  isAvailable(): boolean {
    return true;
  }

  async save(data: PersistedOnboardingData): Promise<void> {
    // 1. Immediately cache locally for zero-latency resumption
    await this.localAdapter.save(data);

    // 2. Asynchronously sync to backend endpoint
    try {
      if (typeof window !== 'undefined') {
        fetch('/api/onboarding/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).catch((err) => {
          console.debug('[LUMA Persistence] Remote sync background note:', err);
        });
      }
    } catch (err) {
      // Non-blocking
    }
  }

  async load(): Promise<PersistedOnboardingData | null> {
    return await this.localAdapter.load();
  }

  async clear(): Promise<void> {
    await this.localAdapter.clear();
  }

  async hasCompleted(): Promise<boolean> {
    return await this.localAdapter.hasCompleted();
  }
}

export const persistenceAdapter: OnboardingPersistenceAdapter =
  new LocalDevelopmentPersistenceAdapter();
