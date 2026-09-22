import { Contact, Message, WalletTransaction, WebhookLog, WebhookConfig, MessageStatus, CustomReminder, VirtualProviderInfo, VirtualNumber } from '@/types';

export const INITIAL_CONFIG: WebhookConfig = {
  verifyToken: 'vision_tech_secret_2026',
  phoneNumberId: '1103471826188240',
  appId: '2511622519247840',
  accessToken: 'EAAjsTrAR0ZBABSQ41G4LtfU7RVRZCVGLrHQ0wPIziqu9AEIQD2RWauGzJJqafZB7N2RK5UfOcIcPxHooVpLDcY3DGpB3gJaj5zYd38gG9OidIRMTv5sT29cQZCYjOXW83AMEpUPGc1v4ZBrsmyaHnZAn7tEKpoB9OPv2g6AQl1obSAS8F23yfFtcXQAt1LFIPg3gJnNxVtZBkRVuNIVkrPUoma8ZCoQZCa02mVjgUYS82okSRKoKTQdPlBrvsDxBblapMcLQsHAotzTmQUZBRZCQqIE8OQ9i2qoukwuJgwZD',
  crmWebhookUrl: 'https://crm.visiontechautomation.in/api/v1/whatsapp-receiver',
  autoForwardToCrm: true,
  simulationMode: false,
  appMode: 'live',
  metaVerification: {
    wabaId: '1000695869179900',
    displayName: 'Vision Tech Business Support (+91 97242 25971)',
    displayNameStatus: 'APPROVED',
    verificationStatus: 'CONNECTED',
    qualityRating: 'GREEN',
    messagingLimit: '1,000 msgs/day',
    twoFactorPinSet: true,
    isLiveVerified: true
  }
};

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c-918511083277',
    name: 'My Personal Phone (+91 85110 83277)',
    phone: '+91 85110 83277',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    type: 'client',
    role: 'Primary WhatsApp Recipient',
    lastMessage: 'Tap to send a WhatsApp message...',
    lastMessageTime: 'Just now',
    unreadCount: 0,
    online: true
  },
  {
    id: 'c-919724225971',
    name: 'Vision Tech Business Line (+91 97242 25971)',
    phone: '+91 97242 25971',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    type: 'client',
    role: 'Registered Business WhatsApp Number',
    lastMessage: 'Official WhatsApp Cloud API Active',
    lastMessageTime: 'Just now',
    unreadCount: 0,
    online: true
  },
  {
    id: 'c1',
    name: 'Rajesh Sharma (Acme Corp Client)',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    type: 'client',
    role: 'Client - Procurement Manager',
    lastMessage: 'Received project delivery file. Will review today.',
    lastMessageTime: '10:42 AM',
    unreadCount: 0,
    online: true
  },
  {
    id: 'c2',
    name: 'Priya Verma (Sr. Developer Employee)',
    phone: '+91 91234 56789',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    type: 'employee',
    role: 'Employee - Backend Lead',
    lastMessage: 'Sprint task update submitted in CRM.',
    lastMessageTime: '09:15 AM',
    unreadCount: 1,
    online: true
  },
  {
    id: 'c3',
    name: 'Anil Kumar (Vendor Task)',
    phone: '+91 99887 76655',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    type: 'task',
    role: 'Task - Hardware Supply',
    lastMessage: 'Hardware dispatch schedule confirmed for 2 PM.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    online: false
  },
  {
    id: 'c4',
    name: 'Daily CRM Payment Reminder',
    phone: '+91 98000 11223',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    type: 'reminder',
    role: 'Automated CRM Bot',
    lastMessage: 'Invoice #VT-9021 payment reminder dispatched.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    online: false
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {};


export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx1',
    timestamp: '2026-09-04 14:30',
    type: 'credit',
    amount: 5000,
    description: 'Meta Balance Top-Up via Razorpay UPI',
    metaTxId: 'META-PAY-90182391',
    status: 'completed'
  },
  {
    id: 'tx2',
    timestamp: '2026-09-04 18:45',
    type: 'debit',
    amount: 45.50,
    description: 'WhatsApp Utility Conversations (35 Messages)',
    metaTxId: 'META-MSG-8829103',
    status: 'completed'
  },
  {
    id: 'tx3',
    timestamp: '2026-09-05 09:15',
    type: 'debit',
    amount: 18.20,
    description: 'WhatsApp Service Conversations (14 Messages)',
    metaTxId: 'META-MSG-9910294',
    status: 'completed'
  }
];

