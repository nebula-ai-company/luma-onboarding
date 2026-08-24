/**
 * LUMA Onboarding — Public Integration API Entry Point
 * 
 * This module exports the complete public interface required by the host LUMA application.
 */

// 1. Core Integration Provider & Hooks
export {
  LumaOnboardingIntegrationProvider,
  useLumaIntegration,
  useLumaAdapters,
  useLumaFeatureFlags,
  useLumaCurrentUser,
  type LumaOnboardingIntegrationProviderProps,
  type LumaIntegrationContextValue,
} from '@/context/LumaIntegrationContext';

// 2. High-Level Onboarding Component & Context
export {
  LumaOnboarding,
  type LumaOnboardingProps,
} from '@/components/onboarding/LumaOnboarding';

export {
  OnboardingProvider,
  useOnboarding,
  type OnboardingProviderProps,
} from '@/context/OnboardingContext';

// 3. Integration Contracts & Types
export type {
  LumaOnboardingIntegration,
  OnboardingEnvironment,
  OnboardingFeatureFlags,
  LumaOnboardingUser,
  UserIntegrationAdapter,
  OnboardingPreferences,
  PersistedOnboardingProgress,
  PersistedOnboardingProfile,
  OnboardingPersistenceAdapter,
  UploadedAsset,
  AssetReference,
  AssetIntegrationAdapter,
  CreationStatusCallback,
  CreationExecuteParams,
  CreationExecuteOptions,
  CreationJobResult,
  CreationIntegrationAdapter,
  NavigationIntegrationAdapter,
  OnboardingAnalyticsEvent,
  AnalyticsIntegrationAdapter,
  FirstCreationMode,
  LumaSectionId,
  PersonalizationArchetype,
  RecommendedFirstAction,
  FunWorkflowTemplate,
} from './contracts';

export {
  ONBOARDING_SCHEMA_VERSION,
} from './contracts';

// 4. Default Constants & Error System
export {
  DEFAULT_FEATURE_FLAGS,
  FUN_WORKFLOW_TEMPLATES,
} from './constants';

export {
  createIntegrationError,
  isIntegrationError,
  ERROR_MESSAGES_FA,
  type OnboardingIntegrationError,
  type OnboardingIntegrationErrorCode,
} from './errors';

// 5. Validation & Migration Helpers
export {
  validateOnboardingIntegration,
  validatePersistedProfile,
  migrateOnboardingProfile,
  getDashboardPersonalization,
  type IntegrationValidationResult,
} from './validation';

// 6. Adapter Factories & Implementations
export {
  createDevelopmentIntegration,
  DevelopmentUserAdapter,
  DevelopmentPersistenceAdapter,
  DevelopmentAssetAdapter,
  DevelopmentCreationAdapter,
  DevelopmentNavigationAdapter,
  DevelopmentAnalyticsAdapter,
} from './adapters/development';

export {
  createProductionIntegration,
  ProductionUserAdapter as ConcreteProductionUserAdapter,
  ProductionPersistenceAdapter as ConcreteProductionPersistenceAdapter,
  ProductionNavigationAdapter as ConcreteProductionNavigationAdapter,
  ProductionAnalyticsAdapter as ConcreteProductionAnalyticsAdapter,
  ProductionAssetAdapter as ConcreteProductionAssetAdapter,
  ProductionCreationAdapter as ConcreteProductionCreationAdapter,
} from './adapters/production';

export {
  createProductionIntegrationStub,
  ProductionUserAdapter,
  ProductionPersistenceAdapter,
  ProductionAssetAdapter,
  ProductionCreationAdapter,
  ProductionNavigationAdapter,
  ProductionAnalyticsAdapter,
  type ProductionStubConfig,
} from './adapters/production-stub';
