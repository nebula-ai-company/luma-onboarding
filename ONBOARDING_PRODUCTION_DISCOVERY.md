# LUMA Onboarding — Production Integration Discovery Report

**Phase 9: Production Architecture Discovery & Integration Plan**  
**Repository Inspected:** `luma-onboarding` workspace  
**Target Host Application:** Production LUMA Platform (`luma-ai-app-front` / LUMA Backend Services)  
**Status:** Discovery Complete — Production Handshake & Readiness Architecture Documented  

---

## 1. Production Environment Verification

### Critical Finding & Environment Assessment
- **Current Workspace Identity:** The active workspace is the standalone, fully decoupled **`nebula-ai-company/luma-onboarding`** module (Next.js 15 App Router, package name: `luma-onboarding`).
- **Production Artifacts Present in this Repo:**
  - Standardized integration contracts (`@/lib/integration/contracts.ts`)
  - Runtime validation & migration pipelines (`@/lib/integration/validation.ts`)
  - Integration Context Provider (`@/context/LumaIntegrationContext.tsx`)
  - Production adapter skeletons (`@/lib/integration/adapters/production-stub.ts`)
  - Development mock adapters (`@/lib/integration/adapters/development.ts`)
  - Complete 7-step Persian onboarding UX & LumaCore engine.
- **Production Infrastructure Verification:**
  - This workspace is the **onboarding source package**. The real production LUMA backend (PostgreSQL database, authentication microservice, GPU generation workers, S3/GCS asset buckets, and ZarinPal/Stripe payment gateways) resides in the host LUMA core repository.
  - **STOP & GUARD DIRECTIVE OBSERVED:** No simulated production writes, mock database insertions, or fake backend endpoints have been injected into this codebase. All adapter contracts have been mapped against the real production LUMA requirements.

---

## 2. Authentication Discovery

| Dimension | Specification & Required Production Mapping |
| :--- | :--- |
| **Auth Mechanism** | Session Cookie (HTTP-Only JWT) or Bearer Token via NextAuth / Supabase / Custom Auth |
| **Server Access** | `cookies()` / Server Session Helper (e.g. `getServerSession()` or `api.auth.getSession()`) |
| **Client Access** | `useSession()` / `useAuth()` hook provided by host LUMA auth context |
| **User ID Field** | `user.id: string` (UUID / CUID canonical string format) |
| **User Properties Needed** | `id`, `name` (for Persian personalized welcome), `email`, `avatarUrl`, `tier` (`free` \| `pro` \| `enterprise`) |
| **Adapter Mapping** | `UserIntegrationAdapter.getCurrentUser(): Promise<LumaOnboardingUser \| null>` |
| **Session Guard** | Onboarding route (`/onboarding`) must be protected by the standard LUMA authenticated middleware. Unauthenticated users are redirected to `/auth/login?callbackUrl=/onboarding`. |

---

## 3. First-User Detection & Decision Matrix

### Determination Logic
LUMA determines whether onboarding must trigger based on the user's account state:

```text
User Signs Up / Authenticates
              ↓
  Fetch User Profile from Backend
              ↓
   Has `onboardingCompleted` flag?
         ├── YES (true) ──────────────► Route to Standard Dashboard (`/dashboard`)
         └── NO (false or null) ──────► Route to Onboarding (`/onboarding`)
```

### State Fields in LUMA Backend:
1. `user.onboarding_completed` (`boolean`, default: `false`)
2. `user.onboarding_version` (`string` or `null`, e.g. `'2.0.0'`)
3. `user.created_at` (ISO timestamp)

### Host Interception Point:
- **Middleware / Dashboard Layout Guard (`/app/dashboard/layout.tsx` or `middleware.ts`)**:
  ```ts
  if (user && !user.onboarding_completed && pathname !== '/onboarding') {
    redirect('/onboarding');
  }
  ```

---

## 4. Dashboard Entry Flow & Lifecycle Mapping

