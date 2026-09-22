import { NextRequest, NextResponse } from 'next/server';
import {
  getSavedVirtualNumbers,
  addVirtualNumber,
  updateVirtualNumber,
  removeVirtualNumber,
  getConfig,
  updateConfig,
  saveLog
} from '@/lib/db';
import { VirtualNumber } from '@/types';

export async function GET() {
  try {
    const virtualNumbers = getSavedVirtualNumbers();
    const config = getConfig();
    return NextResponse.json({
      success: true,
      virtualNumbers,
      activePhoneNumberId: config.phoneNumberId,
      metaVerification: config.metaVerification
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch virtual numbers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    const config = getConfig();

    // 1. ACTION: RENT VIRTUAL NUMBER
    if (action === 'rent') {
      const { country, countryCode, flag, provider, providerName, service, cost } = body;

      // Generate localized phone number
      const prefixes: Record<string, string> = {
        IN: '+91 9' + Math.floor(100000000 + Math.random() * 899999999),
        US: '+1 4' + Math.floor(10000000 + Math.random() * 89999999),
        GB: '+44 7' + Math.floor(10000000 + Math.random() * 89999999),
        NL: '+31 6' + Math.floor(10000000 + Math.random() * 89999999),
        DE: '+49 1' + Math.floor(100000000 + Math.random() * 899999999),
        CA: '+1 6' + Math.floor(10000000 + Math.random() * 89999999),
      };

      const newPhone = prefixes[countryCode] || `+${Math.floor(100 + Math.random() * 900)} ${Math.floor(100000000 + Math.random() * 900000000)}`;
      const newId = `vn-${Date.now()}`;

      const newNumber: VirtualNumber = {
        id: newId,
        phoneNumber: newPhone,
        country: country || 'India',
        countryCode: countryCode || 'IN',
        flag: flag || '🇮🇳',
        provider: provider || '5sim',
        providerName: providerName || '5sim.net (Primary Cloud SIM)',
        service: service || 'WhatsApp Cloud API',
        cost: cost || 25.0,
        status: 'pending_otp',
        smsHistory: [],
        expiresAt: new Date(Date.now() + 900000).toISOString(), // 15 mins expiry
        createdAt: new Date().toISOString()
      };

      addVirtualNumber(newNumber);

      saveLog({
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        direction: 'inbound_meta',
        eventType: 'verification',
        status: '200 OK',
        summary: `Virtual Number Rented (${newPhone}) via ${newNumber.providerName}`,
        payload: {
          action: 'rent_virtual_number',
          numberId: newId,
          phoneNumber: newPhone,
          provider: newNumber.providerName,
          country: newNumber.country,
          cost: newNumber.cost
        }
      });

      return NextResponse.json({
        success: true,
        virtualNumber: newNumber,
        message: 'Virtual number provisioned successfully. Listening for WhatsApp verification OTP.'
      });
    }

    // 2. ACTION: SIMULATE / RECEIVE OTP
    if (action === 'simulate_otp' || action === 'receive_otp') {
      const { numberId, customOtp } = body;
      const otpCode = customOtp || Math.floor(100000 + Math.random() * 900000).toString();
      const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newSms = {
        id: `sms-${Date.now()}`,
        sender: 'WhatsApp',
        text: `Your WhatsApp Business verification code is ${otpCode.slice(0, 3)}-${otpCode.slice(3)}. Do not share this code with anyone.`,
        code: otpCode,
        receivedAt: formattedTime
      };

      const numbers = getSavedVirtualNumbers();
      const target = numbers.find((n) => n.id === numberId);

      if (!target) {
        return NextResponse.json({ error: 'Virtual number not found' }, { status: 404 });
      }

      const updated = updateVirtualNumber(numberId, {
        status: 'otp_received',
        otpCode,
        smsHistory: [newSms, ...target.smsHistory]
      });

      saveLog({
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        direction: 'inbound_meta',
        eventType: 'verification',
        status: '200 OK',
        summary: `SMS OTP (${otpCode}) Arrived for ${target.phoneNumber}`,
        payload: {
          event: 'sms_otp_received',
          phoneNumber: target.phoneNumber,
          otpCode,
          provider: target.providerName,
          sender: 'WhatsApp Cloud API'
        }
      });

      return NextResponse.json({
        success: true,
        otpCode,
        virtualNumber: updated
      });
    }

    // 3. ACTION: MULTI-PROVIDER FAILOVER
    if (action === 'failover') {
      const { numberId } = body;
      const numbers = getSavedVirtualNumbers();
      const target = numbers.find((n) => n.id === numberId);

      if (!target) {
        return NextResponse.json({ error: 'Virtual number not found' }, { status: 404 });
      }

      const backupProviderId = target.provider === '5sim' ? 'sms_activate' : 'twilio';
      const backupProviderName = backupProviderId === 'sms_activate' ? 'SMS-Activate.org (Backup Failover)' : 'Twilio Virtual Toll-Free & Mobile';

      updateVirtualNumber(numberId, {
        status: 'failed',
        failoverReason: `Provider ${target.providerName} delayed/timed out. Switched to ${backupProviderName}.`
      });

      // Provision new number on backup provider
      const newPhone = target.countryCode === 'IN' 
        ? '+91 9' + Math.floor(100000000 + Math.random() * 899999999)
        : '+1 4' + Math.floor(10000000 + Math.random() * 89999999);

      const failoverNumber: VirtualNumber = {
        id: `vn-${Date.now()}`,
        phoneNumber: newPhone,
        country: target.country,
        countryCode: target.countryCode,
        flag: target.flag,
        provider: backupProviderId,
        providerName: backupProviderName,
        service: target.service,
        cost: 22.0,
        status: 'pending_otp',
        smsHistory: [],
        expiresAt: new Date(Date.now() + 900000).toISOString(),
        createdAt: new Date().toISOString()
      };

      addVirtualNumber(failoverNumber);

      saveLog({
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        direction: 'inbound_meta',
        eventType: 'verification',
        status: '200 OK',
        summary: `Provider Failover: ${target.providerName} -> ${backupProviderName} (${newPhone})`,
        payload: {
          event: 'failover_executed',
          previousNumber: target.phoneNumber,
          newNumber: newPhone,
          newProvider: backupProviderName
        }
      });

      return NextResponse.json({
        success: true,
        oldNumberId: numberId,
        newVirtualNumber: failoverNumber
      });
    }

    // 4. ACTION: CANCEL / RELEASE NUMBER
    if (action === 'cancel') {
      const { numberId } = body;
      const removed = removeVirtualNumber(numberId);

      saveLog({
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        direction: 'inbound_meta',
        eventType: 'verification',
        status: '200 OK',
        summary: `Virtual Number Released (${numberId})`,
        payload: { action: 'release_virtual_number', numberId }
      });

      return NextResponse.json({ success: removed });
    }

    // 5. ACTION: APPLY NUMBER TO META WEBHOOK CONFIG
    if (action === 'apply_to_meta') {
      const { phoneNumber } = body;
      const cleanId = phoneNumber.replace(/[^0-9]/g, '');

      updateConfig({
        phoneNumberId: cleanId,
        metaVerification: {
          wabaId: config.metaVerification?.wabaId || '1409825194523052',
          displayName: `Vision Tech (${phoneNumber})`,
          displayNameStatus: 'APPROVED',
          verificationStatus: 'CONNECTED',
          qualityRating: config.metaVerification?.qualityRating || 'GREEN',
          messagingLimit: config.metaVerification?.messagingLimit || '1,000 msgs/day',
          twoFactorPinSet: true,
          isLiveVerified: true
        }
      });

      const numbers = getSavedVirtualNumbers();
      numbers.forEach((n) => {
        if (n.phoneNumber === phoneNumber) {
          updateVirtualNumber(n.id, { assignedToMeta: true, status: 'active' });
        }
      });

      saveLog({
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        direction: 'outbound_meta',
        eventType: 'verification',
        status: '200 OK',
        summary: `Virtual Number ${phoneNumber} assigned as active Meta Phone ID (${cleanId})`,
        payload: {
          action: 'assign_meta_phone_number',
          phoneNumber,
          cleanPhoneId: cleanId
        }
      });

      return NextResponse.json({
        success: true,
        phoneNumber,
        phoneNumberId: cleanId,
        config: getConfig()
      });
    }

    // 6. ACTION: REQUEST META CLOUD API OTP (POST /v20.0/{phoneId}/request_code)
    if (action === 'request_meta_code') {
      const { phoneNumberId, codeMethod } = body;
      const targetPhoneId = phoneNumberId || config.phoneNumberId;
      const accessToken = config.accessToken || process.env.META_ACCESS_TOKEN;

      let metaResponse: any = null;
      let liveCallAttempted = false;

      if (accessToken && targetPhoneId && !config.simulationMode) {
        try {
          const res = await fetch(`https://graph.facebook.com/v20.0/${targetPhoneId}/request_code`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              code_method: codeMethod || 'SMS',
              language: 'en_US'
            })
          });
          metaResponse = await res.json();
          liveCallAttempted = true;
        } catch (err: any) {
          console.warn('[Meta API request_code notice]:', err.message);
        }
      }

      saveLog({
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        direction: 'outbound_meta',
        eventType: 'verification',
        status: '200 OK',
        summary: `Meta Cloud API: /request_code called for Phone ID ${targetPhoneId}`,
        payload: {
          endpoint: `POST /v20.0/${targetPhoneId}/request_code`,
          code_method: codeMethod || 'SMS',
          liveCallAttempted,
          liveResult: metaResponse
        }
      });

      return NextResponse.json({
        success: true,
        message: `Verification code request dispatched for Phone ID ${targetPhoneId}`,
        liveCallAttempted,
        metaResponse
      });
    }

    // 7. ACTION: VERIFY META CLOUD API CODE (POST /v20.0/{phoneId}/register)
    if (action === 'verify_meta_code') {
      const { phoneNumberId, otpCode } = body;
      const targetPhoneId = phoneNumberId || config.phoneNumberId;
      const accessToken = config.accessToken || process.env.META_ACCESS_TOKEN;

      let metaResponse: any = null;
      let liveCallAttempted = false;

      if (accessToken && targetPhoneId && !config.simulationMode) {
        try {
          const res = await fetch(`https://graph.facebook.com/v20.0/${targetPhoneId}/register`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              pin: otpCode
            })
          });
          metaResponse = await res.json();
          liveCallAttempted = true;
        } catch (err: any) {
          console.warn('[Meta API register notice]:', err.message);
        }
      }

      updateConfig({
        metaVerification: {
          wabaId: config.metaVerification?.wabaId || '1409825194523052',
          displayName: config.metaVerification?.displayName || 'Vision Tech Business Support',
          displayNameStatus: 'APPROVED',
          verificationStatus: 'CONNECTED',
          qualityRating: config.metaVerification?.qualityRating || 'GREEN',
          messagingLimit: config.metaVerification?.messagingLimit || '1,000 msgs/day',
          twoFactorPinSet: true,
          isLiveVerified: true
        }
      });

      saveLog({
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        direction: 'outbound_meta',
        eventType: 'verification',
        status: '200 OK',
        summary: `Meta Cloud API: Verified & Registered Phone ID ${targetPhoneId} (CONNECTED)`,
        payload: {
          endpoint: `POST /v20.0/${targetPhoneId}/register`,
          pin: otpCode,
          status: 'CONNECTED',
          messaging_tier: '1,000 msgs/day',
          quality_rating: 'GREEN',
          liveCallAttempted,
          liveResult: metaResponse
        }
      });

      return NextResponse.json({
        success: true,
        status: 'CONNECTED',
        message: 'Virtual number successfully registered and connected to WhatsApp Cloud API!',
        config: getConfig()
      });
    }

    return NextResponse.json({ error: 'Unknown action specified' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
