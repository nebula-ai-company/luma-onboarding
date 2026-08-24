import type { LumaOnboardingUser } from '@/lib/integration/contracts';

export type RolloutStage =
  | 'STAGE_0_INTERNAL'
  | 'STAGE_1_ONE_PERCENT'
  | 'STAGE_2_FIVE_PERCENT'
  | 'STAGE_3_FIFTEEN_PERCENT'
  | 'STAGE_4_TWENTY_FIVE_PERCENT'
  | 'STAGE_5_FIFTY_PERCENT'
  | 'STAGE_6_FULL_ROLLOUT';

export type ExperimentVariant = 'control' | 'treatment';

export interface RolloutConfig {
  enableNewUserOnboarding: boolean; // Master Kill Switch
  currentStage: RolloutStage;
  rolloutPercentage: number; // 0, 1, 5, 15, 25, 50, 100
  experimentId: string;
  internalWhitelist: string[];
  updatedAt: string;
  updatedBy: string;
}

export interface OnboardingExperimentMetadata {
  experimentId: string;
  variant: ExperimentVariant;
  assignedAt: string;
  rolloutPercentage: number;
  isInternalWhitelist: boolean;
  userBucket: number;
  stage: RolloutStage;
}

export interface UserEligibilityResult {
  isEligible: boolean;
  reason:
    | 'legacy_user'
    | 'already_completed'
    | 'already_skipped'
    | 'admin_automation'
    | 'kill_switch_disabled'
    | 'control_group'
    | 'treatment_enrolled'
    | 'internal_whitelist';
  variant: ExperimentVariant;
  experiment: OnboardingExperimentMetadata;
  shouldShowOnboarding: boolean;
}

export const STAGE_CONFIG_MAP: Record<RolloutStage, { name: string; percentage: number; description: string }> = {
  STAGE_0_INTERNAL: {
    name: 'مرحله ۰ — فقط کاربران داخلی (QA & Team)',
    percentage: 0,
    description: 'هیچ کاربر عمومی وارد آنبوردینگ نمی‌شود. فقط لیست سفید داخلی و اکانت‌های آزمایشی فعال هستند.',
  },
  STAGE_1_ONE_PERCENT: {
    name: 'مرحله ۱ — ۱٪ از کاربران واجد شرایط جدید',
    percentage: 1,
    description: 'شناسایی خطاهای بحرانی اولیه، بررسی عملکرد صدور فاکتور و جلوگیری از لوپ‌های احتمالی.',
  },
  STAGE_2_FIVE_PERCENT: {
    name: 'مرحله ۲ — ۵٪ از کاربران واجد شرایط جدید',
    percentage: 5,
    description: 'تایید پایداری گیت‌های فنی و بررسی سلامت اولیه شاخص‌های ریزش.',
  },
  STAGE_3_FIFTEEN_PERCENT: {
    name: 'مرحله ۳ — ۱۵٪ از کاربران واجد شرایط جدید',
    percentage: 15,
    description: 'تحلیل دقیق‌تر روند اکتیویشن اولیه و مقایسه زمان رسیدن به خروجی اول.',
  },
  STAGE_4_TWENTY_FIVE_PERCENT: {
    name: 'مرحله ۴ — ۲۵٪ از کاربران واجد شرایط جدید',
    percentage: 25,
    description: 'پایش تاثیر روی بار پشتیبانی و انطباق مصرف اعتبار LUM.',
  },
  STAGE_5_FIFTY_PERCENT: {
    name: 'مرحله ۵ — ۵۰٪ از کاربران واجد شرایط جدید',
    percentage: 50,
    description: 'مقایسه عادلانه A/B بین گروه کنترل و درمان در ابعاد آماری معنادار.',
  },
  STAGE_6_FULL_ROLLOUT: {
    name: 'مرحله ۶ — ۱۰۰٪ رول‌اوت کامل',
    percentage: 100,
    description: 'پس از اطمینان کامل از برتری شاخص‌های اصلی فعال‌سازی و سلامت عملیاتی.',
  },
};

/**
 * Initial Rollout State (Phase 11 mandate: Master Rollout is OFF, Internal Whitelist is enabled)
 */
let currentRolloutConfig: RolloutConfig = {
  enableNewUserOnboarding: false, // Master Kill Switch default OFF for public
  currentStage: 'STAGE_0_INTERNAL',
  rolloutPercentage: 0,
  experimentId: 'new-user-onboarding-v1',
  internalWhitelist: [
    'sara.radmanesh@luma.ir',
    'qa@luma.ir',
    'qa_tester@luma.ir',
    'team_lead@luma.ir',
    'developer@luma.ir',
  ],
  updatedAt: new Date().toISOString(),
  updatedBy: 'Luma Operations & Release Management',
};

