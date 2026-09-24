-- Vision Tech WhatsApp Webhook SQL Database Schema (MySQL / MariaDB)
-- Run this script inside your PHP CRM database (e.g. Worksuite CRM)

CREATE TABLE IF NOT EXISTS `whatsapp_contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(30) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `whatsapp_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `contact_phone` VARCHAR(30) NOT NULL,
  `sender` ENUM('contact', 'agent', 'system') NOT NULL,
  `content` TEXT NOT NULL,
  `msg_type` VARCHAR(30) DEFAULT 'text',
  `meta_message_id` VARCHAR(150) NULL UNIQUE,
  `crm_reference_id` VARCHAR(100) NULL,
  `delivery_status` ENUM('sent', 'delivered', 'read', 'failed') DEFAULT 'sent',
  `attachment_url` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (`contact_phone`),
  INDEX (`meta_message_id`),
  INDEX (`crm_reference_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `whatsapp_webhook_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_type` VARCHAR(50) NOT NULL,
  `direction` VARCHAR(20) NOT NULL,
  `status_code` VARCHAR(20) NOT NULL,
  `summary` TEXT NOT NULL,
  `payload` LONGTEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
