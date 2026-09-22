# Vision Tech WhatsApp API — Webhook Testing, Headers, Tokens & Approved Template Specifications
**Client Reference & Integration Credential Document**  
**API Endpoint**: `https://staging.visiontechautomation.in/api/crm/send-message`  
**Target Domain**: `crm.visiontechautomation.in`  
**Gateway Engine**: Vision Tech WhatsApp Gateway (Meta Cloud API v20.0 Direct)  
**Date**: September 15, 2026  

---

## 1. Authentication Headers & Credentials Summary

Below are the exact production headers, bearer tokens, Meta API keys, and webhook secrets required for integration and verification.

### **A. API Request Headers for Outbound Messages (`POST /api/crm/send-message`)**

```http
Authorization: Bearer vt_live_sec_90218847291048291
Content-Type: application/json
X-Idempotency-Key: crm-evt-90218841-38
```

| Credential / Parameter | HTTP Header Name | Value / Secret | Description & Usage |
| :--- | :--- | :--- | :--- |
| **API Secret Token (Live Production)** | `Authorization` | `Bearer vt_live_sec_90218847291048291` | Primary authorization Bearer token for CRM requests |
| **API Secret Token (Sandbox / Test)** | `Authorization` | `Bearer vt_test_sec_demo2026_9021` | Active token for staging & sandbox testing |
| **Idempotency Key (Optional)** | `X-Idempotency-Key` | `crm-evt-90218841-38` | Prevents duplicate WhatsApp dispatches |

---

### **B. Meta WhatsApp Cloud API Direct Credentials**

For direct Meta Graph API calls (`https://graph.facebook.com/v20.0/{phoneNumberId}/messages`):

```http
Authorization: Bearer EAAjsTrAR0ZBABSXd3sKxQFwN1ueZBgYnCoj46HNCe4IZCkMDtlvG0MMVZC2uzAAJZA4yB1rp8idrs9vY
Content-Type: application/json
```

| Parameter Field | Value | Purpose |
| :--- | :--- | :--- |
| **Meta Access Token (`accessToken`)** | `EAAjsTrAR0ZBABSXd3sKxQFwN1ueZBgYnCoj46HNCe4IZCkMDtlvG0MMVZC2uzAAJZA4yB1rp8idrs9vY` | System User Access Token for Meta Graph API v20.0 |
| **Phone Number ID (`phoneNumberId`)** | `1348331951688529` | Registered WhatsApp Phone Number ID (+1 303 376-9229) |
| **WABA ID (`wabaId`)** | `26119545054390590` | WhatsApp Business Account ID (wixfox) |
| **App ID (`appId`)** | `2511622519247840` | Meta Developer App ID |
| **Webhook Verify Token (`verifyToken`)**| `vision_tech_secret_2026` | Token used for Meta GET Webhook Handshake (`hub.verify_token`) |

---

### **C. Webhook Receiver Security Headers & Secrets**

When Vision Tech dispatches callbacks (`status_update`, `message_received`) to your CRM endpoint (`https://crm.visiontechautomation.in/api/v1/whatsapp-receiver`), the following security headers are attached:

```http
X-VisionTech-Signature: sha256=a8f9c7d0384812a10b490818c4e72f910a3d820f719...
X-CRM-Webhook-Token: vt_wh_tok_prod_89e472a10b5c3d1f
```

| Security Key / Token | Header Name | Value | Purpose & Requirements |
| :--- | :--- | :--- | :--- |
| **HMAC SHA-256 Secret** | `X-VisionTech-Signature` | `vt_whsec_prod_c984f1a27e053b6d91480f2a74c83e16` | **MANDATORY**: HMAC digest secret key used to verify raw request body signature |
| **CRM Webhook Token** | `X-CRM-Webhook-Token` | `vt_wh_tok_prod_89e472a10b5c3d1f` | **OPTIONAL**: Static header token for quick middleware validation |

---

## 2. Webhook Test Trigger Guide

To allow your CRM engineering team to verify and test your webhook receiver (`https://crm.visiontechautomation.in/api/v1/whatsapp-receiver`) before production launch, Vision Tech provides a dedicated test trigger endpoint.

### **Endpoint**:
`POST https://staging.visiontechautomation.in/api/crm/test-webhook`

### **Headers**:
```http
Content-Type: application/json
```

---

### **A. How to Trigger Webhook Tests**

#### 1. Trigger `delivered` Webhook Test:
```bash
curl -X POST https://staging.visiontechautomation.in/api/crm/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "targetUrl": "https://crm.visiontechautomation.in/api/v1/whatsapp-receiver",
    "eventType": "delivered",
    "crmReferenceId": "TASK-38",
    "recipientPhone": "919876543210"
  }'
```

