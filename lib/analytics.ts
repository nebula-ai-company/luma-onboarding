import type { AnalyticsIntegrationAdapter, OnboardingAnalyticsEvent } from './integration/contracts';
import type { OnboardingExperimentMetadata } from './rollout/experiment-service';

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
  
  // Experiment & Rollout Context
  experimentId?: string;
  experimentVariant?: 'control' | 'treatment';
  rolloutPercentage?: number;
  onboardingStage?: string;
  userBucket?: number;

  // Safe Contextual Error Logging
  errorCode?: string;
  errorCategory?: 'ONBOARDING' | 'ONBOARDING_GENERATION' | 'ONBOARDING_BILLING' | 'ONBOARDING_UPLOAD' | 'ROUTING';
  errorStep?: number | string;
  errorMessageSafe?: string; // Sanitized: No user prompt, file payload, or private URL

  [key: string]: unknown;
}

let activeAnalyticsAdapter: AnalyticsIntegrationAdapter | null = null;
let activeExperimentContext: Partial<OnboardingExperimentMetadata> | null = null;

export function setActiveAnalyticsAdapter(adapter: AnalyticsIntegrationAdapter | null) {
  activeAnalyticsAdapter = adapter;
}

export function setActiveExperimentContext(exp: Partial<OnboardingExperimentMetadata> | null) {
  activeExperimentContext = exp;
}

/**
 * Sanitizes payload to guarantee user privacy (no prompts, no raw files, no sensitive auth tokens)
 */
function sanitizeEventPayload(payload?: OnboardingEventPayload): OnboardingEventPayload {
  if (!payload) return {};
  const sanitized: OnboardingEventPayload = { ...payload };

  // Remove potential sensitive fields
  delete (sanitized as any).rawPrompt;
  delete (sanitized as any).promptText;
  delete (sanitized as any).fileBase64;
  delete (sanitized as any).fileUrl;
  delete (sanitized as any).password;
  delete (sanitized as any).token;

  // Merge active experiment context if not explicitly provided
  if (activeExperimentContext) {
    if (!sanitized.experimentId && activeExperimentContext.experimentId) {
      sanitized.experimentId = activeExperimentContext.experimentId;
    }
    if (!sanitized.experimentVariant && activeExperimentContext.variant) {
      sanitized.experimentVariant = activeExperimentContext.variant;
    }
    if (sanitized.rolloutPercentage === undefined && activeExperimentContext.rolloutPercentage !== undefined) {
      sanitized.rolloutPercentage = activeExperimentContext.rolloutPercentage;
    }
    if (!sanitized.onboardingStage && activeExperimentContext.stage) {
      sanitized.onboardingStage = activeExperimentContext.stage;
    }
  }

  return sanitized;
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
    const cleanPayload = sanitizeEventPayload(payload);
    if (activeAnalyticsAdapter) {
      activeAnalyticsAdapter.track(event as OnboardingAnalyticsEvent, cleanPayload);
    } else if (process.env.NODE_ENV === 'development') {
      console.debug(`[LUMA Analytics] ${event}`, cleanPayload);
    }
  } catch (err) {
    // Analytics error must never break UI runtime
    console.warn('[Analytics Error]', err);
  }
}

/**
 * Safe error logging for onboarding telemetry
 */
export function trackOnboardingError(
  category: 'ONBOARDING' | 'ONBOARDING_GENERATION' | 'ONBOARDING_BILLING' | 'ONBOARDING_UPLOAD' | 'ROUTING',
  code: string,
  safeMessage: string,
  extra?: Record<string, unknown>
): void {
  trackOnboardingEvent('onboarding_error_logged', {
    errorCategory: category,
    errorCode: code,
    errorMessageSafe: safeMessage,
    ...extra,
  });
}


