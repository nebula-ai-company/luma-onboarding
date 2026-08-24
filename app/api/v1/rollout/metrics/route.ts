import { NextResponse } from 'next/server';
import { INITIAL_ROLLOUT_REPORT } from '@/lib/rollout/metrics-data';
import { getRolloutConfig } from '@/lib/rollout/experiment-service';

export async function GET() {
  const currentConfig = getRolloutConfig();
  const report = {
    ...INITIAL_ROLLOUT_REPORT,
    currentStage: currentConfig.currentStage,
    rolloutPercentage: currentConfig.rolloutPercentage,
    experimentId: currentConfig.experimentId,
    masterKillSwitchEnabled: currentConfig.enableNewUserOnboarding,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json({
    report,
  });
}
