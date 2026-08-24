import { NextRequest, NextResponse } from 'next/server';
import { getActiveUserSession, updateUserSession, resetUserSession } from '@/lib/auth/user-service';

export async function GET() {
  const user = await getActiveUserSession();
  return NextResponse.json({ user });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.action === 'reset_type') {
      const user = await resetUserSession(body.type);
      return NextResponse.json({ user });
    }
    const user = await updateUserSession(body.updates || {});
    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
