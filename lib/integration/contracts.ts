import type { PersonalizationArchetype, LumaSectionId, RecommendedFirstAction, FirstCreationMode } from '@/types/onboarding';

export type { PersonalizationArchetype, LumaSectionId, RecommendedFirstAction, FirstCreationMode };

// ============================================================================
// 1. CANONICAL IDENTIFIERS & METADATA
// ============================================================================

export const ONBOARDING_SCHEMA_VERSION = '2.0.0';

export const LUMA_TOOL_IDS = {
  GENERATE_IMAGE: 'generate-image',
  EDIT_IMAGE: 'edit-image',
  IMAGE_TO_VIDEO: 'image-to-video',
  TEXT_TO_VIDEO: 'text-to-video',
  REFERENCE_TO_VIDEO: 'reference-to-video',
  UPSCALE: 'upscale',
  REMOVE_BACKGROUND: 'remove-background',
  VIRTUAL_TRY_ON: 'virtual-try-on',
  TEXT_TO_SPEECH: 'text-to-speech',
  CHAT: 'chat',
  WORKFLOW: 'workflow',
  ASSISTANT: 'assistant',
  API: 'api',
} as const;

export type LumaCanonicalToolId = (typeof LUMA_TOOL_IDS)[keyof typeof LUMA_TOOL_IDS];

export const LUMA_SECTION_IDS = {
  AI_TOOLS: 'ai_tools',
  AI_CHAT: 'ai_chat',
  WORKFLOW: 'workflow',
  SMART_ASSISTANT: 'smart_assistant',
  MY_FILES: 'my_files',
  API_DEVELOPERS: 'api_developers',
} as const;

export type LumaCanonicalSectionId = (typeof LUMA_SECTION_IDS)[keyof typeof LUMA_SECTION_IDS];

// ============================================================================
// 2. ERROR TAXONOMY & CODES
// ============================================================================

export type OnboardingIntegrationErrorCode =
  | 'NETWORK_ERROR'
  | 'UPLOAD_FAILED'
  | 'GENERATION_FAILED'
  | 'UNSUPPORTED_FILE'
  | 'INSUFFICIENT_BALANCE'
  | 'SERVICE_UNAVAILABLE'
  | 'PERSISTENCE_FAILED'
  | 'UNKNOWN';

export interface OnboardingIntegrationError {
  code: OnboardingIntegrationErrorCode;
  message: string;
  userMessagePersian: string;
  originalError?: unknown;
  retryable?: boolean;
}

// ============================================================================
// 3. USER INTEGRATION CONTRACT
// ============================================================================

export interface LumaOnboardingUser {
  id: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
  tier?: 'free' | 'pro' | 'enterprise';
  lumBalance?: number;
  onboardingCompleted?: boolean;
  isExistingLegacyUser?: boolean;
  createdAt?: string;
}

export interface UserIntegrationAdapter {
  getCurrentUser(): Promise<LumaOnboardingUser | null>;
}

// ============================================================================
// 4. PERSISTENCE PAYLOAD & ADAPTER
// ============================================================================

export interface OnboardingPreferences {
  professions: string[];
  interests: string[];
  archetypes: PersonalizationArchetype[];
}

export interface PersistedOnboardingProgress {
  currentStep: number;
  preferences: Partial<OnboardingPreferences>;
  selectedRecommendedTool?: string | null;
  firstCreationMode?: FirstCreationMode;
  lastUpdated: string;
}

export interface PersistedOnboardingProfile {
  onboardingVersion: string;
  lifecycle: 'completed' | 'skipped';
  completionReason:
    | 'first_creation_success'
    | 'completed_without_creation'
    | 'skipped';
  preferences: OnboardingPreferences;
  primarySections: LumaSectionId[];
  recommendedToolIds: string[];
  recommendedFirstAction: RecommendedFirstAction | null;
  firstCreation?: {
    mode: FirstCreationMode;
    toolId?: string;
    inputAssetId?: string;
    outputAssetId?: string;
    outputUrl?: string;
    outputType?: 'image' | 'video' | 'audio' | 'text';
    succeeded: boolean;
  };
  firstCompletedAt?: string;
  lastCompletedAt: string;
}

export interface OnboardingPersistenceAdapter {
  loadProfile(userId: string): Promise<PersistedOnboardingProfile | null>;
  loadProgress?(userId: string): Promise<PersistedOnboardingProgress | null>;
  saveProgress(userId: string, progress: PersistedOnboardingProgress): Promise<void>;
  complete(userId: string, profile: PersistedOnboardingProfile): Promise<void>;
  updatePreferences(userId: string, preferences: OnboardingPreferences): Promise<void>;
  reset?(userId: string): Promise<void>;
}

// ============================================================================
// 5. ASSET INTEGRATION CONTRACT
// ============================================================================

export interface UploadedAsset {
  id: string;
  previewUrl?: string;
  fileSizeBytes?: number;
  mimeType?: string;
}

export interface AssetReference {
  id: string;
  url: string;
  mimeType?: string;
  createdAt?: string;
}

export interface AssetIntegrationAdapter {
  upload(
    file: File,
    options?: {
      signal?: AbortSignal;
      onProgress?: (percent: number) => void;
    }
  ): Promise<UploadedAsset>;

  getAsset(assetId: string): Promise<AssetReference | null>;
}

// ============================================================================
// 6. CREATION & WORKFLOW ADAPTER CONTRACT
// ============================================================================

export type CreationSemanticStatus =
  | 'analyzing'
  | 'uploading'
  | 'queued'
  | 'processing'
  | 'finalizing'
  | 'completed'
  | 'failed';

