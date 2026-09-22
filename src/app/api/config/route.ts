import { NextRequest, NextResponse } from 'next/server';
import { getConfig, updateConfig, saveLog } from '@/lib/db';

export async function GET() {
  try {
    const config = getConfig();
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch config' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateConfig(body);

    saveLog({
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      direction: 'outbound_meta',
      eventType: 'verification',
      status: '200 OK',
      summary: `Meta Webhook Configuration Updated (Phone ID: ${updated.phoneNumberId})`,
      payload: {
        verifyToken: updated.verifyToken ? '***configured***' : 'not set',
        phoneNumberId: updated.phoneNumberId,
        crmWebhookUrl: updated.crmWebhookUrl,
        autoForwardToCrm: updated.autoForwardToCrm
      }
    });

    return NextResponse.json({ success: true, config: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update config' }, { status: 500 });
  }
}
