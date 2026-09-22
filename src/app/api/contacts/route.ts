import { NextRequest, NextResponse } from 'next/server';
import { getSavedContacts, saveOrUpdateContact } from '@/lib/db';

export async function GET() {
  const contacts = getSavedContacts();
  return NextResponse.json({ success: true, contacts });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, phone, name, type, role } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const contact = saveOrUpdateContact(phone, name, type, role, id);
    return NextResponse.json({ success: true, contact });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
