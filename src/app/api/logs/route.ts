import { NextRequest, NextResponse } from 'next/server';
import { getSavedLogs, clearLogs, saveLog } from '@/lib/db';

export async function GET() {
  try {
    const logs = getSavedLogs();
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    clearLogs();
    return NextResponse.json({ success: true, message: 'Logs cleared successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to clear logs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const log = saveLog(body);
    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save log' }, { status: 500 });
  }
}
