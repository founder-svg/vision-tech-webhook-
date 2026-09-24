<?php
/**
 * Vision Tech WhatsApp API & Webhook Portal Dashboard (100% Pure PHP)
 */

require_once __DIR__ . '/config.php';

$verifyToken = META_VERIFY_TOKEN;
$hmacSecret = VISIONTECH_HMAC_SECRET;
$webhookToken = VISIONTECH_WEBHOOK_TOKEN;
$crmUrl = CRM_WEBHOOK_RECEIVER_URL;
?>
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vision Tech — WhatsApp Webhook & CRM Integration Suite (PHP)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        code, pre { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="bg-[#0b141a] text-gray-100 min-h-screen">

    <!-- Top Navigation Header -->
    <header class="bg-[#111b21] border-b border-[#222d34] sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-[#00a884]/20 border border-[#00a884]/40 flex items-center justify-center text-[#00a884]">
                    <i data-lucide="message-square-code" class="w-6 h-6"></i>
                </div>
                <div>
                    <h1 class="text-base font-bold text-white flex items-center gap-2">
                        <span>Vision Tech WhatsApp API Gateway</span>
                        <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">PHP Native Engine</span>
                    </h1>
                    <p class="text-xs text-gray-400">Worksuite CRM Integration Suite — crm.visiontechautomation.in</p>
                </div>
            </div>

            <div class="flex items-center space-x-3">
                <span class="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5 font-medium">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Webhook Active</span>
                </span>
            </div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        <!-- Status & Credentials Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Meta Verify Handshake Card -->
            <div class="bg-[#111b21] border border-[#222d34] rounded-2xl p-5 space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Meta Webhook Handshake</span>
                    <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
                </div>
                <div>
                    <p class="text-xs text-gray-400">Handshake Token (`hub.verify_token`):</p>
                    <p class="font-mono text-xs text-emerald-400 bg-[#1f2c34] p-2 rounded-lg border border-[#2a3942] mt-1 select-all"><?= htmlspecialchars($verifyToken) ?></p>
                </div>
                <p class="text-[11px] text-gray-400">Returned automatically in `webhook.php` on Meta GET verification.</p>
            </div>

            <!-- HMAC SHA-256 Secret Card -->
            <div class="bg-[#111b21] border border-[#222d34] rounded-2xl p-5 space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold uppercase tracking-wider text-gray-400">HMAC SHA-256 Secret Key</span>
                    <i data-lucide="key" class="w-4 h-4 text-amber-400"></i>
                </div>
                <div>
                    <p class="text-xs text-gray-400">Header: `X-VisionTech-Signature`</p>
                    <p class="font-mono text-xs text-amber-300 bg-[#1f2c34] p-2 rounded-lg border border-[#2a3942] mt-1 select-all truncate"><?= htmlspecialchars($hmacSecret) ?></p>
                </div>
                <p class="text-[11px] text-gray-400">Mandatory signature header attached to all outbound callbacks.</p>
            </div>

            <!-- Target CRM Endpoint Card -->
            <div class="bg-[#111b21] border border-[#222d34] rounded-2xl p-5 space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Target CRM Receiver URL</span>
                    <i data-lucide="globe" class="w-4 h-4 text-blue-400"></i>
                </div>
                <div>
                    <p class="text-xs text-gray-400">Worksuite CRM Receiver:</p>
                    <p class="font-mono text-xs text-blue-300 bg-[#1f2c34] p-2 rounded-lg border border-[#2a3942] mt-1 select-all truncate"><?= htmlspecialchars($crmUrl) ?></p>
                </div>
                <p class="text-[11px] text-gray-400">Inbound endpoint receiving normalized JSON events.</p>
            </div>
        </div>

        <!-- Interactive Webhook Test Trigger Panel -->
        <div class="bg-[#111b21] border border-[#222d34] rounded-3xl p-6 shadow-xl space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-base font-bold text-white flex items-center gap-2">
                        <i data-lucide="zap" class="w-5 h-5 text-amber-400"></i>
                        <span>Interactive Webhook Receiver Tester</span>
                    </h2>
                    <p class="text-xs text-gray-400">Send HMAC-signed test callbacks (`delivered`, `read`, `failed`, `incoming`) to your CRM receiver endpoint.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-semibold text-gray-300 block mb-1">CRM Webhook Receiver URL</label>
                    <input type="text" id="targetUrl" value="<?= htmlspecialchars($crmUrl) ?>" class="w-full bg-[#1f2c34] text-emerald-300 font-mono text-xs rounded-xl px-4 py-2.5 border border-[#2a3942] focus:border-[#00a884] focus:outline-none">
                </div>
                <div>
                    <label class="text-xs font-semibold text-gray-300 block mb-1">CRM Reference ID (Task / Invoice / Lead ID)</label>
                    <input type="text" id="crmRef" value="TASK-38" class="w-full bg-[#1f2c34] text-gray-100 font-mono text-xs rounded-xl px-4 py-2.5 border border-[#2a3942] focus:border-[#00a884] focus:outline-none">
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-3 pt-2">
                <button onclick="triggerWebhook('delivered')" class="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95">
                    <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i>
                    <span>Send "DELIVERED" Status</span>
                </button>
                <button onclick="triggerWebhook('read')" class="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95">
                    <i data-lucide="check-check" class="w-4 h-4 text-blue-400"></i>
                    <span>Send "READ" Status</span>
                </button>
                <button onclick="triggerWebhook('failed')" class="bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95">
                    <i data-lucide="x-circle" class="w-4 h-4 text-red-400"></i>
                    <span>Send "FAILED" Status</span>
                </button>
                <button onclick="triggerWebhook('incoming')" class="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95">
                    <i data-lucide="send" class="w-4 h-4 text-purple-400"></i>
                    <span>Send "INCOMING REPLY"</span>
                </button>
            </div>

            <!-- Result Box -->
            <div id="testResultContainer" class="hidden bg-[#1f2c34] p-4 rounded-2xl border border-[#2a3942] space-y-2 mt-4">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-white flex items-center gap-2">
                        <i data-lucide="terminal" class="w-4 h-4 text-emerald-400"></i>
                        <span>Webhook Dispatch Result</span>
                    </span>
                    <span id="testStatusBadge" class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"></span>
                </div>
                <pre id="testResultOutput" class="text-xs font-mono text-emerald-300 bg-[#111b21] p-3 rounded-xl border border-[#2a3942] overflow-x-auto leading-relaxed"></pre>
            </div>
        </div>

        <!-- PHP Code Integration Docs -->
        <div class="bg-[#111b21] border border-[#222d34] rounded-3xl p-6 shadow-xl space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-base font-bold text-white flex items-center gap-2">
                        <i data-lucide="code" class="w-5 h-5 text-indigo-400"></i>
                        <span>PHP Integration Code Snippets</span>
                    </h2>
                    <p class="text-xs text-gray-400">Copy-paste ready PHP scripts for Worksuite CRM Controllers.</p>
                </div>
            </div>

            <div class="space-y-4">
                <div>
                    <span class="text-xs font-bold text-gray-300 block mb-1">1. Inbound Webhook Receiver Verification in PHP (`crm_webhook_receiver.php`)</span>
                    <pre class="bg-[#1f2c34] p-4 rounded-xl border border-[#2a3942] text-xs font-mono text-emerald-300 overflow-x-auto">
&lt;?php
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_VISIONTECH_SIGNATURE'] ?? '';
$secret = '<?= htmlspecialchars($hmacSecret) ?>';

// HMAC SHA-256 Signature Verification
if ('sha256=' . hash_hmac('sha256', $payload, $secret) !== $signature) {
    http_response_code(401);
    exit(json_encode(['error' => 'Invalid HMAC Signature']));
}

$event = json_decode($payload, true);
// Process $event['event'] == 'whatsapp.message_received' or 'whatsapp.status_update'
http_response_code(200);
echo json_encode(['status' => 'success']);
</pre>
                </div>

                <div>
                    <span class="text-xs font-bold text-gray-300 block mb-1">2. Sending Approved Task Alert Template via PHP cURL (`send_message.php`)</span>
                    <pre class="bg-[#1f2c34] p-4 rounded-xl border border-[#2a3942] text-xs font-mono text-indigo-300 overflow-x-auto">
&lt;?php
require_once __DIR__ . '/send_message.php';

$whatsapp = new VisionTechWhatsApp();

// Send Task Assignment Template
$result = $whatsapp->sendTemplateMessage(
    '919876543210', 
    'task_assignment_alert', 
    ['Rajesh Sharma', 'TASK-38: API Integration', '2026-09-20', 'Priya Verma'], 
    ['38']
);
</pre>
                </div>
            </div>
        </div>

    </main>

    <script>
        lucide.createIcons();

        async function triggerWebhook(eventType) {
            const targetUrl = document.getElementById('targetUrl').value;
            const crmRef = document.getElementById('crmRef').value;
            const container = document.getElementById('testResultContainer');
            const output = document.getElementById('testResultOutput');
            const badge = document.getElementById('testStatusBadge');

            container.classList.remove('hidden');
            output.textContent = 'Dispatching test webhook callback...';

            try {
                const res = await fetch('test_webhook.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        targetUrl: targetUrl,
                        eventType: eventType,
                        crmReferenceId: crmRef
                    })
                });
                const data = await res.json();
                output.textContent = JSON.stringify(data, null, 2);
                badge.textContent = 'HTTP ' + (data.dispatchResult?.statusCode || 'N/A');
            } catch (err) {
                output.textContent = 'Error: ' + err.message;
                badge.textContent = 'ERROR';
            }
        }
    </script>
</body>
</html>
