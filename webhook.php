<?php
/**
 * Vision Tech Meta WhatsApp Webhook Endpoint (PHP Native Solution)
 * 
 * Host this file on your PHP server (e.g., https://your-domain.com/webhook.php)
 * Works on any standard PHP 7.4+ web server (cPanel, Apache, Nginx, IIS).
 */

require_once __DIR__ . '/config.php';

// Set response content-type
header('Content-Type: application/json');

// Logger helper function
function writeLog($level, $message, $data = null) {
    $timestamp = date('Y-m-d H:i:s');
    $logLine = "[$timestamp] [$level] $message";
    if ($data !== null) {
        $logLine .= " | Payload: " . (is_string($data) ? $data : json_encode($data));
    }
    $logLine .= PHP_EOL;
    @file_put_contents(LOG_FILE, $logLine, FILE_APPEND);
}

// ============================================================================
// 1. META WEBHOOK VERIFICATION GET HANDSHAKE
// ============================================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $mode = $_GET['hub_mode'] ?? $_GET['hub.mode'] ?? null;
    $token = $_GET['hub_verify_token'] ?? $_GET['hub.verify_token'] ?? null;
    $challenge = $_GET['hub_challenge'] ?? $_GET['hub.challenge'] ?? null;

    if ($mode === 'subscribe' && $token === META_VERIFY_TOKEN) {
        writeLog('INFO', 'Meta Webhook Handshake SUCCESSFUL', ['challenge' => $challenge]);
        http_response_code(200);
        header('Content-Type: text/plain');
        echo $challenge;
        exit;
    }

    writeLog('WARNING', 'Meta Webhook Handshake REJECTED (Invalid verify token)', ['receivedToken' => $token]);
    http_response_code(403);
    echo json_encode(['error' => 'Verification failed. Invalid verify token.']);
    exit;
}

