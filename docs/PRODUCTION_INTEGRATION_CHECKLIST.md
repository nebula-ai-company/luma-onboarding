# LUMA Onboarding — Production Integration Checklist

Use this checklist during host application integration to verify all boundaries before deploying to production.

---

## 1. Authentication & User Adapter
- [ ] Connect `UserIntegrationAdapter.getCurrentUser()` to production auth session (NextAuth, Supabase Auth, Firebase, or custom JWT).
- [ ] Provide authenticated `userId`, `name`, `email`, and `avatarUrl` where available.
- [ ] Handle unauthenticated state gracefully (e.g. redirect to login before entering onboarding).
- [ ] Ensure user tier (`free`, `pro`, `enterprise`) is passed correctly for tier-specific tool badges.

---

## 2. Persistence & Storage Adapter
- [ ] Connect `OnboardingPersistenceAdapter.loadProfile(userId)` to production database (PostgreSQL, Firestore, or user metadata store).
- [ ] Connect `OnboardingPersistenceAdapter.complete(userId, profile)` to store schema `2.0.0` payload.
- [ ] Verify `loadProgress` and `saveProgress` work for in-flight step recovery.
- [ ] Confirm migration helper `migrateOnboardingProfile()` correctly handles any legacy v1 profiles.
- [ ] Ensure database constraints do not reject Persian/Unicode characters in user prompts or titles.

---

## 3. Asset Upload Adapter
- [ ] Connect `AssetIntegrationAdapter.upload(file)` to production cloud storage (S3 / Cloud Storage / CDN).
- [ ] Enforce client-side and server-side file size limits (max 10MB).
- [ ] Restrict allowed MIME types to `image/jpeg`, `image/png`, `image/webp`.
- [ ] Verify returned `UploadedAsset.id` and public `previewUrl` are accessible from the frontend.
- [ ] Ensure Object URL memory leaks are prevented by calling `URL.revokeObjectURL()` upon upload completion.

---

## 4. Creation Engine Adapter (AI Services)
- [ ] Connect `CreationIntegrationAdapter.create()` to production LUMA AI microservices.
- [ ] **Generate Image**: Verify text-to-image job creation with user prompt.
- [ ] **Edit Image**: Verify image inpainting / restyling with uploaded asset ID.
- [ ] **Image to Video**: Verify video generation pipeline.
- [ ] Map fun transformation template IDs (`transform-cyberpunk`, `transform-claymation`, `transform-anime`, `transform-lego`, `transform-oilpaint`, `transform-sketch`, `transform-3d-chibi`) to production workflow IDs.
- [ ] Test status polling / WebSocket progress callbacks (`analyzing` → `uploading` → `processing` → `finalizing`).
- [ ] Verify cancellation with `AbortController` signal when user clicks cancel or leaves the scene.

---

## 5. Billing & Credit Limits
- [ ] Implement backend credit validation prior to AI job initiation.
- [ ] Test `INSUFFICIENT_CREDITS` error code response and verify user receives the Persian credit upgrade prompt.
- [ ] Verify estimated LUM cost is deducted accurately upon job completion.

---

## 6. Navigation & Routing Adapter
- [ ] Connect `NavigationIntegrationAdapter.goToDashboard()` to `/dashboard`.
- [ ] Connect `goToSection(sectionId)` to respective section routes (`/dashboard/tools`, `/dashboard/workflows`, `/dashboard/files`, `/dashboard/billing`).
- [ ] Connect `goToTool(toolId, options)` to deep-link into tool views with initial prompt and asset context.
- [ ] Connect `goToWorkflow(workflowId)` to workflow canvas editor route.
- [ ] Verify browser back/forward button interactions do not corrupt onboarding step indices.

---

## 7. Analytics & Telemetry Adapter
- [ ] Connect `AnalyticsIntegrationAdapter.trackEvent()` to production analytics SDK (Mixpanel, PostHog, GA4, Datadog).
- [ ] Verify standard event stream:
  - `onboarding_started`
  - `onboarding_step_viewed`
  - `onboarding_profession_selected`
  - `onboarding_interest_selected`
  - `onboarding_tool_selected`
  - `onboarding_creation_started`
  - `onboarding_creation_succeeded`
  - `onboarding_creation_failed`
  - `onboarding_completed`
  - `onboarding_skipped`
- [ ] Ensure PII (passwords, auth tokens) is strictly omitted from event property dictionaries.

---

## 8. Environment & Feature Flags
- [ ] Set `environment: 'production'` in `LumaOnboardingIntegrationProvider`.
- [ ] Verify development mock adapters (`createDevelopmentIntegration`) are **NOT** active in production builds.
- [ ] Test `enableFirstCreation: false` to ensure fast-path completion works without opening the creation sandbox.
- [ ] Test `enableFunCreation: false` to verify that fun transform templates are cleanly hidden when disabled.
- [ ] Test `mode: 'preferences'` to ensure account settings can launch directly into interest updates.

---

## 9. Visual, RTL, & Performance Polish
- [ ] Verify Persian RTL layout alignment across all 7 scenes.
- [ ] Check responsive behavior on mobile viewports (360px–420px width).
- [ ] Confirm high frame-rate performance for particle background and LumaCore animation.
- [ ] Verify zero console errors or hydration warnings in production build.
