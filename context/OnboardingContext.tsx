'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type {
  OnboardingState,
  OnboardingContextValue,
  LumaSectionId,
  RecommendedFirstAction,
  FirstCreationMode,
} from '@/types/onboarding';
import {
  deriveArchetypes,
  derivePrimarySections,
  deriveToolRecommendations,
  MAX_INTERESTS_SELECTION,
} from '@/lib/onboarding-data';
import { trackOnboardingEvent, setActiveAnalyticsAdapter } from '@/lib/analytics';
import { resolveOnboardingDestination } from '@/lib/destination-resolver';
import { useLumaIntegration } from './LumaIntegrationContext';
import type {
  PersistedOnboardingProfile,
  PersistedOnboardingProgress,
  OnboardingIntegrationErrorCode,
} from '@/lib/integration/contracts';
import { ONBOARDING_SCHEMA_VERSION } from '@/lib/integration/contracts';

const TOTAL_STEPS = 7; // 0: Welcome, 1: Profession, 2: Interests, 3: Confirmation/Synthesis, 4: Ecosystem, 5: Recommendations, 6: First Creation

const defaultSections = derivePrimarySections([], []);
const defaultRecommendations = deriveToolRecommendations([], []);

const initialState: OnboardingState = {
  currentStep: 0,
  totalSteps: TOTAL_STEPS,
  direction: 1,
  selectedProfessions: [],
  selectedInterests: [],
  recommendedTools: defaultRecommendations.recommendations.map((t) => t.id),
  firstCreationChoice: null,
  onboardingCompleted: false,
  isSkipped: false,
  derivedArchetypes: [],
  primarySections: defaultSections.primary,
  exploredSections: [],
  guidedExplorationSkipped: false,
  ecosystemTourCompleted: false,
  toolRecommendations: defaultRecommendations.recommendations,
  recommendedFirstAction: defaultRecommendations.recommendedFirstAction,
  selectedRecommendedTool: defaultRecommendations.primaryRecommendation?.id || 'generate-image',
  firstCreationMode: null,
  firstCreationTool: null,
  firstCreationPrompt: '',
  firstCreationTemplate: null,
  firstCreationStatus: 'idle',
  firstCreationResult: null,
  firstCreationInputUrl: null,
  creationStartedAt: null,
  creationCompletedAt: null,
  lifecycle: 'initializing',
  activeWorkspaceSection: 'ai_tools',
  activeWorkspaceToolId: defaultRecommendations.primaryRecommendation?.id || 'generate-image',
};

