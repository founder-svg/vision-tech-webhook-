'use client';

import React, { useState, useEffect } from 'react';
import {
  INITIAL_CONTACTS,
  INITIAL_MESSAGES,
  INITIAL_TRANSACTIONS,
  INITIAL_LOGS,
  INITIAL_CONFIG,
  INITIAL_REMINDERS,
  INITIAL_VIRTUAL_PROVIDERS,
  INITIAL_VIRTUAL_NUMBERS,
} from '@/lib/store';
import { Contact, ContactType, Message, Attachment, WalletTransaction, WebhookLog, WebhookConfig, CustomReminder, VirtualNumber, VirtualProviderInfo, VirtualProviderId } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { MetaWalletCard } from '@/components/wallet/MetaWalletCard';
import { RechargeModal } from '@/components/wallet/RechargeModal';
import { WebhookSettings } from '@/components/webhook/WebhookSettings';
import { WebhookLogsInspector } from '@/components/webhook/WebhookLogsInspector';
import { CrmApiDocs } from '@/components/crm/CrmApiDocs';
import { ReminderManager } from '@/components/reminders/ReminderManager';
import { VirtualNumberManager } from '@/components/virtual-number/VirtualNumberManager';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'wallet' | 'settings' | 'logs' | 'docs' | 'reminders' | 'virtual'>('chat');
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [activeContactId, setActiveContactId] = useState<string>('c1');
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [reminders, setReminders] = useState<CustomReminder[]>(INITIAL_REMINDERS);
  const [virtualNumbers, setVirtualNumbers] = useState<VirtualNumber[]>(INITIAL_VIRTUAL_NUMBERS);
  const [virtualProviders, setVirtualProviders] = useState<VirtualProviderInfo[]>(INITIAL_VIRTUAL_PROVIDERS);

  // Meta Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(4250.00);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);

  // Webhook & Logs State
  const [config, setConfig] = useState<WebhookConfig>(INITIAL_CONFIG);
  const [logs, setLogs] = useState<WebhookLog[]>(INITIAL_LOGS);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState<boolean>(true);

  // Load initial state from localStorage on client side mount
  useEffect(() => {
    try {
      const savedContacts = localStorage.getItem('visiontech_contacts');
      if (savedContacts) {
        const parsed = JSON.parse(savedContacts);
        if (Array.isArray(parsed) && parsed.length > 0) setContacts(parsed);
      }
      const savedMessages = localStorage.getItem('visiontech_messages');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (parsed && typeof parsed === 'object') setMessages(parsed);
      }
      const savedActiveContact = localStorage.getItem('visiontech_active_contact');
      if (savedActiveContact) {
        setActiveContactId(savedActiveContact);
      }
    } catch (e) {
      console.warn('LocalStorage restore notice:', e);
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    try {
      if (contacts && contacts.length > 0) {
        localStorage.setItem('visiontech_contacts', JSON.stringify(contacts));
      }
    } catch (e) {}
  }, [contacts]);

  useEffect(() => {
    try {
      if (messages) {
        localStorage.setItem('visiontech_messages', JSON.stringify(messages));
      }
    } catch (e) {}
  }, [messages]);

  useEffect(() => {
    try {
      if (contacts && contacts.length > 0) {
        localStorage.setItem('visiontech_contacts', JSON.stringify(contacts));
      }
    } catch (e) {}
  }, [contacts]);

  useEffect(() => {
    try {
      if (activeContactId) {
        localStorage.setItem('visiontech_active_contact', activeContactId);
      }
    } catch (e) {}
  }, [activeContactId]);

  // Helper to resolve API URLs in web vs native Capacitor APK
  const getApiUrl = (path: string) => {
    if (typeof window !== 'undefined') {
      const isNative = (window as any).Capacitor || window.location.protocol === 'file:';
      if (isNative) {
        const tunnel = config?.customTunnelUrl?.trim();
        const base = tunnel || 'https://staging.visiontechautomation.in';
        return `${base.replace(/\/$/, '')}${path}`;
      }
    }
    return path;
  };

  // Auto-sync contacts, messages, virtual numbers, logs & config from backend API store
  useEffect(() => {
    const syncData = async () => {
      try {
        const [resContacts, resChats, resVirtual, resLogs, resConfig] = await Promise.all([
          fetch(getApiUrl('/api/contacts')),
          fetch(getApiUrl('/api/chats')),
          fetch(getApiUrl('/api/virtual-numbers')),
          fetch(getApiUrl('/api/logs')),
          fetch(getApiUrl('/api/config'))
        ]);
        if (resContacts.ok) {
          const dataC = await resContacts.json();
          if (dataC.contacts && Array.isArray(dataC.contacts) && dataC.contacts.length > 0) {
            setContacts((prev) => {
              const serverIdMap = new Map(dataC.contacts.map((c: Contact) => [c.id, c]));
              const serverPhoneMap = new Map(dataC.contacts.map((c: Contact) => [c.phone?.replace(/[^0-9]/g, ''), c]));
              const merged = [...dataC.contacts];

              (prev || []).forEach((c) => {
                const cDigits = c?.phone?.replace(/[^0-9]/g, '');
                if (c && c.id && !serverIdMap.has(c.id) && (!cDigits || !serverPhoneMap.has(cDigits))) {
                  merged.unshift(c);
                }
              });
              return merged;
            });
          }
        }
        if (resChats.ok) {
          const dataM = await resChats.json();
          if (dataM.messages && typeof dataM.messages === 'object') {
            setMessages(dataM.messages);
          }
        }
        if (resVirtual.ok) {
          const dataV = await resVirtual.json();
          if (dataV.virtualNumbers && Array.isArray(dataV.virtualNumbers) && dataV.virtualNumbers.length > 0) {
            setVirtualNumbers(dataV.virtualNumbers);
          }
        }
        if (resLogs.ok) {
          const dataL = await resLogs.json();
          if (dataL.logs && Array.isArray(dataL.logs) && dataL.logs.length > 0) {
            setLogs(dataL.logs);
          }
        }
        if (resConfig.ok) {
          const dataCfg = await resConfig.json();
          if (dataCfg.config) {
            setConfig((prev) => ({ ...prev, ...dataCfg.config }));
          }
        }
      } catch (err) {
        // Silent fallback to local state if server fetch is unavailable
      }
    };

    syncData();
    const interval = setInterval(syncData, 3000);
    return () => clearInterval(interval);
  }, []);

  const defaultContact: Contact = INITIAL_CONTACTS[0] || {
    id: 'default',
    name: 'WhatsApp Support',
    phone: '+1 (555) 019-2831',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    type: 'client',
    role: 'Meta Business Support',
    lastMessage: 'Ready to receive messages',
    lastMessageTime: 'Just now',
    unreadCount: 0,
    online: true
  };

  const activeContact: Contact = (contacts || []).find((c) => c?.id === activeContactId) || contacts?.[0] || defaultContact;
  const activeMessages = (messages && activeContactId ? messages[activeContactId] : []) || [];

  // Helper to log a webhook event
  const addWebhookLog = (
    direction: 'inbound_meta' | 'outbound_crm' | 'outbound_meta',
    eventType: 'messages' | 'statuses' | 'verification' | 'crm_dispatch',
    summary: string,
    payload: any
  ) => {
    const newLog: WebhookLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      direction,
      eventType,
      status: '200 OK',
      summary,
      payload
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Send message handler with automated Meta status transitions (Clock -> Single tick -> Double tick -> Blue tick!)
  const handleSendMessage = (content: string, attachment?: Attachment) => {
    const msgId = `m-${Date.now()}`;
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const metaWamid = `wamid.HBgL${Date.now()}VR${Math.floor(Math.random() * 9000 + 1000)}`;

    const newMessage: Message = {
      id: msgId,
      contactId: activeContactId,
      sender: 'user',
      content,
      timestamp: formattedTime,
      sentAt: formattedTime,
      status: 'sending',
      metaMessageId: metaWamid,
      attachment
    };

    // Append sending message
    setMessages((prev) => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));

    // Update last message in sidebar
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeContactId
          ? { ...c, lastMessage: content || attachment?.fileName || 'Media file', lastMessageTime: formattedTime }
          : c
      )
    );

    const targetContact = activeContact || defaultContact;
    const recipientName = targetContact.name || 'Contact';
    const recipientPhone = targetContact.phone || '+910000000000';

    // Deduct message utility charge from Meta Wallet (₹0.85)
    setWalletBalance((prev) => Math.max(0, prev - 0.85));
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'debit',
        amount: 0.85,
        description: `Meta Utility Message to ${recipientName}`,
        metaTxId: metaWamid,
        status: 'completed'
      },
      ...prev
    ]);

    // Persist outbound chat message to server store
    fetch(getApiUrl('/api/chats'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactId: activeContactId,
        content,
        sender: 'user',
        senderName: 'You',
        attachment,
        metaMessageId: metaWamid
      })
    }).catch(() => { });

    // 1. Transition to SENT (Single Tick ✓) after 500ms
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeContactId]: prev[activeContactId]?.map((m) =>
          m.id === msgId ? { ...m, status: 'sent' } : m
        ) || []
      }));

      addWebhookLog(
        'outbound_meta',
        'messages',
        `Dispatched WhatsApp Message to ${recipientPhone} (${metaWamid})`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientPhone,
          type: attachment ? attachment.type : 'text',
          message_id: metaWamid,
          status: 'sent'
        }
      );

      // LIVE Meta Cloud API HTTP Dispatch Call to recipient's phone number
      const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');
      if (config.accessToken && config.phoneNumberId && cleanPhone) {
        const payload: any = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
        };

        if (attachment && (attachment.type === 'image' || attachment.type === 'document' || attachment.type === 'video' || attachment.type === 'audio')) {
          payload.type = attachment.type;
          payload[attachment.type] = {
            link: attachment.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
            caption: content || undefined
          };
        } else {
          payload.type = 'text';
          payload.text = { body: content || 'Hello from Vision Tech WhatsApp Webhook!' };
        }

        fetch(`https://graph.facebook.com/v20.0/${config.phoneNumberId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }).then(async (res) => {
          const metaResult = await res.json();
          addWebhookLog(
            'outbound_meta',
            'messages',
            `LIVE Meta Graph API Response (${res.status} ${res.statusText}) for ${recipientPhone}`,
            metaResult
          );
        }).catch((err) => {
          addWebhookLog(
            'outbound_meta',
            'messages',
            `LIVE Meta Graph API Dispatch Error: ${err.message}`,
            { error: err.message }
          );
        });
      }
    }, 500);

    // 2. Transition to DELIVERED (Double Tick ✓✓) after 1400ms
    setTimeout(() => {
      const delTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setMessages((prev) => ({
        ...prev,
        [activeContactId]: prev[activeContactId]?.map((m) =>
          m.id === msgId ? { ...m, status: 'delivered', deliveredAt: delTime } : m
        ) || []
      }));

      addWebhookLog(
        'inbound_meta',
        'statuses',
        `Meta Webhook: Status callback DELIVERED for ${recipientName}`,
        {
          object: 'whatsapp_business_account',
          entry: [{
            changes: [{
              value: {
                statuses: [{
                  id: metaWamid,
                  status: 'delivered',
                  timestamp: Math.floor(Date.now() / 1000).toString(),
                  recipient_id: recipientPhone
                }]
              }
            }]
          }]
        }
      );
    }, 1400);

    // 3. Transition to READ (Blue Double Tick ✓✓) after 2800ms
    setTimeout(() => {
      const readTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setMessages((prev) => ({
        ...prev,
        [activeContactId]: prev[activeContactId]?.map((m) =>
          m.id === msgId ? { ...m, status: 'read', viewedAt: readTime } : m
        ) || []
      }));

      addWebhookLog(
        'inbound_meta',
        'statuses',
        `Meta Webhook: Status callback READ / VIEWED for ${recipientName} (Blue Tick)`,
        {
          object: 'whatsapp_business_account',
          entry: [{
            changes: [{
              value: {
                statuses: [{
                  id: metaWamid,
                  status: 'read',
                  timestamp: Math.floor(Date.now() / 1000).toString(),
                  recipient_id: recipientPhone
                }]
              }
            }]
          }]
        }
      );

      // Auto-forward event to CRM Webhook
      if (config.autoForwardToCrm) {
        addWebhookLog(
          'outbound_crm',
          'crm_dispatch',
          `Forwarded READ status to CRM (${config.crmWebhookUrl || 'CRM Listener'})`,
          {
            event: 'whatsapp.message_read',
            meta_message_id: metaWamid,
            contact_phone: recipientPhone,
            viewed_at: readTime,
            status: 'read'
          }
        );
      }

      // Auto-reply simulation if enabled
      if (autoReplyEnabled) {
        setTimeout(() => {
          handleSimulateIncomingMessage(activeContactId);
        }, 1800);
      }
    }, 2800);
  };

  // Simulate Incoming Message from Meta Webhook (Executes full server webhook pipeline)
  const handleSimulateIncomingMessage = (targetContactId?: string, customText?: string) => {
    const cId = targetContactId || activeContactId;
    const targetContact = (contacts || []).find((c) => c?.id === cId) || activeContact || defaultContact;
    const recipientName = targetContact.name || 'Contact';
    const recipientPhone = targetContact.phone || '+910000000000';
    const cleanPhone = recipientPhone.replace(/[^0-9]/g, '') || '918511083277';

    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const metaWamid = `wamid.HBgL${Date.now()}INBOUND${Math.floor(Math.random() * 5000)}`;
    const sampleReplies = [
      'Verified with CRM records. Everything looks perfect!',
      'Thank you! Received your message and invoice payment details.',
      'Payment for invoice #VT-9021 has been processed via UPI.',
      'Task update received. Updating status in CRM portal.',
      'Daily shift attendance report updated in CRM system.'
    ];
    const replyText = customText || sampleReplies[Math.floor(Math.random() * sampleReplies.length)];

    const incomingMsg: Message = {
      id: `m-in-${Date.now()}`,
      contactId: cId,
      sender: 'contact',
      senderName: recipientName,
      content: replyText,
      timestamp: formattedTime,
      status: 'read',
      metaMessageId: metaWamid
    };

    setMessages((prev) => ({
      ...prev,
      [cId]: [...(prev[cId] || []), incomingMsg]
    }));

    setContacts((prev) =>
      (prev || []).map((c) =>
        c.id === cId
          ? { ...c, lastMessage: replyText, lastMessageTime: formattedTime, unreadCount: c.id === activeContactId ? 0 : (c.unreadCount || 0) + 1 }
          : c
      )
    );

    addWebhookLog(
      'inbound_meta',
      'messages',
      `Meta Webhook: Inbound WhatsApp Message from ${recipientName} (${cleanPhone})`,
      {
        object: 'whatsapp_business_account',
        entry: [{
          changes: [{
            value: {
              contacts: [{ profile: { name: recipientName }, wa_id: cleanPhone }],
              messages: [{
                from: cleanPhone,
                id: metaWamid,
                timestamp: Math.floor(Date.now() / 1000).toString(),
                text: { body: replyText },
                type: 'text'
              }]
            }
          }]
        }]
      }
    );

    // Send payload directly to /api/webhook POST endpoint to test complete backend webhook processor pipeline
    fetch(getApiUrl('/api/webhook'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        object: 'whatsapp_business_account',
        entry: [{
          id: config.metaVerification?.wabaId || '1409825194523052',
          changes: [{
            value: {
              messaging_product: 'whatsapp',
              metadata: { display_phone_number: config.phoneNumberId || '13033769229', phone_number_id: config.phoneNumberId || '1348331951688529' },
              contacts: [{ profile: { name: recipientName }, wa_id: cleanPhone }],
              messages: [{
                from: cleanPhone,
                id: metaWamid,
                timestamp: Math.floor(Date.now() / 1000).toString(),
                text: { body: replyText },
                type: 'text'
              }]
            },
            field: 'messages'
          }]
        }]
      })
    }).catch((err) => console.warn('[Webhook Simulation Sync Error]:', err));

    if (config.autoForwardToCrm) {
      addWebhookLog(
        'outbound_crm',
        'crm_dispatch',
        `Forwarded incoming message payload to CRM listener (${config.crmWebhookUrl || 'CRM'})`,
        {
          event: 'whatsapp.message_received',
          sender_name: recipientName,
          sender_phone: recipientPhone,
          message: replyText,
          meta_message_id: metaWamid,
          received_at: new Date().toISOString()
        }
      );
    }
  };

  // Simulate Delivery status callback
  const handleSimulateDeliveryStatus = () => {
    const targetContact = activeContact || defaultContact;
    const recipientName = targetContact.name || 'Contact';
    const recipientPhone = targetContact.phone || '+910000000000';

    const targetMsg = (activeMessages || []).find((m) => m.sender === 'user');
    if (!targetMsg) return;

    setMessages((prev) => ({
      ...prev,
      [activeContactId]: (prev[activeContactId] || []).map((m) =>
        m.id === targetMsg.id
          ? { ...m, status: 'delivered', deliveredAt: new Date().toLocaleTimeString() }
          : m
      )
    }));

    addWebhookLog(
      'inbound_meta',
      'statuses',
      `Simulated Status DELIVERED (Double Tick ✓✓) for ${recipientName}`,
      { messageId: targetMsg.metaMessageId, status: 'delivered', recipient: recipientPhone }
    );
  };

  // Simulate Read status callback (Blue double tick)
  const handleSimulateReadStatus = (messageId?: string) => {
    const targetContact = activeContact || defaultContact;
    const recipientName = targetContact.name || 'Contact';
    const recipientPhone = targetContact.phone || '+910000000000';

    const targetId = messageId || (activeMessages || []).find((m) => m.sender === 'user')?.id;
    if (!targetId) return;

    const readTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setMessages((prev) => ({
      ...prev,
      [activeContactId]: (prev[activeContactId] || []).map((m) =>
        m.id === targetId ? { ...m, status: 'read', viewedAt: readTime } : m
      )
    }));

    addWebhookLog(
      'inbound_meta',
      'statuses',
      `Simulated Status READ / VIEWED (Blue Double Tick ✓✓) at ${readTime}`,
      { messageId: targetId, status: 'read', viewedAt: readTime, recipient: recipientPhone }
    );
  };

  // Live Test GET Webhook Handshake against server API
  const handleTestGetHandshake = async () => {
    const testChallenge = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    try {
      const startTime = performance.now();
      const res = await fetch(`/api/webhook?hub.mode=subscribe&hub.verify_token=${encodeURIComponent(config.verifyToken)}&hub.challenge=${testChallenge}`);
      const challengeReturn = await res.text();
      const latencyMs = Math.round(performance.now() - startTime);

      if (res.status === 200 && challengeReturn.trim() === testChallenge) {
        addWebhookLog(
          'inbound_meta',
          'verification',
          `✅ Live Meta Webhook Handshake PASSED (HTTP 200 OK • ${latencyMs}ms)`,
          {
            'hub.mode': 'subscribe',
            'hub.verify_token': config.verifyToken,
            'hub.challenge': testChallenge,
            'returned_challenge': challengeReturn,
            'latency': `${latencyMs}ms`,
            'status': '200 OK',
            'meta_compatibility': '100% Compliant'
          }
        );
      } else {
        addWebhookLog(
          'inbound_meta',
          'verification',
          `❌ Live Meta Webhook Handshake FAILED (HTTP ${res.status})`,
          {
            'hub.mode': 'subscribe',
            'hub.verify_token': config.verifyToken,
            'http_status': res.status,
            'response_body': challengeReturn,
            'expected_challenge': testChallenge
          }
        );
      }
    } catch (err: any) {
      addWebhookLog(
        'inbound_meta',
        'verification',
        `❌ Webhook Handshake Exception: ${err.message}`,
        { error: err.message }
      );
    }
  };

  // Handle CRM Test Message Dispatch
  const handleSendTestCrmMessage = (phone: string, name: string, message: string) => {
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const metaWamid = `wamid.HBgL${Date.now()}CRM${Math.floor(Math.random() * 1000)}`;

    const crmMsg: Message = {
      id: `m-crm-${Date.now()}`,
      contactId: activeContactId,
      sender: 'crm_bot',
      content: message,
      timestamp: formattedTime,
      sentAt: formattedTime,
      status: 'read',
      metaMessageId: metaWamid
    };

    setMessages((prev) => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), crmMsg]
    }));

    addWebhookLog(
      'inbound_meta',
      'crm_dispatch',
      `Triggered CRM Message Dispatch to ${name} (${phone})`,
      {
        recipientPhone: phone,
        recipientName: name,
        message,
        crmReferenceId: `CRM-REF-${Date.now()}`,
        dispatchedAt: new Date().toISOString()
      }
    );
  };

  // Handle Wallet Recharge Success
  const handleRechargeSuccess = (amount: number, txId: string) => {
    setWalletBalance((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'credit',
        amount,
        description: 'Meta Wallet Balance Top-Up (UPI / Meta Billing)',
        metaTxId: txId,
        status: 'completed'
      },
      ...prev
    ]);
  };

  // REMINDERS MANAGEMENT & AUTOMATION ENGINE
  const handleCreateReminder = (newRemData: Omit<CustomReminder, 'id' | 'createdAt' | 'status'>) => {
    const remId = `rem-${Date.now()}`;
    const formattedCreatedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

    let targetContactId = newRemData.contactId;

    // If contact does not exist, create contact so it appears in sidebar
    if (!targetContactId) {
      const newContactId = `c-rem-${Date.now()}`;
      const newContactObj: Contact = {
        id: newContactId,
        name: newRemData.contactName,
        phone: newRemData.contactPhone,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        type: 'reminder',
        role: `Reminder: ${newRemData.title}`,
        lastMessage: newRemData.message,
        lastMessageTime: 'Scheduled',
        unreadCount: 0,
        online: false
      };
      setContacts((prev) => [newContactObj, ...prev]);
      targetContactId = newContactId;
    }

    const newReminder: CustomReminder = {
      ...newRemData,
      id: remId,
      contactId: targetContactId,
      status: 'pending',
      createdAt: formattedCreatedAt
    };

    setReminders((prev) => [newReminder, ...prev]);

    // Log creation event in Webhook Inspector
    addWebhookLog(
      'outbound_crm',
      'crm_dispatch',
      `Registered Custom Reminder: "${newRemData.title}" (${newRemData.mode.toUpperCase()})`,
      {
        reminder_id: remId,
        title: newRemData.title,
        recipient: newRemData.contactName,
        phone: newRemData.contactPhone,
        mode: newRemData.mode,
        scheduled_date: newRemData.scheduledDate,
        scheduled_time: newRemData.scheduledTime,
        frequency: newRemData.frequency
      }
    );
  };

  const handleDispatchReminder = (reminderId: string) => {
    const targetRem = reminders.find((r) => r.id === reminderId);
    if (!targetRem) return;

    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const metaWamid = `wamid.HBgLREM${Date.now()}`;

    // 1. Update reminder status
    setReminders((prev) =>
      prev.map((r) =>
        r.id === reminderId
          ? { ...r, status: 'dispatched', lastDispatchedAt: formattedTime }
          : r
      )
    );

    // 2. Append message to contact conversation
    const cId = targetRem.contactId || 'c1';
    const newMsg: Message = {
      id: `m-rem-${Date.now()}`,
      contactId: cId,
      sender: 'crm_bot',
      senderName: 'Vision Tech Reminder Engine',
      content: `🔔 [REMINDER DISPATCH]: ${targetRem.message}`,
      timestamp: formattedTime,
      sentAt: formattedTime,
      deliveredAt: formattedTime,
      viewedAt: formattedTime,
      status: 'read',
      metaMessageId: metaWamid,
      isCrmTriggered: true
    };

    setMessages((prev) => ({
      ...prev,
      [cId]: [...(prev[cId] || []), newMsg]
    }));

    // 3. Update contact last message in sidebar
    setContacts((prev) =>
      prev.map((c) =>
        c.id === cId
          ? {
            ...c,
            lastMessage: `🔔 Reminder: ${targetRem.title}`,
            lastMessageTime: formattedTime
          }
          : c
      )
    );

    // 4. Deduct utility charge from Meta Wallet (₹0.85)
    setWalletBalance((prev) => Math.max(0, prev - 0.85));
    setTransactions((prev) => [
      {
        id: `tx-rem-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'debit',
        amount: 0.85,
        description: `Reminder Dispatch: ${targetRem.title} to ${targetRem.contactName}`,
        metaTxId: metaWamid,
        status: 'completed'
      },
      ...prev
    ]);

    // 5. Add Webhook Log
    addWebhookLog(
      'outbound_meta',
      'messages',
      `Dispatched Custom Reminder "${targetRem.title}" to ${targetRem.contactPhone}`,
      {
        messaging_product: 'whatsapp',
        to: targetRem.contactPhone,
        type: 'template',
        template: {
          name: 'reminder_notification',
          language: { code: 'en_US' },
          components: [
            {
              type: 'body',
              parameters: [{ type: 'text', text: targetRem.message }]
            }
          ]
        },
        meta_message_id: metaWamid
      }
    );
  };

  const handleTogglePauseReminder = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === reminderId
          ? { ...r, status: r.status === 'paused' ? 'pending' : 'paused' }
          : r
      )
    );
  };

  const handleDeleteReminder = (reminderId: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== reminderId));
  };

  // VIRTUAL NUMBER MANAGEMENT HANDLERS (With Live Backend Persistence)
  const handleAcquireVirtualNumber = (
    country: string,
    countryCode: string,
    flag: string,
    providerId: VirtualProviderId,
    service: string
  ): boolean => {
    const provider = virtualProviders.find((p) => p.id === providerId) || virtualProviders[0];
    const cost = provider.costPerNumber;

    if (walletBalance < cost) {
      return false;
    }

    // Deduct from Meta Wallet
    setWalletBalance((prev) => Math.max(0, prev - cost));
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'debit',
        amount: cost,
        description: `Virtual Number Rental (${country}) - ${provider.name}`,
        metaTxId: `VN-REF-${Date.now()}`,
        status: 'completed'
      },
      ...prev
    ]);

    // Dispatch to Backend Store
    fetch('/api/virtual-numbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'rent',
        country,
        countryCode,
        flag,
        provider: provider.id,
        providerName: provider.name,
        service,
        cost
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.virtualNumber) {
          setVirtualNumbers((prev) => [data.virtualNumber, ...prev.filter((n) => n.id !== data.virtualNumber.id)]);
        }
      })
      .catch((err) => console.warn('[Virtual Number Backend Sync Notice]:', err));

    return true;
  };

  const handleSimulateVirtualOtp = (numberId: string) => {
    fetch('/api/virtual-numbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'simulate_otp', numberId })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.virtualNumber) {
          setVirtualNumbers((prev) =>
            prev.map((n) => (n.id === numberId ? data.virtualNumber : n))
          );
        }
      })
      .catch((err) => console.warn('[Virtual OTP Sync Notice]:', err));
  };

  const handleFailoverVirtualProvider = (numberId: string) => {
    const targetNum = virtualNumbers.find((n) => n.id === numberId);
    if (!targetNum) return;

    const backupProvider = virtualProviders.find((p) => p.id !== targetNum.provider) || virtualProviders[1];
    const refundAmount = targetNum.cost;

    // Refund old number
    setWalletBalance((prev) => prev + refundAmount);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'credit',
        amount: refundAmount,
        description: `Refund: Provider Failover for ${targetNum.phoneNumber} (${targetNum.providerName})`,
        metaTxId: `REFUND-${Date.now()}`,
        status: 'completed'
      },
      ...prev
    ]);

    fetch('/api/virtual-numbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'failover', numberId })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.newVirtualNumber) {
          setVirtualNumbers((prev) => [
            data.newVirtualNumber,
            ...prev.map((n) =>
              n.id === numberId ? { ...n, status: 'failed', failoverReason: `Switched to ${backupProvider.name}` } : n
            )
          ]);
        }
      })
      .catch((err) => console.warn('[Failover Sync Notice]:', err));
  };

  const handleCancelVirtualNumber = (numberId: string) => {
    const targetNum = virtualNumbers.find((n) => n.id === numberId);
    if (!targetNum) return;

    // Refund if not yet verified
    if (targetNum.status === 'pending_otp' || targetNum.status === 'failed') {
      setWalletBalance((prev) => prev + targetNum.cost);
      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          type: 'credit',
          amount: targetNum.cost,
          description: `Refund: Released Virtual Number ${targetNum.phoneNumber}`,
          metaTxId: `REL-${Date.now()}`,
          status: 'completed'
        },
        ...prev
      ]);
    }

    setVirtualNumbers((prev) => prev.filter((n) => n.id !== numberId));

    fetch('/api/virtual-numbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel', numberId })
    }).catch((err) => console.warn('[Cancel Number Sync Notice]:', err));
  };

  const handleApplyNumberToWebhookConfig = (phoneNumber: string) => {
    const cleanId = phoneNumber.replace(/[^0-9]/g, '');
    setConfig((prev) => ({
      ...prev,
      phoneNumberId: cleanId || prev.phoneNumberId,
      metaVerification: {
        wabaId: prev.metaVerification?.wabaId || '1409825194523052',
        displayName: `Vision Tech (${phoneNumber})`,
        displayNameStatus: prev.metaVerification?.displayNameStatus || 'APPROVED',
        verificationStatus: 'CONNECTED',
        qualityRating: prev.metaVerification?.qualityRating || 'GREEN',
        messagingLimit: prev.metaVerification?.messagingLimit || '1,000 msgs/day',
        twoFactorPinSet: true,
        isLiveVerified: true
      }
    }));

    setVirtualNumbers((prev) =>
      prev.map((n) =>
        n.phoneNumber === phoneNumber ? { ...n, assignedToMeta: true, status: 'active' } : n
      )
    );

    setActiveTab('settings');

    fetch('/api/virtual-numbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'apply_to_meta', phoneNumber })
    }).catch((err) => console.warn('[Apply Number Sync Notice]:', err));
  };

  const handleRequestMetaOtp = (phoneNumberId: string) => {
    fetch('/api/virtual-numbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'request_meta_code', phoneNumberId })
    })
      .then((res) => res.json())
      .catch((err) => console.warn('[Meta Request Code Sync Notice]:', err));
  };

  const handleVerifyMetaOtp = (phoneNumberId: string, otpCode: string) => {
    fetch('/api/virtual-numbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify_meta_code', phoneNumberId, otpCode })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.config) {
          setConfig((prev) => ({ ...prev, ...data.config }));
        }
      })
      .catch((err) => console.warn('[Meta Verify Code Sync Notice]:', err));
  };

  const handleSaveConfig = (newCfg: WebhookConfig) => {
    setConfig(newCfg);
    fetch(getApiUrl('/api/config'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCfg)
    }).catch((err) => console.warn('[Config Save Sync Notice]:', err));
  };

  const handleClearLogs = () => {
    setLogs([]);
    fetch(getApiUrl('/api/logs'), { method: 'DELETE' }).catch((err) => console.warn('[Clear Logs Sync Notice]:', err));
  };

  const handleAddContact = (name: string, phone: string, type: ContactType, role?: string) => {
    const cleanPhone = phone.trim();
    const cleanDigits = cleanPhone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;
    const contactName = name.trim() || `Contact (${formattedPhone})`;

    // Check if contact with same phone or ID exists in current state
    const existing = contacts.find((c) => c.phone && c.phone.replace(/[^0-9]/g, '') === cleanDigits);

    if (existing) {
      const updatedContact = {
        ...existing,
        name: name.trim() || existing.name,
        type: type || existing.type,
        role: role || existing.role
      };
      setContacts((prev) => prev.map((c) => (c.id === existing.id ? updatedContact : c)));
      setActiveContactId(existing.id);

      fetch(getApiUrl('/api/contacts'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existing.id,
          name: updatedContact.name,
          phone: updatedContact.phone,
          type: updatedContact.type,
          role: updatedContact.role
        })
      }).catch((err) => console.warn('[Update Contact Backend Sync Notice]:', err));

      return;
    }

    const newId = `c-${cleanDigits || Date.now()}`;
    const newContact: Contact = {
      id: newId,
      name: contactName,
      phone: formattedPhone,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      type: type || 'client',
      role: role || 'WhatsApp Contact',
      lastMessage: 'Tap to send a WhatsApp message...',
      lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unreadCount: 0,
      online: true
    };

    setContacts((prev) => [newContact, ...(prev || [])]);
    setMessages((prev) => ({
      ...prev,
      [newId]: prev[newId] || []
    }));
    setActiveContactId(newId);

    // Persist to server store so polling sync won't wipe it out
    fetch(getApiUrl('/api/contacts'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newId,
        name: newContact.name,
        phone: newContact.phone,
        type: newContact.type,
        role: newContact.role
      })
    }).catch((err) => console.warn('[Add Contact Backend Sync Notice]:', err));

    addWebhookLog(
      'outbound_meta',
      'verification',
      `Added Custom Target Phone Number (${formattedPhone}) for WhatsApp Message Testing`,
      {
        action: 'add_custom_phone_number',
        phone: formattedPhone,
        name: contactName,
        type,
        addedAt: new Date().toISOString()
      }
    );
  };

  // Reset Chat History Handler
  const handleResetChats = async () => {
    try {
      await fetch('/api/chats', { method: 'DELETE' });
      localStorage.removeItem('visiontech_messages');
      setMessages({});
      setContacts((prev) =>
        prev.map((c) => ({
          ...c,
          lastMessage: 'Tap to send a WhatsApp message...',
          lastMessageTime: 'Just now',
          unreadCount: 0
        }))
      );
      addWebhookLog(
        'outbound_meta',
        'verification',
        'Reset Chat Data Store & Purged Local Cache',
        { action: 'reset_chats', timestamp: new Date().toISOString() }
      );
      alert('Chat history has been reset successfully! You can now start fresh real-time messaging.');
    } catch (err) {
      console.error('Failed to reset chats:', err);
    }
  };

  // Automated Reminder Background Clock Check
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentDateStr = now.toISOString().split('T')[0];
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      reminders.forEach((r) => {
        if (
          r.mode === 'automated' &&
          r.status === 'pending' &&
          r.scheduledDate === currentDateStr &&
          r.scheduledTime === currentTimeStr
        ) {
          handleDispatchReminder(r.id);
        }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0b141a]">

      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        walletBalance={walletBalance}
        appMode={config.appMode}
        onOpenRecharge={() => setIsRechargeOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'chat' && (
          <div className="flex h-full w-full">
            <ChatSidebar
              contacts={contacts}
              activeContactId={activeContactId}
              onSelectContact={(id) => setActiveContactId(id)}
              onOpenReminderManager={() => setActiveTab('reminders')}
              onAddContact={handleAddContact}
              onResetChats={handleResetChats}
            />
            <ChatWindow
              contact={activeContact}
              messages={activeMessages}
              onSendMessage={handleSendMessage}
              onSimulateReadStatus={(id) => handleSimulateReadStatus(id)}
              onSimulateIncomingMessage={handleSimulateIncomingMessage}
              autoReplyEnabled={autoReplyEnabled}
              onToggleAutoReply={() => setAutoReplyEnabled(!autoReplyEnabled)}
            />
          </div>
        )}

        {activeTab === 'virtual' && (
          <div className="h-full overflow-y-auto p-4 sm:p-6">
            <VirtualNumberManager
              virtualNumbers={virtualNumbers}
              providers={virtualProviders}
              walletBalance={walletBalance}
              onAcquireNumber={handleAcquireVirtualNumber}
              onSimulateOtp={handleSimulateVirtualOtp}
              onFailoverProvider={handleFailoverVirtualProvider}
              onCancelNumber={handleCancelVirtualNumber}
              onApplyToWebhook={handleApplyNumberToWebhookConfig}
            />
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="h-full overflow-y-auto p-4 sm:p-6">
            <ReminderManager
              reminders={reminders}
              contacts={contacts}
              onCreateReminder={handleCreateReminder}
              onDispatchReminder={handleDispatchReminder}
              onTogglePauseReminder={handleTogglePauseReminder}
              onDeleteReminder={handleDeleteReminder}
            />
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="h-full overflow-y-auto p-4 sm:p-6">
            <MetaWalletCard
              balance={walletBalance}
              transactions={transactions}
              onOpenRecharge={() => setIsRechargeOpen(true)}
            />
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="h-full overflow-y-auto p-4 sm:p-6">
            <WebhookLogsInspector
              logs={logs}
              onClearLogs={handleClearLogs}
              onSimulateIncomingMessage={handleSimulateIncomingMessage}
              onSimulateDeliveryStatus={handleSimulateDeliveryStatus}
              onSimulateReadStatus={() => handleSimulateReadStatus()}
              onTestGetHandshake={handleTestGetHandshake}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="h-full overflow-y-auto p-4 sm:p-6">
            <WebhookSettings
              config={config}
              virtualNumbers={virtualNumbers}
              onSaveConfig={handleSaveConfig}
              onTestVerification={handleTestGetHandshake}
              onRequestMetaOtp={handleRequestMetaOtp}
              onVerifyMetaOtp={handleVerifyMetaOtp}
            />
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="h-full overflow-y-auto p-4 sm:p-6">
            <CrmApiDocs
              onSendTestCrmMessage={handleSendTestCrmMessage}
            />
          </div>
        )}
      </main>

      {/* Recharge Top Up Modal */}
      <RechargeModal
        isOpen={isRechargeOpen}
        onClose={() => setIsRechargeOpen(false)}
        onRechargeSuccess={handleRechargeSuccess}
      />

    </div>
  );
}
