'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type {
  LumaOnboardingIntegration,
  OnboardingFeatureFlags,
  OnboardingEnvironment,
  LumaOnboardingUser,
} from '@/lib/integration/contracts';
import { DEFAULT_FEATURE_FLAGS } from '@/lib/integration/constants';
import { validateOnboardingIntegration } from '@/lib/integration/validation';
import { createDevelopmentIntegration } from '@/lib/integration/adapters/development';

export interface LumaIntegrationContextValue {
  integration: LumaOnboardingIntegration;
  environment: OnboardingEnvironment;
  featureFlags: OnboardingFeatureFlags;
  currentUser: LumaOnboardingUser | null;
  isLoadingUser: boolean;
  isValid: boolean;
  validationWarnings: string[];
}

const LumaIntegrationContext = createContext<LumaIntegrationContextValue | null>(null);

export interface LumaOnboardingIntegrationProviderProps {
  integration?: LumaOnboardingIntegration;
  environment?: OnboardingEnvironment;
  featureFlags?: Partial<OnboardingFeatureFlags>;
  children: React.ReactNode;
}

export function LumaOnboardingIntegrationProvider({
  integration: customIntegration,
  environment: customEnvironment,
  featureFlags: featureFlagOverrides,
  children,
}: LumaOnboardingIntegrationProviderProps) {
  const integration = useMemo(() => {
    return customIntegration || createDevelopmentIntegration();
  }, [customIntegration]);

  const environment = customEnvironment || integration.environment || 'development';

  const [currentUser, setCurrentUser] = useState<LumaOnboardingUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  // Compute merged feature flags
  const effectiveFeatureFlags: OnboardingFeatureFlags = useMemo(() => {
    return {
      ...DEFAULT_FEATURE_FLAGS,
      ...(integration.featureFlags || {}),
      ...(featureFlagOverrides || {}),
    };
  }, [integration.featureFlags, featureFlagOverrides]);

  // Validation
  const validation = useMemo(() => {
    return validateOnboardingIntegration(integration, environment);
  }, [integration, environment]);

  if (!validation.valid && environment === 'production') {
    console.error('[LUMA Onboarding Integration Error]', validation.errors);
  }

  // Fetch current user from adapter on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoadingUser(true);

    integration.user
      .getCurrentUser()
      .then((user) => {
        if (isMounted) {
          setCurrentUser(user);
          setIsLoadingUser(false);
        }
      })
      .catch((err) => {
        console.warn('[LumaIntegration] Failed to get current user:', err);
        if (isMounted) {
          setCurrentUser(null);
          setIsLoadingUser(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [integration.user]);

  const value = useMemo<LumaIntegrationContextValue>(() => {
    return {
      integration,
      environment: integration.environment || environment,
      featureFlags: effectiveFeatureFlags,
      currentUser,
      isLoadingUser,
      isValid: validation.valid,
      validationWarnings: validation.warnings,
    };
  }, [
    integration,
    environment,
    effectiveFeatureFlags,
    currentUser,
    isLoadingUser,
    validation,
  ]);

  return (
    <LumaIntegrationContext.Provider value={value}>
      {children}
    </LumaIntegrationContext.Provider>
  );
}

export function useLumaIntegration(): LumaIntegrationContextValue {
  const ctx = useContext(LumaIntegrationContext);
  if (!ctx) {
    throw new Error(
      'useLumaIntegration must be used within a <LumaOnboardingIntegrationProvider>.'
    );
  }
  return ctx;
}

export function useLumaAdapters() {
  const { integration } = useLumaIntegration();
  return {
    user: integration.user,
    persistence: integration.persistence,
    creation: integration.creation,
    assets: integration.assets,
    navigation: integration.navigation,
    analytics: integration.analytics,
  };
}

export function useLumaFeatureFlags(): OnboardingFeatureFlags {
  const { featureFlags } = useLumaIntegration();
  return featureFlags;
}
