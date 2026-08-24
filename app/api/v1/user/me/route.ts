import { NextRequest, NextResponse } from 'next/server';
import {
  getActiveUserSession,
  updateUserSession,
  resetUserSession,
  getUserEligibilityDetails,
} from '@/lib/auth/user-service';

export async function GET() {
  const user = await getActiveUserSession();
  const eligibility = getUserEligibilityDetails(user);
  return NextResponse.json({
    user,
    eligibility,
    experiment: eligibility.experiment,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.action === 'reset_type') {
      const user = await resetUserSession(body.type, body.customEmail);
      const eligibility = getUserEligibilityDetails(user);
      return NextResponse.json({ user, eligibility, experiment: eligibility.experiment });
    }
    const user = await updateUserSession(body.updates || {});
    const eligibility = getUserEligibilityDetails(user);
    return NextResponse.json({ user, eligibility, experiment: eligibility.experiment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

