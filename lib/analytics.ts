export type OnboardingEventType =
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
  | 'onboarding_quick_tour_started'
  | 'onboarding_quick_tour_completed'
  | 'onboarding_quick_tour_skipped'
  | 'onboarding_recommendations_requested'
  | 'onboarding_recommendations_viewed'
  | 'onboarding_recommendation_opened'
  | 'onboarding_primary_recommendation_clicked'
  | 'onboarding_recommendation_reason_viewed'
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
  | 'onboarding_creation_saved'
  | 'onboarding_creation_retried'
  | 'onboarding_completed_from_creation'
  | 'onboarding_completion_started'
  | 'onboarding_transition_triggered'
  | 'onboarding_handoff_completed'
  | 'onboarding_persisted'
  | 'onboarding_resumed'
  | 'onboarding_restarted_from_workspace'
  | 'workspace_section_changed'
  | 'workspace_tool_launched'
  | 'workspace_result_action_clicked'
  | 'workspace_preferences_modal_opened';

export interface OnboardingEventPayload {
  step?: number;
  professionId?: string;
  interestId?: string;
  selectedCount?: number;
  profileArchetypes?: string[];
  toolId?: string;
  mode?: string;
  templateId?: string;
  durationMs?: number;
  promptLength?: number;
  timeToFirstCreation?: number;
  timeToFirstResult?: number;
  [key: string]: unknown;
}

/**
 * Lightweight internal analytics event abstraction for LUMA onboarding.
 * In production this routes to telemetry systems (e.g. PostHog, Mixpanel, Segment, or custom data pipelines).
 */
export function trackOnboardingEvent(
  event: OnboardingEventType,
  payload?: OnboardingEventPayload
): void {
  if (process.env.NODE_ENV === 'development') {
    // Structured telemetry logging in dev environment
    console.debug(`[LUMA Analytics] ${event}`, payload ?? {});
  }
}
