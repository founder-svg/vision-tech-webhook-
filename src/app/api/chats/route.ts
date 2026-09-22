import { NextRequest, NextResponse } from 'next/server';
import { getSavedMessages, saveMessage } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contactId = searchParams.get('contactId');

  const messages = getSavedMessages(contactId || undefined);
  return NextResponse.json({ success: true, messages });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contactId, content, sender, senderName, attachment, metaMessageId } = body;

    if (!contactId || (!content && !attachment)) {
      return NextResponse.json({ error: 'contactId and content/attachment are required' }, { status: 400 });
    }

    const savedMsg = saveMessage(contactId, {
      contactId,
      sender: sender || 'user',
      senderName,
      content: content || '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      attachment,
      metaMessageId
    });

    return NextResponse.json({ success: true, message: savedMsg });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { clearAllMessages } = await import('@/lib/db');
    clearAllMessages();
    return NextResponse.json({ success: true, message: 'All chat history reset successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to reset chats' }, { status: 500 });
  }
}

