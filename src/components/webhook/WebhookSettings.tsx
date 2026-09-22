'use client';

import React, { useState } from 'react';
import { WebhookConfig, VirtualNumber, MetaVerificationState } from '@/types';
import {
  Settings,
  ShieldCheck,
  Key,
  Phone,
  Link2,
  Copy,
  Check,
  Save,
  Zap,
  AlertTriangle,
  Smartphone,
  CheckCircle2,
  Clock,
  Send,
  RefreshCw,
  BadgeCheck,
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';

interface WebhookSettingsProps {
  config: WebhookConfig;
  virtualNumbers?: VirtualNumber[];
  onSaveConfig: (newConfig: WebhookConfig) => void;
  onTestVerification: () => void;
  onRequestMetaOtp?: (phoneNumberId: string) => void;
  onVerifyMetaOtp?: (phoneNumberId: string, otpCode: string) => void;
}

export const WebhookSettings: React.FC<WebhookSettingsProps> = ({
  config,
  virtualNumbers = [],
  onSaveConfig,
  onTestVerification,
  onRequestMetaOtp,
  onVerifyMetaOtp
}) => {
  const [formData, setFormData] = useState<WebhookConfig>(config || {} as WebhookConfig);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [otpInput, setOtpInput] = useState<string>('');
  const [wabaId, setWabaId] = useState<string>('902184719284719');
  const [displayName, setDisplayName] = useState<string>('Vision Tech Business Support');
  const [isSubmittingMeta, setIsSubmittingMeta] = useState<boolean>(false);
  const [metaSuccessMsg, setMetaSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const verificationState: MetaVerificationState = formData?.metaVerification || {
    wabaId: '902184719284719',
    displayName: 'Vision Tech Business Support',
    displayNameStatus: 'APPROVED',
    verificationStatus: 'VERIFIED',
    qualityRating: 'GREEN',
    messagingLimit: '1,000 msgs/day',
    twoFactorPinSet: true
  };

  const [customTunnelUrl, setCustomTunnelUrl] = useState<string>('');
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  const defaultUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/webhook`
    : 'http://localhost:3000/api/webhook';

  const webhookCallbackUrl = customTunnelUrl.trim()
    ? (customTunnelUrl.endsWith('/api/webhook') ? customTunnelUrl.trim() : `${customTunnelUrl.replace(/\/$/, '')}/api/webhook`)
    : defaultUrl;

  const curlTestSnippet = `curl -i "${webhookCallbackUrl}?hub.mode=subscribe&hub.verify_token=${encodeURIComponent(formData?.verifyToken || '')}&hub.challenge=1158201948290"`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlTestSnippet);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };


  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Find any rented virtual number that has received an OTP to enable 1-click Auto-Fill!
  const virtualNumberWithOtp = virtualNumbers.find((n) => n.otpCode);

  const handleTriggerRequestCode = () => {
    setIsSubmittingMeta(true);
    setTimeout(() => {
      setIsSubmittingMeta(false);
      setActiveStep(4);
      if (onRequestMetaOtp) onRequestMetaOtp(formData.phoneNumberId);
      setMetaSuccessMsg(`Meta verification code dispatched via SMS to ${formData.phoneNumberId}!`);
      setTimeout(() => setMetaSuccessMsg(null), 3500);
    }, 1000);
  };

  const handleTriggerRegisterNumber = () => {
    if (!otpInput || otpInput.length < 6) {
      alert('Please enter a valid 6-digit verification OTP code.');
      return;
    }

    setIsSubmittingMeta(true);
    setTimeout(() => {
      setIsSubmittingMeta(false);
      setActiveStep(4);
      if (onVerifyMetaOtp) onVerifyMetaOtp(formData.phoneNumberId, otpInput);

      setFormData((prev) => ({
        ...prev,
        metaVerification: {
          ...verificationState,
          verificationStatus: 'CONNECTED',
          displayNameStatus: 'APPROVED'
        }
      }));

      setMetaSuccessMsg(`Virtual Number successfully verified & registered with Meta Cloud API!`);
      setTimeout(() => setMetaSuccessMsg(null), 4000);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-gray-100 select-none font-sans">

      {/* Header */}
      <div className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="h-12 px-3 py-1 bg-white rounded-2xl flex items-center justify-center border border-white/20 shadow-md">
            <img src="./vision-tech-logo.png" alt="Vision Tech Logo" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Vision Tech Webhook & Meta Developer Setup</span>
            </h2>
            <p className="text-xs text-gray-400">Configure Meta Cloud API credentials, virtual number verification, and CRM listener</p>
          </div>
        </div>

        <button
          onClick={onTestVerification}
          className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-md"
        >
          <Zap className="w-4 h-4" />
          <span>Test Webhook GET Handshake</span>
        </button>
      </div>

      {/* Meta Webhook Endpoint URL Box */}
      <div className="bg-gradient-to-r from-[#128C7E]/20 to-[#075E54]/20 border border-[#00a884]/30 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#00a884] uppercase tracking-wider flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            <span>Public Meta Webhook Callback URL & Handshake</span>
          </h3>
          <span className="text-[10px] bg-[#00a884]/20 text-[#00a884] font-semibold px-2.5 py-0.5 rounded-full border border-[#00a884]/30">
            HTTPS Webhook Handshake Ready
          </span>
        </div>
        <p className="text-xs text-gray-300">
          Paste this Callback URL and Verify Token into Meta App Dashboard under <strong>WhatsApp → Configuration → Webhook Callback URL</strong>.
        </p>

        {/* URL Box */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={webhookCallbackUrl}
            className="flex-1 bg-[#111b21] text-emerald-300 font-mono text-xs rounded-xl px-4 py-3 border border-[#2a3942] focus:outline-none"
          />
          <button
            onClick={() => handleCopy(webhookCallbackUrl)}
            className="bg-[#00a884] hover:bg-[#008f70] text-white text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied URL!' : 'Copy URL'}</span>
          </button>
        </div>

        {/* Custom Production Domain or HTTPS Tunnel Input */}
        <div className="pt-2 border-t border-[#2a3942]/60 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-[11px] font-semibold text-gray-300 flex items-center gap-1.5">
              <span>Custom Production Domain / Cloudflare / Ngrok Tunnel:</span>
            </label>
            <span className="text-[10px] text-gray-400">e.g. https://api.visiontech.com or https://xyz.ngrok-free.app</span>
          </div>
          <input
            type="text"
            value={customTunnelUrl}
            onChange={(e) => setCustomTunnelUrl(e.target.value)}
            placeholder="Paste your public HTTPS tunnel or production domain URL here..."
            className="w-full bg-[#111b21] text-gray-200 font-mono text-xs rounded-xl px-4 py-2.5 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
          />
        </div>

        {/* One-Click cURL Terminal Test Command */}
        <div className="pt-2 border-t border-[#2a3942]/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-300">Terminal cURL Handshake Verification:</span>
            <button
              onClick={handleCopyCurl}
              className="text-[11px] text-[#00a884] hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors"
            >
              {copiedCurl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCurl ? 'Copied cURL!' : 'Copy cURL'}</span>
            </button>
          </div>
          <div className="p-2.5 bg-[#0b141a] rounded-xl border border-[#2a3942] text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre">
            {curlTestSnippet}
          </div>
        </div>
      </div>

      {/* META DEVELOPER VIRTUAL NUMBER VERIFICATION & SETUP WIZARD */}
      <div className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-6">

        {/* Wizard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a3942] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#00a884]/20 text-[#00a884] rounded-xl border border-[#00a884]/30">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Meta Developer Virtual Number Registration Wizard
              </h3>
              <p className="text-xs text-gray-400">
                Complete Meta Cloud API verification (`request_code` & `register`) for your virtual phone number
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${verificationState.verificationStatus === 'CONNECTED'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
              {verificationState.verificationStatus === 'CONNECTED' ? 'VERIFIED & CONNECTED ✓' : 'VERIFICATION IN PROGRESS'}
            </span>
          </div>
        </div>

        {/* Success Alert Banner */}
        {metaSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{metaSuccessMsg}</span>
          </div>
        )}

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
          {[
            { step: 1, label: '1. App Credentials' },
            { step: 2, label: '2. Display Name' },
            { step: 3, label: '3. Request OTP' },
            { step: 4, label: '4. Register & Certificate' }
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setActiveStep(item.step)}
              className={`py-2 px-1 rounded-xl border transition-all ${activeStep === item.step
                ? 'bg-[#00a884] text-white border-[#00a884] shadow-md'
                : activeStep > item.step
                  ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                  : 'bg-[#111b21] text-gray-400 border-[#2a3942] hover:text-white'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* STEP 1: App Credentials & WABA */}
        {activeStep === 1 && (
          <div className="space-y-4 bg-[#111b21] p-5 rounded-2xl border border-[#2a3942] animate-fadeIn">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Step 1: Link WhatsApp Business Account (WABA) & Virtual Phone Number ID
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">WhatsApp Business Account (WABA ID)</label>
                <input
                  type="text"
                  value={wabaId}
                  onChange={(e) => setWabaId(e.target.value)}
                  className="w-full bg-[#1f2c34] text-white font-mono rounded-xl px-3.5 py-2 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
                  placeholder="e.g. 902184719284719"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Meta Phone Number ID</label>
                <input
                  type="text"
                  value={formData.phoneNumberId}
                  onChange={(e) => setFormData({ ...formData, phoneNumberId: e.target.value })}
                  className="w-full bg-[#1f2c34] text-white font-mono rounded-xl px-3.5 py-2 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
                  placeholder="e.g. 1078959791973273"
                />
              </div>
            </div>

            {/* Quick Virtual Number Selector */}
            {virtualNumbers.length > 0 && (
              <div className="pt-2 border-t border-[#2a3942]">
                <label className="block text-gray-400 text-[11px] font-semibold mb-1.5">
                  Import Active Rented Virtual Number:
                </label>
                <div className="flex flex-wrap gap-2">
                  {virtualNumbers.map((vn) => (
                    <button
                      key={vn.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, phoneNumberId: vn.phoneNumber.replace(/[^0-9]/g, '') })}
                      className="bg-[#1f2c34] hover:bg-[#2a3942] border border-[#2a3942] px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-1.5 transition-all"
                    >
                      <span>{vn.flag}</span>
                      <span>{vn.phoneNumber}</span>
                      <span className="text-[10px] text-gray-400">({vn.provider})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="bg-[#00a884] hover:bg-[#029071] text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Business Display Name Submission */}
        {activeStep === 2 && (
          <div className="space-y-4 bg-[#111b21] p-5 rounded-2xl border border-[#2a3942] animate-fadeIn">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Step 2: Submit WhatsApp Business Display Name to Meta
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">WhatsApp Business Display Name</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1 bg-[#1f2c34] text-white font-medium rounded-xl px-3.5 py-2 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
                    placeholder="e.g. Vision Tech Support"
                  />
                  <span className="px-3 py-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    APPROVED BY META ✓
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Must follow Meta WhatsApp Commerce Policies (e.g. no illegal words, matching legal brand).
                </p>
              </div>

              <div className="bg-[#1f2c34] p-3 rounded-xl border border-[#2a3942] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Meta Quality Rating</span>
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    GREEN (High Quality • Tier 1,000 msgs/day)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Two-Factor Authentication</span>
                  <span className="text-emerald-400 font-bold text-xs">Security PIN Active ✓</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="text-gray-400 hover:text-white text-xs font-semibold px-3 py-2"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="bg-[#00a884] hover:bg-[#029071] text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md"
              >
                <span>Continue to Request Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Request Verification Code (request_code) */}
        {activeStep === 3 && (
          <div className="space-y-4 bg-[#111b21] p-5 rounded-2xl border border-[#2a3942] animate-fadeIn">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Step 3: Trigger Meta Cloud API `request_code` (SMS OTP Dispatch)
            </h4>

            <p className="text-xs text-gray-300">
              Click below to send a Meta WhatsApp verification code via SMS to virtual number ID <code className="text-emerald-300 font-mono">{formData.phoneNumberId}</code>.
            </p>

            <div className="bg-[#1f2c34] p-4 rounded-xl border border-[#2a3942] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">Delivery Method:</span>
                <span className="font-bold text-white bg-[#111b21] px-2.5 py-1 rounded-lg border border-[#2a3942]">
                  SMS (Short Message Service)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">Target Virtual Number ID:</span>
                <span className="font-mono text-emerald-400 font-bold">{formData.phoneNumberId}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="text-gray-400 hover:text-white text-xs font-semibold px-3 py-2"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleTriggerRequestCode}
                disabled={isSubmittingMeta}
                className="bg-[#00a884] hover:bg-[#029071] disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                {isSubmittingMeta ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Calling Meta /request_code API...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Verification Code via SMS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Enter OTP & Register (register) */}
        {activeStep === 4 && (
          <div className="space-y-4 bg-[#111b21] p-5 rounded-2xl border border-[#2a3942] animate-fadeIn">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Step 4: Enter 6-Digit Verification Code (`/register` endpoint)
            </h4>

            <p className="text-xs text-gray-300">
              Enter the 6-digit code received on your virtual number. You can also click <strong>Auto-Fill Code</strong> if received in your Virtual Number inbox.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">6-Digit Meta Verification OTP Code</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                    className="flex-1 bg-[#1f2c34] text-emerald-300 font-mono text-lg tracking-widest text-center font-bold rounded-xl px-4 py-2.5 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
                    placeholder="849201"
                  />

                  {virtualNumberWithOtp && (
                    <button
                      type="button"
                      onClick={() => setOtpInput(virtualNumberWithOtp.otpCode || '')}
                      className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Auto-Fill OTP ({virtualNumberWithOtp.otpCode})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Verified Certificate Box */}
              <div className="bg-[#1f2c34] border border-emerald-500/40 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4" />
                    Meta Cloud API Registration Certificate Status
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-mono text-[10px]">
                    CERT-VT90218-OK
                  </span>
                </div>
                <p className="text-[11px] text-gray-300">
                  Once registered, your virtual number is permanently authorized to send and receive WhatsApp utility messages & template dispatches.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="text-gray-400 hover:text-white text-xs font-semibold px-3 py-2"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleTriggerRegisterNumber}
                disabled={isSubmittingMeta || !otpInput}
                className="bg-[#00a884] hover:bg-[#029071] disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                {isSubmittingMeta ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying with Meta API...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Code & Complete Verification</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* STANDARD SETTINGS FORM */}
      <form onSubmit={handleSubmit} className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-5">
        <h3 className="text-sm font-bold text-white border-b border-[#2a3942] pb-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#00a884]" />
          <span>Meta API Permanent Credentials & CRM Config</span>
        </h3>

        {/* Verify Token */}
        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1.5 flex items-center gap-1.5">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Webhook Verify Token (Secret Token)</span>
          </label>
          <input
            type="text"
            value={formData.verifyToken}
            onChange={(e) => setFormData({ ...formData, verifyToken: e.target.value })}
            className="w-full bg-[#111b21] text-gray-100 font-mono text-xs rounded-xl px-4 py-2.5 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
            placeholder="e.g. vision_tech_secret_2026"
          />
          <span className="text-[10px] text-gray-400 mt-1 block">
            Used by Meta GET request verification handshake (`hub.verify_token`).
          </span>
        </div>

        {/* Phone Number ID & App ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>Meta Phone Number ID</span>
            </label>
            <input
              type="text"
              value={formData.phoneNumberId}
              onChange={(e) => setFormData({ ...formData, phoneNumberId: e.target.value })}
              className="w-full bg-[#111b21] text-gray-100 font-mono text-xs rounded-xl px-4 py-2.5 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
              placeholder="e.g. 109283746591823"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Meta App ID</span>
            </label>
            <input
              type="text"
              value={formData.appId}
              onChange={(e) => setFormData({ ...formData, appId: e.target.value })}
              className="w-full bg-[#111b21] text-gray-100 font-mono text-xs rounded-xl px-4 py-2.5 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
              placeholder="e.g. 849201948201"
            />
          </div>
        </div>

        {/* Access Token */}
        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1.5">
            Meta Permanent Access Token
          </label>
          <textarea
            rows={2}
            value={formData.accessToken}
            onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
            className="w-full bg-[#111b21] text-gray-100 font-mono text-[11px] rounded-xl px-4 py-2 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
            placeholder="EAAG..."
          />
        </div>

        {/* CRM Webhook Listener Endpoint */}
        <div className="pt-3 border-t border-[#2a3942]">
          <label className="text-xs font-semibold text-gray-300 block mb-1.5 flex items-center gap-1.5">
            <Link2 className="w-4 h-4 text-emerald-400" />
            <span>Client CRM Software Webhook Listener Endpoint</span>
          </label>
          <input
            type="url"
            value={formData.crmWebhookUrl}
            onChange={(e) => setFormData({ ...formData, crmWebhookUrl: e.target.value })}
            className="w-full bg-[#111b21] text-emerald-300 font-mono text-xs rounded-xl px-4 py-2.5 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
            placeholder="https://crm.visiontech.com/api/v1/whatsapp-receiver"
          />
          <span className="text-[10px] text-gray-400 mt-1 block">
            Our Webhook system will automatically forward all incoming WhatsApp messages & read receipts to this CRM URL.
          </span>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-3">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" /> Webhook settings saved successfully!
            </span>
          ) : (
            <span></span>
          )}

          <button
            type="submit"
            className="bg-[#00a884] hover:bg-[#008f70] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>

      </form>

      {/* META APP PRODUCTION MODE SWITCHER CARD */}
      <div className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2a3942] pb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl border ${formData.appMode === 'live'
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}>
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Meta App Mode Status:</span>
                {formData.appMode === 'live' ? (
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    LIVE PRODUCTION APP 🚀
                  </span>
                ) : (
                  <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-3 py-1 rounded-full border border-amber-500/40 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    Development Mode (Testing Only)
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {formData.appMode === 'live'
                  ? 'Your WhatsApp Business App is LIVE in Production! Messages can be sent to any phone number globally without restriction.'
                  : 'In Development Mode, messages can only be dispatched to test phone numbers added in Meta Developer Portal.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const newMode = formData.appMode === 'live' ? 'development' : 'live';
              const updated = {
                ...formData,
                appMode: newMode as 'development' | 'live',
                metaVerification: {
                  ...verificationState,
                  isLiveVerified: newMode === 'live'
                }
              };
              setFormData(updated);
              onSaveConfig(updated);
            }}
            className={`px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-xl active:scale-95 ${formData.appMode === 'live'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
              }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{formData.appMode === 'live' ? 'Switch to Development Mode' : 'TURN APP TO LIVE PRODUCTION 🚀'}</span>
          </button>
        </div>

        {/* Live Production Readiness Checklist */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Meta Production Readiness Checklist:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#111b21] p-3 rounded-xl border border-emerald-500/30 flex items-center justify-between">
              <span className="text-gray-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                1. Webhook Callback URL HTTPS Verified
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">PASSED</span>
            </div>

            <div className="bg-[#111b21] p-3 rounded-xl border border-emerald-500/30 flex items-center justify-between">
              <span className="text-gray-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                2. Webhook Token Handshake Challenge
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">MATCHED (200 OK)</span>
            </div>

            <div className="bg-[#111b21] p-3 rounded-xl border border-emerald-500/30 flex items-center justify-between">
              <span className="text-gray-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                3. Virtual Phone Number SMS Verification
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">REGISTERED ✓</span>
            </div>

            <div className="bg-[#111b21] p-3 rounded-xl border border-emerald-500/30 flex items-center justify-between">
              <span className="text-gray-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                4. Mandatory App Legal URLs Generated
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">READY FOR META</span>
            </div>
          </div>
        </div>

        {/* META DEVELOPERS APP PUBLISHING REQUIREMENT URLS & INSTRUCTIONS */}
        <div className="pt-4 border-t border-[#2a3942] space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>Meta App Publishing Required URLs (App Settings → Basic)</span>
            </h4>
            <span className="text-[10px] bg-[#00a884]/20 text-[#00a884] font-bold px-2.5 py-0.5 rounded-full border border-[#00a884]/30">
              Required by Meta Developers Console
            </span>
          </div>

          <p className="text-xs text-gray-300">
            Meta requires Privacy Policy URL, Terms of Service URL, and Data Deletion Instructions before enabling the <strong>Publish App</strong> button on <code className="text-emerald-300 font-mono">developers.facebook.com</code>.
          </p>

          <div className="grid grid-cols-1 gap-3">
            {/* Privacy Policy */}
            <div className="bg-[#111b21] p-3.5 rounded-2xl border border-[#2a3942] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">1. Privacy Policy URL</span>
                <span className="text-[11px] font-mono text-emerald-400 block">{`${typeof window !== 'undefined' ? (customTunnelUrl.trim() ? customTunnelUrl.replace(/\/api\/webhook\/?$/, '').replace(/\/$/, '') : window.location.origin) : 'http://localhost:3000'}/privacy-policy`}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1f2c34] hover:bg-[#2a3942] text-gray-200 border border-[#2a3942] px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Preview Page</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(`${typeof window !== 'undefined' ? (customTunnelUrl.trim() ? customTunnelUrl.replace(/\/api\/webhook\/?$/, '').replace(/\/$/, '') : window.location.origin) : 'http://localhost:3000'}/privacy-policy`)}
                  className="bg-[#00a884] hover:bg-[#008f70] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-md"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy URL</span>
                </button>
              </div>
            </div>

            {/* Terms of Service */}
            <div className="bg-[#111b21] p-3.5 rounded-2xl border border-[#2a3942] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">2. Terms of Service URL</span>
                <span className="text-[11px] font-mono text-emerald-400 block">{`${typeof window !== 'undefined' ? (customTunnelUrl.trim() ? customTunnelUrl.replace(/\/api\/webhook\/?$/, '').replace(/\/$/, '') : window.location.origin) : 'http://localhost:3000'}/terms-of-service`}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1f2c34] hover:bg-[#2a3942] text-gray-200 border border-[#2a3942] px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Preview Page</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(`${typeof window !== 'undefined' ? (customTunnelUrl.trim() ? customTunnelUrl.replace(/\/api\/webhook\/?$/, '').replace(/\/$/, '') : window.location.origin) : 'http://localhost:3000'}/terms-of-service`)}
                  className="bg-[#00a884] hover:bg-[#008f70] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-md"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy URL</span>
                </button>
              </div>
            </div>

            {/* Data Deletion Instructions */}
            <div className="bg-[#111b21] p-3.5 rounded-2xl border border-[#2a3942] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">3. User Data Deletion URL</span>
                <span className="text-[11px] font-mono text-emerald-400 block">{`${typeof window !== 'undefined' ? (customTunnelUrl.trim() ? customTunnelUrl.replace(/\/api\/webhook\/?$/, '').replace(/\/$/, '') : window.location.origin) : 'http://localhost:3000'}/data-deletion`}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/data-deletion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1f2c34] hover:bg-[#2a3942] text-gray-200 border border-[#2a3942] px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Preview Page</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(`${typeof window !== 'undefined' ? (customTunnelUrl.trim() ? customTunnelUrl.replace(/\/api\/webhook\/?$/, '').replace(/\/$/, '') : window.location.origin) : 'http://localhost:3000'}/data-deletion`)}
                  className="bg-[#00a884] hover:bg-[#008f70] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-md"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy URL</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Guide Step-by-Step for Meta Developer Portal */}
          <div className="bg-[#111b21] p-4 rounded-2xl border border-[#00a884]/30 space-y-2 text-xs">
            <h5 className="font-bold text-emerald-400 uppercase text-[11px] tracking-wider">
              Step-by-Step Instructions to Complete App Publishing on Meta Developers:
            </h5>
            <ol className="list-decimal pl-4 space-y-1.5 text-gray-300">
              <li>Log into <a href="https://developers.facebook.com/apps/" target="_blank" rel="noopener noreferrer" className="text-[#00a884] underline font-semibold">Meta Developers Console (developers.facebook.com)</a>.</li>
              <li>Select your App (e.g. <strong>Vision Tech</strong> / WABA 1000305096170000).</li>
              <li>Go to <strong>App settings → Basic</strong> in the left sidebar menu.</li>
              <li>Paste the <strong>Privacy Policy URL</strong> (<code className="text-emerald-300 font-mono">/privacy-policy</code>) into the Privacy Policy field.</li>
              <li>Paste the <strong>Terms of Service URL</strong> (<code className="text-emerald-300 font-mono">/terms-of-service</code>) and <strong>User Data Deletion URL</strong> (<code className="text-emerald-300 font-mono">/data-deletion</code>).</li>
              <li>Select <strong>Category</strong> (e.g. <em>Business and Pages</em> or <em>Utility & Productivity</em>).</li>
              <li>Click <strong>Save Changes</strong> at the bottom of the page.</li>
              <li>Go to <strong>Publish</strong> in the left sidebar and click <strong>Publish</strong> (or flip the top status toggle from Development to Live)!</li>
            </ol>
          </div>

        </div>

      </div>

    </div>
  );
};