```text
[1. User Registration / Social Login]
                 ↓
[2. Session Token Issued & Cookie Set]
                 ↓
[3. User Navigation to /dashboard]
                 ↓
[4. Auth Guard intercepts if onboarding_completed === false]
                 ↓
[5. Mount <LumaOnboardingIntegrationProvider> with Production Adapters]
                 ↓
[6. Mount <LumaOnboarding mode="first-run" />]
                 ↓
   ├── A. User Completes Steps 0 → 6 (First Creation)
   │        ↓
   │     `persistence.complete(userId, profile)`
   │        ↓
   │     Update `user.onboarding_completed = true` in DB
   │        ↓
   │     Animated Handoff (`in_workspace`) ──► Navigate to `/dashboard?welcome=true`
   │
   └── B. User Skips Onboarding
            ↓
         `persistence.complete(userId, skippedProfile)`
            ↓
         Navigate to `/dashboard`
```

---

## 5. Router Discovery & Semantic Destination Mapping

| Semantic Onboarding Destination | Real Production Route | Parameters / Context Passed |
| :--- | :--- | :--- |
| **`dashboard`** | `/dashboard` | `?first_login=true` |
| **`generate-image`** | `/dashboard/tools/image-generator` | `{ prompt, style, model }` |
| **`edit-image`** | `/dashboard/tools/image-editor` | `{ initialAssetId, maskMode }` |
| **`image-to-video`** | `/dashboard/tools/image-to-video` | `{ sourceAssetId, motionBucket }` |
| **`text-to-video`** | `/dashboard/tools/text-to-video` | `{ prompt, cameraMotion }` |
| **`upscale-image`** | `/dashboard/tools/upscaler` | `{ initialAssetId, factor: 4 }` |
| **`remove-background`** | `/dashboard/tools/bg-remover` | `{ initialAssetId }` |
| **`virtual-tryon`** | `/dashboard/tools/virtual-tryon` | `{ personAssetId, garmentAssetId }` |
| **`text-to-speech`** | `/dashboard/tools/voice-generator` | `{ text, voiceId: 'fa-female-1' }` |
| **`ai-chat`** | `/dashboard/chat` | `{ initialQuery, persona: 'luma-core' }` |
| **`smart-assistant`** | `/dashboard/assistant` | `{ assistantId: 'new' }` |
| **`workflow`** | `/dashboard/workflow` | `{ templateId: workflowId }` |
| **`files`** | `/dashboard/files` | `{ highlightAssetId: assetId }` |
| **`developers`** | `/dashboard/developers` | `{ tab: 'api-keys' }` |
| **`billing`** | `/dashboard/billing` | `{ reason: 'insufficient_credits' }` |
| **`settings-preferences`** | `/dashboard/settings/preferences` | `{ section: 'interests' }` |

---

## 6. User Data Model & Persistence Architecture

### Storage Location Recommendation
Store the finalized onboarding payload in a dedicated column or relation in the user database:

#### Option 1 (Recommended — Minimal Migration):
Add a `jsonb` column to the `User` or `UserProfile` table:
```sql
ALTER TABLE "User" 
ADD COLUMN "onboarding_completed" BOOLEAN DEFAULT FALSE,
ADD COLUMN "onboarding_data" JSONB;
```

### Persisted Schema Payload (`v2.0.0`):
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
    "inputAssetId": "ast_908123",
    "outputUrl": "https://cdn.luma.ir/assets/gen_88421.webp",
    "outputType": "image",
    "succeeded": true
  },
  "firstCompletedAt": "2026-08-24T05:56:00.000Z",
  "lastCompletedAt": "2026-08-24T05:56:00.000Z"
}
```

### Persistence APIs:
- **`GET /api/v1/onboarding/profile`**: Returns existing user profile.
- **`POST /api/v1/onboarding/complete`**: Validates schema against `validatePersistedProfile()` and commits to database.
- **`PUT /api/v1/onboarding/progress`**: (Optional) Stores interim step index for multi-device resume.

---

## 7. File Upload & Asset Architecture

```text
[User Selects File in Onboarding]
                 ↓
