'use client';

import React from 'react';
import { WalletTransaction } from '@/types';
import { Wallet, ArrowUpRight, ArrowDownLeft, ShieldCheck, RefreshCw, CreditCard, ExternalLink, Zap } from 'lucide-react';

interface MetaWalletCardProps {
  balance: number;
  transactions: WalletTransaction[];
  onOpenRecharge: () => void;
}

export const MetaWalletCard: React.FC<MetaWalletCardProps> = ({
  balance,
  transactions,
  onOpenRecharge,
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 text-gray-100 select-none">
      
      {/* Top Banner & Balance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Wallet Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#128C7E] via-[#075E54] to-[#0b141a] rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                  <Wallet className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Meta Business Wallet</h2>
                  <p className="text-xs text-emerald-200/80">WhatsApp Cloud API Prepaid Balance</p>
                </div>
              </div>

              <span className="text-xs bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Meta Verified
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs text-emerald-200/70 uppercase font-semibold tracking-wider block">Available Balance</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-emerald-200">INR</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4 text-xs text-emerald-100">
              <div>
                <span className="text-emerald-300/70 block text-[10px]">Avg Utility Cost</span>
                <span className="font-semibold text-white">₹0.85 / msg</span>
              </div>
              <div className="h-6 w-px bg-white/20"></div>
              <div>
                <span className="text-emerald-300/70 block text-[10px]">Est. Remaining</span>
                <span className="font-semibold text-white">~{Math.floor(balance / 0.85)} Messages</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href="https://business.facebook.com/billing_hub"
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-2 transition-all"
              >
                <span>Meta Business Suite</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onOpenRecharge}
                className="bg-[#00a884] hover:bg-[#008f70] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-[#00a884]/30 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>Top Up / Recharge</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Daily Usage Summary Card */}
        <div className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-gray-100 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> Daily Messaging Stats
              </span>
              <span className="text-[10px] text-gray-400">Target: 30-40 msgs/day</span>
            </h3>

            <div className="space-y-4">
              <div className="bg-[#111b21] p-3.5 rounded-2xl border border-[#2a3942]">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-gray-400">Today Dispatched</span>
                  <span className="font-bold text-[#00a884]">36 Messages</span>
                </div>
                <div className="w-full bg-[#202c33] rounded-full h-2 overflow-hidden">
                  <div className="bg-[#00a884] h-full rounded-full w-[90%]"></div>
                </div>
              </div>

              <div className="bg-[#111b21] p-3.5 rounded-2xl border border-[#2a3942]">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-gray-400">Monthly Utility Total</span>
                  <span className="font-bold text-gray-200">1,048 Messages</span>
                </div>
                <div className="w-full bg-[#202c33] rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full w-[65%]"></div>
                </div>
              </div>

              <div className="bg-[#111b21] p-3.5 rounded-2xl border border-[#2a3942]">
                <span className="text-[11px] text-gray-400 block mb-1">Low Balance Alert Threshold</span>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-400">₹500.00</span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                    Active Alert
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#2a3942] text-[11px] text-gray-400 flex items-center justify-between">
            <span>Meta Category: Transactional Only</span>
            <span className="text-emerald-400">0% Marketing</span>
          </div>
        </div>

      </div>

      {/* Wallet Transactions History Table */}
      <div className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#00a884]" />
              <span>Wallet Transaction History</span>
            </h3>
            <p className="text-xs text-gray-400">Meta WhatsApp Cloud API deductions and UPI recharges</p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="p-2 bg-[#111b21] hover:bg-[#2a3942] text-gray-300 rounded-xl border border-[#2a3942] text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Balance</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2a3942] text-gray-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Amount (INR)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a3942]/50 text-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#202c33]/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-gray-300">
                    {tx.metaTxId}
                  </td>
                  <td className="py-3 px-4 text-gray-400">{tx.timestamp}</td>
                  <td className="py-3 px-4 font-medium">{tx.description}</td>
                  <td className="py-3 px-4">
                    {tx.type === 'credit' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-semibold text-[10px]">
                        <ArrowUpRight className="w-3 h-3" /> Top Up Credit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded font-semibold text-[10px]">
                        <ArrowDownLeft className="w-3 h-3" /> Usage Debit
                      </span>
                    )}
                  </td>
                  <td className={`py-3 px-4 text-right font-bold text-sm ${
                    tx.type === 'credit' ? 'text-emerald-400' : 'text-gray-300'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
