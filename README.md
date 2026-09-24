# Vision Tech WhatsApp Webhook & API Gateway (Native PHP Edition)

This repository contains a **100% Native PHP Webhook Solution** designed specifically for **PHP-based CRM systems** (such as **Worksuite CRM**, Laravel, CodeIgniter, WordPress, or custom PHP backends).

These PHP files require zero external dependencies, no NPM/Node, and run directly on any standard PHP web server (cPanel, Apache, Nginx, IIS).

---

## 📁 Repository Contents

| File | Purpose |
| :--- | :--- |
| [`config.php`](config.php) | Central PHP configuration containing Meta API Access Tokens, Phone Number ID, Verify Token, and HMAC Secret. |
| [`webhook.php`](webhook.php) | Complete Meta WhatsApp Cloud API Webhook Listener in PHP. Handles GET Handshake (`hub.verify_token` + `hub.challenge`) and POST event listener (`messages` and `statuses`). |
| [`crm_webhook_receiver.php`](crm_webhook_receiver.php) | Dedicated Worksuite CRM / PHP Webhook Receiver Script. Validates `X-VisionTech-Signature` HMAC SHA-256 signatures and processes inbound updates. |
| [`send_message.php`](send_message.php) | PHP helper class (`VisionTechWhatsApp`) to dispatch text messages, approved Meta templates (`task_assignment_alert`), and PDF invoices via PHP cURL. |
| [`db_setup.sql`](db_setup.sql) | SQL Database schema script to create `whatsapp_contacts`, `whatsapp_messages`, and `whatsapp_webhook_logs` in MySQL/MariaDB. |

---

## 🚀 Quick 3-Step Setup for PHP CRM Server

### Step 1: Upload Files to PHP Server
Upload the contents of this repository to your PHP web server directory (e.g. `/public_html/webhook/`).
Your Webhook URL will now be:
```
https://your-domain.com/webhook/webhook.php
```

### Step 2: Configure Meta Developer Console
1. Log into **[Meta Developers Console](https://developers.facebook.com)**.
2. Select your App -> **WhatsApp -> Configuration**.
3. Edit **Callback URL**: `https://your-domain.com/webhook/webhook.php`
4. Enter **Verify Token**: `vision_tech_secret_2026`
5. Click **Verify and Save**. Meta will send a GET request to `webhook.php`, which will respond with `hub.challenge` HTTP 200 automatically!
6. Subscribe to fields: `messages`.

### Step 3: Integrate Inbound Webhook Receiver in PHP CRM
Set your CRM Receiver URL in `config.php`:
```php
define('CRM_WEBHOOK_RECEIVER_URL', 'https://crm.visiontechautomation.in/api/v1/whatsapp-receiver');
```
Inside your PHP CRM, verify incoming webhooks using `crm_webhook_receiver.php` or check `X-VisionTech-Signature` HMAC SHA-256.

---

## ✉️ Sending Messages from PHP CRM

In your PHP code:
```php
require_once __DIR__ . '/send_message.php';

$whatsapp = new VisionTechWhatsApp();

// 1. Send Task Alert Template
$result = $whatsapp->sendTemplateMessage(
    '919876543210', 
    'task_assignment_alert', 
    ['Rajesh Sharma', 'TASK-38: API Integration', '2026-09-20', 'Priya Verma'], 
    ['38']
);

// 2. Send PDF Invoice
$result = $whatsapp->sendDocumentMessage(
    '919876543210',
    'https://crm.visiontechautomation.in/uploads/invoices/INV-9021.pdf',
    'Invoice_INV-9021.pdf',
    'Please find attached Invoice #INV-9021'
);
```

---

## 🔒 Security Specifications

- **HMAC Verification**: Callbacks sent to your CRM receiver include header `X-VisionTech-Signature: sha256=<hash>`, computed using `VISIONTECH_HMAC_SECRET`.
- **Verify Token**: Meta handshake requires `hub.verify_token === 'vision_tech_secret_2026'`.
