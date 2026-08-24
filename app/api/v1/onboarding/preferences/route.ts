import { NextRequest, NextResponse } from 'next/server';
import { updateStoredPreferences, getStoredProfile } from '@/lib/auth/profile-store';
import { getActiveUserSession } from '@/lib/auth/user-service';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionUser = await getActiveUserSession();
    const userId = body.userId || sessionUser.id;
    const preferences = body.preferences || body;

    await updateStoredPreferences(userId, preferences);
    const profile = await getStoredProfile(userId);

    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
