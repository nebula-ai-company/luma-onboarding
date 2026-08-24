import type {
  LumaOnboardingIntegration,
  OnboardingEnvironment,
  PersistedOnboardingProfile,
  DashboardPersonalization,
} from './contracts';
import { ONBOARDING_SCHEMA_VERSION } from './contracts';

export interface IntegrationValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
}

/**
 * Validates that an integration bundle complies with the contracts
 * and is safe for the given environment (development vs production).
 */
export function validateOnboardingIntegration(
  integration: LumaOnboardingIntegration,
  environment: OnboardingEnvironment = 'development'
): IntegrationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!integration.user || typeof integration.user.getCurrentUser !== 'function') {
    errors.push('UserIntegrationAdapter must provide a getCurrentUser method.');
  }

  if (
    !integration.persistence ||
    typeof integration.persistence.loadProfile !== 'function' ||
    typeof integration.persistence.saveProgress !== 'function' ||
    typeof integration.persistence.complete !== 'function' ||
    typeof integration.persistence.updatePreferences !== 'function'
  ) {
    errors.push('OnboardingPersistenceAdapter missing one or more required methods.');
  }

  if (
    !integration.creation ||
    typeof integration.creation.create !== 'function'
  ) {
    errors.push('OnboardingCreationAdapter must implement create().');
  } else if (environment === 'production' && integration.creation.isSimulation) {
    errors.push('Production environment cannot use a simulated creation adapter.');
  }

  if (
    !integration.assets ||
    typeof integration.assets.upload !== 'function' ||
    typeof integration.assets.getAsset !== 'function'
  ) {
    errors.push('AssetIntegrationAdapter missing upload or getAsset methods.');
  }

  if (
    !integration.navigation ||
    typeof integration.navigation.goToDashboard !== 'function' ||
    typeof integration.navigation.goToTool !== 'function' ||
    typeof integration.navigation.goToFiles !== 'function' ||
    typeof integration.navigation.goToWorkflow !== 'function' ||
    typeof integration.navigation.goToAssistant !== 'function' ||
    typeof integration.navigation.goToDevelopers !== 'function'
  ) {
    errors.push('NavigationIntegrationAdapter missing required semantic navigation methods.');
  }

  if (
    !integration.analytics ||
    typeof integration.analytics.track !== 'function'
  ) {
    warnings.push('AnalyticsIntegrationAdapter missing track method.');
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Safely parses and migrates any persisted profile format to v2.0.0
 */
export function migrateOnboardingProfile(raw: unknown): PersistedOnboardingProfile | null {
  if (!raw || typeof raw !== 'object') return null;

  const data = raw as Record<string, unknown>;

  // If already v2
  if (data.onboardingVersion === ONBOARDING_SCHEMA_VERSION) {
    return data as unknown as PersistedOnboardingProfile;
  }

  // Legacy v1 schema migration
  try {
    const preferences = (data.preferences as Record<string, unknown>) || {};
    const professions = Array.isArray(preferences.professions)
      ? preferences.professions
      : Array.isArray(data.selectedProfessions)
      ? (data.selectedProfessions as string[])
      : [];
    const interests = Array.isArray(preferences.interests)
      ? preferences.interests
      : Array.isArray(data.selectedInterests)
      ? (data.selectedInterests as string[])
      : [];
    const archetypes = Array.isArray(preferences.archetypes)
      ? preferences.archetypes
      : Array.isArray(data.derivedArchetypes)
      ? (data.derivedArchetypes as any[])
      : [];

    const primarySections = Array.isArray(data.primarySections)
      ? (data.primarySections as any[])
      : ['ai_tools', 'ai_chat'];

    const recommendedToolIds = Array.isArray(data.recommendedToolIds)
      ? (data.recommendedToolIds as string[])
      : Array.isArray(data.toolRecommendations)
      ? (data.toolRecommendations as any[]).map((r) => r.id)
      : [];

    const isSkipped = Boolean(data.isSkipped || data.completionReason === 'skipped');

    return {
      onboardingVersion: ONBOARDING_SCHEMA_VERSION,
      lifecycle: isSkipped ? 'skipped' : 'completed',
      completionReason: isSkipped
        ? 'skipped'
        : data.firstCreation
        ? 'first_creation_success'
        : 'completed_without_creation',
      preferences: {
        professions,
        interests,
        archetypes,
      },
      primarySections,
      recommendedToolIds,
      recommendedFirstAction: (data.recommendedFirstAction as any) || null,
      firstCreation: data.firstCreation as any,
      firstCompletedAt: (data.completedAt as string) || (data.firstCompletedAt as string) || new Date().toISOString(),
      lastCompletedAt: (data.lastCompletedAt as string) || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Validates that a persisted profile matches schema requirements
 */
export function validatePersistedProfile(profile: unknown): profile is PersistedOnboardingProfile {
  if (!profile || typeof profile !== 'object') return false;
  const p = profile as Partial<PersistedOnboardingProfile>;
  return (
    p.onboardingVersion === ONBOARDING_SCHEMA_VERSION &&
    (p.lifecycle === 'completed' || p.lifecycle === 'skipped') &&
    Boolean(p.preferences && Array.isArray(p.preferences.professions)) &&
    Boolean(p.primarySections && Array.isArray(p.primarySections))
  );
}

/**
 * Returns dashboard personalization config derived from a persisted profile
 */
export function getDashboardPersonalization(
  profile: PersistedOnboardingProfile
): DashboardPersonalization {
  return {
    highlightedSections: profile.primarySections,
    recommendedToolIds: profile.recommendedToolIds,
    recommendedFirstAction: profile.recommendedFirstAction,
    primaryArchetypes: profile.preferences.archetypes,
  };
}