export interface OnboardingCreationRequest {
  requestId?: string; // Idempotency key
  toolId: string;
  mode: 'recommended' | 'fun';
  prompt?: string;
  inputAssetId?: string;
  workflowTemplateId?: string;
  options?: Record<string, unknown>;
}

export interface OnboardingCreationResult {
  success: boolean;
  jobId?: string;
  assetId?: string;
  outputType?: 'image' | 'video' | 'audio' | 'text';
  outputUrl?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  title?: string;
  chatResponseText?: string;
  aspectRatio?: string;
  dimensions?: string;
  fileSizeBytes?: number;
  generationTimeSeconds?: number;
  errorCode?: OnboardingIntegrationErrorCode;
  errorMessage?: string;
  estimatedCostLum?: number;
}

export interface FunWorkflowTemplate {
  onboardingTemplateId: string;
  title: string;
  tagline: string;
  description: string;
  previewAsset: string;
  beforeSampleUrl?: string;
  afterSampleUrl?: string;
  promptExample: string;
  badge: string;
  iconName: string;
  gradient: string;
  productionWorkflowId?: string;
}

export type CreationStatusCallback = (
  status: CreationSemanticStatus,
  message?: string,
  progressPercent?: number
) => void;

export interface CreationExecuteOptions {
  signal?: AbortSignal;
  onStatus?: CreationStatusCallback;
}

export type CreationExecuteParams = OnboardingCreationRequest;
export type CreationJobResult = OnboardingCreationResult;
export type CreationIntegrationAdapter = OnboardingCreationAdapter;

export interface OnboardingCreationAdapter {
  readonly isSimulation: boolean;

  create(
    request: OnboardingCreationRequest,
    options?: CreationExecuteOptions
  ): Promise<OnboardingCreationResult>;

  isWorkflowAvailable?(workflowTemplateId?: string): Promise<boolean> | boolean;
}

// ============================================================================
// 7. NAVIGATION INTEGRATION CONTRACT
// ============================================================================

export type OnboardingDestination =
  | { type: 'dashboard' }
  | { type: 'tool'; toolId: string }
  | { type: 'workflow'; workflowId?: string }
  | { type: 'files'; highlightAssetId?: string }
  | { type: 'assistant' }
  | { type: 'developers' }
  | { type: 'billing' };

export interface NavigationIntegrationAdapter {
  goToDashboard(): void;
  goToTool(toolId: string): void;
  goToFiles(highlightAssetId?: string): void;
  goToWorkflow(workflowId?: string): void;
  goToAssistant(): void;
  goToDevelopers(): void;
  goToBilling?(): void;
  navigate?(destination: OnboardingDestination): void;
}

// ============================================================================
// 8. ANALYTICS INTEGRATION CONTRACT
// ============================================================================

export type OnboardingAnalyticsEvent =
  | 'onboarding_welcome_viewed'
  | 'onboarding_profession_viewed'
  | 'onboarding_profession_selected'
  | 'onboarding_profession_deselected'
  | 'onboarding_interest_viewed'
  | 'onboarding_interest_selected'
  | 'onboarding_interest_deselected'
  | 'onboarding_profile_completed'
  | 'onboarding_step_back'
  | 'onboarding_step_skipped'
  | 'onboarding_ecosystem_viewed'
  | 'onboarding_section_highlighted'
  | 'onboarding_section_opened'
  | 'onboarding_recommendations_requested'
  | 'onboarding_recommendations_viewed'
  | 'onboarding_recommendation_opened'
  | 'onboarding_primary_recommendation_clicked'
  | 'onboarding_preferences_edit_clicked'
  | 'onboarding_first_action_selected'
  | 'onboarding_fun_path_selected'
  | 'onboarding_creation_viewed'
  | 'onboarding_creation_mode_changed'
  | 'onboarding_creation_input_added'
  | 'onboarding_creation_preset_selected'
  | 'onboarding_fun_template_selected'
  | 'onboarding_fun_sample_selected'
  | 'onboarding_creation_started'
  | 'onboarding_creation_succeeded'
  | 'onboarding_creation_failed'
  | 'onboarding_completion_started'
  | 'onboarding_transition_triggered'
  | 'onboarding_handoff_completed'
  | 'onboarding_persisted'
  | 'onboarding_resumed'
  | 'onboarding_restarted';

export interface AnalyticsIntegrationAdapter {
  track(
    event: OnboardingAnalyticsEvent,
    properties?: Record<string, unknown>
  ): void | Promise<void>;
}

// ============================================================================
// 9. FEATURE FLAGS & ENVIRONMENT
// ============================================================================

export interface OnboardingFeatureFlags {
  enableFirstCreation: boolean;
  enableFunCreation: boolean;
  enableResume: boolean;
  enableDashboardPersonalization: boolean;
  enableNewUserOnboarding?: boolean;
}

export type OnboardingEnvironment = 'development' | 'integration' | 'production';

// ============================================================================
// 10. CENTRAL INTEGRATION CONTRACT
// ============================================================================

export interface LumaOnboardingIntegration {
  user: UserIntegrationAdapter;
  persistence: OnboardingPersistenceAdapter;
  creation: OnboardingCreationAdapter;
  assets: AssetIntegrationAdapter;
  navigation: NavigationIntegrationAdapter;
  analytics: AnalyticsIntegrationAdapter;
  featureFlags?: Partial<OnboardingFeatureFlags>;
  environment?: OnboardingEnvironment;
}

// ============================================================================
// 11. DASHBOARD PERSONALIZATION OUTPUT
// ============================================================================

export interface DashboardPersonalization {
  highlightedSections: LumaSectionId[];
  recommendedToolIds: string[];
  recommendedFirstAction: RecommendedFirstAction | null;
  primaryArchetypes: PersonalizationArchetype[];
}
