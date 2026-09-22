# Vision Tech WhatsApp API & Webhook Technical Delivery Documentation
## Worksuite CRM Integration Guide (`crm.visiontechautomation.in`)

**Client / Project**: Vision Tech Automation — Worksuite CRM Integration  
**Target Domain**: `crm.visiontechautomation.in`  
**Gateway Engine**: Vision Tech WhatsApp Gateway (Meta Cloud API v20.0 Direct)  
**Date**: September 12, 2026  
**Document Version**: v1.0 Production Release  

---

### Executive Summary

This document provides the complete technical integration specification requested by your development team to connect **Worksuite CRM** (`crm.visiontechautomation.in`) with the **Vision Tech WhatsApp API & Webhook Gateway**.

> **Direct Meta API Architecture**: Vision Tech connects directly to **Meta WhatsApp Cloud API v20.0**.
> - **Zero BSP Overhead**: Billed directly by Meta at official rates (Utility, Marketing, Service).
> - **Instant Meta Message IDs**: Synchronous return of `wamid.HBgL...` for exact status mapping.
> - **CRM Reference Mapping**: Your internal CRM IDs (`TASK-38`, `INV-9021`, `LEAD-105`, `DEAL-72`, `LEAVE-14`, `TICKET-56`) are mapped and returned in all status callbacks.

---

### 1. Production API Base URL

| Environment | Base URL | Endpoints Base | Status |
| :--- | :--- | :--- | :--- |
| **Production HTTPS** | `https://api.visiontechautomation.in` | `https://api.visiontechautomation.in/api` | Live Production |
| **Sandbox / Staging** | `https://staging.visiontechautomation.in` | `https://staging.visiontechautomation.in/api` | Testing / QA |

*Note: All endpoints enforce TLS 1.3 encryption. Localhost/127.0.0.1 URLs are strictly for local offline simulation.*

---

### 2. Authentication & Authorization

All requests to the Vision Tech API must be authenticated using a Bearer token in the `Authorization` HTTP header.

#### Request Header Format:
```http
Authorization: Bearer vt_live_sec_90218847291048291
Content-Type: application/json
X-Idempotency-Key: crm-evt-90218841-38
```

#### Credential Management Procedure:
- **Sandbox/Test Token**: `vt_test_sec_demo2026_9021` (Active for sandbox testing).
- **Production Credential Provisioning**:
  1. Log in to the Vision Tech Portal (`https://api.visiontechautomation.in/settings`).
  2. Navigate to **Webhook & API Credentials**.
  3. Click **Generate New Secret Token**. The key will be shown once and stored in encrypted form.

---

### 3. Send Message API (`POST /api/crm/send-message`)

#### Endpoint:
`POST https://api.visiontechautomation.in/api/crm/send-message`

#### A. Request Payload — Standard Text Notification (Task / Lead / Deal Alert)
```json
{
  "recipientPhone": "919876543210",
  "recipientName": "Rajesh Sharma",
  "message": "Hello Rajesh, Task #TASK-38 (Project Milestone Review) has been assigned to you. Due Date: 2026-09-15. View details: https://crm.visiontechautomation.in/account/tasks/38",
  "category": "task_assignment",
  "crmReferenceId": "TASK-38"
}
```

#### B. Request Payload — Document / PDF Invoice Attachment
```json
{
  "recipientPhone": "919876543210",
  "recipientName": "Rajesh Sharma",
  "message": "Hello Rajesh, please find attached Invoice #INV-9021 from Vision Tech.",
  "category": "finance_invoice",
  "crmReferenceId": "INV-9021",
  "mediaUrl": "https://crm.visiontechautomation.in/uploads/invoices/INV-9021.pdf",
  "mediaType": "document",
  "fileName": "Invoice_INV-9021.pdf"
}
```

#### C. Request Payload — Reply / Context Threading
```json
{
  "recipientPhone": "919876543210",
  "recipientName": "Rajesh Sharma",
  "message": "Your leave request #LEAVE-14 has been APPROVED by HR.",
  "category": "leave_update",
  "crmReferenceId": "LEAVE-14",
  "replyToMetaId": "wamid.HBgLMTk8NzY1NDMyMTAVAgARGBI3OTEwMjM5MDEx"
}
```

