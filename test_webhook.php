<?php
/**
 * Vision Tech Webhook Test Trigger Endpoint (PHP Native)
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed. Use POST.']);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: $_POST;

$targetUrl = $data['targetUrl'] ?? CRM_WEBHOOK_RECEIVER_URL;
$eventType = $data['eventType'] ?? 'delivered';
$crmRef = $data['crmReferenceId'] ?? 'TASK-38';
$phone = $data['recipientPhone'] ?? '919876543210';
$customSecret = $data['customSecret'] ?? VISIONTECH_HMAC_SECRET;
$customToken = $data['customToken'] ?? VISIONTECH_WEBHOOK_TOKEN;

if ($eventType === 'incoming') {
    $payload = [
        'event' => 'whatsapp.message_received',
        'contact_phone' => $phone,
        'contact_name' => 'Rajesh Sharma',
        'message' => "I have completed task #$crmRef. Please review.",
        'meta_message_id' => 'wamid.HBgL' . time() . 'TESTINCOMING',
        'crm_reference_id' => $crmRef,
        'type' => 'text',
        'timestamp' => date('Y-m-d\TH:i:s\Z')
    ];
} else {
    $payload = [
        'event' => 'whatsapp.status_update',
        'status' => $eventType, // delivered, read, failed
        'meta_message_id' => 'wamid.HBgL' . time() . 'TEST' . strtoupper($eventType),
        'crm_reference_id' => $crmRef,
        'recipient_phone' => $phone,
        'timestamp' => date('Y-m-d\TH:i:s\Z'),
        'error' => ($eventType === 'failed') ? [
            'code' => 131026,
            'title' => 'Message Undeliverable',
            'message' => 'Recipient phone number is not on WhatsApp or user opted out.'
        ] : null
    ];
}

$payloadStr = json_encode($payload);
$signature = 'sha256=' . hash_hmac('sha256', $payloadStr, $customSecret);

$ch = curl_init($targetUrl);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payloadStr,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 5,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'X-VisionTech-Signature: ' . $signature,
        'X-CRM-Webhook-Token: ' . $customToken
    ]
]);

$responseStr = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr = curl_error($ch);
curl_close($ch);

if ($curlErr) {
    echo json_encode([
        'success' => false,
        'error' => $curlErr,
        'targetUrl' => $targetUrl,
        'payload' => $payload
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'dispatchResult' => [
        'statusCode' => $httpCode,
        'responseBody' => json_decode($responseStr, true) ?: $responseStr
    ],
    'targetUrl' => $targetUrl,
    'signatureSent' => $signature,
    'payload' => $payload
]);
