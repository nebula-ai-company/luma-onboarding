# LUMA Onboarding — Production Integration Guide

This document defines how the host LUMA application integrates, mounts, and configures the `luma-onboarding` package.

---

## 1. Architecture Overview

The onboarding system is designed with a strict **dependency-injected adapter architecture**. The UI and state machine are completely decoupled from storage backends, AI providers, routing frameworks, and analytics SDKs.

```text
       LUMA Application (Host)
                 ↓
  LumaOnboardingIntegrationProvider
                 ↓
        Integration Adapters
  (User · Persistence · Creation · Assets · Navigation · Analytics)
                 ↓
        Onboarding State + UI
```

### Component Breakdown
- **`LumaOnboardingIntegrationProvider`**: Context wrapper that accepts adapters, environment flags, and feature toggles, making them available to the entire onboarding hierarchy.
- **`OnboardingProvider` / `LumaOnboarding`**: State engine managing multi-step progression, archetype inference, tool recommendation logic, durable creation state, and handoff transitions.
- **Integration Adapters**: Modular contracts that the host LUMA app implements to connect its backend, router, and cloud storage.

---

## 2. Minimal Integration Example

The host application connects its production services through the `LumaOnboardingIntegrationProvider` and mounts `<LumaOnboarding />`.

```tsx
import React from 'react';
import {
  LumaOnboardingIntegrationProvider,
  LumaOnboarding,
  type LumaOnboardingIntegration,
} from '@/lib/integration';
import {
  userAdapter,
  persistenceAdapter,
  creationAdapter,
  assetAdapter,
  navigationAdapter,
  analyticsAdapter,
} from '@/services/luma-adapters';

const integration: LumaOnboardingIntegration = {
  environment: 'production',
  user: userAdapter,
  persistence: persistenceAdapter,
  creation: creationAdapter,
  assets: assetAdapter,
  navigation: navigationAdapter,
  analytics: analyticsAdapter,
};

export default function OnboardingRoute() {
  return (
    <LumaOnboardingIntegrationProvider
      integration={integration}
      featureFlags={{
        enableFirstCreation: true,
        enableFunCreation: true,
        enableResume: true,
        enableDashboardPersonalization: true,
      }}
    >
      <LumaOnboarding
        mode="first-run"
        onComplete={(profile) => {
          console.log('[LUMA] Onboarding complete:', profile);
        }}
        onSkip={() => {
          console.log('[LUMA] Onboarding skipped');
        }}
        onIntegrationError={(error) => {
          console.error('[LUMA] Integration error:', error.code, error.message);
        }}
      />
    </LumaOnboardingIntegrationProvider>
  );
}
```

---

## 3. Adapter Contracts Specification

All adapters are strictly typed interfaces defined in `@/lib/integration/contracts.ts`.

### 3.1 User Adapter (`UserIntegrationAdapter`)
Provides current authenticated user information to onboarding.

- **Interface**: `UserIntegrationAdapter`
- **Methods**:
  - `getCurrentUser(): Promise<LumaOnboardingUser | null>`
    - **Input**: None
    - **Output**: `{ id: string; name?: string; email?: string; avatarUrl?: string; tier?: 'free' | 'pro' | 'enterprise'; }`
    - **Failure Behavior**: Resolves `null` if unauthenticated; raises error if network fails.
  - `getUserToken?(): Promise<string | null>` (Optional)
    - **Input**: None
    - **Output**: Bearer token string or `null`.

### 3.2 Persistence Adapter (`OnboardingPersistenceAdapter`)
Loads and persists user onboarding progress and completed profiles.

