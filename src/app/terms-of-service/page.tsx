import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - Vision Tech WhatsApp API Platform',
  description: 'Terms of Service and Usage Policies for Vision Tech WhatsApp Webhook & CRM Integration Platform.',
};

export default function TermsOfServicePage() {
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
              <p className="text-[11px] text-emerald-400 font-semibold">Terms of Service & Meta Platform Terms</p>
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
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Terms of Service</h2>
              <p className="text-xs text-emerald-400 font-medium mt-1">Effective Date: September 15, 2026 • Vision Tech Platform Agreement</p>
              <p className="text-xs text-gray-300 mt-3 leading-relaxed">
                These Terms of Service ("Terms") govern your use of the Vision Tech platform, WhatsApp Business API webhook integrations, virtual number provisioning tools, and CRM gateway services. By accessing or using our platform, you agree to be bound by these Terms.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">

          {/* Section 1 */}
          <section className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00a884]" />
              <span>1. Compliance with Meta & WhatsApp Commerce Policies</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Users of Vision Tech must strictly comply with all policies established by Meta Platforms, Inc. including the <strong className="text-white">WhatsApp Business Policy</strong>, <strong className="text-white">WhatsApp Commerce Policy</strong>, and <strong className="text-white">Meta Developer Terms</strong>.
            </p>
            <ul className="text-xs text-gray-300 space-y-2 pl-4 list-disc marker:text-[#00a884]">
              <li><strong>User Consent:</strong> You must obtain explicit opt-in consent from end users before dispatching business-initiated WhatsApp messages or templates.</li>
              <li><strong>Prohibited Content:</strong> Sending illegal, deceptive, abusive, spam, or misleading messages is strictly prohibited and will result in immediate API termination.</li>
              <li><strong>Rate Limits:</strong> Messaging volume must adhere to Meta quality tiers (e.g. 1,000 msgs/day default tier for initial verified accounts).</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#00a884]" />
              <span>2. API Access & Webhook Integration</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Vision Tech provides HTTPS webhook handlers for receiving Meta Cloud API event payloads. Account owners are responsible for:
            </p>
            <ul className="text-xs text-gray-300 space-y-2 pl-4 list-disc marker:text-[#00a884]">
              <li>Safeguarding Permanent Access Tokens, Verify Tokens, and App Secret keys.</li>
              <li>Maintaining valid, reachable HTTPS endpoints for CRM forwarding listeners.</li>
              <li>Monitoring quality ratings and display name approval status in the Meta Business Manager.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#00a884]" />
              <span>3. Limitation of Liability</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Vision Tech provides messaging and webhook gateway software on an "as-is" and "as-available" basis. We are not liable for service interruptions caused by Meta Cloud API outages, third-party telecommunication providers, or invalid user endpoint configurations.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-2">
            <h3 className="text-sm font-bold text-white">4. Modifications & Termination</h3>
            <p className="text-xs text-gray-300">
              We reserve the right to modify these Terms or suspend account access in the event of policy violations or unauthorized system manipulation. Updates will be published on this page.
            </p>
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
