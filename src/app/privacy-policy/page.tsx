import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - Vision Tech WhatsApp API Platform',
  description: 'Privacy Policy and Data Protection guidelines for Vision Tech WhatsApp Webhook & CRM Integration Platform.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0b141a] text-gray-100 font-sans selection:bg-[#00a884] selection:text-white">
      {/* Header Bar */}
      <header className="bg-[#111b21] border-b border-[#222d34] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 px-2 py-1 bg-white rounded-xl flex items-center justify-center border border-white/20">
              <img src="/vision-tech-logo.png" alt="Vision Tech Logo" className="h-7 w-auto object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-base text-white">Vision Tech</h1>
              <p className="text-[11px] text-emerald-400 font-semibold">Privacy Policy & Meta Compliance</p>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs bg-[#1f2c34] hover:bg-[#2a3942] text-gray-300 hover:text-white px-4 py-2 rounded-xl border border-[#2a3942] transition-all flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Application</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#128C7E]/20 to-[#075E54]/20 border border-[#00a884]/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#00a884]/20 text-[#00a884] rounded-2xl border border-[#00a884]/30">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Privacy Policy</h2>
              <p className="text-xs text-emerald-400 font-medium mt-1">Last Updated: September 15, 2026 • Compliant with Meta Platform Terms & GDPR</p>
              <p className="text-xs text-gray-300 mt-3 leading-relaxed">
                Vision Tech ("we", "our", or "us") provides WhatsApp Business API webhook processing, messaging automation, and CRM software integration services. This Privacy Policy details how we collect, handle, process, and protect your information when utilizing our software and Meta Cloud API integrations.
              </p>
            </div>
          </div>
        </div>

        {/* Section Cards */}
        <div className="space-y-6">

          {/* Section 1 */}
          <section className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#00a884]" />
              <span>1. Information We Collect</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              When using Vision Tech in conjunction with Meta Cloud API and WhatsApp Business accounts, we collect and process the following categories of data:
            </p>
            <ul className="text-xs text-gray-300 space-y-2 pl-4 list-disc marker:text-[#00a884]">
              <li><strong>Account Credentials:</strong> WhatsApp Business Account ID (WABA ID), Phone Number ID, App ID, and Meta Permanent System User Access Tokens configured by authorized account owners.</li>
              <li><strong>Messaging Event Telemetry:</strong> Inbound and outbound WhatsApp message payload IDs, timestamps, delivery receipts, read receipts, sender/recipient phone numbers, and message content forwarded via Webhooks.</li>
              <li><strong>Virtual Number Information:</strong> Rented virtual phone numbers, provider session tokens, and SMS verification OTPs required for Meta Phone Number Registration.</li>
              <li><strong>Technical Logs:</strong> Webhook request headers, HTTP status codes, latency metrics, and error stack traces maintained for diagnostic and auditing purposes.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#00a884]" />
              <span>2. How We Use Your Information</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              We process collected data strictly for the operation, execution, and enhancement of WhatsApp Business API integrations, specifically:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-[#111b21] p-3.5 rounded-xl border border-[#2a3942] text-xs">
                <span className="font-bold text-emerald-400 block mb-1">Webhook Forwarding</span>
                Routing WhatsApp customer messages and status events directly to client CRM webhook listeners.
              </div>
              <div className="bg-[#111b21] p-3.5 rounded-xl border border-[#2a3942] text-xs">
                <span className="font-bold text-emerald-400 block mb-1">Number Verification</span>
                Executing Meta <code className="text-emerald-300 font-mono">/request_code</code> and <code className="text-emerald-300 font-mono">/register</code> verification calls.
              </div>
              <div className="bg-[#111b21] p-3.5 rounded-xl border border-[#2a3942] text-xs">
                <span className="font-bold text-emerald-400 block mb-1">Audit & Compliance</span>
                Maintaining real-time webhook inspection logs to verify message delivery and detect service anomalies.
              </div>
              <div className="bg-[#111b21] p-3.5 rounded-xl border border-[#2a3942] text-xs">
                <span className="font-bold text-emerald-400 block mb-1">Meta Policy Adherence</span>
                Enforcing Meta WhatsApp Commerce and Messaging Policies regarding opt-in consent and customer privacy.
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#00a884]" />
              <span>3. Data Sharing & Meta Platform Principles</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Vision Tech does <strong>not</strong> sell, rent, monetize, or trade end-user data or WhatsApp messaging records. Data is transmitted exclusively between:
            </p>
            <ul className="text-xs text-gray-300 space-y-2 pl-4 list-disc marker:text-[#00a884]">
              <li><strong>Meta Platforms, Inc.:</strong> Over encrypted HTTPS connections (<code className="text-emerald-300 font-mono">graph.facebook.com</code>) to deliver WhatsApp Cloud API services.</li>
              <li><strong>Authorized Client Endpoints:</strong> Your designated CRM server URL configured under Webhook Settings.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#00a884]" />
              <span>4. Data Deletion & User Rights</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              In accordance with Meta Developer Data Policies and international privacy standards (GDPR / CCPA), users and organization administrators have the right to request deletion of all associated data.
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              To request immediate data deletion, visit our <Link href="/data-deletion" className="text-[#00a884] font-bold hover:underline">Data Deletion Instructions</Link> or send an email request to <code className="text-emerald-300 font-mono">privacy@visiontech.com</code>. All personal metadata and stored webhook logs will be erased within 30 days of request receipt.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00a884]" />
              <span>5. Security Standards</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              All credentials, API tokens, and webhook payloads are protected using industry-standard TLS 1.3 encryption in transit and AES-256 encryption at rest. Server environments undergo regular security audits to safeguard against unauthorized access.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-2">
            <h3 className="text-sm font-bold text-white">Contact & Support</h3>
            <p className="text-xs text-gray-300">
              For privacy-related inquiries, data access requests, or compliance questions regarding Meta App Publishing:
            </p>
            <p className="text-xs text-emerald-400 font-mono font-semibold">
              Email: privacy@visiontech.com • Security Desk: compliance@visiontech.com
            </p>
          </section>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#111b21] border-t border-[#222d34] py-6 text-center text-xs text-gray-500 space-y-2">
        <p>© 2026 Vision Tech Inc. All rights reserved. Meta & WhatsApp are registered trademarks of Meta Platforms, Inc.</p>
        <div className="flex justify-center space-x-4 text-[11px] text-gray-400">
          <Link href="/privacy-policy" className="hover:text-emerald-400 underline">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms-of-service" className="hover:text-emerald-400 underline">Terms of Service</Link>
          <span>•</span>
          <Link href="/data-deletion" className="hover:text-emerald-400 underline">Data Deletion</Link>
        </div>
      </footer>
    </div>
  );
}