export interface OnboardingProviderProps {
  mode?: 'first-run' | 'resume' | 'replay' | 'preferences';
  onComplete?: (profile: PersistedOnboardingProfile) => void;
  onSkip?: () => void;
  onIntegrationError?: (error: {
    code: OnboardingIntegrationErrorCode;
    message: string;
    originalError?: unknown;
  }) => void;
  children: React.ReactNode;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({
  mode = 'resume',
  onComplete,
  onSkip,
  onIntegrationError,
  children,
}: OnboardingProviderProps) {
  const { integration, featureFlags, currentUser, isLoadingUser } = useLumaIntegration();
  const [state, setState] = useState<OnboardingState>(initialState);
  const hydratedRef = useRef(false);
  const stateRef = useRef<OnboardingState>(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Hook analytics adapter globally
  useEffect(() => {
    setActiveAnalyticsAdapter(integration.analytics);
    return () => {
      setActiveAnalyticsAdapter(null);
    };
  }, [integration.analytics]);

  // Helper to build canonical v2 persisted profile payload
  const buildPersistedProfile = useCallback(
    (
      currentState: OnboardingState,
      lifecycleStatus: 'completed' | 'skipped',
      reason: 'first_creation_success' | 'completed_without_creation' | 'skipped'
    ): PersistedOnboardingProfile => {
      const toolId = currentState.firstCreationTool || currentState.selectedRecommendedTool || 'generate-image';
      
      return {
        onboardingVersion: ONBOARDING_SCHEMA_VERSION,
        lifecycle: lifecycleStatus,
        completionReason: reason,
        preferences: {
          professions: currentState.selectedProfessions,
          interests: currentState.selectedInterests,
          archetypes: currentState.derivedArchetypes,
        },
        primarySections: currentState.primarySections,
        recommendedToolIds: currentState.recommendedTools,
        recommendedFirstAction: currentState.recommendedFirstAction,
        firstCreation: currentState.firstCreationMode
          ? {
              mode: currentState.firstCreationMode,
              toolId,
              inputAssetId: currentState.firstCreationInputUrl || undefined,
              outputUrl: currentState.firstCreationResult?.imageUrl || currentState.firstCreationResult?.videoUrl,
              outputType: (currentState.firstCreationResult?.outputType as any) || 'image',
              succeeded: Boolean(currentState.firstCreationResult),
            }
          : undefined,
        firstCompletedAt: new Date().toISOString(),
        lastCompletedAt: new Date().toISOString(),
      };
    },
    []
  );

  // Helper to build progress payload
  const buildProgressPayload = useCallback(
    (currentState: OnboardingState): PersistedOnboardingProgress => {
      return {
        currentStep: currentState.currentStep,
        preferences: {
          professions: currentState.selectedProfessions,
          interests: currentState.selectedInterests,
          archetypes: currentState.derivedArchetypes,
        },
        selectedRecommendedTool: currentState.selectedRecommendedTool,
        firstCreationMode: currentState.firstCreationMode || undefined,
        lastUpdated: new Date().toISOString(),
      };
    },
    []
  );

  // Restore existing session when user is loaded
  useEffect(() => {
    if (isLoadingUser || hydratedRef.current) return;
    hydratedRef.current = true;

    let isMounted = true;

    async function checkPersistedSession() {
      const userId = currentUser?.id || 'demo_user_1';

      try {
        if (!featureFlags.enableResume || mode === 'first-run' || mode === 'replay') {
          // Force fresh start
          if (isMounted) {
            setState((prev) => ({
              ...prev,
              lifecycle: 'in_onboarding',
              currentStep: 0,
            }));
          }
          return;
        }

        const persisted = await integration.persistence.loadProfile(userId);
        if (!isMounted) return;

        if (persisted) {
          const professions = persisted.preferences?.professions || [];
          const interests = persisted.preferences?.interests || [];
          const archetypes = deriveArchetypes(professions, interests);
          const { primary } = derivePrimarySections(professions, interests);
          const { recommendations, recommendedFirstAction, primaryRecommendation } =
            deriveToolRecommendations(professions, interests);

          const isSkipped = persisted.lifecycle === 'skipped' || persisted.completionReason === 'skipped';
          const hasCreatedResult = Boolean(persisted.firstCreation?.succeeded);

          if (mode === 'preferences') {
            // Edit preferences mode -> jump directly to profession selection
            setState((prev) => ({
              ...prev,
              lifecycle: 'in_onboarding',
              currentStep: 1,
              selectedProfessions: professions,
              selectedInterests: interests,
              derivedArchetypes: archetypes,
              primarySections: primary,
              toolRecommendations: recommendations,
              recommendedFirstAction,
            }));
            return;
          }

          // Full workspace restoration
          setState((prev) => ({
            ...prev,
            lifecycle: 'in_workspace',
            onboardingCompleted: true,
            isSkipped,
            selectedProfessions: professions,
            selectedInterests: interests,
            derivedArchetypes: archetypes,
            primarySections: persisted.primarySections || primary,
            toolRecommendations: recommendations,
            recommendedFirstAction: persisted.recommendedFirstAction || recommendedFirstAction,
            selectedRecommendedTool:
              persisted.recommendedToolIds?.[0] ||
              primaryRecommendation?.id ||
              'generate-image',
            firstCreationMode: persisted.firstCreation?.mode || null,
            firstCreationTool: persisted.firstCreation?.toolId || null,
            firstCreationStatus: hasCreatedResult ? 'success' : 'idle',
            firstCreationResult: persisted.firstCreation?.outputUrl
              ? {
                  title: 'خروجی آنبوردینگ شما',
                  imageUrl: persisted.firstCreation.outputUrl,
                  dimensions: '2048 x 2048',
                }
              : null,
            activeWorkspaceSection: persisted.primarySections?.[0] || 'ai_tools',
            activeWorkspaceToolId:
              persisted.firstCreation?.toolId ||
              persisted.recommendedToolIds?.[0] ||
              'generate-image',
          }));

          trackOnboardingEvent('onboarding_resumed', {
            completionReason: persisted.completionReason,
            hasCreatedResult,
          });
        } else {
          // Check if there is in-flight progress saved
          const progress = integration.persistence.loadProgress
            ? await integration.persistence.loadProgress(userId)
            : null;

          if (progress && progress.currentStep > 0) {
            const professions = progress.preferences?.professions || [];
            const interests = progress.preferences?.interests || [];
            const archetypes = deriveArchetypes(professions, interests);
            const { primary } = derivePrimarySections(professions, interests);
            const { recommendations, recommendedFirstAction, primaryRecommendation } =
              deriveToolRecommendations(professions, interests);

            setState((prev) => ({
              ...prev,
              lifecycle: 'in_onboarding',
              currentStep: Math.min(progress.currentStep, prev.totalSteps - 1),
              selectedProfessions: professions,
              selectedInterests: interests,
              derivedArchetypes: archetypes,
              primarySections: primary,
              toolRecommendations: recommendations,
              recommendedFirstAction,
              selectedRecommendedTool:
                progress.selectedRecommendedTool ||
                primaryRecommendation?.id ||
                'generate-image',
              firstCreationMode: progress.firstCreationMode || null,
            }));

            trackOnboardingEvent('onboarding_resumed', {
              inFlightStep: progress.currentStep,
            });
          } else {
            // Fresh user
            setState((prev) => ({
              ...prev,
              lifecycle: 'in_onboarding',
              currentStep: 0,
            }));
          }
        }
      } catch (err) {
        console.warn('[LUMA Context] Session hydration error:', err);
        onIntegrationError?.({
          code: 'PERSISTENCE_FAILED',
          message: 'خطا در بارگذاری اطلاعات ذخیره‌شده کاربر.',
          originalError: err,
        });
        if (isMounted) {
          setState((prev) => ({ ...prev, lifecycle: 'in_onboarding' }));
        }
      }
    }

    checkPersistedSession();

    return () => {
      isMounted = false;
    };
  }, [
    currentUser,
    isLoadingUser,
    integration.persistence,
    featureFlags.enableResume,
    mode,
    onIntegrationError,
  ]);

  const nextStep = useCallback(() => {
    const current = stateRef.current;
    const next = current.currentStep + 1;
    const nextStepIndex = Math.min(next, current.totalSteps - 1);

    // Track step advancement
    if (nextStepIndex === 1) trackOnboardingEvent('onboarding_profession_viewed');
    else if (nextStepIndex === 2) trackOnboardingEvent('onboarding_interest_viewed');
    else if (nextStepIndex === 3) {
      trackOnboardingEvent('onboarding_profile_completed', {
        professions: current.selectedProfessions,
        interests: current.selectedInterests,
        derivedArchetypes: current.derivedArchetypes,
      });
    } else if (nextStepIndex === 4) {
      trackOnboardingEvent('onboarding_ecosystem_viewed', {
        primarySections: current.primarySections,
        derivedArchetypes: current.derivedArchetypes,
      });
    } else if (nextStepIndex === 5) {
      trackOnboardingEvent('onboarding_recommendations_viewed', {
        primaryRecommendation: current.toolRecommendations[0]?.id,
        recommendationsCount: current.toolRecommendations.length,
        recommendedFirstAction: current.recommendedFirstAction,
      });
    }

    const updated: OnboardingState = {
      ...current,
      direction: 1,
      currentStep: nextStepIndex,
    };

    // Autosave progress if user ID available
    const userId = currentUser?.id || 'demo_user_1';
    integration.persistence.saveProgress(userId, buildProgressPayload(updated)).catch((err) => {
      console.warn('[Persistence] Autosave progress failed:', err);
    });

    setState(updated);
  }, [currentUser, integration.persistence, buildProgressPayload]);

  const prevStep = useCallback(() => {
    const current = stateRef.current;
    const prevStepIndex = Math.max(current.currentStep - 1, 0);
    trackOnboardingEvent('onboarding_step_back', { fromStep: current.currentStep, toStep: prevStepIndex });
    setState((prev) => ({
      ...prev,
      direction: -1,
      currentStep: prevStepIndex,
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    const current = stateRef.current;
    trackOnboardingEvent('onboarding_preferences_edit_clicked', { fromStep: current.currentStep, targetStep: step });
    setState((prev) => ({
      ...prev,
      direction: (step > prev.currentStep ? 1 : -1) as 1 | -1,
      currentStep: Math.max(0, Math.min(step, prev.totalSteps - 1)),
    }));
  }, []);

  const skipOnboarding = useCallback(() => {
    const current = stateRef.current;
    trackOnboardingEvent('onboarding_step_skipped', { fromStep: current.currentStep });

    const updated: OnboardingState = {
      ...current,
      isSkipped: true,
      onboardingCompleted: true,
      lifecycle: 'transitioning',
      activeWorkspaceSection: 'ai_tools',
    };

    const profile = buildPersistedProfile(updated, 'skipped', 'skipped');
    const userId = currentUser?.id || 'demo_user_1';

    integration.persistence.complete(userId, profile).catch((err) => {
      console.warn('[Persistence] Skip persistence failed:', err);
      onIntegrationError?.({
        code: 'PERSISTENCE_FAILED',
        message: 'خطا در ثبت انصراف از آنبوردینگ.',
        originalError: err,
      });
    });

    setState(updated);

    // Invoke user-provided onSkip callback safely outside render cycle
    setTimeout(() => {
      onSkip?.();
    }, 0);
  }, [currentUser, integration.persistence, buildPersistedProfile, onSkip, onIntegrationError]);

  const completeOnboarding = useCallback(() => {
    const current = stateRef.current;
    const hasResult = Boolean(current.firstCreationResult);
    const completionReason = hasResult ? 'first_creation_success' : 'completed_without_creation';
    const destination = resolveOnboardingDestination(current);

    const updated: OnboardingState = {
      ...current,
      onboardingCompleted: true,
      lifecycle: 'transitioning',
      activeWorkspaceSection: destination.targetSection,
      activeWorkspaceToolId: destination.targetToolId || current.selectedRecommendedTool,
    };

    const profile = buildPersistedProfile(updated, 'completed', completionReason);
    const userId = currentUser?.id || 'demo_user_1';

    integration.persistence.complete(userId, profile).catch((err) => {
      console.warn('[Persistence] Complete persistence failed:', err);
      onIntegrationError?.({
        code: 'PERSISTENCE_FAILED',
        message: 'خطا در ذخیره‌سازی نمایه تکمیل‌شده آنبوردینگ.',
        originalError: err,
      });
    });

    trackOnboardingEvent('onboarding_completion_started', {
      completionReason,
      hasCreatedResult: hasResult,
      targetSection: destination.targetSection,
    });

    setState(updated);

    // Invoke user-provided onComplete callback safely outside render cycle
    setTimeout(() => {
      onComplete?.(profile);
    }, 0);
  }, [currentUser, integration.persistence, buildPersistedProfile, onComplete, onIntegrationError]);

  const startTransitionToWorkspace = useCallback(() => {
    setState((prev) => ({
      ...prev,
      lifecycle: 'transitioning',
    }));
    trackOnboardingEvent('onboarding_transition_triggered');
  }, []);

  const finishTransitionToWorkspace = useCallback(() => {
    const current = stateRef.current;
    const destination = resolveOnboardingDestination(current);

    setState((prev) => ({
      ...prev,
      lifecycle: 'in_workspace',
    }));

    trackOnboardingEvent('onboarding_handoff_completed');

    // Call navigation safely outside of the React render cycle
    setTimeout(() => {
      if (destination.targetToolId) {
        integration.navigation.goToTool(destination.targetToolId);
      } else {
        integration.navigation.goToDashboard();
      }
    }, 0);
  }, [integration.navigation]);

  const relaunchOnboarding = useCallback((step: number = 0) => {
    setState((prev) => ({
      ...prev,
      lifecycle: 'in_onboarding',
      onboardingCompleted: false,
      currentStep: Math.max(0, Math.min(step, prev.totalSteps - 1)),
    }));
    trackOnboardingEvent('onboarding_restarted_from_workspace', { step });
  }, []);

  const resetOnboarding = useCallback(() => {
    setState({
      ...initialState,
      lifecycle: 'in_onboarding',
    });
    trackOnboardingEvent('onboarding_restarted');
  }, []);

  const toggleProfession = useCallback((id: string) => {
    const current = stateRef.current;
    const exists = current.selectedProfessions.includes(id);
    const updated = exists
      ? current.selectedProfessions.filter((p) => p !== id)
      : [...current.selectedProfessions, id];

    if (exists) {
      trackOnboardingEvent('onboarding_profession_deselected', { professionId: id });
    } else {
      trackOnboardingEvent('onboarding_profession_selected', { professionId: id, totalSelected: updated.length });
    }

    const archetypes = deriveArchetypes(updated, current.selectedInterests);
    const { primary } = derivePrimarySections(updated, current.selectedInterests);
    const { recommendations, recommendedFirstAction, primaryRecommendation } = deriveToolRecommendations(
      updated,
      current.selectedInterests
    );

    setState((prev) => ({
      ...prev,
      selectedProfessions: updated,
      derivedArchetypes: archetypes,
      primarySections: primary,
      toolRecommendations: recommendations,
      recommendedFirstAction,
      selectedRecommendedTool: primaryRecommendation?.id || 'generate-image',
    }));
  }, []);

  const toggleInterest = useCallback((id: string): boolean => {
    const current = stateRef.current;
    const exists = current.selectedInterests.includes(id);
    if (!exists && current.selectedInterests.length >= MAX_INTERESTS_SELECTION) {
      return false;
    }

    const updated = exists
      ? current.selectedInterests.filter((i) => i !== id)
      : [...current.selectedInterests, id];

    if (exists) {
      trackOnboardingEvent('onboarding_interest_deselected', { interestId: id });
    } else {
      trackOnboardingEvent('onboarding_interest_selected', { interestId: id, totalSelected: updated.length });
    }

    const archetypes = deriveArchetypes(current.selectedProfessions, updated);
    const { primary } = derivePrimarySections(current.selectedProfessions, updated);
    const { recommendations, recommendedFirstAction, primaryRecommendation } = deriveToolRecommendations(
      current.selectedProfessions,
      updated
    );

    setState((prev) => ({
      ...prev,
      selectedInterests: updated,
      derivedArchetypes: archetypes,
      primarySections: primary,
      toolRecommendations: recommendations,
      recommendedFirstAction,
      selectedRecommendedTool: primaryRecommendation?.id || 'generate-image',
    }));

    return true;
  }, []);

  const setSelectedProfessions = useCallback((professions: string[]) => {
    setState((prev) => {
      const { primary } = derivePrimarySections(professions, prev.selectedInterests);
      const { recommendations, recommendedFirstAction, primaryRecommendation } = deriveToolRecommendations(
        professions,
        prev.selectedInterests
      );
      return {
        ...prev,
        selectedProfessions: professions,
        derivedArchetypes: deriveArchetypes(professions, prev.selectedInterests),
        primarySections: primary,
        toolRecommendations: recommendations,
        recommendedFirstAction,
        selectedRecommendedTool: primaryRecommendation?.id || 'generate-image',
      };
    });
  }, []);

  const setSelectedInterests = useCallback((interests: string[]) => {
    setState((prev) => {
      const { primary } = derivePrimarySections(prev.selectedProfessions, interests);
      const { recommendations, recommendedFirstAction, primaryRecommendation } = deriveToolRecommendations(
        prev.selectedProfessions,
        interests
      );
      return {
        ...prev,
        selectedInterests: interests,
        derivedArchetypes: deriveArchetypes(prev.selectedProfessions, interests),
        primarySections: primary,
        toolRecommendations: recommendations,
        recommendedFirstAction,
        selectedRecommendedTool: primaryRecommendation?.id || 'generate-image',
      };
    });
  }, []);

  const setRecommendedTools = useCallback((tools: string[]) => {
    setState((prev) => ({ ...prev, recommendedTools: tools }));
  }, []);

  const setFirstCreationChoice = useCallback((choice: string | null) => {
    setState((prev) => ({ ...prev, firstCreationChoice: choice }));
  }, []);

  const markSectionExplored = useCallback((sectionId: LumaSectionId) => {
    setState((prev) => {
      if (prev.exploredSections.includes(sectionId)) return prev;
      return {
        ...prev,
        exploredSections: [...prev.exploredSections, sectionId],
      };
    });
  }, []);

  const setGuidedExplorationSkipped = useCallback((skipped: boolean) => {
    setState((prev) => ({ ...prev, guidedExplorationSkipped: skipped }));
  }, []);

  const setEcosystemTourCompleted = useCallback((completed: boolean) => {
    setState((prev) => ({ ...prev, ecosystemTourCompleted: completed }));
  }, []);

  const setSelectedRecommendedTool = useCallback((toolId: string | null) => {
    setState((prev) => {
      if (toolId) {
        trackOnboardingEvent('onboarding_recommendation_opened', { toolId });
      }
      return { ...prev, selectedRecommendedTool: toolId };
    });
  }, []);

  const setFirstCreationMode = useCallback((mode: FirstCreationMode) => {
    setState((prev) => ({ ...prev, firstCreationMode: mode }));
  }, []);

  const proceedToFirstCreation = useCallback((mode: 'recommended' | 'fun', toolId?: string) => {
    setState((prev) => {
      const chosenTool = toolId || prev.selectedRecommendedTool || prev.toolRecommendations[0]?.id || 'generate-image';

      if (mode === 'fun') {
        trackOnboardingEvent('onboarding_fun_path_selected');
      } else {
        trackOnboardingEvent('onboarding_first_action_selected', {
          toolId: chosenTool,
          action: prev.recommendedFirstAction,
        });
      }

      return {
        ...prev,
        firstCreationMode: mode,
        selectedRecommendedTool: chosenTool,
        firstCreationTool: chosenTool,
        direction: 1,
        currentStep: Math.min(prev.currentStep + 1, prev.totalSteps - 1),
      };
    });
  }, []);

  const setCreationDurableState = useCallback((updates: Partial<import('@/types/onboarding').CreationDurableState>) => {
    setState((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetCreationState = useCallback(() => {
    setState((prev) => ({
      ...prev,
      firstCreationPrompt: '',
      firstCreationTemplate: null,
      firstCreationStatus: 'idle',
      firstCreationResult: null,
      firstCreationInputUrl: null,
      creationStartedAt: null,
      creationCompletedAt: null,
    }));
  }, []);

  const setActiveWorkspaceSection = useCallback((sectionId: LumaSectionId) => {
    setState((prev) => {
      trackOnboardingEvent('workspace_section_changed', { sectionId });
      return { ...prev, activeWorkspaceSection: sectionId };
    });
  }, []);

  const setActiveWorkspaceToolId = useCallback((toolId: string | null) => {
    setState((prev) => {
      if (toolId) {
        trackOnboardingEvent('workspace_tool_launched', { toolId });
      }
      return { ...prev, activeWorkspaceToolId: toolId };
    });
  }, []);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      ...state,
      nextStep,
      prevStep,
      goToStep,
      skipOnboarding,
      completeOnboarding,
      resetOnboarding,
      toggleProfession,
      toggleInterest,
      setSelectedProfessions,
      setSelectedInterests,
      setRecommendedTools,
      setFirstCreationChoice,
      markSectionExplored,
      setGuidedExplorationSkipped,
      setEcosystemTourCompleted,
      setSelectedRecommendedTool,
      setFirstCreationMode,
      proceedToFirstCreation,
      setCreationDurableState,
      resetCreationState,
      setActiveWorkspaceSection,
      setActiveWorkspaceToolId,
      startTransitionToWorkspace,
      finishTransitionToWorkspace,
      relaunchOnboarding,
    }),
    [
      state,
      nextStep,
      prevStep,
      goToStep,
      skipOnboarding,
      completeOnboarding,
      resetOnboarding,
      toggleProfession,
      toggleInterest,
      setSelectedProfessions,
      setSelectedInterests,
      setRecommendedTools,
      setFirstCreationChoice,
      markSectionExplored,
      setGuidedExplorationSkipped,
      setEcosystemTourCompleted,
      setSelectedRecommendedTool,
      setFirstCreationMode,
      proceedToFirstCreation,
      setCreationDurableState,
      resetCreationState,
      setActiveWorkspaceSection,
      setActiveWorkspaceToolId,
      startTransitionToWorkspace,
      finishTransitionToWorkspace,
      relaunchOnboarding,
    ]
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
