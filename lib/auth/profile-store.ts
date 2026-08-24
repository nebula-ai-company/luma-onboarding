import type {
  PersistedOnboardingProfile,
  PersistedOnboardingProgress,
  OnboardingPreferences,
} from '@/lib/integration/contracts';
import { ONBOARDING_SCHEMA_VERSION } from '@/lib/integration/contracts';

// In-memory persistent storage for server routes
const profileStore = new Map<string, PersistedOnboardingProfile>();
const progressStore = new Map<string, PersistedOnboardingProgress>();

export async function getStoredProfile(userId: string): Promise<PersistedOnboardingProfile | null> {
  return profileStore.get(userId) || null;
}

export async function saveStoredProfile(userId: string, profile: PersistedOnboardingProfile): Promise<void> {
  profileStore.set(userId, profile);
}

export async function getStoredProgress(userId: string): Promise<PersistedOnboardingProgress | null> {
  return progressStore.get(userId) || null;
}

export async function saveStoredProgress(userId: string, progress: PersistedOnboardingProgress): Promise<void> {
  progressStore.set(userId, progress);
}

export async function updateStoredPreferences(userId: string, preferences: OnboardingPreferences): Promise<void> {
  const existing = profileStore.get(userId);
  if (existing) {
    existing.preferences = preferences;
    existing.lastCompletedAt = new Date().toISOString();
    profileStore.set(userId, existing);
  }
}

export async function clearStoredOnboarding(userId: string): Promise<void> {
  profileStore.delete(userId);
  progressStore.delete(userId);
}
