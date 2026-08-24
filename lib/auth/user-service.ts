import type { LumaOnboardingUser, OnboardingFeatureFlags } from '@/lib/integration/contracts';
import { DEFAULT_FEATURE_FLAGS } from '@/lib/integration/constants';
import {
  evaluateUserEligibility,
  type UserEligibilityResult,
  type RolloutConfig,
} from '@/lib/rollout/experiment-service';

/**
 * In-memory / persistent user state store for production LUMA session
 */
export interface UserSessionData extends LumaOnboardingUser {
  onboardingCompleted: boolean;
  onboardingSkipped?: boolean;
  onboardingVersion?: string;
  isExistingLegacyUser?: boolean;
  role?: string;
}

// Default simulated production session
const DEFAULT_USER: UserSessionData = {
  id: 'usr_luma_prod_98412',
  displayName: 'سارا رادمنش',
  email: 'sara.radmanesh@luma.ir',
  avatarUrl: 'https://picsum.photos/seed/sara_luma_user/200/200',
  tier: 'pro',
  lumBalance: 20, // 20 LUM Welcome balance
  onboardingCompleted: false,
  onboardingSkipped: false,
  isExistingLegacyUser: false,
  role: 'user',
  createdAt: '2026-03-01T10:00:00.000Z',
};

let currentUserState: UserSessionData = { ...DEFAULT_USER };

/**
 * Get active user session
 */
export async function getActiveUserSession(): Promise<UserSessionData> {
  return { ...currentUserState };
}

/**
 * Update user session state (e.g. when onboarding is completed or skipped)
 */
export async function updateUserSession(updates: Partial<UserSessionData>): Promise<UserSessionData> {
  currentUserState = {
    ...currentUserState,
    ...updates,
  };
  return { ...currentUserState };
}

/**
 * Reset user session back to fresh new user
 */
export async function resetUserSession(
  type: 'new_user' | 'existing_completed' | 'legacy_user' | 'custom_email' = 'new_user',
  customEmail?: string
): Promise<UserSessionData> {
  if (type === 'existing_completed') {
    currentUserState = {
      ...DEFAULT_USER,
      onboardingCompleted: true,
      onboardingSkipped: false,
      onboardingVersion: '2.0.0',
      isExistingLegacyUser: false,
    };
  } else if (type === 'legacy_user') {
    currentUserState = {
      ...DEFAULT_USER,
      onboardingCompleted: true, // Legacy users must never be forced into onboarding
      onboardingSkipped: false,
      isExistingLegacyUser: true,
      createdAt: '2024-01-15T08:00:00.000Z',
    };
  } else if (type === 'custom_email' && customEmail) {
    currentUserState = {
      ...DEFAULT_USER,
      id: `usr_${Math.random().toString(36).slice(2, 9)}`,
      email: customEmail,
      displayName: customEmail.split('@')[0],
      onboardingCompleted: false,
      onboardingSkipped: false,
      onboardingVersion: undefined,
      isExistingLegacyUser: false,
    };
  } else {
    currentUserState = {
      ...DEFAULT_USER,
      onboardingCompleted: false,
      onboardingSkipped: false,
      onboardingVersion: undefined,
      isExistingLegacyUser: false,
    };
  }
  return { ...currentUserState };
}

/**
 * Checks whether onboarding is strictly required for the given user.
 * 
 * Rules:
 * 1. If rollout flag `enableNewUserOnboarding` is false, only whitelisted users get onboarding.
 * 2. If user is an existing legacy user (`isExistingLegacyUser === true`), never show onboarding.
 * 3. If user has already completed onboarding (`onboardingCompleted === true`), never show onboarding.
 * 4. Checks deterministic experiment hash / percentage rollout.
 */
export function isOnboardingRequired(
  user: (LumaOnboardingUser & { isExistingLegacyUser?: boolean; onboardingCompleted?: boolean; onboardingSkipped?: boolean; role?: string }) | null,
  featureFlags?: Partial<OnboardingFeatureFlags>,
  overrideConfig?: Partial<RolloutConfig>
): boolean {
  if (!user) return false;
  const evalResult = evaluateUserEligibility(user, overrideConfig);
  return evalResult.shouldShowOnboarding;
}

/**
 * Get complete eligibility and experiment assignment details for the user
 */
export function getUserEligibilityDetails(
  user: (LumaOnboardingUser & { isExistingLegacyUser?: boolean; onboardingCompleted?: boolean; onboardingSkipped?: boolean; role?: string }) | null,
  overrideConfig?: Partial<RolloutConfig>
): UserEligibilityResult {
  return evaluateUserEligibility(user, overrideConfig);
}