#### 2. Trigger `read` Webhook Test:
```bash
curl -X POST https://staging.visiontechautomation.in/api/crm/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "targetUrl": "https://crm.visiontechautomation.in/api/v1/whatsapp-receiver",
    "eventType": "read",
    "crmReferenceId": "TASK-38",
    "recipientPhone": "919876543210"
  }'
```

#### 3. Trigger `failed` Webhook Test:
```bash
curl -X POST https://staging.visiontechautomation.in/api/crm/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "targetUrl": "https://crm.visiontechautomation.in/api/v1/whatsapp-receiver",
    "eventType": "failed",
    "crmReferenceId": "INV-9021",
    "recipientPhone": "919876543210"
  }'
```

---

### **B. Webhook Callbacks Received by Your CRM**

All callbacks sent by Vision Tech to your receiver include security headers for verification:
```http
X-VisionTech-Signature: sha256=a8f9c7d0384812a10b490818c4e72f91...
X-CRM-Webhook-Token: vt_wh_tok_prod_89e472a10b5c3d1f
```

#### Payload: `delivered` Status Update
```json
{
  "event": "whatsapp.status_update",
  "status": "delivered",
  "meta_message_id": "wamid.HBgLMTk8NzY1NDMyMTAVAgARGBI3OTEwMjM5MDEx",
  "crm_reference_id": "TASK-38",
  "recipient_phone": "919876543210",
  "timestamp": "2026-09-15T12:00:00.000Z",
  "error": null
}
```

#### Payload: `read` Status Update
```json
{
  "event": "whatsapp.status_update",
  "status": "read",
  "meta_message_id": "wamid.HBgLMTk8NzY1NDMyMTAVAgARGBI3OTEwMjM5MDEx",
  "crm_reference_id": "TASK-38",
  "recipient_phone": "919876543210",
  "timestamp": "2026-09-15T12:01:00.000Z",
  "viewed_at": "12:01:00 PM",
  "error": null
}
```

#### Payload: `failed` Status Update
```json
{
  "event": "whatsapp.status_update",
  "status": "failed",
  "meta_message_id": "wamid.HBgLMTk8NzY1NDMyMTAVAgARGBI9OTEwMjM5MDMz",
  "crm_reference_id": "INV-9021",
  "recipient_phone": "919876543210",
  "timestamp": "2026-09-15T12:02:00.000Z",
  "error": {
    "code": 131026,
    "title": "Message Undeliverable",
    "message": "Recipient phone number is not registered on WhatsApp or user opted out."
  }
}
```

---

## 3. Approved Meta Template Variable / Parameter Order Specification

When dispatching WhatsApp templates via `POST https://staging.visiontechautomation.in/api/crm/send-message`, parameters must be supplied in the exact variable order below.

---

### **1. `task_assignment_alert`**
* **Category**: Utility  
* **Description**: Dispatched when a task is assigned to an employee or team member.  
* **Header Component (Optional)**: `document` (Task Brief PDF)  
* **Body Variable Order (`type: "body"`)**:
  1. `{{1}}`: Recipient / Employee Name (e.g. `"Rajesh Sharma"`)
  2. `{{2}}`: Task Title & Reference ID (e.g. `"TASK-38: API Integration"`)
  3. `{{3}}`: Due Date (e.g. `"2026-09-20"`)
  4. `{{4}}`: Assigned By / Manager (e.g. `"Priya Verma"`)
* **Button Variable Order (`type: "button"`, `sub_type: "url"`, `index: "0"`)**:
  1. `{{1}}`: Task ID Suffix (e.g. `"38"` -> expands URL to `https://crm.visiontechautomation.in/account/tasks/38`)

#### Example JSON Payload:
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
        "parameters": [
          { "type": "text", "text": "38" }
        ]
      }
    ]
  }
}
```

---

### **2. `lead_assignment_notice`**
* **Category**: Utility  
* **Description**: Dispatched to sales reps upon new lead allocation.  
* **Body Variable Order (`type: "body"`)**:
  1. `{{1}}`: Sales Representative Name (e.g. `"Anil Kumar"`)
  2. `{{2}}`: Lead / Company Name (e.g. `"Acme Corp Solutions"`)
  3. `{{3}}`: Lead Contact Phone Number (e.g. `"+91 98765 43210"`)
  4. `{{4}}`: Estimated Deal Value (e.g. `"₹1,50,000"`)
* **Button Variable Order (`type: "button"`, `sub_type: "url"`, `index: "0"`)**:
  1. `{{1}}`: Lead ID Suffix (e.g. `"105"` -> expands URL to `https://crm.visiontechautomation.in/account/leads/105`)

