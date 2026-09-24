<?php
/**
 * Vision Tech Webhook Log Inspector Endpoint (PHP Native)
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

if (!file_exists(LOG_FILE)) {
    echo json_encode([
        'success' => true,
        'logs' => [],
        'message' => 'No log file found yet.'
    ]);
    exit;
}

$logLines = file(LOG_FILE, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$logLines = array_reverse($logLines); // Show newest logs first

$parsedLogs = [];
foreach (array_slice($logLines, 0, 50) as $line) {
    $parsedLogs[] = [
        'raw' => $line
    ];
}

echo json_encode([
    'success' => true,
    'total' => count($logLines),
    'logs' => $parsedLogs
]);
