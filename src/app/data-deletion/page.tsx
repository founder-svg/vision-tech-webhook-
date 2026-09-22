import React from 'react';
import Link from 'next/link';
import { Trash2, ShieldAlert, CheckCircle2, ArrowLeft, Mail, RefreshCw } from 'lucide-react';

export const metadata = {
  title: 'Data Deletion Instructions - Vision Tech WhatsApp API Platform',
  description: 'User Data Deletion Callback and Request Instructions for Meta Developer App compliance.',
};

export default function DataDeletionPage() {
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
              <p className="text-[11px] text-emerald-400 font-semibold">User Data Deletion Policy & Meta Callback</p>
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
        <div className="bg-gradient-to-r from-red-950/40 via-[#1f2c34] to-emerald-950/40 border border-red-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl border border-red-500/30">
              <Trash2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">User Data Deletion Instructions</h2>
              <p className="text-xs text-red-400 font-medium mt-1">Meta Developer Platform Requirement • Instant Data Erasure</p>
              <p className="text-xs text-gray-300 mt-3 leading-relaxed">
                Vision Tech is committed to user privacy and data sovereignty. In accordance with Meta Platform Policy and global data protection regulations (GDPR/CCPA), users can request the full deletion of their account data, message logs, and WhatsApp Meta API integration tokens.
              </p>
            </div>
          </div>
        </div>

        {/* Steps Card */}
        <div className="space-y-6">

          <section className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#00a884]" />
              <span>How to Submit a Data Deletion Request</span>
            </h3>

            <div className="space-y-3">
              <div className="bg-[#111b21] p-4 rounded-2xl border border-[#2a3942] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#00a884] text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Method 1: Email Request (Recommended)</h4>
                  <p className="text-xs text-gray-300 mt-1">
                    Send an email from your registered administrator address to <code className="text-emerald-300 font-mono">datadeletion@visiontech.com</code> with the subject line <strong className="text-white">"Request for Meta WhatsApp User Data Erasure"</strong>. Include your Meta App ID or WhatsApp Business Account (WABA ID).
                  </p>
                </div>
              </div>

              <div className="bg-[#111b21] p-4 rounded-2xl border border-[#2a3942] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#00a884] text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Method 2: In-App Purge & Disconnect</h4>
                  <p className="text-xs text-gray-300 mt-1">
                    Navigate to <strong>Webhook Config</strong> inside Vision Tech dashboard, clear your Meta System User Access Token and Webhook Verify Token, and click <strong>Save Configuration</strong>. This instantly removes local credential cache and revokes listener permissions.
                  </p>
                </div>
              </div>

              <div className="bg-[#111b21] p-4 rounded-2xl border border-[#2a3942] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#00a884] text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Method 3: Meta App Settings Disconnect</h4>
                  <p className="text-xs text-gray-300 mt-1">
                    Go to your Facebook Profile → <strong>Settings & Privacy → Business Integrations</strong>, select Vision Tech, and click <strong>Remove</strong>. Meta will trigger an automated webhook data deletion callback (<code className="text-emerald-300 font-mono">/api/data-deletion</code>) to purge all data instantly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Verification & Processing Timeline */}
          <section className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#00a884]" />
              <span>Data Deletion Confirmation & Verification</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Upon receiving a data deletion request:
            </p>
            <ul className="text-xs text-gray-300 space-y-2 pl-4 list-disc marker:text-[#00a884]">
              <li>We issue a unique <strong>Data Deletion Confirmation Code</strong> via email or HTTP callback response within 24 hours.</li>
              <li>All associated message payloads, phone numbers, contact records, and audit logs are permanently purged from database stores within 7 business days.</li>
              <li>A final Deletion Certificate is generated for audit compliance.</li>
            </ul>
          </section>

          {/* Meta Callback Info */}
          <section className="bg-[#111b21] border border-[#00a884]/30 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-[#00a884] uppercase tracking-wider flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span>Meta Data Deletion Callback URL for Meta App Settings</span>
            </h3>
            <p className="text-xs text-gray-300">
              For Meta Developer Portal registration (under <strong>App Settings → Basic → User Data Deletion</strong>):
            </p>
            <div className="p-3 bg-[#0b141a] rounded-xl border border-[#2a3942] text-xs font-mono text-emerald-300">
              Data Deletion Instructions URL: https://&lt;your-domain&gt;/data-deletion
            </div>
          </section>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#111b21] border-t border-[#222d34] py-6 text-center text-xs text-gray-500 space-y-2">
        <p>© 2026 Vision Tech Inc. All rights reserved.</p>
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