#### Synchronous Success Response (200 OK):
```json
{
  "success": true,
  "status": "dispatched_live",
  "metaMessageId": "wamid.HBgLMTk8NzY1NDMyMTAVAgARGBI3OTEwMjM5MDEx",
  "crmReferenceId": "TASK-38",
  "recipientPhone": "919876543210",
  "recipientName": "Rajesh Sharma",
  "category": "task_assignment",
  "messagingProduct": "whatsapp",
  "sentAt": "2026-09-12T10:30:00.000Z",
  "walletCost": 0.85,
  "metaBillingType": "utility"
}
```

---

### 4. Template Message API

Approved Meta WhatsApp templates are sent by embedding the `template` object inside the send payload.

#### Endpoint:
`POST https://api.visiontechautomation.in/api/crm/send-message`

#### Request Payload — Approved Template Dispatch:
```json
{
  "recipientPhone": "919876543210",
  "recipientName": "Rajesh Sharma",
  "crmReferenceId": "TASK-38",
  "category": "task_assignment",
  "template": {
    "name": "task_assignment_alert",
    "language": { "code": "en" },
    "components": [
      {
        "type": "header",
        "parameters": [
          {
            "type": "document",
            "document": {
              "link": "https://crm.visiontechautomation.in/uploads/tasks/brief-38.pdf",
              "filename": "Task_Brief_38.pdf"
            }
          }
        ]
      },
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "Rajesh Sharma" },
          { "type": "text", "text": "TASK-38" },
          { "type": "text", "text": "2026-09-15" }
        ]
      },
      {
        "type": "button",
        "sub_type": "url",
        "index": "0",
        "parameters": [
          { "type": "text", "text": "38" }
        ]
      }
    ]
  }
}
```

---

### 5. Webhook Payload Documentation

Vision Tech dispatches real-time HTTPS POST callbacks to your configured CRM receiver URL:  
`https://crm.visiontechautomation.in/api/v1/whatsapp-receiver`

#### A. Incoming WhatsApp Message Event:
```json
{
  "event": "whatsapp.message_received",
  "contact_phone": "919876543210",
  "contact_name": "Rajesh Sharma",
  "message": "I have completed task #TASK-38. Please review.",
  "meta_message_id": "wamid.HBgLMTk8NzY1NDMyMTAVAgARGBI3OTEwMjM5MDEx",
  "crm_reference_id": "TASK-38",
  "type": "text",
  "timestamp": "2026-09-12T10:32:00.000Z"
}
```

#### B. Media Message Received (Image / Document):
```json
{
  "event": "whatsapp.message_received",
  "contact_phone": "919876543210",
  "contact_name": "Rajesh Sharma",
  "message": "Payment receipt uploaded.",
  "meta_message_id": "wamid.HBgLMTk8NzY1NDMyMTAVAgARGBI4OTEwMjM5MDIy",
  "type": "document",
  "attachment": {
    "url": "https://api.visiontechautomation.in/media/att-840291.pdf",
    "fileName": "Payment_Receipt_9021.pdf",
    "mimeType": "application/pdf",
    "fileSize": "1.4 MB"
  },
  "timestamp": "2026-09-12T10:33:00.000Z"
}
```

#### C. Status Callbacks (`sent`, `delivered`, `read`, `failed`):

```json
{
  "event": "whatsapp.status_update",
  "status": "delivered",
  "meta_message_id": "wamid.HBgLMTk8NzY1NDMyMTAVAgARGBI3OTEwMjM5MDEx",
  "crm_reference_id": "TASK-38",
  "recipient_phone": "919876543210",
  "timestamp": "2026-09-12T10:30:05.000Z",
  "error": null
}
```

```json
{
  "event": "whatsapp.status_update",
  "status": "read",
  "meta_message_id": "wamid.HBgLMTk8NzY1NDMyMTAVAgARGBI3OTEwMjM5MDEx",
  "crm_reference_id": "TASK-38",
  "recipient_phone": "919876543210",
  "timestamp": "2026-09-12T10:31:12.000Z",
  "viewed_at": "10:31:12 AM",
  "error": null
}
```

