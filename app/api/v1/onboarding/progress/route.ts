import { NextRequest, NextResponse } from 'next/server';
import { getStoredProgress, saveStoredProgress } from '@/lib/auth/profile-store';
import { getActiveUserSession } from '@/lib/auth/user-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionUser = await getActiveUserSession();
  const userId = searchParams.get('userId') || sessionUser.id;

  const progress = await getStoredProgress(userId);
  if (!progress) {
    return NextResponse.json({ message: 'No progress found' }, { status: 404 });
  }

  return NextResponse.json(progress);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionUser = await getActiveUserSession();
    const userId = body.userId || sessionUser.id;
    const progress = body.progress || body;

    await saveStoredProgress(userId, progress);
    return NextResponse.json({ success: true, progress });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
