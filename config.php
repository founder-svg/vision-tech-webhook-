<?php
/**
 * Vision Tech WhatsApp Gateway & Webhook Configuration (PHP Native)
 * 
 * Target Domain: crm.visiontechautomation.in
 * Engine: Meta WhatsApp Cloud API v20.0 Direct
 * 
 * NOTE: Set environment variables or update the values below before production deployment.
 */

// Load environment variables if .env exists
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($key, $value) = explode('=', $line, 2);
        putenv(trim($key) . '=' . trim($value));
    }
}

// Meta WhatsApp Cloud API Direct Credentials
define('META_ACCESS_TOKEN', getenv('META_ACCESS_TOKEN') ?: 'YOUR_META_ACCESS_TOKEN');
define('META_PHONE_NUMBER_ID', getenv('META_PHONE_NUMBER_ID') ?: 'YOUR_PHONE_NUMBER_ID');
define('META_WABA_ID', getenv('META_WABA_ID') ?: 'YOUR_WABA_ID');
define('META_VERIFY_TOKEN', getenv('META_VERIFY_TOKEN') ?: 'vision_tech_secret_2026');

// Webhook Security & CRM Forwarding Settings
define('VISIONTECH_HMAC_SECRET', getenv('VISIONTECH_HMAC_SECRET') ?: 'YOUR_WEBHOOK_HMAC_SECRET');
define('VISIONTECH_WEBHOOK_TOKEN', getenv('VISIONTECH_WEBHOOK_TOKEN') ?: 'YOUR_WEBHOOK_TOKEN');
define('CRM_WEBHOOK_RECEIVER_URL', getenv('CRM_WEBHOOK_RECEIVER_URL') ?: 'https://crm.visiontechautomation.in/api/v1/whatsapp-receiver');
define('AUTO_FORWARD_TO_CRM', getenv('AUTO_FORWARD_TO_CRM') !== 'false');

// Optional Database Logging Credentials (MySQL / MariaDB for Worksuite CRM)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'worksuite_crm');
define('DB_USER', getenv('DB_USER') ?: 'crm_user');
define('DB_PASS', getenv('DB_PASS') ?: 'crm_password');
define('ENABLE_DB_LOGGING', getenv('ENABLE_DB_LOGGING') === 'true');

// File Logging
define('LOG_FILE', __DIR__ . '/webhook.log');