#### Example JSON Payload:
```json
{
  "recipientPhone": "919876543210",
  "recipientName": "Anil Kumar",
  "crmReferenceId": "LEAD-105",
  "category": "lead_assignment",
  "template": {
    "name": "lead_assignment_notice",
    "language": { "code": "en" },
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "Anil Kumar" },
          { "type": "text", "text": "Acme Corp Solutions" },
          { "type": "text", "text": "+91 98765 43210" },
          { "type": "text", "text": "₹1,50,000" }
        ]
      },
      {
        "type": "button",
        "sub_type": "url",
        "index": "0",
        "parameters": [
          { "type": "text", "text": "105" }
        ]
      }
    ]
  }
}
```

---

### **3. `invoice_payment_reminder`**
* **Category**: Utility  
* **Description**: Invoice payment notification with PDF header attachment.  
* **Header Component (`type: "header"`)**: `document` (PDF Link + Filename)  
* **Body Variable Order (`type: "body"`)**:
  1. `{{1}}`: Client Name (e.g. `"Rajesh Sharma"`)
  2. `{{2}}`: Invoice Number (e.g. `"INV-9021"`)
  3. `{{3}}`: Total Amount Due (e.g. `"₹45,000.00"`)
  4. `{{4}}`: Payment Due Date (e.g. `"2026-09-25"`)
* **Button Variable Order (`type: "button"`, `sub_type: "url"`, `index: "0"`)**:
  1. `{{1}}`: Invoice ID Suffix (e.g. `"9021"` -> expands URL to `https://crm.visiontechautomation.in/account/invoices/9021`)

#### Example JSON Payload:
```json
{
  "recipientPhone": "919876543210",
  "recipientName": "Rajesh Sharma",
  "crmReferenceId": "INV-9021",
  "category": "finance_invoice",
  "template": {
    "name": "invoice_payment_reminder",
    "language": { "code": "en" },
    "components": [
      {
        "type": "header",
        "parameters": [
          {
            "type": "document",
            "document": {
              "link": "https://crm.visiontechautomation.in/uploads/invoices/INV-9021.pdf",
              "filename": "Invoice_INV-9021.pdf"
            }
          }
        ]
      },
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "Rajesh Sharma" },
          { "type": "text", "text": "INV-9021" },
          { "type": "text", "text": "₹45,000.00" },
          { "type": "text", "text": "2026-09-25" }
        ]
      },
      {
        "type": "button",
        "sub_type": "url",
        "index": "0",
        "parameters": [
          { "type": "text", "text": "9021" }
        ]
      }
    ]
  }
}
```

---

### **4. `leave_status_update`**
* **Category**: Utility  
* **Description**: Sent to employees when leave requests are approved or rejected.  
* **Body Variable Order (`type: "body"`)**:
  1. `{{1}}`: Employee Name (e.g. `"Priya Verma"`)
  2. `{{2}}`: Leave Request Reference ID (e.g. `"LEAVE-14"`)
  3. `{{3}}`: Status Outcome (e.g. `"APPROVED"` or `"REJECTED"`)
  4. `{{4}}`: Approved Date Range (e.g. `"Sep 18 - Sep 20, 2026"`)
  5. `{{5}}`: Reviewed / Approved By (e.g. `"HR Department"`)

#### Example JSON Payload:
```json
{
  "recipientPhone": "919876543210",
  "recipientName": "Priya Verma",
  "crmReferenceId": "LEAVE-14",
  "category": "leave_update",
  "template": {
    "name": "leave_status_update",
    "language": { "code": "en" },
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "Priya Verma" },
          { "type": "text", "text": "LEAVE-14" },
          { "type": "text", "text": "APPROVED" },
          { "type": "text", "text": "Sep 18 - Sep 20, 2026" },
          { "type": "text", "text": "HR Department" }
        ]
      }
    ]
  }
}
```

---

### **5. `attendance_shift_reminder`**
* **Category**: Utility  
* **Description**: Reminder sent to staff before scheduled work shift.  
* **Body Variable Order (`type: "body"`)**:
  1. `{{1}}`: Employee Name (e.g. `"Rajesh Sharma"`)
  2. `{{2}}`: Shift Name & Time (e.g. `"Morning Shift (09:00 AM - 06:00 PM)"`)
  3. `{{3}}`: Scheduled Shift Date (e.g. `"2026-09-16"`)
  4. `{{4}}`: Office Location / Branch (e.g. `"Vision Tech HQ - Tech Park"`)

#### Example JSON Payload:
```json
{
  "recipientPhone": "919876543210",
  "recipientName": "Rajesh Sharma",
  "crmReferenceId": "SHIFT-9021",
  "category": "attendance_reminder",
  "template": {
    "name": "attendance_shift_reminder",
    "language": { "code": "en" },
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "Rajesh Sharma" },
          { "type": "text", "text": "Morning Shift (09:00 AM - 06:00 PM)" },
          { "type": "text", "text": "2026-09-16" },
          { "type": "text", "text": "Vision Tech HQ - Tech Park" }
        ]
      }
    ]
  }
}
```