- **Interface**: `OnboardingPersistenceAdapter`
- **Methods**:
  - `loadProfile(userId: string): Promise<PersistedOnboardingProfile | null>`
    - **Input**: User ID
    - **Output**: Completed profile object matching schema `2.0.0`, or `null` if the user has not completed onboarding.
    - **Failure Behavior**: Throws `OnboardingIntegrationError` with code `PERSISTENCE_FAILED`.
  - `loadProgress?(userId: string): Promise<PersistedOnboardingProgress | null>` (Optional)
    - **Input**: User ID
    - **Output**: Saved in-flight progress (step index, selected professions/interests), or `null`.
  - `saveProgress(userId: string, progress: PersistedOnboardingProgress): Promise<void>`
    - **Input**: User ID and current in-flight state.
    - **Output**: `Promise<void>`
    - **Failure Behavior**: Logs warning or emits error; non-blocking to user step navigation.
  - `complete(userId: string, profile: PersistedOnboardingProfile): Promise<void>`
    - **Input**: User ID and finalized `PersistedOnboardingProfile`.
    - **Output**: `Promise<void>`
    - **Failure Behavior**: Throws error and triggers `onIntegrationError` callback.
  - `updatePreferences(userId: string, preferences: OnboardingPreferences): Promise<void>`
    - **Input**: User ID and updated `{ professions, interests, archetypes }`.
  - `reset?(userId: string): Promise<void>` (Optional)
    - **Input**: User ID to clear persisted data.

### 3.3 Creation Adapter (`CreationIntegrationAdapter`)
Executes first-creation jobs through real LUMA AI microservices with progress feedback.

- **Interface**: `CreationIntegrationAdapter`
- **Methods**:
  - `create(params: CreationExecuteParams, options?: CreationExecuteOptions): Promise<CreationJobResult>`
    - **Input `params`**:
      - `requestId`: Unique string for idempotency
      - `toolId`: Target tool (e.g., `'generate-image'`, `'edit-image'`, `'image-to-video'`)
      - `mode`: `'recommended'` | `'fun'`
      - `prompt`: User prompt or selected prompt string
      - `inputAssetId` / `inputAssetUrl`: Uploaded image ID or reference URL
      - `workflowTemplateId`?: Fun transform template ID
    - **Input `options`**:
      - `signal`?: `AbortSignal` for cancellation
      - `onStatus`?: `(status: 'analyzing' | 'uploading' | 'processing' | 'finalizing' | 'completed', message?: string, progressPercent?: number) => void`
    - **Output `CreationJobResult`**:
      - `success`: `boolean`
      - `assetId`?: Generated asset ID
      - `outputUrl`?: Result media URL
      - `outputType`?: `'image'` | `'video'` | `'audio'` | `'text'`
      - `dimensions`?: `'2048 x 2048'`
      - `generationTimeSeconds`?: Generation duration
      - `estimatedCostLum`?: Credits used
      - `errorCode`? / `errorMessage`?: Error details if failed
    - **Failure Behavior**: Returns `{ success: false, errorCode: 'INSUFFICIENT_CREDITS' | 'GENERATION_FAILED' | ... }` or throws an error.

### 3.4 Asset Adapter (`AssetIntegrationAdapter`)
Handles file uploads (user images for avatars/transforms) to cloud storage.

- **Interface**: `AssetIntegrationAdapter`
- **Methods**:
  - `upload(file: File, options?: { onProgress?: (percent: number) => void }): Promise<UploadedAsset>`
    - **Input**: Raw `File` object from file picker or drag-and-drop
    - **Output**: `{ id: string; previewUrl?: string; fileSizeBytes?: number; mimeType?: string }`
    - **Failure Behavior**: Throws error if size exceeds limit (>10MB) or network fails.
  - `getAssetUrl?(assetId: string): Promise<string>` (Optional)
  - `cleanup?(assetId: string): Promise<void>` (Optional)

### 3.5 Navigation Adapter (`NavigationIntegrationAdapter`)
Maps onboarding semantic exit destinations into real host application routes.

- **Interface**: `NavigationIntegrationAdapter`
- **Methods**:
  - `goToDashboard(): void`: Routes to primary LUMA dashboard.
  - `goToSection(sectionId: LumaSectionId): void`: Routes to specific dashboard section (`'ai_tools'`, `'workflows'`, `'file_manager'`, `'developers'`, `'billing'`).
  - `goToTool(toolId: string, options?: { initialAssetId?: string; prompt?: string }): void`: Deep-links into a specific creation tool with preloaded context.
  - `goToWorkflow(workflowId: string): void`: Deep-links into a workflow canvas.
  - `goToFiles(folderId?: string): void`: Routes to user asset storage.
  - `goToDevelopers?(): void`
  - `goToBilling?(): void`
  - `navigate?(route: string): void`

