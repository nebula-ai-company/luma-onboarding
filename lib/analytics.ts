import type { AnalyticsIntegrationAdapter, OnboardingAnalyticsEvent } from './integration/contracts';

export type OnboardingEventType = OnboardingAnalyticsEvent | string;

export interface OnboardingEventPayload {
  step?: number;
  professionId?: string;
  interestId?: string;
  selectedCount?: number;
  profileArchetypes?: string[];
  toolId?: string;
  mode?: string;
  templateId?: string;
  durationMs?: number;
  promptLength?: number;
  timeToFirstCreation?: number;
  timeToFirstResult?: number;
  [key: string]: unknown;
}

let activeAnalyticsAdapter: AnalyticsIntegrationAdapter | null = null;

export function setActiveAnalyticsAdapter(adapter: AnalyticsIntegrationAdapter | null) {
  activeAnalyticsAdapter = adapter;
}

/**
 * Lightweight internal analytics event abstraction for LUMA onboarding.
 * Delegates safely to the configured AnalyticsIntegrationAdapter.
 */
export function trackOnboardingEvent(
  event: OnboardingEventType,
  payload?: OnboardingEventPayload
): void {
  try {
    if (activeAnalyticsAdapter) {
      activeAnalyticsAdapter.track(event as OnboardingAnalyticsEvent, payload);
    } else if (process.env.NODE_ENV === 'development') {
      console.debug(`[LUMA Analytics] ${event}`, payload ?? {});
    }
  } catch (err) {
    // Analytics error must never break UI runtime
    console.warn('[Analytics Error]', err);
  }
}