#### D. Template / Message Delivery Failure Callback:
```json
{
  "event": "whatsapp.status_update",
  "status": "failed",
  "meta_message_id": "wamid.HBgLMTk8NzY1NDMyMTAVAgARGBI9OTEwMjM5MDMz",
  "crm_reference_id": "INV-9021",
  "recipient_phone": "919876543210",
  "timestamp": "2026-09-12T10:35:00.000Z",
  "error": {
    "code": 131026,
    "title": "Message Undeliverable",
    "message": "Recipient phone number is not on WhatsApp or user opted out."
  }
}
```

---

### 6. Webhook Security & Production Credentials

Every outbound HTTP webhook request sent by Vision Tech to your CRM receiver endpoint contains two security headers:

```http
X-VisionTech-Signature: sha256=a8f9c7d0384812a10b490818c4e72f910a3d820f719...
X-CRM-Webhook-Token: vt_wh_tok_prod_89e472a10b5c3d1f
```

#### Production Credentials Table:

| Credential / Parameter | Production Header | Production Value | Purpose & Requirement |
| :--- | :--- | :--- | :--- |
| **Unique Production HMAC Secret** | `X-VisionTech-Signature` | `vt_whsec_prod_c984f1a27e053b6d91480f2a74c83e16` | **MANDATORY**: Cryptographic HMAC-SHA256 digest of raw request body. |
| **Production Webhook Token** | `X-CRM-Webhook-Token` | `vt_wh_tok_prod_89e472a10b5c3d1f` | **OPTIONAL / SECONDARY**: Static header token for optional middleware authorization. |

#### Token Necessity Clarification:
- **`X-VisionTech-Signature` (HMAC SHA-256)**: **Mandatory & Primary**. Protects against payload tampering and unauthenticated dispatches. Your receiver MUST verify this HMAC digest using `vt_whsec_prod_c984f1a27e053b6d91480f2a74c83e16`.
- **`X-CRM-Webhook-Token`**: **Optional / Secondary**. Useful if your CRM framework or WAF performs quick header-based authentication before parsing JSON bodies. It is passed in every webhook payload alongside HMAC.

#### Signature Verification Code Example (PHP / Laravel for Worksuite CRM):

```php
// PHP / Laravel Code snippet inside Worksuite CRM Webhook Controller
$payload = file_get_contents('php://input');
$signatureHeader = $_SERVER['HTTP_X_VISIONTECH_SIGNATURE'] ?? '';
$tokenHeader = $_SERVER['HTTP_X_CRM_WEBHOOK_TOKEN'] ?? '';

// 1. Mandatory HMAC Verification
$secretKey = env('VISIONTECH_WEBHOOK_SECRET', 'vt_whsec_prod_c984f1a27e053b6d91480f2a74c83e16');
$expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, $secretKey);

if (!hash_equals($expectedSignature, $signatureHeader)) {
    http_response_code(401);
    exit(json_encode(['error' => 'Invalid HMAC signature verification']));
}

// 2. Optional Token Validation
$expectedToken = env('VISIONTECH_WEBHOOK_TOKEN', 'vt_wh_tok_prod_89e472a10b5c3d1f');
if ($tokenHeader !== $expectedToken) {
    http_response_code(403);
    exit(json_encode(['error' => 'Invalid webhook token']));
}
```

#### Webhook Test Trigger API (`POST /api/crm/test-webhook`):
You can trigger real-time test webhooks (`delivered`, `read`, `failed`, `incoming`) to your CRM receiver URL to test your verification before production deployment:

```bash
curl -X POST https://staging.visiontechautomation.in/api/crm/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "targetUrl": "https://crm.visiontechautomation.in/api/v1/whatsapp-receiver",
    "eventType": "delivered",
    "crmReferenceId": "TASK-38"
  }'
```
Available `eventType` values: `"delivered"`, `"read"`, `"failed"`, `"incoming"`.

---

### 7. Message ID (`metaMessageId`)

- **Format**: Meta official WhatsApp Message ID string (e.g. `wamid.HBgLMTk8NzY1NDMyMTAVAgARGBI3OTEwMjM5MDEx`).
- **Synchronous Return**: Returned immediately in the HTTP 200 JSON response of `POST /api/crm/send-message`.
- **Callback Tracking**: Stored in Worksuite CRM database. All subsequent `delivered`, `read`, and `failed` webhook updates contain `meta_message_id` and `crm_reference_id` for exact matching.

