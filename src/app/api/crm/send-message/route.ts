import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CONFIG } from '@/lib/store';
import { getConfig, saveLog } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization') || req.headers.get('X-API-Key');
    const body = await req.json();
    const { 
      recipientPhone, 
      recipientName, 
      message, 
      category, 
      mediaUrl,
      mediaType,
      fileName,
      template,
      crmReferenceId,
      accessToken: customToken,
      phoneNumberId: customPhoneId
    } = body;

    if (!recipientPhone || (!message && !template)) {
      return NextResponse.json(
        {
          error: {
            code: 'MISSING_REQUIRED_PARAMS',
            message: 'Missing required parameters: recipientPhone and either message or template are required.',
            status: 400
          }
        },
        { status: 400 }
      );
    }

    const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 7 || cleanPhone.length > 15) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_PHONE_NUMBER',
            message: 'Phone number format is invalid. Must be in international format without leading + sign.',
            status: 400
          }
        },
        { status: 400 }
      );
    }

    const currentConfig = getConfig() || INITIAL_CONFIG;
    const accessToken = customToken || currentConfig.accessToken || process.env.META_ACCESS_TOKEN || INITIAL_CONFIG.accessToken;
    const phoneNumberId = customPhoneId || currentConfig.phoneNumberId || process.env.META_PHONE_NUMBER_ID || INITIAL_CONFIG.phoneNumberId;

    let metaResponseBody: any = null;
    let generatedMetaMessageId = `wamid.HBgL${Date.now()}VR${Math.floor(Math.random() * 10000)}`;
    let isLiveDispatched = false;

    // Dispatch live to Meta WhatsApp Cloud API if credentials and recipient are present
    if (accessToken && phoneNumberId && cleanPhone) {
      try {
        const payload: any = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
        };

        if (template) {
          payload.type = 'template';
          payload.template = template;
        } else if (mediaUrl) {
          const isDoc = mediaType === 'document' || mediaUrl.toLowerCase().endsWith('.pdf') || (fileName && fileName.toLowerCase().endsWith('.pdf'));
          const isVideo = mediaType === 'video' || mediaUrl.toLowerCase().endsWith('.mp4');
          const isAudio = mediaType === 'audio' || mediaUrl.toLowerCase().endsWith('.mp3');

          if (isDoc) {
            payload.type = 'document';
            payload.document = {
              link: mediaUrl,
              filename: fileName || 'Attachment.pdf',
              caption: message || undefined
            };
          } else if (isVideo) {
            payload.type = 'video';
            payload.video = { link: mediaUrl, caption: message || undefined };
          } else if (isAudio) {
            payload.type = 'audio';
            payload.audio = { link: mediaUrl };
          } else {
            payload.type = 'image';
            payload.image = { link: mediaUrl, caption: message || undefined };
          }
        } else {
          payload.type = 'text';
          payload.text = { body: message };
        }

        const metaRes = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        metaResponseBody = await metaRes.json();

        if (metaRes.ok && metaResponseBody.messages?.[0]?.id) {
          generatedMetaMessageId = metaResponseBody.messages[0].id;
          isLiveDispatched = true;
        }
      } catch (liveErr: any) {
        console.error('[Meta Live Dispatch Error]:', liveErr);
      }
    }

    const crmRef = crmReferenceId || `CRM-REF-${Date.now()}`;

    // Log outbound dispatch in system log auditor
    saveLog({
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      direction: 'outbound_crm',
      eventType: 'crm_dispatch',
      status: '200 OK',
      summary: `CRM Dispatched Message (${isLiveDispatched ? 'Live Meta' : 'Queued'}) to ${recipientName || 'Client'} (${recipientPhone}) - Ref: ${crmRef}`,
      payload: {
        crmReferenceId: crmRef,
        recipientPhone,
        metaMessageId: generatedMetaMessageId,
        templateUsed: template ? template.name : null,
        authenticated: !!authHeader
      }
    });

    return NextResponse.json({
      status: isLiveDispatched ? 'dispatched_live' : 'queued_simulated',
      metaMessageId: generatedMetaMessageId,
      crmReferenceId: crmRef,
      recipientPhone,
      recipientName: recipientName || 'Client/Employee',
      category: category || 'general_notification',
      messagingProduct: 'whatsapp',
      sentAt: new Date().toISOString(),
      walletCost: 0.85,
      metaBillingType: 'utility',
      liveMetaResult: metaResponseBody
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: error.message || 'Failed to dispatch message from CRM',
          status: 500
        }
      },
      { status: 500 }
    );
  }
}

