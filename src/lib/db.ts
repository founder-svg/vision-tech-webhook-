import { Contact, Message, WebhookLog, WebhookConfig, VirtualNumber } from '@/types';
import { INITIAL_CONTACTS, INITIAL_MESSAGES, INITIAL_LOGS, INITIAL_CONFIG, INITIAL_VIRTUAL_NUMBERS } from './store';

// Global persistent in-memory database store for Next.js API routes & Server Components
declare global {
  var _visionTechDb: {
    contacts: Contact[];
    messages: Record<string, Message[]>;
    logs: WebhookLog[];
    config: WebhookConfig;
    virtualNumbers: VirtualNumber[];
  } | undefined;
}

if (!global._visionTechDb) {
  global._visionTechDb = {
    contacts: [...INITIAL_CONTACTS],
    messages: { ...INITIAL_MESSAGES },
    logs: [...INITIAL_LOGS],
    config: { ...INITIAL_CONFIG },
    virtualNumbers: [...INITIAL_VIRTUAL_NUMBERS]
  };
}

const db = global._visionTechDb;

export function getDb() {
  return db;
}

// Contacts Management
export function getSavedContacts(): Contact[] {
  return db.contacts;
}

export function saveOrUpdateContact(phone: string, name?: string, type?: string, role?: string, id?: string): Contact {
  const cleanPhoneDigits = phone.replace(/[^0-9]/g, '');
  const formattedPhone = phone.trim().startsWith('+') ? phone.trim() : `+${phone.replace(/[^0-9+]/g, '')}`;

  let contact = db.contacts.find((c) => 
    (id && c.id === id) || 
    (c.phone && c.phone.replace(/[^0-9]/g, '') === cleanPhoneDigits)
  );

  if (contact) {
    if (name && name.trim()) {
      const isGenericNewName = name.startsWith('User (+') || name.startsWith('Contact (');
      const isGenericOldName = !contact.name || contact.name.startsWith('User (+') || contact.name.startsWith('Contact (');
      if (!isGenericNewName || isGenericOldName) {
        contact.name = name.trim();
      }
    }
    if (type) contact.type = type as any;
    if (role) contact.role = role;
    if (id && contact.id !== id) {
      // Migrate messages if id changed
      if (db.messages[contact.id]) {
        db.messages[id] = [...(db.messages[id] || []), ...(db.messages[contact.id] || [])];
        delete db.messages[contact.id];
      }
      contact.id = id;
    }
    return contact;
  }

  // Create new contact if not found
  const newContactId = id || `c-${cleanPhoneDigits || Date.now()}`;
  const newContact: Contact = {
    id: newContactId,
    name: name?.trim() || `Contact (${formattedPhone})`,
    phone: formattedPhone,
    avatar: `https://images.unsplash.com/photo-${1534528741775 + (db.contacts.length % 10)}?w=150&auto=format&fit=crop&q=80`,
    type: (type as any) || 'client',
    role: role || 'WhatsApp Contact',
    lastMessage: 'Tap to send a WhatsApp message...',
    lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    unreadCount: 0,
    online: true
  };

  db.contacts.unshift(newContact);
  if (!db.messages[newContact.id]) {
    db.messages[newContact.id] = [];
  }
  return newContact;
}

// Messages Management
export function getSavedMessages(contactId?: string): Record<string, Message[]> | Message[] {
  if (contactId) {
    const cleanDigits = contactId.replace(/[^0-9]/g, '');
    const contact = db.contacts.find((c) => c.id === contactId || (cleanDigits && c.phone?.replace(/[^0-9]/g, '') === cleanDigits));
    const targetId = contact ? contact.id : contactId;
    return db.messages[targetId] || [];
  }
  return db.messages;
}

