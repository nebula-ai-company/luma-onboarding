import { NextRequest, NextResponse } from 'next/server';
import {
  getRolloutConfig,
  updateRolloutConfig,
  resetExperimentAssignments,
  STAGE_CONFIG_MAP,
} from '@/lib/rollout/experiment-service';

export async function GET() {
  const config = getRolloutConfig();
  return NextResponse.json({
    config,
    stageCatalog: STAGE_CONFIG_MAP,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'reset_assignments') {
      resetExperimentAssignments();
      return NextResponse.json({
        success: true,
        message: 'تمامی گروه‌بندی‌های ذخیره‌شده آزمایشی با موفقیت ریست شدند.',
        config: getRolloutConfig(),
      });
    }

    const updated = updateRolloutConfig(body.updates || {}, body.updatedBy || 'Luma Operator');
    return NextResponse.json({
      success: true,
      config: updated,
      stageCatalog: STAGE_CONFIG_MAP,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