// ============================================================================
// 2. META WEBHOOK EVENT LISTENER POST ENDPOINT
// ============================================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawPayload = file_get_contents('php://input');
    $body = json_decode($rawPayload, true);

    if (!$body) {
        writeLog('ERROR', 'Invalid JSON body received');
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON payload']);
        exit;
    }

    writeLog('INFO', 'Webhook Payload Received', $body);

    // Verify WhatsApp Business Account event
    if (isset($body['object']) && $body['object'] === 'whatsapp_business_account') {
        $entries = $body['entry'] ?? [];
        $processedCount = 0;

        foreach ($entries as $entry) {
            $changes = $entry['changes'] ?? [];
            foreach ($changes as $change) {
                $value = $change['value'] ?? null;
                if (!$value) continue;

                // ------------------------------------------------------------
                // A. Handle Incoming Messages
                // ------------------------------------------------------------
                $messages = $value['messages'] ?? [];
                foreach ($messages as $msg) {
                    $processedCount++;
                    $fromPhone = $msg['from'] ?? '';
                    $contactMeta = $value['contacts'][0] ?? null;
                    $senderName = $contactMeta['profile']['name'] ?? "User (+$fromPhone)";

                    $msgContent = $msg['text']['body'] ?? '';
                    $msgType = $msg['type'] ?? 'text';
                    $metaMessageId = $msg['id'] ?? '';
                    $attachment = null;

                    // Extract attachment/media details
                    if ($msgType === 'image' && isset($msg['image'])) {
                        $attachment = [
                            'id' => $msg['image']['id'] ?? 'att-' . time(),
                            'type' => 'image',
                            'url' => $msg['image']['url'] ?? '',
                            'mimeType' => $msg['image']['mime_type'] ?? 'image/jpeg'
                        ];
                        $msgContent = $msg['image']['caption'] ?? '[Image Media]';
                    } elseif ($msgType === 'document' && isset($msg['document'])) {
                        $attachment = [
                            'id' => $msg['document']['id'] ?? 'att-' . time(),
                            'type' => 'document',
                            'url' => $msg['document']['url'] ?? '',
                            'fileName' => $msg['document']['filename'] ?? 'Document.pdf',
                            'mimeType' => $msg['document']['mime_type'] ?? 'application/pdf'
                        ];
                        $msgContent = $msg['document']['caption'] ?? $msg['document']['filename'] ?? '[Document Media]';
                    } elseif ($msgType === 'video' && isset($msg['video'])) {
                        $attachment = [
                            'id' => $msg['video']['id'] ?? 'att-' . time(),
                            'type' => 'video',
                            'url' => $msg['video']['url'] ?? '',
                            'mimeType' => $msg['video']['mime_type'] ?? 'video/mp4'
                        ];
                        $msgContent = $msg['video']['caption'] ?? '[Video Media]';
                    } elseif (($msgType === 'audio' || $msgType === 'voice') && (isset($msg['audio']) || isset($msg['voice']))) {
                        $msgContent = '[Voice Note / Audio]';
                    }

                    $crmEventPayload = [
                        'event' => 'whatsapp.message_received',
                        'contact_phone' => $fromPhone,
                        'contact_name' => $senderName,
                        'message' => $msgContent,
                        'meta_message_id' => $metaMessageId,
                        'type' => $msgType,
                        'attachment' => $attachment,
                        'timestamp' => date('Y-m-d\TH:i:s\Z')
                    ];

                    writeLog('SUCCESS', "Inbound message from $senderName ($fromPhone): \"$msgContent\"", $crmEventPayload);

                    // Forward event to PHP CRM Receiver URL with HMAC signature header
                    if (AUTO_FORWARD_TO_CRM && defined('CRM_WEBHOOK_RECEIVER_URL') && CRM_WEBHOOK_RECEIVER_URL !== '') {
                        forwardToCrm(CRM_WEBHOOK_RECEIVER_URL, $crmEventPayload);
                    }
                }

                // ------------------------------------------------------------
                // B. Handle Message Status Updates (sent, delivered, read, failed)
                // ------------------------------------------------------------
                $statuses = $value['statuses'] ?? [];
                foreach ($statuses as $statusMeta) {
                    $processedCount++;
                    $statusType = $statusMeta['status'] ?? 'unknown'; // sent | delivered | read | failed
                    $metaMsgId = $statusMeta['id'] ?? '';
                    $recipientPhone = $statusMeta['recipient_id'] ?? '';

                    $statusPayload = [
                        'event' => 'whatsapp.status_update',
                        'status' => $statusType,
                        'meta_message_id' => $metaMsgId,
                        'recipient_phone' => $recipientPhone,
                        'timestamp' => date('Y-m-d\TH:i:s\Z', (int)($statusMeta['timestamp'] ?? time())),
                        'error' => $statusMeta['errors'][0] ?? null
                    ];

                    writeLog('INFO', "Status update: " . strtoupper($statusType) . " for WAMID: $metaMsgId", $statusPayload);

                    // Forward status update to CRM receiver
                    if (AUTO_FORWARD_TO_CRM && defined('CRM_WEBHOOK_RECEIVER_URL') && CRM_WEBHOOK_RECEIVER_URL !== '') {
                        forwardToCrm(CRM_WEBHOOK_RECEIVER_URL, $statusPayload);
                    }
                }
            }
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Meta Webhook events processed successfully via PHP',
            'processedCount' => $processedCount
        ]);
        exit;
    }

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Non-WhatsApp event ignored']);
    exit;
}

// Helper function to dispatch signed webhook callbacks to PHP CRM
function forwardToCrm($url, $payloadData) {
    $payloadStr = json_encode($payloadData);
    $signature = 'sha256=' . hash_hmac('sha256', $payloadStr, VISIONTECH_HMAC_SECRET);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payloadStr,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 5,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'X-VisionTech-Signature: ' . $signature,
            'X-CRM-Webhook-Token: ' . VISIONTECH_WEBHOOK_TOKEN
        ]
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if ($curlErr) {
        writeLog('WARNING', "CRM Dispatch Failed to $url: $curlErr");
    } else {
        writeLog('INFO', "Forwarded event to CRM ($url) - HTTP Code: $httpCode");
    }
}
