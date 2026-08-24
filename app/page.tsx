import { LumaOnboardingIntegrationProvider, LumaOnboarding } from '@/lib/integration';

export default function HomePage() {
  return (
    <LumaOnboardingIntegrationProvider>
      <LumaOnboarding mode="resume" />
    </LumaOnboardingIntegrationProvider>
  );
}