---

### **6. `crm_ticket_update`**
* **Category**: Service  
* **Description**: Sent to clients or support agents upon ticket status change.  
* **Body Variable Order (`type: "body"`)**:
  1. `{{1}}`: Client / Customer Name (e.g. `"Rajesh Sharma"`)
  2. `{{2}}`: Ticket Ref ID & Subject (e.g. `"TICKET-56: Webhook Latency"`)
  3. `{{3}}`: Updated Ticket Status (e.g. `"IN PROGRESS"` or `"RESOLVED"`)
  4. `{{4}}`: Assigned Support Engineer (e.g. `"Support Desk Tech"`)
* **Button Variable Order (`type: "button"`, `sub_type: "url"`, `index: "0"`)**:
  1. `{{1}}`: Ticket ID Suffix (e.g. `"56"` -> expands URL to `https://crm.visiontechautomation.in/account/tickets/56`)

#### Example JSON Payload:
```json
{
  "recipientPhone": "919876543210",
  "recipientName": "Rajesh Sharma",
  "crmReferenceId": "TICKET-56",
  "category": "crm_ticket",
  "template": {
    "name": "crm_ticket_update",
    "language": { "code": "en" },
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "Rajesh Sharma" },
          { "type": "text", "text": "TICKET-56: Webhook Latency" },
          { "type": "text", "text": "IN PROGRESS" },
          { "type": "text", "text": "Support Desk Tech" }
        ]
      },
      {
        "type": "button",
        "sub_type": "url",
        "index": "0",
        "parameters": [
          { "type": "text", "text": "56" }
        ]
      }
    ]
  }
}
```

---

## 4. Summary Credentials Table for Client

| Feature / Credential | Type / Parameter | Exact Real Value | Purpose |
| :--- | :--- | :--- | :--- |
| **API Secret Token (Live)** | Bearer Token | `vt_live_sec_90218847291048291` | Used in `Authorization` header for `POST /api/crm/send-message` |
| **API Secret Token (Sandbox)** | Bearer Token | `vt_test_sec_demo2026_9021` | Active token for staging environment testing |
| **Meta Permanent Access Token** | `accessToken` | `EAAjsTrAR0ZBABSXd3sKxQFwN1ueZBgYnCoj46HNCe4IZCkMDtlvG0MMVZC2uzAAJZA4yB1rp8idrs9vY` | Direct Meta Cloud Graph API v20.0 Access Token |
| **Meta Phone Number ID** | `phoneNumberId` | `1348331951688529` | WhatsApp Phone Number ID (+1 303 376-9229) |
| **Meta WABA ID** | `wabaId` | `26119545054390590` | WhatsApp Business Account ID (wixfox) |
| **Meta App ID** | `appId` | `2511622519247840` | Meta Developer App ID |
| **Meta Webhook Verify Token** | `verifyToken` | `vision_tech_secret_2026` | Verification token for Meta GET handshake (`hub.verify_token`) |
| **Webhook HMAC Secret** | Secret Key | `vt_whsec_prod_c984f1a27e053b6d91480f2a74c83e16` | Used in `X-VisionTech-Signature` header for signature verification |
| **Webhook Header Token** | Token Header | `vt_wh_tok_prod_89e472a10b5c3d1f` | Static header token in `X-CRM-Webhook-Token` |
| **Privacy Policy URL** | Legal URL | `https://<YOUR-DOMAIN>/privacy-policy` | Mandatory Meta Developer App basic setting |
| **Terms of Service URL** | Legal URL | `https://<YOUR-DOMAIN>/terms-of-service` | Mandatory Meta Developer App basic setting |
| **Data Deletion Instructions** | Legal URL | `https://<YOUR-DOMAIN>/data-deletion` | Mandatory Meta Developer User Data Deletion setting |

---

## 5. Meta Developer Console App Publishing Checklist

To complete App Publishing on `developers.facebook.com`:
1. Log into **Meta Developers Console**.
2. Select App `2511622519247840` / WABA `1409825194523052`.
3. Open **App settings → Basic**.
4. Enter `https://<YOUR-DOMAIN>/privacy-policy` into **Privacy Policy URL**.
5. Enter `https://<YOUR-DOMAIN>/terms-of-service` into **Terms of Service URL**.
6. Enter `https://<YOUR-DOMAIN>/data-deletion` into **User Data Deletion**.
7. Select Category (**Business and Pages**).
8. Save changes and click **Publish App** (or flip top toggle to **Live**).


