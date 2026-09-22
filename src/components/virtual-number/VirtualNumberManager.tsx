'use client';

import React, { useState } from 'react';
import { 
  Smartphone, 
  ShieldCheck, 
  RefreshCw, 
  Plus, 
  Copy, 
  Check, 
  AlertTriangle, 
  Clock, 
  MessageSquare, 
  ArrowRight, 
  Radio, 
  ChevronDown,
  ChevronUp,
  Trash2,
  Send,
  Zap,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { VirtualNumber, VirtualProviderInfo, VirtualProviderId } from '@/types';

interface VirtualNumberManagerProps {
  virtualNumbers: VirtualNumber[];
  providers: VirtualProviderInfo[];
  walletBalance: number;
  onAcquireNumber: (country: string, countryCode: string, flag: string, providerId: VirtualProviderId, service: string) => boolean;
  onSimulateOtp: (numberId: string) => void;
  onFailoverProvider: (numberId: string) => void;
  onCancelNumber: (numberId: string) => void;
  onApplyToWebhook: (phoneNumber: string) => void;
}

const COUNTRY_OPTIONS = [
  { name: 'India', code: 'IN', flag: '🇮🇳', phonePrefix: '+91', price: 25.0 },
  { name: 'United States', code: 'US', flag: '🇺🇸', phonePrefix: '+1', price: 22.0 },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', phonePrefix: '+44', price: 30.0 },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱', phonePrefix: '+31', price: 28.0 },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', phonePrefix: '+49', price: 35.0 },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', phonePrefix: '+1', price: 24.0 },
];

