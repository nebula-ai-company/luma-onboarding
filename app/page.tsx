import { LumaOnboardingIntegrationProvider } from '@/context/LumaIntegrationContext';
import { OnboardingProvider } from '@/context/OnboardingContext';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';

export default function HomePage() {
  return (
    <LumaOnboardingIntegrationProvider>
      <OnboardingProvider>
        <OnboardingShell />
      </OnboardingProvider>
    </LumaOnboardingIntegrationProvider>
  );
}