---

### 8. Retry Policy & Idempotency

- **Webhook Retry Intervals**: If your CRM returns non-2xx status (e.g., 500, 502, 503, 504), Vision Tech retries in 3 attempts:
  - Retry 1: After 5 seconds
  - Retry 2: After 30 seconds
  - Retry 3: After 5 minutes
- **API Request Timeout**: 10,000ms.
- **Idempotency Key**: Supported via `X-Idempotency-Key` header. Requests sent with the same key within 24 hours will return the existing cached response without re-sending duplicate WhatsApp messages.

---

### 9. Recipient Phone Number Format

- **Format**: International E.164 format **without spaces, dashes, or brackets**.
- **Preferred**: Country code + 10-digit number (e.g., `919876543210` for India, `14158901234` for US).
- **Auto-Sanitization**: If submitted as `+91 98765-43210`, Vision Tech automatically sanitizes it to `919876543210`.

---

### 10. Rate Limits & Throughput

- **Default Limit**: 80 requests/second per WhatsApp Business Account (WABA).
- **Burst Capacity**: Up to 200 requests/second queued asynchronously.
- **Header Telemetry**: Returned in API response headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`).

---

### 11. Error Response Structure & Error Code Table

All API errors return a standard JSON structure:

```json
{
  "error": true,
  "code": "INVALID_PHONE_NUMBER",
  "message": "The recipient phone number provided is invalid or malformed.",
  "details": {
    "submittedPhone": "12345"
  }
}
```

| HTTP Code | Error Code | Description & Action |
| :--- | :--- | :--- |
| `400` | `MISSING_REQUIRED_PARAMS` | Required fields (`recipientPhone`, `message` or `template`) missing. |
| `400` | `INVALID_PHONE_NUMBER` | Phone number formatting error. Must include country code. |
| `401` | `UNAUTHORIZED` | Invalid or missing `Authorization: Bearer <token>` header. |
| `404` | `TEMPLATE_NOT_FOUND` | Template name does not exist or is not approved in WABA. |
| `429` | `RATE_LIMIT_EXCEEDED` | Exceeded 80 req/sec limit. Implement exponential backoff. |
| `500` | `META_API_ERROR` | Upstream Meta Graph API rejected dispatch. Details returned in payload. |

---

### 12. Media Upload & Attachment Specifications

Supported media formats for document / invoice / media dispatches:

| Category | Supported MIME Types | Max Size | Parameter Field |
| :--- | :--- | :--- | :--- |
| **Documents** | `application/pdf`, `.docx`, `.xlsx` | 100 MB | `"mediaType": "document"` |
| **Images** | `image/jpeg`, `image/png`, `image/webp` | 5 MB | `"mediaType": "image"` |
| **Video** | `video/mp4`, `video/3gpp` | 16 MB | `"mediaType": "video"` |
| **Audio** | `audio/aac`, `audio/mp3`, `audio/ogg` | 16 MB | `"mediaType": "audio"` |

*Note: Media can be passed as a publicly accessible HTTPS URL (`mediaUrl`) or uploaded directly via `POST /api/media/upload`.*

---

### 13. Approved Template Library & Exact Parameter Order Matrix

The exact parameter index order (`{{1}}`, `{{2}}`, `{{3}}`, etc.) for each pre-approved Meta WhatsApp template is defined below. Ensure your CRM payload populates `parameters` in this precise order:

#### 1. `task_assignment_alert` (Category: Utility)
- **Parameter Order**:
  - `{{1}}`: Recipient / Employee Name (e.g. `"Rajesh Sharma"`)
  - `{{2}}`: Task Title & Reference ID (e.g. `"TASK-38: API Integration"`)
  - `{{3}}`: Due Date (e.g. `"2026-09-20"`)
  - `{{4}}`: Assigned By / Manager (e.g. `"Priya Verma"`)
- **Button Parameter (URL sub_type index 0)**:
  - `{{1}}`: Task ID Suffix (e.g. `"38"` -> builds `https://crm.visiontechautomation.in/account/tasks/38`)

