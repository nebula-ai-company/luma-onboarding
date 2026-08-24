import { NextRequest, NextResponse } from 'next/server';
import { getStoredProfile, saveStoredProfile } from '@/lib/auth/profile-store';
import { getActiveUserSession } from '@/lib/auth/user-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionUser = await getActiveUserSession();
  const userId = searchParams.get('userId') || sessionUser.id;

  const profile = await getStoredProfile(userId);
  if (!profile) {
    return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
  }

  return NextResponse.json(profile);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionUser = await getActiveUserSession();
    const userId = body.userId || sessionUser.id;
    const profile = body.profile || body;

    await saveStoredProfile(userId, profile);
    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
