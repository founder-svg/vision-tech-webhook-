'use client';

import React from 'react';
import { MessageSquare, Wallet, Settings, Terminal, Code2, ShieldCheck, Zap, ArrowUpRight, Bell, Smartphone } from 'lucide-react';

interface NavbarProps {
  activeTab: 'chat' | 'wallet' | 'settings' | 'logs' | 'docs' | 'reminders' | 'virtual';
  setActiveTab: (tab: 'chat' | 'wallet' | 'settings' | 'logs' | 'docs' | 'reminders' | 'virtual') => void;
  walletBalance: number;
  onOpenRecharge: () => void;
  appMode?: 'development' | 'live';
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  walletBalance,
  onOpenRecharge,
  appMode = 'development'
}) => {
  return (
    <header className="bg-[#111b21] border-b border-[#222d34] sticky top-0 z-40 text-gray-100 select-none shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Status */}
          <div className="flex items-center space-x-3">
            <div className="h-11 px-2.5 py-1 bg-white rounded-xl flex items-center justify-center shadow-md border border-white/20">
              <img 
                src="./vision-tech-logo.png" 
                alt="Vision Tech Logo" 
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">Vision Tech</span>
                <span className="text-xs bg-[#00a884]/20 text-[#00a884] font-semibold px-2 py-0.5 rounded-full border border-[#00a884]/30">
                  WhatsApp Webhook Engine
                </span>
                
                {appMode === 'live' ? (
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    LIVE APP PRODUCTION 🚀
                  </span>
                ) : (
                  <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    Development Mode
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Meta Cloud API v20.0 • Verified & Ready
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#1f2c34] p-1.5 rounded-xl border border-[#2a3942]">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-[#00a884] text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-[#2a3942]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Live Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('virtual')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'virtual'
                  ? 'bg-[#00a884] text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-[#2a3942]'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Virtual Numbers</span>
            </button>

            <button
              onClick={() => setActiveTab('reminders')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'reminders'
                  ? 'bg-[#00a884] text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-[#2a3942]'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Reminders</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'wallet'
                  ? 'bg-[#00a884] text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-[#2a3942]'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Meta Wallet</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'logs'
                  ? 'bg-[#00a884] text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-[#2a3942]'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Webhook Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#00a884] text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-[#2a3942]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Webhook Config</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'docs'
                  ? 'bg-[#00a884] text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-[#2a3942]'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>CRM API Docs</span>
            </button>
          </nav>

          {/* Meta Wallet Quick Action */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-[#1f2c34] border border-[#2a3942] rounded-xl px-3 py-1.5">
              <div className="text-right mr-3">
                <span className="text-[10px] text-gray-400 block uppercase font-medium">Meta Wallet</span>
                <span className="text-sm font-bold text-[#00a884]">₹{walletBalance.toFixed(2)}</span>
              </div>
              <button
                onClick={onOpenRecharge}
                className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all active:scale-95"
              >
                <span>Top Up</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
