'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
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
import { trackOnboardingEvent } from '@/lib/analytics';

const TOTAL_STEPS = 7; // 0: Welcome, 1: Profession, 2: Interests, 3: Confirmation/Synthesis, 4: Phase 3 Ecosystem, 5: Phase 4 Recommendations, 6: Temporary Phase 5

const defaultSections = derivePrimarySections([], []);
const defaultRecommendations = deriveToolRecommendations([], []);

const initialState: OnboardingState = {
  currentStep: 0, // 0 = Welcome scene
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
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(initialState);

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
    setState((prev) => ({
      ...prev,
      isSkipped: true,
      onboardingCompleted: true,
    }));
  }, [state.currentStep]);

  const completeOnboarding = useCallback(() => {
    setState((prev) => ({
      ...prev,
      onboardingCompleted: true,
    }));
  }, []);

  const resetOnboarding = useCallback(() => {
    setState(initialState);
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
        direction: 1,
        currentStep: Math.min(prev.currentStep + 1, prev.totalSteps - 1),
      };
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