#### 2. `lead_assignment_notice` (Category: Utility)
- **Parameter Order**:
  - `{{1}}`: Sales Representative Name (e.g. `"Anil Kumar"`)
  - `{{2}}`: Lead / Company Name (e.g. `"Acme Corp Solutions"`)
  - `{{3}}`: Lead Contact Phone Number (e.g. `"+91 98765 43210"`)
  - `{{4}}`: Estimated Deal Value (e.g. `"₹1,50,000"`)
- **Button Parameter (URL sub_type index 0)**:
  - `{{1}}`: Lead Reference ID (e.g. `"105"` -> builds `https://crm.visiontechautomation.in/account/leads/105`)

#### 3. `invoice_payment_reminder` (Category: Utility)
- **Header Component**: `document` type (PDF link + filename)
- **Parameter Order**:
  - `{{1}}`: Client Name (e.g. `"Rajesh Sharma"`)
  - `{{2}}`: Invoice Number (e.g. `"INV-9021"`)
  - `{{3}}`: Total Amount Due (e.g. `"₹45,000.00"`)
  - `{{4}}`: Payment Due Date (e.g. `"2026-09-25"`)
- **Button Parameter (URL sub_type index 0)**:
  - `{{1}}`: Invoice ID (e.g. `"9021"` -> builds `https://crm.visiontechautomation.in/account/invoices/9021`)

#### 4. `leave_status_update` (Category: Utility)
- **Parameter Order**:
  - `{{1}}`: Employee Name (e.g. `"Priya Verma"`)
  - `{{2}}`: Leave Request Reference ID (e.g. `"LEAVE-14"`)
  - `{{3}}`: Status Outcome (e.g. `"APPROVED"` or `"REJECTED"`)
  - `{{4}}`: Approved Date Range (e.g. `"Sep 18 - Sep 20, 2026"`)
  - `{{5}}`: Reviewed / Approved By (e.g. `"HR Department"`)

#### 5. `attendance_shift_reminder` (Category: Utility)
- **Parameter Order**:
  - `{{1}}`: Employee Name (e.g. `"Rajesh Sharma"`)
  - `{{2}}`: Shift Name & Schedule (e.g. `"Morning Shift (09:00 AM - 06:00 PM)"`)
  - `{{3}}`: Scheduled Shift Date (e.g. `"2026-09-16"`)
  - `{{4}}`: Office Location / Branch (e.g. `"Vision Tech HQ - Tech Park"`)

#### 6. `crm_ticket_update` (Category: Service)
- **Parameter Order**:
  - `{{1}}`: Client / Customer Name (e.g. `"Rajesh Sharma"`)
  - `{{2}}`: Ticket Ref ID & Subject (e.g. `"TICKET-56: Webhook Latency"`)
  - `{{3}}`: Updated Ticket Status (e.g. `"IN PROGRESS"` or `"RESOLVED"`)
  - `{{4}}`: Assigned Support Engineer (e.g. `"Support Desk Tech"`)
- **Button Parameter (URL sub_type index 0)**:
  - `{{1}}`: Ticket ID Suffix (e.g. `"56"` -> builds `https://crm.visiontechautomation.in/account/tickets/56`)

#### Custom CRM Templates:
1. Go to **Webhook Config** > **Meta Templates** in the Vision Tech portal.
2. Click **Create Template**, select category (Utility / Marketing / Service), language (`en`), and body parameters (`{{1}}`, `{{2}}`).
3. Click **Submit for Meta Approval**. Meta AI reviewer approves valid templates within **1 to 5 minutes**.

---

### 14. Sandbox / Test Environment & Interactive Developer Portal

- **Live Interactive API Inspector**: Access `https://api.visiontechautomation.in/docs` or open the **CRM API Docs** tab in the Vision Tech app.
- **Sandbox Test Phone Number**: `+91 98765 43210` (Pre-configured for task assignment and notification testing).
- **Test Secret Token**: `vt_test_sec_demo2026_9021`

---

### Summary Checklist for Client CRM Team

- [x] Integrate `POST /api/crm/send-message` for task, lead, invoice, leave, and attendance alerts.
- [x] Configure CRM Receiver URL: `https://crm.visiontechautomation.in/api/v1/whatsapp-receiver`.
- [x] Implement HMAC-SHA256 signature check using `X-VisionTech-Signature`.
- [x] Map `metaMessageId` and `crmReferenceId` in CRM database to store status ticks (`sent`, `delivered`, `read`).
