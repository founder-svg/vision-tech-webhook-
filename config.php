<?php
/**
 * Vision Tech WhatsApp Gateway & Webhook Configuration (PHP Native)
 * 
 * Target Domain: crm.visiontechautomation.in
 * Engine: Meta WhatsApp Cloud API v20.0 Direct
 */

// Meta WhatsApp Cloud API Direct Credentials
define('META_ACCESS_TOKEN', 'EAAjsTrAR0ZBABSXd3sKxQFwN1ueZBgYnCoj46HNCe4IZCkMDtlvG0MMVZC2uzAAJZA4yB1rp8idrs9vY');
define('META_PHONE_NUMBER_ID', '1348331951688529');
define('META_WABA_ID', '26119545054390590');
define('META_VERIFY_TOKEN', 'vision_tech_secret_2026'); // Handshake verify token for hub.verify_token

// Webhook Security & CRM Forwarding Settings
define('VISIONTECH_HMAC_SECRET', 'vt_whsec_prod_c984f1a27e053b6d91480f2a74c83e16'); // X-VisionTech-Signature HMAC SHA256 key
define('VISIONTECH_WEBHOOK_TOKEN', 'vt_wh_tok_prod_89e472a10b5c3d1f'); // X-CRM-Webhook-Token static header token
define('CRM_WEBHOOK_RECEIVER_URL', 'https://crm.visiontechautomation.in/api/v1/whatsapp-receiver');
define('AUTO_FORWARD_TO_CRM', true);

// Optional Database Logging Credentials (MySQL / MariaDB for Worksuite CRM)
define('DB_HOST', 'localhost');
define('DB_NAME', 'worksuite_crm');
define('DB_USER', 'crm_user');
define('DB_PASS', 'crm_password');
define('ENABLE_DB_LOGGING', false); // Set to true if connecting directly to MySQL

// File Logging
define('LOG_FILE', __DIR__ . '/webhook.log');
