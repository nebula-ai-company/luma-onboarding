import { NextRequest, NextResponse } from 'next/server';
import { clearStoredOnboarding } from '@/lib/auth/profile-store';
import { getActiveUserSession, updateUserSession } from '@/lib/auth/user-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const sessionUser = await getActiveUserSession();
    const userId = body.userId || sessionUser.id;

    await clearStoredOnboarding(userId);
    const updatedUser = await updateUserSession({
      onboardingCompleted: false,
      onboardingVersion: undefined,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
