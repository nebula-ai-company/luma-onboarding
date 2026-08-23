'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type {
  OnboardingState,
  OnboardingContextValue,
  LumaSectionId,
  RecommendedFirstAction,
  FirstCreationMode,
  OnboardingLifecycle,
} from '@/types/onboarding';
import {
  deriveArchetypes,
  derivePrimarySections,
  deriveToolRecommendations,
  MAX_INTERESTS_SELECTION,
} from '@/lib/onboarding-data';
import { trackOnboardingEvent } from '@/lib/analytics';
import {
  persistenceAdapter,
  ONBOARDING_VERSION,
  type PersistedOnboardingData,
  type OnboardingCompletionPath,
} from '@/lib/persistence-adapter';
import { resolveOnboardingDestination } from '@/lib/destination-resolver';

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
  // Phase 6 Lifecycle & Workspace
  lifecycle: 'initializing',
  activeWorkspaceSection: 'ai_tools',
  activeWorkspaceToolId: defaultRecommendations.primaryRecommendation?.id || 'generate-image',
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(initialState);

  // Helper to construct durable persistence payload
  const buildPersistedSnapshot = useCallback(
    (
      currentState: OnboardingState,
      completionPath: OnboardingCompletionPath,
      completedTime: string | null
    ): PersistedOnboardingData => {
      const destination = resolveOnboardingDestination(currentState);

      return {
        version: ONBOARDING_VERSION,
        completedAt: completedTime,
        isSkipped: currentState.isSkipped || completionPath === 'skipped',
        completionPath,
        profile: {
          professions: currentState.selectedProfessions,
          interests: currentState.selectedInterests,
          archetypes: currentState.derivedArchetypes,
        },
        ecosystem: {
          primarySections: currentState.primarySections,
          exploredSections: currentState.exploredSections,
          ecosystemTourCompleted: currentState.ecosystemTourCompleted,
        },
        recommendations: {
          recommendedToolIds: currentState.recommendedTools,
          recommendedFirstAction: currentState.recommendedFirstAction,
          selectedRecommendedTool: currentState.selectedRecommendedTool,
          toolRecommendations: currentState.toolRecommendations,
        },
        creation: {
          mode: currentState.firstCreationMode,
          hasCreatedResult: Boolean(currentState.firstCreationResult),
          toolId: currentState.firstCreationTool,
          prompt: currentState.firstCreationPrompt || null,
          templateId: currentState.firstCreationTemplate,
          result: currentState.firstCreationResult,
          inputUrl: currentState.firstCreationInputUrl,
          durationSeconds:
            currentState.creationStartedAt && currentState.creationCompletedAt
              ? (currentState.creationCompletedAt - currentState.creationStartedAt) / 1000
              : undefined,
        },
        destination: {
          targetSection: destination.targetSection,
          targetToolId: destination.targetToolId,
          route: destination.route,
          reason: destination.reasonPersian,
        },
        metadata: {
          lastUpdated: new Date().toISOString(),
          clientTimestamp: Date.now(),
        },
      };
    },
    []
  );

  // Restore existing session on mount
  useEffect(() => {
    let isMounted = true;

    async function checkPersistedSession() {
      try {
        const persisted = await persistenceAdapter.load();
        if (!isMounted) return;

        if (persisted && persisted.completedAt) {
          // Returning user with completed onboarding
          const professions = persisted.profile.professions || [];
          const interests = persisted.profile.interests || [];
          const archetypes = deriveArchetypes(professions, interests);
          const { primary } = derivePrimarySections(professions, interests);
          const { recommendations, recommendedFirstAction, primaryRecommendation } =
            deriveToolRecommendations(professions, interests);

          setState((prev) => ({
            ...prev,
            lifecycle: 'in_workspace',
            onboardingCompleted: true,
            isSkipped: persisted.isSkipped,
            selectedProfessions: professions,
            selectedInterests: interests,
            derivedArchetypes: archetypes,
            primarySections: primary,
            toolRecommendations: recommendations,
            recommendedFirstAction,
            selectedRecommendedTool:
              persisted.recommendations.selectedRecommendedTool ||
              primaryRecommendation?.id ||
              'generate-image',
            firstCreationMode: persisted.creation.mode,
            firstCreationTool: persisted.creation.toolId,
            firstCreationPrompt: persisted.creation.prompt || '',
            firstCreationTemplate: persisted.creation.templateId,
            firstCreationStatus: persisted.creation.hasCreatedResult ? 'success' : 'idle',
            firstCreationResult: persisted.creation.result,
            activeWorkspaceSection: persisted.destination?.targetSection || 'ai_tools',
            activeWorkspaceToolId:
              persisted.destination?.targetToolId ||
              persisted.creation.toolId ||
              primaryRecommendation?.id ||
              'generate-image',
          }));

          trackOnboardingEvent('onboarding_resumed', {
            completionPath: persisted.completionPath,
            hasCreatedResult: persisted.creation.hasCreatedResult,
          });
        } else {
          // Fresh user
          setState((prev) => ({
            ...prev,
            lifecycle: 'in_onboarding',
          }));
        }
      } catch (err) {
        console.warn('[LUMA Context] Session hydration error:', err);
        if (isMounted) {
          setState((prev) => ({ ...prev, lifecycle: 'in_onboarding' }));
        }
      }
    }

    checkPersistedSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      const next = prev.currentStep + 1;
      const nextStepIndex = Math.min(next, prev.totalSteps - 1);

      // Track step advancement
      if (nextStepIndex === 1) trackOnboardingEvent('onboarding_profession_viewed');
      else if (nextStepIndex === 2) trackOnboardingEvent('onboarding_interest_viewed');
      else if (nextStepIndex === 3) {
        trackOnboardingEvent('onboarding_profile_completed', {
          professions: prev.selectedProfessions,
          interests: prev.selectedInterests,
          derivedArchetypes: prev.derivedArchetypes,
        });
      } else if (nextStepIndex === 4) {
        trackOnboardingEvent('onboarding_ecosystem_viewed', {
          primarySections: prev.primarySections,
          derivedArchetypes: prev.derivedArchetypes,
        });
      } else if (nextStepIndex === 5) {
        trackOnboardingEvent('onboarding_recommendations_viewed', {
          primaryRecommendation: prev.toolRecommendations[0]?.id,
          recommendationsCount: prev.toolRecommendations.length,
          recommendedFirstAction: prev.recommendedFirstAction,
        });
      }

      return {
        ...prev,
        direction: 1,
        currentStep: nextStepIndex,
      };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => {
      const prevStepIndex = Math.max(prev.currentStep - 1, 0);
      trackOnboardingEvent('onboarding_step_back', { fromStep: prev.currentStep, toStep: prevStepIndex });
      return {
        ...prev,
        direction: -1,
        currentStep: prevStepIndex,
      };
    });
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => {
      trackOnboardingEvent('onboarding_preferences_edit_clicked', { fromStep: prev.currentStep, targetStep: step });
      return {
        ...prev,
        direction: step > prev.currentStep ? 1 : -1,
        currentStep: Math.max(0, Math.min(step, prev.totalSteps - 1)),
      };
    });
  }, []);

  const skipOnboarding = useCallback(() => {
    trackOnboardingEvent('onboarding_step_skipped', { fromStep: state.currentStep });
    
    setState((prev) => {
      const updated: OnboardingState = {
        ...prev,
        isSkipped: true,
        onboardingCompleted: true,
        lifecycle: 'transitioning',
        activeWorkspaceSection: 'ai_tools',
      };

      const snapshot = buildPersistedSnapshot(updated, 'skipped', new Date().toISOString());
      persistenceAdapter.save(snapshot);

      return updated;
    });
  }, [state.currentStep, buildPersistedSnapshot]);

  const completeOnboarding = useCallback(() => {
    setState((prev) => {
      const hasResult = Boolean(prev.firstCreationResult);
      const completionPath: OnboardingCompletionPath = hasResult ? 'created_result' : 'completed_flow';
      
      const destination = resolveOnboardingDestination(prev);

      const updated: OnboardingState = {
        ...prev,
        onboardingCompleted: true,
        lifecycle: 'transitioning',
        activeWorkspaceSection: destination.targetSection,
        activeWorkspaceToolId: destination.targetToolId || prev.selectedRecommendedTool,
      };

      const snapshot = buildPersistedSnapshot(updated, completionPath, new Date().toISOString());
      persistenceAdapter.save(snapshot);

      trackOnboardingEvent('onboarding_completion_started', {
        completionPath,
        hasCreatedResult: hasResult,
        targetSection: destination.targetSection,
      });

      return updated;
    });
  }, [buildPersistedSnapshot]);

  const startTransitionToWorkspace = useCallback(() => {
    setState((prev) => ({
      ...prev,
      lifecycle: 'transitioning',
    }));
    trackOnboardingEvent('onboarding_transition_triggered');
  }, []);

  const finishTransitionToWorkspace = useCallback(() => {
    setState((prev) => ({
      ...prev,
      lifecycle: 'in_workspace',
    }));
    trackOnboardingEvent('onboarding_handoff_completed');
  }, []);

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
    persistenceAdapter.clear();
    setState({
      ...initialState,
      lifecycle: 'in_onboarding',
    });
  }, []);

  const toggleProfession = useCallback((id: string) => {
    setState((prev) => {
      const exists = prev.selectedProfessions.includes(id);
      const updated = exists
        ? prev.selectedProfessions.filter((p) => p !== id)
        : [...prev.selectedProfessions, id];

      if (exists) {
        trackOnboardingEvent('onboarding_profession_deselected', { professionId: id });
      } else {
        trackOnboardingEvent('onboarding_profession_selected', { professionId: id, totalSelected: updated.length });
      }

      const archetypes = deriveArchetypes(updated, prev.selectedInterests);
      const { primary } = derivePrimarySections(updated, prev.selectedInterests);
      const { recommendations, recommendedFirstAction, primaryRecommendation } = deriveToolRecommendations(
        updated,
        prev.selectedInterests
      );

      return {
        ...prev,
        selectedProfessions: updated,
        derivedArchetypes: archetypes,
        primarySections: primary,
        toolRecommendations: recommendations,
        recommendedFirstAction,
        selectedRecommendedTool: primaryRecommendation?.id || 'generate-image',
      };
    });
  }, []);

  const toggleInterest = useCallback((id: string): boolean => {
    let allowed = true;
    setState((prev) => {
      const exists = prev.selectedInterests.includes(id);
      if (!exists && prev.selectedInterests.length >= MAX_INTERESTS_SELECTION) {
        allowed = false;
        return prev;
      }

      const updated = exists
        ? prev.selectedInterests.filter((i) => i !== id)
        : [...prev.selectedInterests, id];

      if (exists) {
        trackOnboardingEvent('onboarding_interest_deselected', { interestId: id });
      } else {
        trackOnboardingEvent('onboarding_interest_selected', { interestId: id, totalSelected: updated.length });
      }

      const archetypes = deriveArchetypes(prev.selectedProfessions, updated);
      const { primary } = derivePrimarySections(prev.selectedProfessions, updated);
      const { recommendations, recommendedFirstAction, primaryRecommendation } = deriveToolRecommendations(
        prev.selectedProfessions,
        updated
      );

      return {
        ...prev,
        selectedInterests: updated,
        derivedArchetypes: archetypes,
        primarySections: primary,
        toolRecommendations: recommendations,
        recommendedFirstAction,
        selectedRecommendedTool: primaryRecommendation?.id || 'generate-image',
      };
    });
    return allowed;
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
