export type OnboardingStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type PersonalizationArchetype =
  | 'creative'
  | 'video'
  | 'commerce'
  | 'marketing'
  | 'business'
  | 'automation'
  | 'developer'
  | 'research';

export type LumaSectionId =
  | 'ai_tools'
  | 'ai_chat'
  | 'workflow'
  | 'smart_assistant'
  | 'my_files'
  | 'api_developers';

export type RecommendedFirstAction =
  | 'generate-image'
  | 'edit-image'
  | 'image-to-video'
  | 'text-to-video'
  | 'reference-to-video'
  | 'upscale'
  | 'remove-background'
  | 'virtual-try-on'
  | 'text-to-speech'
  | 'chat'
  | 'workflow'
  | 'assistant'
  | 'api';

export type FirstCreationMode = 'recommended' | 'fun' | null;
export type FirstCreationStatus = 'idle' | 'input' | 'generating' | 'success' | 'error';
export type OnboardingLifecycle = 'initializing' | 'in_onboarding' | 'transitioning' | 'in_workspace';

export interface CreationDurableState {
  firstCreationTool: string | null;
  firstCreationPrompt: string;
  firstCreationTemplate: string | null;
  firstCreationStatus: FirstCreationStatus;
  firstCreationResult: any | null;
  firstCreationInputUrl: string | null;
  creationStartedAt: number | null;
  creationCompletedAt: number | null;
}

export interface ToolRecommendation {
  id: string;
  actionId: RecommendedFirstAction;
  title: string;
  description: string;
  route: string;
  score: number;
  reasons: string[];
  primaryReason: string;
  category: string;
  iconName: string;
  examples: string[];
  previewType: 'image_gen' | 'image_edit' | 'video_gen' | 'img_to_video' | 'ref_video' | 'upscale' | 'bg_remove' | 'try_on' | 'tts' | 'chat' | 'workflow' | 'assistant' | 'api';
  primaryCtaText: string;
  isFastResult: boolean;
}

export interface LumaEcosystemSection {
  id: LumaSectionId;
  title: string;
  shortDescription: string;
  detailedExplanation: string;
  examples: string[];
  iconName: string;
  sidebarId: string;
  accentColor: string;
}

export interface ProfessionOption {
  id: string;
  title: string;
  description: string;
  iconName: string;
  archetypes: PersonalizationArchetype[];
  visualHints: string[]; // Persian keywords shown as subtle float hints around LumaCore
}

export interface InterestOption {
  id: string;
  title: string;
  category: 'visual' | 'video' | 'commerce' | 'social' | 'intelligence' | 'automation' | 'developer' | 'general';
  relevantProfessions: string[]; // Used for smart sorting and recommendation weights
}

export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  direction: 1 | -1; // 1 = forward, -1 = backward
  selectedProfessions: string[];
  selectedInterests: string[];
  recommendedTools: string[];
  firstCreationChoice: string | null;
  onboardingCompleted: boolean;
  isSkipped: boolean;
  derivedArchetypes: PersonalizationArchetype[];
  primarySections: LumaSectionId[];
  exploredSections: LumaSectionId[];
  guidedExplorationSkipped: boolean;
  ecosystemTourCompleted: boolean;
  toolRecommendations: ToolRecommendation[];
  recommendedFirstAction: RecommendedFirstAction;
  selectedRecommendedTool: string | null;
  firstCreationMode: FirstCreationMode;
  // Durable Creation State
  firstCreationTool: string | null;
  firstCreationPrompt: string;
  firstCreationTemplate: string | null;
  firstCreationStatus: FirstCreationStatus;
  firstCreationResult: any | null;
  firstCreationInputUrl: string | null;
  creationStartedAt: number | null;
  creationCompletedAt: number | null;
  // Phase 6 Lifecycle & Workspace State
  lifecycle: OnboardingLifecycle;
  activeWorkspaceSection: LumaSectionId;
  activeWorkspaceToolId: string | null;
}

export interface OnboardingContextValue extends OnboardingState {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  toggleProfession: (id: string) => void;
  toggleInterest: (id: string) => boolean; // Returns true if added/toggled, false if limit reached
  setSelectedProfessions: (professions: string[]) => void;
  setSelectedInterests: (interests: string[]) => void;
  setRecommendedTools: (tools: string[]) => void;
  setFirstCreationChoice: (choice: string | null) => void;
  markSectionExplored: (sectionId: LumaSectionId) => void;
  setGuidedExplorationSkipped: (skipped: boolean) => void;
  setEcosystemTourCompleted: (completed: boolean) => void;
  setSelectedRecommendedTool: (toolId: string | null) => void;
  setFirstCreationMode: (mode: FirstCreationMode) => void;
  proceedToFirstCreation: (mode: 'recommended' | 'fun', toolId?: string) => void;
  setCreationDurableState: (updates: Partial<CreationDurableState>) => void;
  resetCreationState: () => void;
  // Phase 6 Methods
  setActiveWorkspaceSection: (sectionId: LumaSectionId) => void;
  setActiveWorkspaceToolId: (toolId: string | null) => void;
  startTransitionToWorkspace: () => void;
  finishTransitionToWorkspace: () => void;
  relaunchOnboarding: (step?: number) => void;
}


