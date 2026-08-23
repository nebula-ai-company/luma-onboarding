import { OnboardingProvider } from '@/context/OnboardingContext';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';

export default function HomePage() {
  return (
    <OnboardingProvider>
      <OnboardingShell />
    </OnboardingProvider>
  );
}
