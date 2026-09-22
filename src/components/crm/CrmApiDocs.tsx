'use client';

import React, { useState } from 'react';
import { Code2, Copy, Check, Send, Play, Terminal, ArrowRight, BookOpen, ShieldCheck, FileText, Bell, Layers, CheckCircle2, Zap, HelpCircle, CheckSquare, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

interface CrmApiDocsProps {
  onSendTestCrmMessage: (phone: string, name: string, message: string) => void;
}

export const CrmApiDocs: React.FC<CrmApiDocsProps> = ({ onSendTestCrmMessage }) => {
  const [activeLang, setActiveLang] = useState<'curl' | 'js' | 'python' | 'php'>('curl');
  const [activeDocTab, setActiveDocTab] = useState<'text' | 'template' | 'media' | 'webhook' | 'templates_matrix'>('text');
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Send Message Test Runner State
  const [testPhone, setTestPhone] = useState('+91 98765 43210');
  const [testName, setTestName] = useState('Rajesh Sharma');
  const [testMsg, setTestMsg] = useState('Vision Tech CRM Alert: Task TASK-38 has been assigned to you. Due Date: 2026-09-15.');
  const [testSuccess, setTestSuccess] = useState(false);

  // Webhook Tester State
  const [webhookTargetUrl, setWebhookTargetUrl] = useState('https://crm.visiontechautomation.in/api/v1/whatsapp-receiver');
  const [webhookCrmRef, setWebhookCrmRef] = useState('TASK-38');
  const [webhookTestStatus, setWebhookTestStatus] = useState<'delivered' | 'read' | 'failed' | 'incoming'>('delivered');
  const [webhookTestResult, setWebhookTestResult] = useState<any>(null);
  const [isTriggeringWebhook, setIsTriggeringWebhook] = useState(false);

  // Production Secrets
  const PROD_HMAC_SECRET = 'vt_whsec_prod_c984f1a27e053b6d91480f2a74c83e16';
  const PROD_WEBHOOK_TOKEN = 'vt_wh_tok_prod_89e472a10b5c3d1f';
  const STAGING_SEND_ENDPOINT = 'https://staging.visiontechautomation.in/api/crm/send-message';
  const PROD_SEND_ENDPOINT = 'https://api.visiontechautomation.in/api/crm/send-message';

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTriggerTestWebhook = async (statusType: 'delivered' | 'read' | 'failed' | 'incoming') => {
    setIsTriggeringWebhook(true);
    setWebhookTestResult(null);
    setWebhookTestStatus(statusType);

    try {
      const response = await fetch('/api/crm/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: webhookTargetUrl,
          eventType: statusType,
          crmReferenceId: webhookCrmRef,
          customSecret: PROD_HMAC_SECRET,
          customToken: PROD_WEBHOOK_TOKEN
        })
      });
      const data = await response.json();
      setWebhookTestResult(data);
    } catch (err: any) {
      setWebhookTestResult({
        error: true,
        message: err.message || 'Network error triggering webhook'
      });
    } finally {
      setIsTriggeringWebhook(false);
    }
  };

  const snippets = {
    text: {
      curl: `curl -X POST ${PROD_SEND_ENDPOINT} \\
  -H "Authorization: Bearer vt_live_sec_90218847291" \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipientPhone": "919876543210",
    "recipientName": "Rajesh Sharma",
    "message": "Task TASK-38 assigned. View: https://crm.visiontechautomation.in/account/tasks/38",
    "category": "task_assignment",
    "crmReferenceId": "TASK-38"
  }'`,
      js: `const response = await fetch('${PROD_SEND_ENDPOINT}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer vt_live_sec_90218847291',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipientPhone: '919876543210',
    recipientName: 'Rajesh Sharma',
    message: 'Task TASK-38 assigned.',
    category: 'task_assignment',
    crmReferenceId: 'TASK-38'
  })
});
const data = await response.json();
console.log('Dispatched Meta Message ID:', data.metaMessageId);`,
      python: `import requests

url = "${PROD_SEND_ENDPOINT}"
headers = {
    "Authorization": "Bearer vt_live_sec_90218847291",
    "Content-Type": "application/json"
}
payload = {
    "recipientPhone": "919876543210",
    "recipientName": "Rajesh Sharma",
    "message": "Task TASK-38 assigned.",
    "category": "task_assignment",
    "crmReferenceId": "TASK-38"
}
response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
      php: `<?php
$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => '${PROD_SEND_ENDPOINT}',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => json_encode([
    'recipientPhone' => '919876543210',
    'recipientName' => 'Rajesh Sharma',
    'message' => 'Task TASK-38 assigned.',
    'category' => 'task_assignment',
    'crmReferenceId' => 'TASK-38'
  ]),
  CURLOPT_HTTPHEADER => array(
    'Authorization: Bearer vt_live_sec_90218847291',
    'Content-Type: application/json'
  ),
));
$response = curl_exec($curl);
curl_close($curl);
echo $response;`
    },
    template: {
      curl: `curl -X POST ${PROD_SEND_ENDPOINT} \\
  -H "Authorization: Bearer vt_live_sec_90218847291" \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipientPhone": "919876543210",
    "recipientName": "Rajesh Sharma",
    "crmReferenceId": "TASK-38",
    "template": {
      "name": "task_assignment_alert",
      "language": { "code": "en" },
      "components": [
        {
          "type": "body",
          "parameters": [
            { "type": "text", "text": "Rajesh Sharma" },
            { "type": "text", "text": "TASK-38: API Integration" },
            { "type": "text", "text": "2026-09-20" },
            { "type": "text", "text": "Priya Verma" }
          ]
        },
        {
          "type": "button",
          "sub_type": "url",
          "index": "0",
          "parameters": [{ "type": "text", "text": "38" }]
        }
      ]
    }
  }'`,
      js: `const response = await fetch('${PROD_SEND_ENDPOINT}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer vt_live_sec_90218847291',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipientPhone: '919876543210',
    recipientName: 'Rajesh Sharma',
    crmReferenceId: 'TASK-38',
    template: {
      name: 'task_assignment_alert',
      language: { code: 'en' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: 'Rajesh Sharma' },
            { type: 'text', text: 'TASK-38: API Integration' },
            { type: 'text', text: '2026-09-20' },
            { type: 'text', text: 'Priya Verma' }
          ]
        },
        {
          type: 'button',
          sub_type: 'url',
          index: '0',
          parameters: [{ type: 'text', text: '38' }]
        }
      ]
    }
  })
});
const data = await response.json();`,
      python: `payload = {
    "recipientPhone": "919876543210",
    "recipientName": "Rajesh Sharma",
    "crmReferenceId": "TASK-38",
    "template": {
        "name": "task_assignment_alert",
        "language": {"code": "en"},
        "components": [
            {
                "type": "body",
                "parameters": [
                    {"type": "text", "text": "Rajesh Sharma"},
                    {"type": "text", "text": "TASK-38: API Integration"},
                    {"type": "text", "text": "2026-09-20"},
                    {"type": "text", "text": "Priya Verma"}
                ]
            },
            {
                "type": "button",
                "sub_type": "url",
                "index": "0",
                "parameters": [{"type": "text", "text": "38"}]
            }
        ]
    }
}`,
      php: `$payload = [
  'recipientPhone' => '919876543210',
  'recipientName' => 'Rajesh Sharma',
  'crmReferenceId' => 'TASK-38',
  'template' => [
    'name' => 'task_assignment_alert',
    'language' => ['code' => 'en'],
    'components' => [
      [
        'type' => 'body',
        'parameters' => [
          ['type' => 'text', 'text' => 'Rajesh Sharma'],
          ['type' => 'text', 'text' => 'TASK-38: API Integration'],
          ['type' => 'text', 'text' => '2026-09-20'],
          ['type' => 'text', 'text' => 'Priya Verma']
        ]
      ],
      [
        'type' => 'button',
        'sub_type' => 'url',
        'index' => '0',
        'parameters' => [['type' => 'text', 'text' => '38']]
      ]
    ]
  ]
];`
    },
    media: {
      curl: `curl -X POST ${PROD_SEND_ENDPOINT} \\
  -H "Authorization: Bearer vt_live_sec_90218847291" \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipientPhone": "919876543210",
    "recipientName": "Rajesh Sharma",
    "message": "Please find attached Invoice #INV-9021.",
    "category": "finance_invoice",
    "crmReferenceId": "INV-9021",
    "mediaUrl": "https://crm.visiontechautomation.in/uploads/invoices/INV-9021.pdf",
    "mediaType": "document",
    "fileName": "Invoice_INV-9021.pdf"
  }'`,
      js: `const response = await fetch('${PROD_SEND_ENDPOINT}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer vt_live_sec_90218847291',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipientPhone: '919876543210',
    recipientName: 'Rajesh Sharma',
    message: 'Invoice attached',
    category: 'finance_invoice',
    crmReferenceId: 'INV-9021',
    mediaUrl: 'https://crm.visiontechautomation.in/uploads/invoices/INV-9021.pdf',
    mediaType: 'document',
    fileName: 'Invoice_INV-9021.pdf'
  })
});`,
      python: `payload = {
    "recipientPhone": "919876543210",
    "recipientName": "Rajesh Sharma",
    "message": "Please find attached Invoice #INV-9021.",
    "crmReferenceId": "INV-9021",
    "mediaUrl": "https://crm.visiontechautomation.in/uploads/invoices/INV-9021.pdf",
    "mediaType": "document",
    "fileName": "Invoice_INV-9021.pdf"
}`,
      php: `$payload = [
  'recipientPhone' => '919876543210',
  'recipientName' => 'Rajesh Sharma',
  'message' => 'Invoice attached',
  'crmReferenceId' => 'INV-9021',
  'mediaUrl' => 'https://crm.visiontechautomation.in/uploads/invoices/INV-9021.pdf',
  'mediaType' => 'document',
  'fileName' => 'Invoice_INV-9021.pdf'
];`
    },
    webhook: {
      curl: `// CRM Webhook Verification in PHP / Laravel Controller
$payload = file_get_contents('php://input');
$signatureHeader = $_SERVER['HTTP_X_VISIONTECH_SIGNATURE'] ?? '';
$tokenHeader = $_SERVER['HTTP_X_CRM_WEBHOOK_TOKEN'] ?? '';

// Production Webhook Secret Key
$secretKey = env('VISIONTECH_WEBHOOK_SECRET', '${PROD_HMAC_SECRET}');
$expectedToken = env('VISIONTECH_WEBHOOK_TOKEN', '${PROD_WEBHOOK_TOKEN}');

// 1. HMAC Cryptographic Validation (Primary Security)
$expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, $secretKey);
if (!hash_equals($expectedSignature, $signatureHeader)) {
    http_response_code(401);
    exit(json_encode(['error' => 'Invalid HMAC signature']));
}

// 2. Token Check (Optional / Additional Check)
if ($tokenHeader !== $expectedToken) {
    http_response_code(403);
    exit(json_encode(['error' => 'Invalid webhook token']));
}`,
      js: `// Node.js Express Webhook Verification Middleware
const crypto = require('crypto');

app.post('/api/v1/whatsapp-receiver', (req, res) => {
  const rawBody = JSON.stringify(req.body);
  const signatureHeader = req.headers['x-visiontech-signature'];
  const tokenHeader = req.headers['x-crm-webhook-token'];
  
  const secretKey = process.env.VISIONTECH_WEBHOOK_SECRET || '${PROD_HMAC_SECRET}';
  const expectedToken = process.env.VISIONTECH_WEBHOOK_TOKEN || '${PROD_WEBHOOK_TOKEN}';

  // 1. Validate HMAC SHA256 Signature
  const expectedSignature = 'sha256=' + crypto.createHmac('sha256', secretKey).update(rawBody).digest('hex');
  if (signatureHeader !== expectedSignature) {
    return res.status(401).json({ error: 'HMAC signature mismatch' });
  }

  // 2. Process status callbacks (delivered, read, failed)
  const { event, status, meta_message_id, crm_reference_id } = req.body;
  console.log(\`[Webhook Event] \${event} | Status: \${status} | CRM Ref: \${crm_reference_id}\`);

  res.status(200).json({ success: true, status: 'acknowledged' });
});`,
      python: `# Python / FastAPI Webhook Verification
import hmac, hashlib
from fastapi import Request, HTTPException

WEBHOOK_SECRET = "${PROD_HMAC_SECRET}"

async def verify_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("X-VisionTech-Signature", "")
    token = request.headers.get("X-CRM-Webhook-Token", "")
    
    expected_sig = "sha256=" + hmac.new(WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected_sig):
        raise HTTPException(status_code=401, detail="HMAC signature invalid")`,
      php: `<?php
// Complete Worksuite CRM Controller Handler
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_VISIONTECH_SIGNATURE'] ?? '';
$secret = '${PROD_HMAC_SECRET}';

if ('sha256=' . hash_hmac('sha256', $payload, $secret) !== $signature) {
    http_response_code(401);
    die('Signature mismatch');
}

$data = json_decode($payload, true);
// Update CRM database table worksuite_message_statuses
http_response_code(200);
echo json_encode(['status' => 'success']);`
    },
    templates_matrix: {
      curl: `/* 
  Approved Worksuite CRM Template Parameter Matrix
  -----------------------------------------------
  1. task_assignment_alert
     - Body {{1}}: Recipient Name
     - Body {{2}}: Task Title & Ref ID
     - Body {{3}}: Due Date (YYYY-MM-DD)
     - Body {{4}}: Assignee / Manager
     - Button {{1}}: Task ID Suffix (e.g., "38")

  2. lead_assignment_notice
     - Body {{1}}: Sales Rep Name
     - Body {{2}}: Lead Company / Name
     - Body {{3}}: Contact Phone Number
     - Body {{4}}: Deal Value Amount
     - Button {{1}}: Lead Ref ID (e.g., "LEAD-105")

  3. invoice_payment_reminder
     - Header: Document URL / Attachment
     - Body {{1}}: Client Name
     - Body {{2}}: Invoice Number
     - Body {{3}}: Amount Due
     - Body {{4}}: Payment Due Date
     - Button {{1}}: Invoice ID (e.g., "INV-9021")

  4. leave_status_update
     - Body {{1}}: Employee Name
     - Body {{2}}: Leave Request Ref ID
     - Body {{3}}: Status (APPROVED / REJECTED)
     - Body {{4}}: Leave Date Range
     - Body {{5}}: Approved/Reviewed By

  5. attendance_shift_reminder
     - Body {{1}}: Employee Name
     - Body {{2}}: Shift Name / Timing
     - Body {{3}}: Date
     - Body {{4}}: Office Location

  6. crm_ticket_update
     - Body {{1}}: Client Name
     - Body {{2}}: Ticket ID & Subject
     - Body {{3}}: New Status (IN PROGRESS / RESOLVED)
     - Body {{4}}: Assigned Support Tech
     - Button {{1}}: Ticket ID Suffix
*/`,
      js: `// JS Object mapping template parameter orders
const TEMPLATE_SPECS = {
  task_assignment_alert: {
    bodyParams: ['recipientName', 'taskTitleRef', 'dueDate', 'assignedByManager'],
    buttonUrlParam: ['taskId']
  },
  lead_assignment_notice: {
    bodyParams: ['salesRepName', 'leadName', 'contactPhone', 'dealValue'],
    buttonUrlParam: ['leadId']
  },
  invoice_payment_reminder: {
    headerType: 'document',
    bodyParams: ['clientName', 'invoiceNumber', 'amountDue', 'paymentDueDate'],
    buttonUrlParam: ['invoiceId']
  },
  leave_status_update: {
    bodyParams: ['employeeName', 'leaveRefId', 'status', 'dateRange', 'reviewedBy']
  },
  attendance_shift_reminder: {
    bodyParams: ['employeeName', 'shiftTiming', 'scheduledDate', 'officeLocation']
  },
  crm_ticket_update: {
    bodyParams: ['clientName', 'ticketRefSubject', 'newStatus', 'assignedTech'],
    buttonUrlParam: ['ticketId']
  }
};`,
      python: `# Python Dictionary Mapping for Template Parameters
TEMPLATE_SPECS = {
    "task_assignment_alert": ["recipientName", "taskTitleRef", "dueDate", "assignedByManager"],
    "lead_assignment_notice": ["salesRepName", "leadName", "contactPhone", "dealValue"],
    "invoice_payment_reminder": ["clientName", "invoiceNumber", "amountDue", "paymentDueDate"],
    "leave_status_update": ["employeeName", "leaveRefId", "status", "dateRange", "reviewedBy"],
    "attendance_shift_reminder": ["employeeName", "shiftTiming", "scheduledDate", "officeLocation"],
    "crm_ticket_update": ["clientName", "ticketRefSubject", "newStatus", "assignedTech"]
}`,
      php: `<?php
// PHP Array mapping template formats for Worksuite CRM
$templateSpecs = [
    'task_assignment_alert' => ['{{1}}' => 'recipientName', '{{2}}' => 'taskTitleRef', '{{3}}' => 'dueDate', '{{4}}' => 'manager'],
    'lead_assignment_notice' => ['{{1}}' => 'salesRep', '{{2}}' => 'leadCompany', '{{3}}' => 'phone', '{{4}}' => 'value'],
    'invoice_payment_reminder' => ['{{1}}' => 'clientName', '{{2}}' => 'invoiceNo', '{{3}}' => 'amount', '{{4}}' => 'dueDate'],
    'leave_status_update' => ['{{1}}' => 'empName', '{{2}}' => 'leaveId', '{{3}}' => 'status', '{{4}}' => 'dates', '{{5}}' => 'approver'],
    'attendance_shift_reminder' => ['{{1}}' => 'empName', '{{2}}' => 'shiftTime', '{{3}}' => 'date', '{{4}}' => 'location'],
    'crm_ticket_update' => ['{{1}}' => 'clientName', '{{2}}' => 'ticketSub', '{{3}}' => 'status', '{{4}}' => 'agent']
];`
    }
  };

  const getCodeSnippet = () => {
    return snippets[activeDocTab][activeLang];
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunTest = (e: React.FormEvent) => {
    e.preventDefault();
    onSendTestCrmMessage(testPhone, testName, testMsg);
    setTestSuccess(true);
    setTimeout(() => setTestSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-gray-100 select-none">
      
      {/* Header */}
      <div className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-[#00a884]/20 text-[#00a884] rounded-2xl">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Worksuite CRM Integration Portal & Developer Specs</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">Meta Cloud API v20.0 Direct</span>
            </h2>
            <p className="text-xs text-gray-400">Complete API & Webhook documentation for crm.visiontechautomation.in</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-500/20 text-blue-300 font-semibold px-3 py-1.5 rounded-full border border-blue-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>HMAC SHA-256 Secured</span>
          </span>
        </div>
      </div>

      {/* Production Credentials & Endpoint Resolution Card */}
      <div className="bg-[#1f2c34] border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Production Credentials & Webhook Security Config</span>
          </h3>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-mono border border-amber-500/30">CRM Dedicated Provisioning</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* HMAC Secret */}
          <div className="bg-[#111b21] p-4 rounded-2xl border border-[#2a3942] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">Unique Production HMAC Secret (`X-VisionTech-Signature`)</span>
              <button 
                onClick={() => copyToClipboard(PROD_HMAC_SECRET, 'hmac')}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
              >
                {copiedField === 'hmac' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === 'hmac' ? 'Copied' : 'Copy Secret'}</span>
              </button>
            </div>
            <p className="font-mono text-xs text-emerald-300 bg-[#1f2c34] p-2 rounded-xl border border-[#2a3942] break-all select-all">
              {PROD_HMAC_SECRET}
            </p>
            <p className="text-[11px] text-gray-400">
              Used to calculate SHA-256 HMAC digest of raw POST body sent in <code className="text-emerald-300">X-VisionTech-Signature</code>.
            </p>
          </div>

          {/* Webhook Token */}
          <div className="bg-[#111b21] p-4 rounded-2xl border border-[#2a3942] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">Production Webhook Token (`X-CRM-Webhook-Token`)</span>
              <button 
                onClick={() => copyToClipboard(PROD_WEBHOOK_TOKEN, 'token')}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
              >
                {copiedField === 'token' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === 'token' ? 'Copied' : 'Copy Token'}</span>
              </button>
            </div>
            <p className="font-mono text-xs text-amber-300 bg-[#1f2c34] p-2 rounded-xl border border-[#2a3942] break-all select-all">
              {PROD_WEBHOOK_TOKEN}
            </p>
            <p className="text-[11px] text-gray-400">
              Optional static bearer check sent alongside HMAC signature. HMAC signature remains primary.
            </p>
          </div>
        </div>

        {/* Endpoint Comparison */}
        <div className="bg-[#111b21] p-4 rounded-2xl border border-[#2a3942] space-y-2">
          <h4 className="text-xs font-bold text-gray-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Endpoint Environment Matrix & Confirmation</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#1f2c34] p-3 rounded-xl border border-blue-500/30">
              <span className="text-[10px] font-bold text-blue-400 uppercase">Sandbox / Staging Endpoint (CONFIRMED)</span>
              <p className="font-mono text-emerald-300 text-[11px] mt-1 break-all select-all">{STAGING_SEND_ENDPOINT}</p>
              <p className="text-[10px] text-gray-400 mt-1">Auth Token: <code className="text-gray-300">vt_test_sec_demo2026_9021</code></p>
            </div>

            <div className="bg-[#1f2c34] p-3 rounded-xl border border-emerald-500/30">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Production Live HTTPS Endpoint</span>
              <p className="font-mono text-emerald-300 text-[11px] mt-1 break-all select-all">{PROD_SEND_ENDPOINT}</p>
              <p className="text-[10px] text-gray-400 mt-1">Auth Token: <code className="text-gray-300">vt_live_sec_90218847291048291</code></p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1f2c34] border border-[#2a3942] rounded-2xl p-4 flex items-center space-x-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Media Support</h4>
            <p className="text-[11px] text-gray-400">PDF (100MB), Image, Video</p>
          </div>
        </div>

        <div className="bg-[#1f2c34] border border-[#2a3942] rounded-2xl p-4 flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">CRM Ref Mapping</h4>
            <p className="text-[11px] text-gray-400">TASK, LEAD, INV, DEAL</p>
          </div>
        </div>

        <div className="bg-[#1f2c34] border border-[#2a3942] rounded-2xl p-4 flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Webhook Ticks</h4>
            <p className="text-[11px] text-gray-400">Sent, Delivered, Read, Fail</p>
          </div>
        </div>

        <div className="bg-[#1f2c34] border border-[#2a3942] rounded-2xl p-4 flex items-center space-x-3">
          <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Throughput Rate</h4>
            <p className="text-[11px] text-gray-400">80 msgs / sec</p>
          </div>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-4">
        {/* Payload Type Selector */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#2a3942] pb-4 gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveDocTab('text')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDocTab === 'text' ? 'bg-[#00a884] text-white shadow-md' : 'bg-[#111b21] text-gray-400 hover:text-white border border-[#2a3942]'
              }`}
            >
              1. Direct Notification
            </button>
            <button
              onClick={() => setActiveDocTab('template')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDocTab === 'template' ? 'bg-[#00a884] text-white shadow-md' : 'bg-[#111b21] text-gray-400 hover:text-white border border-[#2a3942]'
              }`}
            >
              2. Meta Template Payload
            </button>
            <button
              onClick={() => setActiveDocTab('media')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDocTab === 'media' ? 'bg-[#00a884] text-white shadow-md' : 'bg-[#111b21] text-gray-400 hover:text-white border border-[#2a3942]'
              }`}
            >
              3. PDF / Attachment
            </button>
            <button
              onClick={() => setActiveDocTab('webhook')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDocTab === 'webhook' ? 'bg-[#00a884] text-white shadow-md' : 'bg-[#111b21] text-gray-400 hover:text-white border border-[#2a3942]'
              }`}
            >
              4. Webhook Receiver Specs
            </button>
            <button
              onClick={() => setActiveDocTab('templates_matrix')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDocTab === 'templates_matrix' ? 'bg-amber-600 text-white shadow-md' : 'bg-[#111b21] text-amber-300 hover:text-white border border-[#2a3942]'
              }`}
            >
              5. Template Parameter Matrix
            </button>
          </div>

          {/* Lang Tabs */}
          <div className="flex items-center space-x-1 bg-[#111b21] p-1 rounded-xl border border-[#2a3942]">
            {(['curl', 'js', 'python', 'php'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
                  activeLang === lang ? 'bg-[#00a884] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <pre className="bg-[#111b21] p-4 rounded-2xl border border-[#2a3942] text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
            {getCodeSnippet()}
          </pre>

          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 bg-[#202c33] hover:bg-[#2a3942] text-gray-200 px-3 py-1.5 rounded-lg border border-[#2a3942] text-xs font-semibold flex items-center gap-1.5 shadow-md"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Code!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* WEBHOOK LIVE TESTER TRIGGER PANEL */}
      <div className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Interactive Webhook Receiver Test Trigger</span>
          </h3>
          <p className="text-xs text-gray-400">
            Dispatch simulated <code className="text-emerald-300">delivered</code>, <code className="text-blue-300">read</code>, and <code className="text-red-300">failed</code> status webhooks signed with live HMAC to test your CRM endpoint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Target CRM Webhook Receiver URL</label>
            <input
              type="text"
              value={webhookTargetUrl}
              onChange={(e) => setWebhookTargetUrl(e.target.value)}
              className="w-full bg-[#111b21] text-emerald-300 font-mono text-xs rounded-xl px-4 py-2.5 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">CRM Reference ID</label>
            <input
              type="text"
              value={webhookCrmRef}
              onChange={(e) => setWebhookCrmRef(e.target.value)}
              className="w-full bg-[#111b21] text-gray-100 font-mono text-xs rounded-xl px-4 py-2.5 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
            />
          </div>
        </div>

        {/* Action Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => handleTriggerTestWebhook('delivered')}
            disabled={isTriggeringWebhook}
            className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Send "DELIVERED" Webhook</span>
          </button>

          <button
            onClick={() => handleTriggerTestWebhook('read')}
            disabled={isTriggeringWebhook}
            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <CheckSquare className="w-4 h-4 text-blue-400" />
            <span>Send "READ" Webhook</span>
          </button>

          <button
            onClick={() => handleTriggerTestWebhook('failed')}
            disabled={isTriggeringWebhook}
            className="bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <XCircle className="w-4 h-4 text-red-400" />
            <span>Send "FAILED" Webhook</span>
          </button>

          <button
            onClick={() => handleTriggerTestWebhook('incoming')}
            disabled={isTriggeringWebhook}
            className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-purple-400" />
            <span>Send "INCOMING REPLY" Webhook</span>
          </button>
        </div>

        {/* Webhook Response Log Box */}
        {webhookTestResult && (
          <div className="bg-[#111b21] p-4 rounded-2xl border border-[#2a3942] space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Test Webhook Dispatch Result ({webhookTestStatus.toUpperCase()})</span>
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                webhookTestResult.dispatchResult?.statusCode === 200 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                HTTP Status: {webhookTestResult.dispatchResult?.statusCode || 'N/A'}
              </span>
            </div>

            <pre className="text-xs font-mono text-emerald-300 bg-[#1f2c34] p-3 rounded-xl border border-[#2a3942] overflow-x-auto leading-relaxed">
              {JSON.stringify(webhookTestResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Interactive API Tester Panel */}
      <div className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Play className="w-4 h-4 text-emerald-400" />
            <span>Live Sandbox Message Dispatch Simulator</span>
          </h3>
          <p className="text-xs text-gray-400">Trigger a simulated CRM notification to test outbound API routing & status callbacks</p>
        </div>

        <form onSubmit={handleRunTest} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Recipient Mobile Number</label>
              <input
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="w-full bg-[#111b21] text-gray-100 font-mono text-xs rounded-xl px-4 py-2.5 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Recipient Name / Role</label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full bg-[#111b21] text-gray-100 text-xs rounded-xl px-4 py-2.5 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Message Content / Notification Text</label>
            <textarea
              rows={2}
              value={testMsg}
              onChange={(e) => setTestMsg(e.target.value)}
              className="w-full bg-[#111b21] text-gray-100 text-xs rounded-xl px-4 py-2 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {testSuccess ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> Message dispatched from CRM! Check Live Chat & Webhook Audit tab.
              </span>
            ) : (
              <span></span>
            )}

            <button
              type="submit"
              className="bg-[#00a884] hover:bg-[#008f70] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Execute Sandbox API Dispatch</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