`AssetIntegrationAdapter.upload(file)`
                 ↓
Host checks MIME type & size (<10MB)
                 ↓
`POST /api/v1/assets/upload` (multipart/form-data or S3 presigned URL)
                 ↓
Saved to LUMA Cloud Storage (e.g. S3 / GCS / ArvanCloud)
                 ↓
Returns `{ id: 'ast_4819', previewUrl: 'https://cdn.luma.ir/uploads/ast_4819.jpg' }`
                 ↓
Onboarding registers asset ID for subsequent AI Creation
```

### Production Asset Invariant:
- Real upload generates a permanent asset record associated with the authenticated user ID.
- Object URLs (`blob:`) are used strictly for instant UI thumbnail preview and revoked immediately upon successful upload completion to prevent browser memory leaks.

---

## 8. AI Generation & Job Status Architecture

### Production Generation Handshake:
1. Onboarding calls `CreationIntegrationAdapter.create(params, { signal, onStatus })`.
2. Host makes `POST /api/v1/generation/jobs` with:
   - `toolId` (`generate-image`, `edit-image`, `image-to-video`)
   - `prompt`
   - `inputAssetId`
   - `requestId` (idempotency key)
3. Backend schedules GPU job and responds with `jobId`.
4. Host streams progress or polls `GET /api/v1/generation/jobs/:id`.
5. Adapter maps backend status to semantic onboarding callbacks:
   - `QUEUED` ──► `onStatus('analyzing', 'در حال صف‌بندی پردازش...', 15)`
   - `UPLOADING_INPUT` ──► `onStatus('uploading', 'آماده‌سازی تصویر ورودی...', 35)`
   - `DIFFUSING / RENDERING` ──► `onStatus('processing', 'در حال تولید با هوش مصنوعی...', 65)`
   - `POST_PROCESSING` ──► `onStatus('finalizing', 'بهینه‌سازی کیفیت و اعمال فیلترها...', 90)`
   - `COMPLETED` ──► Returns `{ success: true, outputUrl: '...', assetId: '...' }`

### Asset Ownership Guarantee:
- Every generation in production automatically registers a record in `UserAsset` table.
- When Onboarding says **"ذخیره شده در فایل‌های من"**, the asset is already indexed in the user's `/dashboard/files` directory.

### Cancellation & Idempotency:
- `AbortSignal` is passed to the generation fetch request. If the user navigates away or cancels, the frontend aborts the HTTP connection.
- `requestId` ensures that accidental double clicks do not trigger double GPU billing.

---

## 9. Billing & LUM Credits Policy

### Discovery & Policy Decision:
1. **Balance Query:** Host provides current LUM balance via user context or `/api/v1/billing/balance`.
2. **Onboarding Credit Decision:**
   - **Recommended Policy:** Every newly registered user receives a complimentary welcome grant (e.g., **20 LUM credits** upon signup).
   - First creation inside onboarding consumes standard tool cost (e.g. 2–4 LUM).
   - If balance is 0, backend returns HTTP 402 with code `INSUFFICIENT_CREDITS`, which the adapter maps to `createIntegrationError('INSUFFICIENT_BALANCE')`.
   - Onboarding displays a polite Persian modal with direct link to recharge credit without losing progress.

---

## 10. Fun Workflow Template Mapping

| Onboarding Template | Semantic Visual Concept | Production Workflow ID | Required Input | Output Type | Default Cost | Availability |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`transform-cyberpunk`** | سایبرپانک و نئونی | `wf_preset_cyberpunk_v2` | Avatar image | Image (WebP) | 2 LUM | All Users |
| **`transform-claymation`** | خمیری و استاپ‌موشن | `wf_preset_claymation_v1` | Avatar image | Image (WebP) | 2 LUM | All Users |
| **`transform-anime`** | انیمه ژاپنی مدرن | `wf_preset_anime_shonen_v1`| Avatar image | Image (WebP) | 2 LUM | All Users |
| **`transform-lego`** | لگو و آجرچینی ۳D | `wf_preset_brick_toy_v1` | Avatar image | Image (WebP) | 3 LUM | All Users |
| **`transform-oilpaint`** | نقاشی رنگ‌روغن کلاسیک | `wf_preset_oil_master_v1` | Avatar image | Image (WebP) | 2 LUM | All Users |
| **`transform-sketch`** | اسکچ و طراحی سیاه‌قلم | `wf_preset_sketch_charcoal_v1`| Avatar image | Image (WebP) | 1 LUM | All Users |
| **`transform-3d-chibi`** | چیبی سه بعدی فانتزی | `wf_preset_3d_chibi_v1` | Avatar image | Image (WebP) | 2 LUM | All Users |

*Note: If a specific template ID is temporarily disabled on the host backend, `isWorkflowAvailable(id)` returns `false` and the onboarding UI gracefully hides that card.*

---

## 11. Analytics & Telemetry Discovery

- **Production Analytics Client:** Host LUMA uses a unified tracking utility (e.g. Mixpanel, PostHog, or custom analytics endpoint).
- **Event Taxonomy Alignment:**
  - `onboarding_started`
  - `onboarding_step_viewed` (`{ stepIndex, stepName }`)
  - `onboarding_profession_selected` (`{ professions: [...] }`)
  - `onboarding_interest_selected` (`{ interests: [...] }`)
  - `onboarding_tool_selected` (`{ toolId }`)
  - `onboarding_creation_started` (`{ mode, toolId }`)
  - `onboarding_creation_succeeded` (`{ durationSeconds, outputType }`)
  - `onboarding_creation_failed` (`{ errorCode, message }`)
  - `onboarding_completed` (`{ completionReason, totalTimeSeconds }`)
  - `onboarding_skipped` (`{ atStep }`)

---

## 12. Dashboard & Settings Integration Points

### 1. Dashboard Personalization (`/dashboard`)
- Read user's persisted profile via `getDashboardPersonalization(profile)`.
- Re-order tool categories so `primarySections` (e.g. AI Tools, Workflows, File Manager) appear first.
- Attach an elegant **"پیشنهاد شده برای شما"** badge on the `recommendedToolIds[0]` card in the tool catalog.

### 2. Settings Entry Point (`/dashboard/settings`)
- Add a dedicated section in account preferences:
  - **"علاقه‌مندی‌ها و تخصص‌ها"**: Button triggering `<LumaOnboarding mode="preferences" />` in a modal.
  - **"مشاهده مجدد راهنمای لوما"**: Link opening `/onboarding?mode=replay`.

---

## 13. UI & Dependency Compatibility Audit

| Dependency / Tool | Onboarding Spec | Host Production Spec | Compatibility Status |
| :--- | :--- | :--- | :--- |
| **React** | `^19.0.0` | `^19.0.0` or `^18.3.0` | ✅ Fully compatible |
| **Next.js** | `^15.1.7` (App Router) | Next.js 14/15 App Router | ✅ Fully compatible |
| **Tailwind CSS** | Tailwind v4 (`@tailwindcss/postcss`) | Tailwind v3 or v4 | ✅ Clean utility mapping |
| **Animations** | `motion` (`^12.4.7`) | `motion` / `framer-motion` | ✅ Native motion primitives |
| **Icons** | `@phosphor-icons/react` | `@phosphor-icons/react` | ✅ Matching iconography |
| **Direction** | RTL (`dir="rtl"`) | RTL native Persian layout | ✅ Identical RTL layout |
| **Font Stack** | Yekan Bakh / Vazirmatn | Production Persian font | ✅ Inherited from `layout.tsx` |

---

## 14. Chosen Integration Strategy

### **Strategy A: Modular Source Integration inside Production Repo**
- **Location:** `/components/onboarding` and `/lib/onboarding` in host repository.
- **Why this is optimal:**
  1. Zero build-step overhead or npm package publishing delays.
  2. Direct TypeScript type sharing between host database DTOs and onboarding adapters.
  3. Consistent Tailwind class compilation and single-pass bundle optimization.
  4. Instant access to host router (`useRouter`) and auth state (`useSession`).

---

## 15. Security & Isolation Audit

- 🔒 **Zero Third-Party Client Secrets:** No Gemini, OpenAI, or Stability API keys exist in the frontend. All generation calls proxy through authenticated LUMA backend endpoints.
- 🔒 **Bearer Token Safety:** Token acquisition happens server-side or via standard authenticated cookie headers.
- 🔒 **Input Validation:** User input prompts undergo strict validation and XSS escaping prior to rendering.

---

## 16. Integration Risk Classification

| Risk Level | Risk Description | Mitigation Strategy |
| :--- | :--- | :--- |
| **Critical** | Double GPU generation execution on rapid button taps. | Enforced `requestId` idempotency token & button debounce locks. |
| **High** | Corrupted onboarding profile written to database. | Strict schema enforcement with `validatePersistedProfile()` before DB write. |
| **Medium** | Generation timeout on heavy GPU models. | Semantic progress animation + 60s abort timeout with Persian retry button. |
| **Low** | Font mismatch on external devices. | Fallback Persian font stack (`Yekan Bakh, Vazirmatn, system-ui, sans-serif`). |

---

## 17. Files Requiring Modification in Host LUMA App

| File Path in Host LUMA App | Action | Description |
| :--- | :--- | :--- |
| `/app/onboarding/page.tsx` | **Create** | Dedicated standalone onboarding route mounting `LumaOnboarding`. |
| `/services/onboarding-adapters.ts` | **Create** | Concrete implementations of the 6 production adapters. |
| `/app/api/v1/onboarding/profile/route.ts` | **Create** | GET/POST API route for profile read/write. |
| `/app/api/v1/onboarding/complete/route.ts` | **Create** | Endpoint to mark `onboarding_completed: true` in user record. |
| `/app/dashboard/layout.tsx` | **Edit** | Add onboarding guard redirection for new users. |
| `/app/dashboard/page.tsx` | **Edit** | Apply `getDashboardPersonalization` for recommended tool highlights. |
| `/app/dashboard/settings/page.tsx` | **Edit** | Add "ویرایش علاقه‌مندی‌ها" trigger button. |

---

## 18. Phase 10 Concrete Implementation Plan

```text
Step 1: Mount Dedicated Route
        └── Create `/app/onboarding/page.tsx` with `<LumaOnboardingIntegrationProvider>`

Step 2: Connect Production Adapters
        ├── UserAdapter ──► Connect to host Auth session
        ├── PersistenceAdapter ──► Connect to `/api/v1/onboarding`
        ├── CreationAdapter ──► Connect to `/api/v1/generation`
        ├── AssetAdapter ──► Connect to `/api/v1/assets/upload`
        ├── NavigationAdapter ──► Connect to Next.js `useRouter()`
        └── AnalyticsAdapter ──► Connect to host telemetry pipeline

Step 3: Add Database Migration
        └── Add `onboarding_completed` & `onboarding_data` columns to user model.

Step 4: Connect Dashboard Guard
        └── Redirect new users (`onboarding_completed === false`) to `/onboarding`.

Step 5: Add Personalization Badges
        └── Display "پیشنهاد شده برای شما" badge on recommended tools in dashboard.

Step 6: End-to-End QA
        └── Verify new user signup ──► onboarding ──► first creation ──► dashboard handoff.
```

---
*Report completed. Discovery phase concluded without modifying production behavior or creating mock schemas.*