export const INITIAL_LOGS: WebhookLog[] = [
  {
    id: 'log1',
    timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    direction: 'inbound_meta',
    eventType: 'verification',
    status: '200 OK',
    summary: 'Meta Webhook Verification GET Request Successful (hub.verify_token matched)',
    payload: {
      "hub.mode": "subscribe",
      "hub.verify_token": "vision_tech_secret_2026",
      "hub.challenge": "1158201948290"
    }
  },
  {
    id: 'log2',
    timestamp: new Date(Date.now() - 1800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    direction: 'inbound_meta',
    eventType: 'messages',
    status: '200 OK',
    summary: 'Incoming WhatsApp Message from +91 98765 43210 (Text payload)',
    payload: {
      "object": "whatsapp_business_account",
      "entry": [{
        "id": "849201948201",
        "changes": [{
          "value": {
            "messaging_product": "whatsapp",
            "metadata": { "display_phone_number": "1555029381", "phone_number_id": "109283746591823" },
            "contacts": [{ "profile": { "name": "Rajesh Sharma" }, "wa_id": "919876543210" }],
            "messages": [{
              "from": "919876543210",
              "id": "wamid.HBgLMTk4NzY1NDMyMTAVAgARGBI3OTEwMjM5MDEx",
              "timestamp": "1725515220",
              "text": { "body": "Received project delivery file. Will review today." },
              "type": "text"
            }]
          },
          "field": "messages"
        }]
      }]
    }
  },
  {
    id: 'log3',
    timestamp: new Date(Date.now() - 1795000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    direction: 'outbound_crm',
    eventType: 'crm_dispatch',
    status: '200 OK',
    summary: 'Forwarded client message payload to CRM webhook (https://crm.visiontech.com...)',
    payload: {
      "event": "whatsapp.message_received",
      "contact_phone": "+91 98765 43210",
      "contact_name": "Rajesh Sharma",
      "message": "Received project delivery file. Will review today.",
      "timestamp": "2026-09-05T01:30:00Z"
    }
  }
];

export const INITIAL_REMINDERS: CustomReminder[] = [
  {
    id: 'rem-1',
    title: 'Invoice #VT-9021 Payment Follow-up',
    contactId: 'c1',
    contactName: 'Rajesh Sharma (Acme Corp Client)',
    contactPhone: '+91 98765 43210',
    message: 'Hello Rajesh ji, this is an automated Vision Tech payment reminder for Invoice #VT-9021 (₹45,000). Please process at your earliest convenience.',
    mode: 'automated',
    scheduledDate: '2026-09-08',
    scheduledTime: '10:00',
    frequency: 'once',
    status: 'pending',
    createdAt: '2026-09-05 10:00'
  },
  {
    id: 'rem-2',
    title: 'Weekly Sprint Progress Alert',
    contactId: 'c2',
    contactName: 'Priya Verma (Sr. Developer Employee)',
    contactPhone: '+91 91234 56789',
    message: 'Hi Priya, automated weekly sprint task update reminder. Kindly submit your completed task list in Vision Tech CRM.',
    mode: 'automated',
    scheduledDate: '2026-09-07',
    scheduledTime: '09:30',
    frequency: 'weekly',
    status: 'pending',
    createdAt: '2026-09-05 11:15'
  },
  {
    id: 'rem-3',
    title: 'Hardware Supply Dispatch Confirmation',
    contactId: 'c3',
    contactName: 'Anil Kumar (Vendor Task)',
    contactPhone: '+91 99887 76655',
    message: 'Manual Follow-up: Hi Anil, please confirm the hardware shipment dispatch tracking number for Order #HT-402.',
    mode: 'manual',
    status: 'pending',
    createdAt: '2026-09-05 12:30'
  }
];

export const INITIAL_VIRTUAL_PROVIDERS: VirtualProviderInfo[] = [
  {
    id: '5sim',
    name: '5sim.net (Primary Cloud SIM)',
    isPrimary: true,
    status: 'online',
    successRate: 98.6,
    avgOtpTimeSec: 8,
    costPerNumber: 25.0,
    apiToken: '5s_live_token_vt90218847291',
    availableCountries: ['India 🇮🇳', 'United States 🇺🇸', 'United Kingdom 🇬🇧', 'Netherlands 🇳🇱', 'Canada 🇨🇦']
  },
  {
    id: 'sms_activate',
    name: 'SMS-Activate.org (Backup Failover Provider)',
    isPrimary: false,
    status: 'online',
    successRate: 97.2,
    avgOtpTimeSec: 12,
    costPerNumber: 22.0,
    apiToken: 'sa_backup_token_99018471928',
    availableCountries: ['India 🇮🇳', 'United States 🇺🇸', 'United Kingdom 🇬🇧', 'Germany 🇩🇪', 'Indonesia 🇮🇩']
  },
  {
    id: 'twilio',
    name: 'Twilio Virtual Toll-Free & Mobile',
    isPrimary: false,
    status: 'online',
    successRate: 99.9,
    avgOtpTimeSec: 5,
    costPerNumber: 45.0,
    apiToken: 'AC_twilio_secret_token_9012847120',
    availableCountries: ['United States 🇺🇸', 'United Kingdom 🇬🇧', 'Canada 🇨🇦']
  },
  {
    id: 'textnow',
    name: 'TextNow Business Virtual SIM',
    isPrimary: false,
    status: 'degraded',
    successRate: 85.1,
    avgOtpTimeSec: 25,
    costPerNumber: 15.0,
    apiToken: 'tn_virtual_token_48102948',
    availableCountries: ['United States 🇺🇸', 'Canada 🇨🇦']
  }
];

export const INITIAL_VIRTUAL_NUMBERS: VirtualNumber[] = [
  {
    id: 'vn-101',
    phoneNumber: '+91 98901 23456',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    provider: '5sim',
    providerName: '5sim.net (Primary Cloud SIM)',
    service: 'WhatsApp Cloud API',
    cost: 25.0,
    status: 'active',
    otpCode: '849201',
    expiresAt: new Date(Date.now() + 86400000 * 25).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    assignedToMeta: true,
    smsHistory: [
      {
        id: 'sms-1',
        sender: 'WhatsApp',
        text: 'Your WhatsApp Business verification code is 849-201. Do not share this code.',
        code: '849201',
        receivedAt: new Date(Date.now() - 3600000 * 1.9).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  },
  {
    id: 'vn-102',
    phoneNumber: '+1 415 890 1234',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    provider: 'sms_activate',
    providerName: 'SMS-Activate.org (Backup Failover Provider)',
    service: 'WhatsApp Business',
    cost: 22.0,
    status: 'pending_otp',
    expiresAt: new Date(Date.now() + 900000).toISOString(), // 15 mins left
    createdAt: new Date(Date.now() - 60000 * 2).toISOString(),
    assignedToMeta: false,
    smsHistory: []
  }
];

