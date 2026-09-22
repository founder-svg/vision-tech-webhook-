import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { INITIAL_CONFIG } from '@/lib/store';
import { saveOrUpdateContact, saveMessage, updateMessageStatusByMetaId, saveLog, getConfig } from '@/lib/db';

// Meta Webhook Verification GET Endpoint (Handshake)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const currentConfig = getConfig() || INITIAL_CONFIG;
  const validTokens = [
    currentConfig.verifyToken,
    INITIAL_CONFIG.verifyToken,
    process.env.META_VERIFY_TOKEN
  ].filter(Boolean);

  if (mode === 'subscribe' && token && validTokens.includes(token)) {
    console.log('[Meta Webhook] Verification handshake successful!');
    saveLog({
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      direction: 'inbound_meta',
      eventType: 'verification',
      status: '200 OK',
      summary: 'Meta Webhook Verification Handshake Passed (hub.challenge returned)',
      payload: { mode, token, challenge }
    });
    return new NextResponse(challenge || 'ok', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  saveLog({
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    direction: 'inbound_meta',
    eventType: 'verification',
    status: '403 Forbidden',
    summary: `Meta Webhook Verification Rejected (Token mismatch: "${token}")`,
    payload: { mode, token, expected: currentConfig.verifyToken }
  });

  return NextResponse.json(
    { error: 'Verification failed. Invalid verify token.' },
    { status: 403 }
  );
}

// Meta Webhook Event Processor POST Endpoint
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const currentConfig = getConfig() || INITIAL_CONFIG;
    console.log('[Meta Webhook Received Payload]:', JSON.stringify(body, null, 2));

    // Check if it is a WhatsApp Business Account event
    if (body.object === 'whatsapp_business_account') {
      const entries = body.entry || [];
      let processedCount = 0;

      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value;
          if (!value) continue;

          // 1. Handle Incoming WhatsApp Messages
          const messages = value.messages || [];
          for (const msg of messages) {
            processedCount++;
            const contactMeta = value.contacts?.[0];
            const fromPhone = msg.from; // Sender's phone number e.g. 919876543210
            const senderName = contactMeta?.profile?.name || `User (+${fromPhone})`;

            // Save or update contact in persistent store
            const savedContact = saveOrUpdateContact(fromPhone, senderName);

            // Format content & attachment based on message type
            let msgContent = msg.text?.body || '';
            let attachmentPayload: any = undefined;

            if (msg.type === 'image' && msg.image) {
              attachmentPayload = {
                id: msg.image.id || `att-${Date.now()}`,
                type: 'image',
                url: msg.image.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
                fileName: 'Received_Image.jpg',
                mimeType: msg.image.mime_type || 'image/jpeg'
              };
              msgContent = msg.image.caption || '[Image Media]';
            } else if ((msg.type === 'document') && msg.document) {
              attachmentPayload = {
                id: msg.document.id || `att-${Date.now()}`,
                type: 'document',
                url: msg.document.url || '',
                fileName: msg.document.filename || 'Received_Document.pdf',
                mimeType: msg.document.mime_type || 'application/pdf'
              };
              msgContent = msg.document.caption || msg.document.filename || '[Document Media]';
            } else if ((msg.type === 'video') && msg.video) {
              attachmentPayload = {
                id: msg.video.id || `att-${Date.now()}`,
                type: 'video',
                url: msg.video.url || '',
                fileName: 'Received_Video.mp4',
                mimeType: msg.video.mime_type || 'video/mp4'
              };
              msgContent = msg.video.caption || '[Video Media]';
            } else if ((msg.type === 'audio' || msg.type === 'voice') && (msg.audio || msg.voice)) {
              const audioObj = msg.audio || msg.voice;
              attachmentPayload = {
                id: audioObj.id || `att-${Date.now()}`,
                type: 'audio',
                url: audioObj.url || '',
                fileName: 'Voice_Note.mp3',
                mimeType: audioObj.mime_type || 'audio/mp3'
              };
              msgContent = '[Voice Note / Audio]';
            } else if (msg.type === 'sticker' && msg.sticker) {
              msgContent = '🎨 [Sticker]';
            } else if (msg.type === 'interactive') {
              const interactiveType = msg.interactive?.type;
              if (interactiveType === 'button_reply') {
                msgContent = `Selected: ${msg.interactive.button_reply?.title || msg.interactive.button_reply?.id}`;
              } else if (interactiveType === 'list_reply') {
                msgContent = `Selected: ${msg.interactive.list_reply?.title || msg.interactive.list_reply?.id}`;
              } else {
                msgContent = '[Interactive Reply]';
              }
            } else if (msg.type === 'button') {
              msgContent = `Button: ${msg.button?.text || msg.button?.payload}`;
            } else if (msg.type === 'location' && msg.location) {
              msgContent = `📍 Shared Location (${msg.location.latitude}, ${msg.location.longitude})`;
            } else if (msg.type === 'contacts' && msg.contacts) {
              const sharedName = msg.contacts[0]?.name?.formatted_name || 'Shared Contact';
              msgContent = `📇 Shared Contact: ${sharedName}`;
            } else if (msg.type === 'reaction' && msg.reaction) {
              msgContent = `Reaction: ${msg.reaction.emoji || '👍'}`;
            }

            // Save incoming message to chat store
            const savedMsg = saveMessage(savedContact.id, {
              contactId: savedContact.id,
              sender: 'contact',
              senderName: savedContact.name,
              content: msgContent,
              timestamp: new Date(parseInt(msg.timestamp || `${Math.floor(Date.now() / 1000)}`) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'read',
              metaMessageId: msg.id,
              attachment: attachmentPayload
            });

            // Log Webhook Inbound Event
            saveLog({
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              direction: 'inbound_meta',
              eventType: 'messages',
              status: '200 OK',
              summary: `Inbound Message from ${savedContact.name} (${fromPhone}): "${msgContent.slice(0, 40)}${msgContent.length > 40 ? '...' : ''}"`,
              payload: body
            });

            // Auto-forward to CRM listener endpoint
            if (currentConfig.autoForwardToCrm && currentConfig.crmWebhookUrl) {
              try {
                const secret = currentConfig.verifyToken || 'vision_tech_secret_2026';
                const crmPayload = {
                  event: 'whatsapp.message_received',
                  contact_phone: fromPhone,
                  contact_name: savedContact.name,
                  message: msgContent,
                  meta_message_id: msg.id,
                  timestamp: new Date().toISOString()
                };
                const payloadStr = JSON.stringify(crmPayload);
                const signature = 'sha256=' + crypto.createHmac('sha256', secret).update(payloadStr).digest('hex');

                fetch(currentConfig.crmWebhookUrl, {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    'X-VisionTech-Signature': signature,
                    'X-CRM-Webhook-Token': secret
                  },
                  body: payloadStr
                }).catch(() => {});

                saveLog({
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                  direction: 'outbound_crm',
                  eventType: 'crm_dispatch',
                  status: '200 OK',
                  summary: `Forwarded to CRM Webhook (${currentConfig.crmWebhookUrl})`,
                  payload: crmPayload
                });
              } catch (crmErr) {
                console.warn('[CRM Forward Warning]:', crmErr);
              }
            }
          }

          // 2. Handle Message Delivery & Read Status Updates
          const statuses = value.statuses || [];
          for (const statusMeta of statuses) {
            processedCount++;
            const statusType = statusMeta.status; // 'sent' | 'delivered' | 'read' | 'failed'
            const metaMsgId = statusMeta.id;
            const recipientId = statusMeta.recipient_id;

            // Update message status in store
            updateMessageStatusByMetaId(metaMsgId, statusType, new Date(parseInt(statusMeta.timestamp || `${Math.floor(Date.now() / 1000)}`) * 1000).toLocaleTimeString());

            saveLog({
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              direction: 'inbound_meta',
              eventType: 'statuses',
              status: '200 OK',
              summary: `Status Update: ${statusType.toUpperCase()} for WAMID ${metaMsgId}`,
              payload: body
            });

            // Forward status update callback to CRM webhook listener
            if (currentConfig.autoForwardToCrm && currentConfig.crmWebhookUrl) {
              try {
                const secret = currentConfig.verifyToken || 'vision_tech_secret_2026';
                const statusPayload = {
                  event: 'whatsapp.status_update',
                  status: statusType,
                  meta_message_id: metaMsgId,
                  recipient_phone: recipientId,
                  timestamp: new Date(parseInt(statusMeta.timestamp || `${Math.floor(Date.now() / 1000)}`) * 1000).toISOString(),
                  error: statusMeta.errors?.[0] || null
                };
                const payloadStr = JSON.stringify(statusPayload);
                const signature = 'sha256=' + crypto.createHmac('sha256', secret).update(payloadStr).digest('hex');

                fetch(currentConfig.crmWebhookUrl, {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    'X-VisionTech-Signature': signature,
                    'X-CRM-Webhook-Token': secret
                  },
                  body: payloadStr
                }).catch(() => {});

                saveLog({
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                  direction: 'outbound_crm',
                  eventType: 'crm_dispatch',
                  status: '200 OK',
                  summary: `Forwarded Status (${statusType.toUpperCase()}) to CRM Webhook (${currentConfig.crmWebhookUrl})`,
                  payload: statusPayload
                });
              } catch (crmErr) {
                console.warn('[CRM Status Forward Warning]:', crmErr);
              }
            }
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Meta Webhook events processed successfully',
        processedCount
      }, { status: 200 });
    }

    return NextResponse.json({ success: true, message: 'Non-WhatsApp object event received' }, { status: 200 });
  } catch (error: any) {
    console.error('[Meta Webhook Error]:', error);
    saveLog({
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      direction: 'inbound_meta',
      eventType: 'messages',
      status: '500 Server Error',
      summary: `Webhook Execution Exception: ${error.message}`,
      payload: { error: error.message }
    });
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
