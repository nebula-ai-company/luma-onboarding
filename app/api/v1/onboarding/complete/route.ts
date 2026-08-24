import { NextRequest, NextResponse } from 'next/server';
import { saveStoredProfile } from '@/lib/auth/profile-store';
import { getActiveUserSession, updateUserSession } from '@/lib/auth/user-service';
import { ONBOARDING_SCHEMA_VERSION } from '@/lib/integration/contracts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionUser = await getActiveUserSession();
    const userId = body.userId || sessionUser.id;
    const profile = body.profile || body;

    // Ensure schema version & timestamps
    const now = new Date().toISOString();
    const finalProfile = {
      ...profile,
      onboardingVersion: ONBOARDING_SCHEMA_VERSION,
      firstCompletedAt: profile.firstCompletedAt || now,
      lastCompletedAt: now,
    };

    await saveStoredProfile(userId, finalProfile);
    const updatedUser = await updateUserSession({
      onboardingCompleted: true,
      onboardingVersion: ONBOARDING_SCHEMA_VERSION,
    });

    return NextResponse.json({
      success: true,
      profile: finalProfile,
      user: updatedUser,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
