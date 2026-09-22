export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export type ContactType = 'client' | 'employee' | 'reminder' | 'task';

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  fileName: string;
  fileSize?: string;
  mimeType?: string;
}

export interface Message {
  id: string;
  contactId: string;
  sender: 'user' | 'contact' | 'crm_bot';
  senderName?: string;
  content: string;
  timestamp: string; // ISO string or formatted
  viewedAt?: string; // Exact time when blue tick was triggered
  deliveredAt?: string; // Exact time when double tick was triggered
  sentAt?: string;
  status: MessageStatus;
  attachment?: Attachment;
  metaMessageId?: string;
  isCrmTriggered?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  type: ContactType;
  role?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  online?: boolean;
}

export interface WalletTransaction {
  id: string;
  timestamp: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  metaTxId: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  direction: 'inbound_meta' | 'outbound_crm' | 'outbound_meta';
  eventType: 'messages' | 'statuses' | 'verification' | 'crm_dispatch';
  status: '200 OK' | '400 Bad Request' | '403 Forbidden' | '500 Server Error' | 'Pending';
  payload: any;
  summary: string;
}

export interface MetaVerificationState {
  wabaId: string;
  displayName: string;
  displayNameStatus: 'APPROVED' | 'PENDING' | 'DECLINED';
  verificationStatus: 'UNVERIFIED' | 'OTP_SENT' | 'VERIFIED' | 'CONNECTED';
  qualityRating: 'GREEN' | 'YELLOW' | 'RED';
  messagingLimit: string; // e.g. '1,000 msgs/day'
  twoFactorPinSet: boolean;
  metaCertId?: string;
  lastOtpSentTime?: string;
  isLiveVerified?: boolean;
}

export interface WebhookConfig {
  verifyToken: string;
  phoneNumberId: string;
  appId: string;
  accessToken: string;
  crmWebhookUrl: string;
  autoForwardToCrm: boolean;
  simulationMode: boolean;
  appMode: 'development' | 'live';
  customTunnelUrl?: string;
  metaVerification?: MetaVerificationState;
}

export interface VirtualNumber {
  id: string;
  phoneNumber: string;
  country: string;
  countryCode: string;
  flag: string;
  provider: VirtualProviderId;
  providerName: string;
  service: string; // 'WhatsApp Business' | 'WhatsApp Cloud API'
  cost: number;
  status: VirtualNumberStatus;
  otpCode?: string;
  smsHistory: VirtualSmsMessage[];
  expiresAt: string; // ISO string
  createdAt: string;
  failoverReason?: string;
  assignedToMeta?: boolean;
  metaVerificationStatus?: 'UNVERIFIED' | 'OTP_SENT' | 'VERIFIED' | 'CONNECTED';
  metaDisplayName?: string;
}


export type ReminderMode = 'automated' | 'manual';
export type ReminderFrequency = 'once' | 'daily' | 'weekly' | 'monthly';
export type ReminderStatus = 'pending' | 'dispatched' | 'paused';

export interface CustomReminder {
  id: string;
  title: string;
  contactId?: string;
  contactName: string;
  contactPhone: string;
  message: string;
  mode: ReminderMode; // 'automated' | 'manual'
  scheduledDate?: string; // e.g. "2026-09-10"
  scheduledTime?: string; // e.g. "10:30"
  frequency?: ReminderFrequency;
  status: ReminderStatus;
  createdAt: string;
  lastDispatchedAt?: string;
}

export type VirtualProviderId = '5sim' | 'sms_activate' | 'twilio' | 'textnow' | 'custom_api';

export type VirtualNumberStatus = 'pending_otp' | 'otp_received' | 'active' | 'expired' | 'failed' | 'refunded';

export interface VirtualSmsMessage {
  id: string;
  sender: string;
  text: string;
  code?: string;
  receivedAt: string;
}

export interface VirtualProviderInfo {
  id: VirtualProviderId;
  name: string;
  isPrimary: boolean;
  status: 'online' | 'degraded' | 'offline';
  successRate: number; // e.g. 98.4%
  avgOtpTimeSec: number; // e.g. 12
  costPerNumber: number; // in INR e.g. 25
  apiToken: string;
  availableCountries: string[];
}

export interface VirtualNumber {
  id: string;
  phoneNumber: string;
  country: string;
  countryCode: string;
  flag: string;
  provider: VirtualProviderId;
  providerName: string;
  service: string; // 'WhatsApp Business' | 'WhatsApp Cloud API'
  cost: number;
  status: VirtualNumberStatus;
  otpCode?: string;
  smsHistory: VirtualSmsMessage[];
  expiresAt: string; // ISO string
  createdAt: string;
  failoverReason?: string;
  assignedToMeta?: boolean;
}