export function saveMessage(contactId: string, msg: Omit<Message, 'id'> & { id?: string }): Message {
  const cleanDigits = contactId.replace(/[^0-9]/g, '');
  const contact = db.contacts.find((c) => c.id === contactId || (cleanDigits && c.phone?.replace(/[^0-9]/g, '') === cleanDigits));
  const targetContactId = contact ? contact.id : contactId;

  const messageId = msg.id || `m-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const fullMessage: Message = {
    id: messageId,
    contactId: targetContactId,
    sender: msg.sender,
    senderName: msg.senderName || (msg.sender === 'contact' ? contact?.name : undefined),
    content: msg.content,
    timestamp: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sentAt: msg.sentAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: msg.status || 'delivered',
    metaMessageId: msg.metaMessageId,
    attachment: msg.attachment
  };

  if (!db.messages[targetContactId]) {
    db.messages[targetContactId] = [];
  }

  // Avoid duplicate message by ID or metaMessageId
  const existingMsgs = db.messages[targetContactId];
  const isDuplicate = existingMsgs.some(
    (m) => m.id === messageId || (msg.metaMessageId && m.metaMessageId === msg.metaMessageId)
  );

  if (!isDuplicate) {
    db.messages[targetContactId].push(fullMessage);
  }

  // Update contact last message
  if (contact) {
    contact.lastMessage = msg.content || msg.attachment?.fileName || 'Media file';
    contact.lastMessageTime = fullMessage.timestamp;
    if (msg.sender === 'contact') {
      contact.unreadCount = (contact.unreadCount || 0) + 1;
    }
  }

  return fullMessage;
}

export function updateMessageStatusByMetaId(metaMessageId: string, status: Message['status'], timestamp?: string) {
  for (const contactId in db.messages) {
    db.messages[contactId] = db.messages[contactId].map((msg) => {
      if (msg.metaMessageId === metaMessageId || msg.id === metaMessageId) {
        return {
          ...msg,
          status,
          ...(status === 'delivered' ? { deliveredAt: timestamp || new Date().toLocaleTimeString() } : {}),
          ...(status === 'read' ? { viewedAt: timestamp || new Date().toLocaleTimeString() } : {})
        };
      }
      return msg;
    });
  }
}

// Config Management
export function getConfig(): WebhookConfig {
  return db.config;
}

export function updateConfig(newConfig: Partial<WebhookConfig>): WebhookConfig {
  const prevMeta = db.config.metaVerification;
  const newMeta = newConfig.metaVerification;

  db.config = {
    ...db.config,
    ...newConfig,
    metaVerification: {
      wabaId: newMeta?.wabaId || prevMeta?.wabaId || '1000695869179900',
      displayName: newMeta?.displayName || prevMeta?.displayName || 'Vision Tech Business Support',
      displayNameStatus: newMeta?.displayNameStatus || prevMeta?.displayNameStatus || 'APPROVED',
      verificationStatus: newMeta?.verificationStatus || prevMeta?.verificationStatus || 'CONNECTED',
      qualityRating: newMeta?.qualityRating || prevMeta?.qualityRating || 'GREEN',
      messagingLimit: newMeta?.messagingLimit || prevMeta?.messagingLimit || '1,000 msgs/day',
      twoFactorPinSet: newMeta?.twoFactorPinSet ?? prevMeta?.twoFactorPinSet ?? true,
      isLiveVerified: newMeta?.isLiveVerified ?? prevMeta?.isLiveVerified ?? true,
      ...(newMeta?.metaCertId ? { metaCertId: newMeta.metaCertId } : {}),
      ...(newMeta?.lastOtpSentTime ? { lastOtpSentTime: newMeta.lastOtpSentTime } : {})
    }
  };
  return db.config;
}

// Logs Management
export function getSavedLogs(): WebhookLog[] {
  return db.logs;
}

export function saveLog(log: Omit<WebhookLog, 'id'>): WebhookLog {
  const newLog: WebhookLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    ...log
  };
  db.logs.unshift(newLog);
  return newLog;
}

export function clearLogs(): void {
  db.logs = [];
}

// Virtual Numbers Management
export function getSavedVirtualNumbers(): VirtualNumber[] {
  return db.virtualNumbers;
}

export function addVirtualNumber(num: VirtualNumber): VirtualNumber {
  db.virtualNumbers.unshift(num);
  return num;
}

export function updateVirtualNumber(id: string, updates: Partial<VirtualNumber>): VirtualNumber | null {
  const index = db.virtualNumbers.findIndex((n) => n.id === id);
  if (index !== -1) {
    db.virtualNumbers[index] = {
      ...db.virtualNumbers[index],
      ...updates
    };
    return db.virtualNumbers[index];
  }
  return null;
}

export function removeVirtualNumber(id: string): boolean {
  const initialLen = db.virtualNumbers.length;
  db.virtualNumbers = db.virtualNumbers.filter((n) => n.id !== id);
  return db.virtualNumbers.length < initialLen;
}

export function clearAllMessages(): void {
  db.messages = {};
  for (const c of db.contacts) {
    c.lastMessage = 'Tap to send a WhatsApp message...';
    c.lastMessageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    c.unreadCount = 0;
  }
}


