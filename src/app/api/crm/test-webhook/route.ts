import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getConfig } from '@/lib/db';
import { INITIAL_CONFIG } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      targetUrl,
      eventType = 'delivered', // 'delivered' | 'read' | 'failed' | 'incoming'
      crmReferenceId = 'TASK-38',
      metaMessageId = 'wamid.HBgLMTk8NzY1NDMyMTAVAgARGBI3OTEwMjM5MDEx',
      recipientPhone = '919876543210',
      customSecret,
      customToken
    } = body;

    const currentConfig = getConfig() || INITIAL_CONFIG;
    const webhookUrl = targetUrl || currentConfig.crmWebhookUrl || 'https://crm.visiontechautomation.in/api/v1/whatsapp-receiver';
    const secret = customSecret || 'vt_whsec_prod_c984f1a27e053b6d91480f2a74c83e16';
    const token = customToken || 'vt_wh_tok_prod_89e472a10b5c3d1f';

    let payload: any = {};

    if (eventType === 'delivered') {
      payload = {
        event: 'whatsapp.status_update',
        status: 'delivered',
        meta_message_id: metaMessageId,
        crm_reference_id: crmReferenceId,
        recipient_phone: recipientPhone,
        timestamp: new Date().toISOString(),
        error: null
      };
    } else if (eventType === 'read') {
      payload = {
        event: 'whatsapp.status_update',
        status: 'read',
        meta_message_id: metaMessageId,
        crm_reference_id: crmReferenceId,
        recipient_phone: recipientPhone,
        timestamp: new Date().toISOString(),
        viewed_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        error: null
      };
    } else if (eventType === 'failed') {
      payload = {
        event: 'whatsapp.status_update',
        status: 'failed',
        meta_message_id: metaMessageId,
        crm_reference_id: crmReferenceId,
        recipient_phone: recipientPhone,
        timestamp: new Date().toISOString(),
        error: {
          code: 131026,
          title: 'Message Undeliverable',
          message: 'Recipient phone number is not registered on WhatsApp or user opted out.'
        }
      };
    } else if (eventType === 'incoming') {
      payload = {
        event: 'whatsapp.message_received',
        contact_phone: recipientPhone,
        contact_name: 'Rajesh Sharma',
        message: 'Task #TASK-38 has been completed and verified.',
        meta_message_id: metaMessageId,
        crm_reference_id: crmReferenceId,
        type: 'text',
        timestamp: new Date().toISOString()
      };
    } else {
      return NextResponse.json(
        { error: { message: 'Invalid eventType. Allowed: delivered, read, failed, incoming' } },
        { status: 400 }
      );
    }

    const payloadString = JSON.stringify(payload);
    const signature = 'sha256=' + crypto.createHmac('sha256', secret).update(payloadString).digest('hex');

    let dispatchStatus = 'dispatched';
    let responseText = '';
    let statusCode = 200;

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VisionTech-Signature': signature,
          'X-CRM-Webhook-Token': token
        },
        body: payloadString
      });

      statusCode = res.status;
      responseText = await res.text();
      dispatchStatus = res.ok ? 'delivered_success' : `received_http_${res.status}`;
    } catch (err: any) {
      dispatchStatus = 'failed_network_error';
      responseText = err.message || 'Connection refused / unreachable URL';
    }

    return NextResponse.json({
      success: true,
      testEvent: eventType,
      targetWebhookUrl: webhookUrl,
      signatureSent: signature,
      tokenSent: token,
      payloadDispatched: payload,
      dispatchResult: {
        status: dispatchStatus,
        statusCode,
        responseBodySnippet: responseText.slice(0, 500)
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error.message || 'Webhook trigger failed' } },
      { status: 500 }
    );
  }
}