### 3.6 Analytics Adapter (`AnalyticsIntegrationAdapter`)
Forwards onboarding telemetry events to the host analytics infrastructure (Mixpanel, PostHog, Google Analytics, Datadog).

- **Interface**: `AnalyticsIntegrationAdapter`
- **Methods**:
  - `trackEvent(event: OnboardingAnalyticsEvent): void`
    - **Input**:
      - `eventName`: Standard event name (e.g., `'onboarding_step_viewed'`, `'onboarding_profession_selected'`, `'onboarding_creation_started'`, `'onboarding_completed'`)
      - `properties`: Strongly typed payload
      - `timestamp`: Epoch milliseconds
    - **Failure Behavior**: Safe no-op; exceptions are swallowed to prevent UI disruption.

---

## 4. Feature Flags Specification

Feature flags can be passed to `LumaOnboardingIntegrationProvider` via the `featureFlags` prop:

| Flag Name | Type | Default | Description & Behavior |
| :--- | :--- | :--- | :--- |
| `enableFirstCreation` | `boolean` | `true` | **`true`**: Step 5 presents "اولین خروجی رو بسازیم" CTA leading to Step 6 creation sandbox.<br>**`false`**: Step 5 primary CTA says "شروع کار با [ابزار]" and finishes onboarding directly, skipping creation. |
| `enableFunCreation` | `boolean` | `true` | **`true`**: Displays the "یه چیز سرگرم‌کننده امتحان کنیم" alternative card in Step 5 and enables avatar transformation templates.<br>**`false`**: Hides fun transformation options; only recommended professional tools are shown. |
| `enableResume` | `boolean` | `true` | **`true`**: Automatically restores existing completed profile or in-flight step progress on mount.<br>**`false`**: Forces fresh start from Step 0 regardless of persisted storage. |
| `enableDashboardPersonalization` | `boolean` | `true` | **`true`**: Passes user primary sections, recommended tools, and archetypes to customize the host dashboard layout.<br>**`false`**: Host renders default static dashboard. |

---

## 5. Onboarding Modes

Passed via the `mode` prop on `<LumaOnboarding mode="..." />` or `<OnboardingProvider mode="..." />`:

1. **`'first-run'`**:
   - Explicitly designed for newly registered users.
   - Clears any previous session memory and starts strictly at Step 0 (Welcome Scene).
2. **`'resume'`** *(Default)*:
   - Queries `persistence.loadProfile(userId)`.
   - If a completed profile exists, restores state and transitions to workspace (`in_workspace`).
   - If in-flight progress exists (`loadProgress`), restores the user to their exact unfinished step.
   - If no profile or progress exists, begins at Step 0.
3. **`'replay'`**:
   - Allows users to re-experience the onboarding journey from Step 0 without resetting their user profile in production until explicitly completed.
4. **`'preferences'`**:
   - Opens directly into Step 1 (Profession & Interests Selection) with the user's saved preferences pre-populated.
   - Used when a user clicks "ویرایش علاقه‌مندی‌ها" from their account settings.

---

## 6. Lifecycle State Transitions

The onboarding state machine uses a clear lifecycle model:

```text
               ┌───────────────────────┐
               │      initializing     │ (Checking persistence & user)
               └───────────┬───────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
  [Profile Exists (resume)]      [Fresh / first-run]
             │                           │
             ▼                           ▼
   ┌───────────────────┐       ┌───────────────────┐
   │   in_workspace    │       │   in_onboarding   │ (Steps 0 → 6)
   └───────────────────┘       └─────────┬─────────┘
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
                 [User Completes]                 [User Skips]
                         │                               │
                         └───────────────┬───────────────┘
                                         ▼
                               ┌───────────────────┐
                               │   transitioning   │ (Handoff animation)
                               └─────────┬─────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │   in_workspace    │ (Router navigation)
                               └───────────────────┘
```