export const VirtualNumberManager: React.FC<VirtualNumberManagerProps> = ({
  virtualNumbers,
  providers,
  walletBalance,
  onAcquireNumber,
  onSimulateOtp,
  onFailoverProvider,
  onCancelNumber,
  onApplyToWebhook
}) => {
  const [isAcquireOpen, setIsAcquireOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_OPTIONS[0]);
  const [selectedProviderId, setSelectedProviderId] = useState<VirtualProviderId>('5sim');
  const [autoFailoverEnabled, setAutoFailoverEnabled] = useState(true);
  const [selectedService, setSelectedService] = useState('WhatsApp Cloud API');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSmsId, setExpandedSmsId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [acquiringLoading, setAcquiringLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const activeProvider = providers.find((p) => p.id === selectedProviderId) || providers[0];
  const backupProvider = providers.find((p) => p.id !== selectedProviderId) || providers[1];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAcquireSubmit = () => {
    if (walletBalance < selectedCountry.price) {
      setFeedbackMsg({
        type: 'error',
        text: `Insufficient Meta Wallet balance (₹${walletBalance.toFixed(2)}). Minimum required is ₹${selectedCountry.price.toFixed(2)}. Please Top Up your wallet.`
      });
      return;
    }

    setAcquiringLoading(true);
    setTimeout(() => {
      const success = onAcquireNumber(
        selectedCountry.name,
        selectedCountry.code,
        selectedCountry.flag,
        selectedProviderId,
        selectedService
      );

      setAcquiringLoading(false);
      if (success) {
        setIsAcquireOpen(false);
        setFeedbackMsg({
          type: 'success',
          text: `Virtual number acquired successfully from ${activeProvider.name}! Waiting for WhatsApp verification SMS.`
        });
      } else {
        setFeedbackMsg({
          type: 'error',
          text: `Failed to acquire number from ${activeProvider.name}. Failover triggered!`
        });
      }
    }, 900);
  };

  const filteredNumbers = virtualNumbers.filter((n) => {
    if (filterStatus === 'all') return true;
    return n.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-gray-100 font-sans">
      
      {/* Banner / Header */}
      <div className="bg-[#1f2c34] border border-[#2a3942] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#00a884]/20 border border-[#00a884]/30 rounded-xl text-[#00a884]">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                  Virtual Phone Number Manager
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/40 font-mono">
                    Multi-Provider Failover Ready
                  </span>
                </h1>
                <p className="text-sm text-gray-400">
                  Rent temporary & dedicated virtual numbers for WhatsApp Cloud API verification, receive instant SMS OTPs, and auto-failover between providers.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAcquireOpen(true)}
              className="bg-[#00a884] hover:bg-[#029071] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-[#00a884]/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Get Virtual Number</span>
            </button>
          </div>
        </div>

        {/* Provider Cards Status Header */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#2a3942]">
          
          {/* Primary Provider */}
          <div className="bg-[#111b21] border border-emerald-500/40 rounded-xl p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                Primary Provider (Active)
              </span>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                98.6% OTP Success
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">5sim.net Cloud SIM</h3>
                <p className="text-xs text-gray-400">Avg OTP arrival: ~8 sec • ₹25.00/num</p>
              </div>
              <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
            </div>
          </div>

          {/* Backup / Failover Provider */}
          <div className="bg-[#111b21] border border-amber-500/40 rounded-xl p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Backup Provider (Auto Failover)
              </span>
              <span className="text-[11px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                97.2% OTP Success
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">SMS-Activate.org</h3>
                <p className="text-xs text-gray-400">Avg OTP arrival: ~12 sec • ₹22.00/num</p>
              </div>
              <span className="h-3 w-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400"></span>
            </div>
          </div>

          {/* Wallet Quick Balance */}
          <div className="bg-[#111b21] border border-[#2a3942] rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase block">Meta Wallet Balance</span>
              <div className="text-xl font-bold text-[#00a884] mt-0.5">₹{walletBalance.toFixed(2)}</div>
              <p className="text-[11px] text-gray-400 mt-1">Deducted per rented virtual number</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-[#00a884]">
              <Zap className="w-5 h-5" />
            </div>
          </div>

        </div>
      </div>

      {/* Global Alert Notification */}
      {feedbackMsg && (
        <div className={`p-4 rounded-xl border flex items-center justify-between animate-fadeIn ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' 
            : feedbackMsg.type === 'error'
            ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
            : 'bg-blue-950/60 border-blue-500/40 text-blue-200'
        }`}>
          <div className="flex items-center gap-3">
            {feedbackMsg.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {feedbackMsg.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
            {feedbackMsg.type === 'info' && <HelpCircle className="w-5 h-5 text-blue-400" />}
            <span className="text-sm font-medium">{feedbackMsg.text}</span>
          </div>
          <button 
            onClick={() => setFeedbackMsg(null)} 
            className="text-xs opacity-70 hover:opacity-100 font-semibold px-2 py-1 bg-white/10 rounded"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Rented Numbers Section & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1f2c34] p-4 rounded-xl border border-[#2a3942]">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#00a884]" />
            <h2 className="font-bold text-white text-base">Your Active & Rented Virtual Numbers</h2>
            <span className="ml-2 text-xs bg-[#2a3942] text-gray-300 font-bold px-2 py-0.5 rounded-full">
              {virtualNumbers.length} Total
            </span>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#111b21] p-1 rounded-lg border border-[#2a3942]">
            {[
              { id: 'all', label: 'All' },
              { id: 'pending_otp', label: 'Waiting for OTP' },
              { id: 'otp_received', label: 'OTP Received' },
              { id: 'active', label: 'Active' },
              { id: 'failed', label: 'Failed/Refunded' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  filterStatus === tab.id
                    ? 'bg-[#00a884] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-[#1f2c34]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredNumbers.length === 0 && (
          <div className="bg-[#1f2c34] border border-[#2a3942] rounded-2xl p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-[#111b21] rounded-2xl border border-[#2a3942] flex items-center justify-center mx-auto text-gray-400">
              <Smartphone className="w-8 h-8 text-gray-500" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white">No Virtual Numbers Found</h3>
              <p className="text-sm text-gray-400 mt-1">
                You haven't rented any virtual numbers matching this filter yet. Click "Get Virtual Number" to acquire a new number for WhatsApp activation.
              </p>
            </div>
            <button
              onClick={() => setIsAcquireOpen(true)}
              className="bg-[#00a884] hover:bg-[#029071] text-white px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Get Virtual Number Now</span>
            </button>
          </div>
        )}

        {/* Numbers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNumbers.map((num) => {
            const isPending = num.status === 'pending_otp';
            const isOtpReceived = num.status === 'otp_received';
            const isActive = num.status === 'active';
            const isFailed = num.status === 'failed' || num.status === 'refunded';

            return (
              <div 
                key={num.id}
                className={`bg-[#1f2c34] border rounded-2xl p-5 shadow-lg transition-all space-y-4 relative ${
                  isPending 
                    ? 'border-amber-500/50 hover:border-amber-500' 
                    : isOtpReceived
                    ? 'border-emerald-500 hover:border-emerald-400 bg-gradient-to-br from-[#1f2c34] to-[#14232b]'
                    : isActive
                    ? 'border-emerald-500/30'
                    : 'border-rose-500/30 opacity-80'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{num.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-white font-mono">{num.phoneNumber}</span>
                        <button
                          onClick={() => handleCopy(num.phoneNumber, `phone-${num.id}`)}
                          className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                          title="Copy phone number"
                        >
                          {copiedId === `phone-${num.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                        <span>{num.country}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium">{num.service}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isPending && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3 h-3" />
                        Waiting for OTP...
                      </span>
                    )}
                    {isOtpReceived && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        OTP Received ✓
                      </span>
                    )}
                    {isActive && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        Active & Verified
                      </span>
                    )}
                    {isFailed && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                        <XCircle className="w-3 h-3 text-rose-400" />
                        Provider Failed
                      </span>
                    )}
                  </div>
                </div>

                {/* Provider Info Row */}
                <div className="bg-[#111b21] rounded-xl p-3 border border-[#2a3942] flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Provider</span>
                    <span className="text-gray-200 font-medium">{num.providerName}</span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Rental Fee</span>
                    <span className="text-emerald-400 font-bold">₹{num.cost.toFixed(2)}</span>
                  </div>
                </div>

                {/* OTP Code Display Box */}
                {(isPending || isOtpReceived || isActive) && (
                  <div className={`rounded-xl p-4 border flex items-center justify-between ${
                    isOtpReceived 
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                      : 'bg-[#111b21] border-[#2a3942]'
                  }`}>
                    <div>
                      <span className="text-[11px] text-gray-400 uppercase font-semibold block">WhatsApp Verification Code</span>
                      {num.otpCode ? (
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-2xl font-black tracking-widest font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-500/40">
                            {num.otpCode}
                          </span>
                          <button
                            onClick={() => handleCopy(num.otpCode!, `otp-${num.id}`)}
                            className="bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 px-2.5 py-1 rounded-lg text-xs font-semibold border border-emerald-500/40 flex items-center gap-1 transition-all active:scale-95"
                          >
                            {copiedId === `otp-${num.id}` ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-400 italic mt-1 block">
                          Waiting for incoming SMS from WhatsApp...
                        </span>
                      )}
                    </div>

                    {/* Quick Simulate SMS Action */}
                    {isPending && (
                      <button
                        onClick={() => onSimulateOtp(num.id)}
                        className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                        title="Simulate SMS reception from WhatsApp API"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Simulate SMS Arrival</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Failover / Error banner if provider failed */}
                {isFailed && (
                  <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-200 space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>{num.failoverReason || 'Primary provider failed to deliver SMS within timeout window.'}</span>
                    </div>
                    <p className="text-rose-300/80">
                      You can instantly failover to switch to Backup Provider (SMS-Activate) or cancel for a full refund to your Meta Wallet.
                    </p>
                  </div>
                )}

                {/* Actions Toolbar */}
                <div className="flex items-center justify-between pt-2 border-t border-[#2a3942] gap-2 flex-wrap">
                  
                  {/* Left Action Buttons */}
                  <div className="flex items-center gap-2">
                    {(num.otpCode || isActive) && (
                      <button
                        onClick={() => onApplyToWebhook(num.phoneNumber)}
                        className="bg-[#00a884] hover:bg-[#029071] text-white border border-[#00a884] px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>Integrate & Register with Meta WhatsApp API</span>
                      </button>
                    )}

                    {/* Failover Switch Button */}
                    {(isPending || isFailed) && (
                      <button
                        onClick={() => onFailoverProvider(num.id)}
                        className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                        title="Switch to backup provider immediately if primary fails or is slow"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Failover to Backup Provider</span>
                      </button>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    {/* View Inbox toggle */}
                    <button
                      onClick={() => setExpandedSmsId(expandedSmsId === num.id ? null : num.id)}
                      className="text-xs text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-[#111b21] border border-transparent hover:border-[#2a3942] flex items-center gap-1 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>SMS Inbox ({num.smsHistory.length})</span>
                      {expandedSmsId === num.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Cancel / Refund */}
                    <button
                      onClick={() => onCancelNumber(num.id)}
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors"
                      title="Release number & refund wallet balance"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* SMS Inbox Expanded Panel */}
                {expandedSmsId === num.id && (
                  <div className="mt-3 bg-[#111b21] rounded-xl p-3 border border-[#2a3942] space-y-2 animate-fadeIn">
                    <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block border-b border-[#2a3942] pb-1.5">
                      Incoming SMS Messages for {num.phoneNumber}
                    </span>

                    {num.smsHistory.length === 0 ? (
                      <p className="text-xs text-gray-500 italic py-2 text-center">
                        No SMS received yet. Click "Simulate SMS Arrival" or send a real WhatsApp verification code.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {num.smsHistory.map((sms) => (
                          <div key={sms.id} className="bg-[#1f2c34] rounded-lg p-2.5 border border-[#2a3942] text-xs space-y-1">
                            <div className="flex items-center justify-between text-[#00a884] font-semibold">
                              <span>From: {sms.sender}</span>
                              <span className="text-[10px] text-gray-400">{sms.receivedAt}</span>
                            </div>
                            <p className="text-gray-200">{sms.text}</p>
                            {sms.code && (
                              <div className="pt-1 flex items-center justify-between text-[11px]">
                                <span className="font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">
                                  Code: {sms.code}
                                </span>
                                <button
                                  onClick={() => handleCopy(sms.code!, `inbox-code-${sms.id}`)}
                                  className="text-[#00a884] hover:underline font-semibold"
                                >
                                  {copiedId === `inbox-code-${sms.id}` ? 'Copied!' : 'Copy Code'}
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* RENT / ACQUIRE VIRTUAL NUMBER MODAL */}
      {isAcquireOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1f2c34] border border-[#2a3942] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2a3942] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#00a884]/20 text-[#00a884] rounded-lg border border-[#00a884]/30">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Rent Virtual Phone Number</h3>
                  <p className="text-xs text-gray-400">Select country, provider, and service type</p>
                </div>
              </div>
              <button
                onClick={() => setIsAcquireOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#111b21]"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Form */}
            <div className="space-y-4 text-sm">
              
              {/* Country Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                  1. Select Country
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COUNTRY_OPTIONS.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setSelectedCountry(c)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedCountry.code === c.code
                          ? 'border-[#00a884] bg-[#00a884]/10 text-white font-semibold'
                          : 'border-[#2a3942] bg-[#111b21] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{c.flag}</span>
                        <span className="text-[11px] font-bold text-[#00a884]">₹{c.price.toFixed(2)}</span>
                      </div>
                      <span className="text-xs block font-medium truncate">{c.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{c.phonePrefix}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Provider Selection & Failover Settings */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-gray-300 uppercase">
                    2. Select Primary Provider
                  </label>
                  <span className="text-[11px] text-emerald-400 font-medium">Multi-Provider Ready</span>
                </div>
                <div className="space-y-2">
                  {providers.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedProviderId === p.id
                          ? 'border-[#00a884] bg-[#00a884]/10 text-white'
                          : 'border-[#2a3942] bg-[#111b21] text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="provider"
                          value={p.id}
                          checked={selectedProviderId === p.id}
                          onChange={() => setSelectedProviderId(p.id)}
                          className="accent-[#00a884] w-4 h-4"
                        />
                        <div>
                          <div className="font-semibold text-xs text-white flex items-center gap-2">
                            {p.name}
                            {p.isPrimary && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                                Primary
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400">
                            Success: {p.successRate}% • Avg: ~{p.avgOtpTimeSec}s
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#00a884]">₹{p.costPerNumber.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Auto Failover Checkbox */}
              <div className="bg-[#111b21] p-3 rounded-xl border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-white block">Auto-Failover to Backup Provider</span>
                    <span className="text-[11px] text-gray-400 block">
                      If {activeProvider.name} fails to deliver SMS within 2 minutes, automatically request a fresh number from {backupProvider.name}.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoFailoverEnabled}
                  onChange={(e) => setAutoFailoverEnabled(e.target.checked)}
                  className="accent-amber-500 w-4 h-4 rounded cursor-pointer"
                />
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  3. Select Service Purpose
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-[#111b21] border border-[#2a3942] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00a884]"
                >
                  <option value="WhatsApp Cloud API">WhatsApp Cloud API (Meta Verification)</option>
                  <option value="WhatsApp Business">WhatsApp Business App</option>
                  <option value="CRM Bulk Dispatch">CRM Bulk Messaging Node</option>
                </select>
              </div>

              {/* Fee & Wallet Summary */}
              <div className="bg-[#111b21] p-4 rounded-xl border border-[#2a3942] space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Number Rental Fee ({selectedCountry.name}):</span>
                  <span className="font-semibold text-white">₹{selectedCountry.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Meta Wallet Current Balance:</span>
                  <span className="font-semibold text-[#00a884]">₹{walletBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-[#2a3942] pt-2 font-bold">
                  <span className="text-gray-200">Balance After Rental:</span>
                  <span className={walletBalance - selectedCountry.price >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    ₹{(walletBalance - selectedCountry.price).toFixed(2)}
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Footer Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-[#2a3942] pt-4">
              <button
                type="button"
                onClick={() => setIsAcquireOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white rounded-xl hover:bg-[#111b21]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAcquireSubmit}
                disabled={acquiringLoading}
                className="bg-[#00a884] hover:bg-[#029071] disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-lg shadow-[#00a884]/20 flex items-center gap-2 transition-all active:scale-95"
              >
                {acquiringLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting Provider API...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Pay ₹{selectedCountry.price.toFixed(2)} & Get Number</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