// In-memory stable assignment store (ensures user never flips variant during lifecycle)
const persistentExperimentAssignments = new Map<string, OnboardingExperimentMetadata>();

/**
 * 32-bit FNV-1a deterministic hash to generate stable bucket [0..99] for a userId
 */
export function hashUserToBucket(userId: string, experimentId: string = 'new-user-onboarding-v1'): number {
  const input = `${experimentId}:${userId}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash % 100;
}

/**
 * Get current rollout configuration
 */
export function getRolloutConfig(): RolloutConfig {
  return { ...currentRolloutConfig };
}

/**
 * Update rollout configuration (Kill switch, stage, percentage, whitelist)
 */
export function updateRolloutConfig(updates: Partial<RolloutConfig>, updatedBy: string = 'Luma Admin'): RolloutConfig {
  let newPercentage = currentRolloutConfig.rolloutPercentage;
  if (updates.currentStage && STAGE_CONFIG_MAP[updates.currentStage]) {
    newPercentage = STAGE_CONFIG_MAP[updates.currentStage].percentage;
  } else if (typeof updates.rolloutPercentage === 'number') {
    newPercentage = updates.rolloutPercentage;
  }

  currentRolloutConfig = {
    ...currentRolloutConfig,
    ...updates,
    rolloutPercentage: newPercentage,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };

  return { ...currentRolloutConfig };
}

/**
 * Check if a user is in the internal QA/Team whitelist
 */
export function isUserInInternalWhitelist(user: LumaOnboardingUser | { id: string; email?: string }): boolean {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  const userId = (user.id || '').toLowerCase().trim();

  // Explicit whitelist check
  if (currentRolloutConfig.internalWhitelist.some((item) => {
    const target = item.toLowerCase().trim();
    return target === email || target === userId;
  })) {
    return true;
  }

  // Domain & prefix check
  if (email.endsWith('@luma.ir') || email.endsWith('@internal.luma.ir')) {
    return true;
  }

  if (userId.startsWith('usr_team_') || userId.startsWith('usr_qa_') || userId.startsWith('usr_internal_')) {
    return true;
  }

  return false;
}

/**
 * Core Evaluation Engine for User Eligibility & Experiment Assignment
 * 
 * Rules:
 * 1. Legacy users (`isExistingLegacyUser`) -> ALWAYS exempt (Control / No onboarding).
 * 2. Already completed or skipped users -> ALWAYS exempt.
 * 3. Support/Admin/Automation accounts -> ALWAYS exempt.
 * 4. Internal whitelist -> Assigned to `treatment` (allows internal validation).
 * 5. Master Kill Switch (`enableNewUserOnboarding === false`) -> If not whitelist, route to `control`.
 * 6. Stable Cohort Hash: `bucket < rolloutPercentage` -> `treatment`, else -> `control`.
 * 7. Stored Assignment Persistence: Once assigned, user remains in their cohort.
 */
export function evaluateUserEligibility(
  user: (LumaOnboardingUser & { isExistingLegacyUser?: boolean; onboardingCompleted?: boolean; onboardingSkipped?: boolean; role?: string }) | null,
  overrideConfig?: Partial<RolloutConfig>
): UserEligibilityResult {
  const config = { ...currentRolloutConfig, ...overrideConfig };

  // Fallback for null user
  if (!user) {
    const dummyExperiment: OnboardingExperimentMetadata = {
      experimentId: config.experimentId,
      variant: 'control',
      assignedAt: new Date().toISOString(),
      rolloutPercentage: 0,
      isInternalWhitelist: false,
      userBucket: 0,
      stage: config.currentStage,
    };
    return {
      isEligible: false,
      reason: 'kill_switch_disabled',
      variant: 'control',
      experiment: dummyExperiment,
      shouldShowOnboarding: false,
    };
  }

  const userId = user.id;
  const userBucket = hashUserToBucket(userId, config.experimentId);
  const isWhitelisted = isUserInInternalWhitelist(user);

  // 1. Existing Legacy Users are never forced into onboarding
  if (user.isExistingLegacyUser) {
    const expMeta: OnboardingExperimentMetadata = {
      experimentId: config.experimentId,
      variant: 'control',
      assignedAt: new Date().toISOString(),
      rolloutPercentage: config.rolloutPercentage,
      isInternalWhitelist: isWhitelisted,
      userBucket,
      stage: config.currentStage,
    };
    return {
      isEligible: false,
      reason: 'legacy_user',
      variant: 'control',
      experiment: expMeta,
      shouldShowOnboarding: false,
    };
  }

  // 2. Already completed users
  if (user.onboardingCompleted) {
    const expMeta: OnboardingExperimentMetadata = {
      experimentId: config.experimentId,
      variant: 'control',
      assignedAt: new Date().toISOString(),
      rolloutPercentage: config.rolloutPercentage,
      isInternalWhitelist: isWhitelisted,
      userBucket,
      stage: config.currentStage,
    };
    return {
      isEligible: false,
      reason: 'already_completed',
      variant: 'control',
      experiment: expMeta,
      shouldShowOnboarding: false,
    };
  }

  // 3. Already skipped users
  if (user.onboardingSkipped) {
    const expMeta: OnboardingExperimentMetadata = {
      experimentId: config.experimentId,
      variant: 'control',
      assignedAt: new Date().toISOString(),
      rolloutPercentage: config.rolloutPercentage,
      isInternalWhitelist: isWhitelisted,
      userBucket,
      stage: config.currentStage,
    };
    return {
      isEligible: false,
      reason: 'already_skipped',
      variant: 'control',
      experiment: expMeta,
      shouldShowOnboarding: false,
    };
  }

  // 4. Admin / Automation Accounts
  if (user.role === 'admin' || user.role === 'automation' || userId.includes('bot_') || userId.includes('service_')) {
    const expMeta: OnboardingExperimentMetadata = {
      experimentId: config.experimentId,
      variant: 'control',
      assignedAt: new Date().toISOString(),
      rolloutPercentage: config.rolloutPercentage,
      isInternalWhitelist: isWhitelisted,
      userBucket,
      stage: config.currentStage,
    };
    return {
      isEligible: false,
      reason: 'admin_automation',
      variant: 'control',
      experiment: expMeta,
      shouldShowOnboarding: false,
    };
  }

  // 5. Check if we already have a persistent cohort assignment for this user
  const storedAssignment = persistentExperimentAssignments.get(userId);
  if (storedAssignment && storedAssignment.experimentId === config.experimentId) {
    // If master kill switch is tripped and user is not whitelisted, allow safe exit
    if (!config.enableNewUserOnboarding && !isWhitelisted) {
      return {
        isEligible: false,
        reason: 'kill_switch_disabled',
        variant: 'control',
        experiment: { ...storedAssignment, variant: 'control' },
        shouldShowOnboarding: false,
      };
    }

    return {
      isEligible: true,
      reason: storedAssignment.variant === 'treatment' ? 'treatment_enrolled' : 'control_group',
      variant: storedAssignment.variant,
      experiment: storedAssignment,
      shouldShowOnboarding: storedAssignment.variant === 'treatment',
    };
  }

  // 6. Internal QA / Whitelist accounts (Allowed even when master switch is off)
  if (isWhitelisted) {
    const expMeta: OnboardingExperimentMetadata = {
      experimentId: config.experimentId,
      variant: 'treatment',
      assignedAt: new Date().toISOString(),
      rolloutPercentage: config.rolloutPercentage,
      isInternalWhitelist: true,
      userBucket,
      stage: config.currentStage,
    };
    persistentExperimentAssignments.set(userId, expMeta);
    return {
      isEligible: true,
      reason: 'internal_whitelist',
      variant: 'treatment',
      experiment: expMeta,
      shouldShowOnboarding: true,
    };
  }

  // 7. Master Kill Switch check for general public
  if (!config.enableNewUserOnboarding) {
    const expMeta: OnboardingExperimentMetadata = {
      experimentId: config.experimentId,
      variant: 'control',
      assignedAt: new Date().toISOString(),
      rolloutPercentage: config.rolloutPercentage,
      isInternalWhitelist: false,
      userBucket,
      stage: config.currentStage,
    };
    persistentExperimentAssignments.set(userId, expMeta);
    return {
      isEligible: false,
      reason: 'kill_switch_disabled',
      variant: 'control',
      experiment: expMeta,
      shouldShowOnboarding: false,
    };
  }

  // 8. Percentage-Based Controlled Rollout Assignment
  const isEnrolledInTreatment = userBucket < config.rolloutPercentage;
  const assignedVariant: ExperimentVariant = isEnrolledInTreatment ? 'treatment' : 'control';

  const expMeta: OnboardingExperimentMetadata = {
    experimentId: config.experimentId,
    variant: assignedVariant,
    assignedAt: new Date().toISOString(),
    rolloutPercentage: config.rolloutPercentage,
    isInternalWhitelist: false,
    userBucket,
    stage: config.currentStage,
  };

  persistentExperimentAssignments.set(userId, expMeta);

  return {
    isEligible: true,
    reason: isEnrolledInTreatment ? 'treatment_enrolled' : 'control_group',
    variant: assignedVariant,
    experiment: expMeta,
    shouldShowOnboarding: isEnrolledInTreatment,
  };
}

/**
 * Reset stored assignments (used for testing or environment resets)
 */
export function resetExperimentAssignments(): void {
  persistentExperimentAssignments.clear();
}