---

## 7. Persisted Data Structure

Completed profiles are saved using Schema Version **`2.0.0`**:

```json
{
  "onboardingVersion": "2.0.0",
  "lifecycle": "completed",
  "completionReason": "first_creation_success",
  "preferences": {
    "professions": ["graphic_designer", "content_creator"],
    "interests": ["visual_generation", "video_motion"],
    "archetypes": ["visual_creator", "video_animator"]
  },
  "primarySections": ["ai_tools", "workflows", "file_manager"],
  "recommendedToolIds": ["generate-image", "edit-image", "image-to-video"],
  "recommendedFirstAction": {
    "toolId": "generate-image",
    "primaryCtaText": "اولین تصویر را خلق کنید",
    "defaultPrompt": "یک شاهکار هنری سورئال با نورپردازی سینمایی",
    "funAlternativeToolId": "transform-avatar"
  },
  "firstCreation": {
    "mode": "recommended",
    "toolId": "generate-image",
    "inputAssetId": "asset_upload_9842",
    "outputUrl": "https://cdn.luma.ir/outputs/gen_10293.webp",
    "outputType": "image",
    "succeeded": true
  },
  "firstCompletedAt": "2026-08-24T04:45:00.000Z",
  "lastCompletedAt": "2026-08-24T04:45:00.000Z"
}
```

### ⚠️ Strict Data Hygiene Rules
The following items **MUST NEVER** be persisted in the profile:
- ❌ Raw `File` objects or base64 binary strings.
- ❌ Temporary browser `blob:` Object URLs.
- ❌ API Keys, JWT tokens, or client secrets.
- ❌ UI transient states (slider position, open modals, animation timers).

---

## 8. Production Safety Guarantees

1. **No Simulation in Production**:
   The production adapter (`ProductionCreationAdapter`) routes all creation jobs strictly to authenticated LUMA backend endpoints. Local simulation is isolated to `DevelopmentCreationAdapter`.
2. **Zero Client-Side Secrets**:
   No third-party AI provider keys (Gemini, Stability, Runway, Replicate) are bundled in the frontend. All generation calls are proxied through backend APIs.
3. **Server-Authoritative Billing**:
   Credit checks and billing limits are enforced backend-side. The onboarding client handles `INSUFFICIENT_CREDITS` error codes gracefully with user-friendly Persian messaging.
4. **Validation Pipeline**:
   All persisted data passes through `validatePersistedProfile()` before storage write and upon hydration read to prevent corrupt schemas.

---

## 9. Information Required From LUMA Backend

Before deploying into the production repository, the following backend parameters must be supplied to the adapters:

| Area | Required Detail | Host Requirement |
| :--- | :--- | :--- |
| **Auth** | User Session Endpoint | Endpoint returning current user ID, name, email, avatar, and tier. |
| **Persistence** | Profile Storage API | `GET /api/v1/onboarding/profile` and `POST /api/v1/onboarding/complete`. |
| **Asset Storage** | Upload API / Presigned URL | Endpoint to upload input images (`multipart/form-data` or S3/GCS presigned POST). |
| **AI Generation** | Creation Job Endpoint | Unified creation endpoint accepting `toolId`, `prompt`, `inputAssetId`, returning asset URL & status. |
| **Workflow IDs** | Template Catalog Mapping | Production workflow template IDs for fun transforms (`cyberpunk`, `claymation`, `anime`, etc.). |
| **Billing** | Credit Balance Endpoint | Backend status code for insufficient LUM credits (e.g. HTTP 402 or `INSUFFICIENT_CREDITS`). |
| **Navigation** | App Router Base Paths | Real Next.js route paths for `/dashboard`, `/tools/:id`, `/workflows/:id`, `/billing`. |
| **Analytics** | Telemetry Client | Production SDK instance (Mixpanel / PostHog / GA4) to receive events. |
