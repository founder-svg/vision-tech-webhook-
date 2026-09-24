<?php
/**
 * Vision Tech Webhook Receiver Endpoint for Worksuite CRM & PHP CRMs
 * 
 * Target Endpoint: https://crm.visiontechautomation.in/api/v1/whatsapp-receiver
 * Place this inside your PHP CRM (e.g. Worksuite CRM Controller / Route)
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

// 1. Get raw request body and security headers
$rawPayload = file_get_contents('php://input');
$signatureHeader = $_SERVER['HTTP_X_VISIONTECH_SIGNATURE'] ?? $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
$tokenHeader = $_SERVER['HTTP_X_CRM_WEBHOOK_TOKEN'] ?? '';

// 2. Validate HMAC SHA-256 Signature (Primary Security Requirement)
$expectedSignature = 'sha256=' . hash_hmac('sha256', $rawPayload, VISIONTECH_HMAC_SECRET);

if (!hash_equals($expectedSignature, $signatureHeader)) {
    http_response_code(401);
    echo json_encode([
        'error' => true,
        'message' => 'Unauthorized: Invalid HMAC signature',
        'expected' => $expectedSignature,
        'received' => $signatureHeader
    ]);
    exit;
}

// 3. Optional Token Header Check
if (defined('VISIONTECH_WEBHOOK_TOKEN') && VISIONTECH_WEBHOOK_TOKEN !== '') {
    if ($tokenHeader !== VISIONTECH_WEBHOOK_TOKEN) {
        http_response_code(403);
        echo json_encode(['error' => true, 'message' => 'Forbidden: Invalid webhook token header']);
        exit;
    }
}

// 4. Parse incoming JSON event
$eventData = json_decode($rawPayload, true);
if (!$eventData) {
    http_response_code(400);
    echo json_encode(['error' => true, 'message' => 'Malformed JSON body']);
    exit;
}

$eventType = $eventData['event'] ?? 'unknown';

// 5. Process CRM Action based on Event Type
if ($eventType === 'whatsapp.message_received') {
    $phone = $eventData['contact_phone'] ?? '';
    $name = $eventData['contact_name'] ?? '';
    $message = $eventData['message'] ?? '';
    $metaId = $eventData['meta_message_id'] ?? '';
    $crmRef = $eventData['crm_reference_id'] ?? null;

    // TODO: Update Worksuite CRM Leads/Tickets/Tasks Database Table here!
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Incoming message logged into PHP CRM',
        'contact' => $name,
        'metaMessageId' => $metaId
    ]);
    exit;
} elseif ($eventType === 'whatsapp.status_update') {
    $status = $eventData['status'] ?? ''; // 'sent' | 'delivered' | 'read' | 'failed'
    $metaId = $eventData['meta_message_id'] ?? '';
    $crmRef = $eventData['crm_reference_id'] ?? '';

    // TODO: Update status tick in CRM DB for this CRM Reference ID or Meta ID!
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => "Message status updated to '$status' in PHP CRM",
        'crmReferenceId' => $crmRef,
        'metaMessageId' => $metaId
    ]);
    exit;
}

http_response_code(200);
echo json_encode(['status' => 'acknowledged', 'message' => 'Event received']);
