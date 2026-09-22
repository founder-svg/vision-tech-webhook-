'use client';

import React, { useState } from 'react';
import { WebhookLog } from '@/types';
import { Terminal, Play, Eye, Copy, Check, Filter, Trash2, CheckCircle2, ArrowRightLeft, Sparkles, RefreshCw } from 'lucide-react';

interface WebhookLogsInspectorProps {
  logs: WebhookLog[];
  onClearLogs: () => void;
  onSimulateIncomingMessage: () => void;
  onSimulateDeliveryStatus: () => void;
  onSimulateReadStatus: () => void;
  onTestGetHandshake: () => void;
}

export const WebhookLogsInspector: React.FC<WebhookLogsInspectorProps> = ({
  logs,
  onClearLogs,
  onSimulateIncomingMessage,
  onSimulateDeliveryStatus,
  onSimulateReadStatus,
  onTestGetHandshake,
}) => {
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [copied, setCopied] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    if (filterType === 'all') return true;
    if (filterType === 'inbound') return log.direction === 'inbound_meta';
    if (filterType === 'crm') return log.direction === 'outbound_crm';
    return true;
  });

  const handleCopyJson = (payload: any) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-gray-100 select-none">
      
      {/* Top Banner & Payload Simulator Control Panel */}
      <div className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#2a3942]">
          <div className="flex items-center space-x-3">
            <div className="h-12 px-3 py-1 bg-white rounded-2xl flex items-center justify-center border border-white/20 shadow-md">
              <img src="./vision-tech-logo.png" alt="Vision Tech Logo" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Vision Tech Webhook Payload Inspector</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Live Monitor
                </span>
              </h2>
              <p className="text-xs text-gray-400">Inspect raw Meta Cloud API payloads & CRM dispatches in real-time</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClearLogs}
              className="p-2 bg-[#111b21] hover:bg-rose-500/20 text-rose-400 rounded-xl border border-[#2a3942] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Logs</span>
            </button>
          </div>
        </div>

        {/* Payload Simulator Bar */}
        <div>
          <span className="text-xs font-bold text-gray-300 block mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Interactive Meta Webhook Event Simulator</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={onTestGetHandshake}
              className="p-3 rounded-2xl bg-[#111b21] hover:bg-[#2a3942] border border-[#2a3942] text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-400">1. GET Handshake</span>
                <Play className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <span className="text-[10px] text-gray-400 block">Simulate Meta verification GET token handshake</span>
            </button>

            <button
              onClick={onSimulateIncomingMessage}
              className="p-3 rounded-2xl bg-[#111b21] hover:bg-[#2a3942] border border-[#2a3942] text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-blue-400">2. Inbound Message</span>
                <Play className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <span className="text-[10px] text-gray-400 block">Simulate client sending WhatsApp message</span>
            </button>

            <button
              onClick={onSimulateDeliveryStatus}
              className="p-3 rounded-2xl bg-[#111b21] hover:bg-[#2a3942] border border-[#2a3942] text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-purple-400">3. Delivered (✓✓)</span>
                <Play className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <span className="text-[10px] text-gray-400 block">Trigger double gray tick delivery webhook</span>
            </button>

            <button
              onClick={onSimulateReadStatus}
              className="p-3 rounded-2xl bg-[#111b21] hover:bg-[#2a3942] border border-[#2a3942] text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#53bdeb]">4. Read / Blue Tick</span>
                <Play className="w-3.5 h-3.5 text-[#53bdeb] group-hover:translate-x-1 transition-transform" />
              </div>
              <span className="text-[10px] text-gray-400 block">Trigger double blue tick + viewed timestamp</span>
            </button>
          </div>
        </div>

      </div>

      {/* Webhook Activity Stream Table */}
      <div className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-4">
        
        {/* Table Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-300">Filter Event Stream:</span>
            <div className="flex items-center space-x-1 bg-[#111b21] p-1 rounded-xl border border-[#2a3942]">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  filterType === 'all' ? 'bg-[#00a884] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                All Logs ({logs.length})
              </button>
              <button
                onClick={() => setFilterType('inbound')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  filterType === 'inbound' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Meta Inbound
              </button>
              <button
                onClick={() => setFilterType('crm')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  filterType === 'crm' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                CRM Forwarded
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2a3942] text-gray-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Summary</th>
                <th className="py-3 px-4 text-center">HTTP Status</th>
                <th className="py-3 px-4 text-right">Inspect Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a3942]/50 text-gray-200">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No webhook logs recorded yet.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#202c33]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-gray-400">{log.timestamp}</td>

                    <td className="py-3.5 px-4">
                      {log.direction === 'inbound_meta' && (
                        <span className="bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          Meta → Webhook
                        </span>
                      )}
                      {log.direction === 'outbound_crm' && (
                        <span className="bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          Webhook → CRM
                        </span>
                      )}
                      {log.direction === 'outbound_meta' && (
                        <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          Webhook → Meta API
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-gray-300">
                      {log.eventType}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-gray-200">
                      {log.summary}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 text-[10px]">
                        {log.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="bg-[#111b21] hover:bg-[#2a3942] text-[#00a884] border border-[#2a3942] text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1 ml-auto transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View JSON</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Raw JSON Payload Viewer Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl max-w-2xl w-full p-6 text-gray-100 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#2a3942] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#00a884]" />
                  <span>Raw Webhook Payload ({selectedLog.eventType})</span>
                </h3>
                <span className="text-[10px] text-gray-400 font-mono">{selectedLog.timestamp} • {selectedLog.status}</span>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="relative">
              <pre className="bg-[#111b21] p-4 rounded-2xl border border-[#2a3942] text-emerald-300 font-mono text-xs overflow-x-auto max-h-96">
                {JSON.stringify(selectedLog.payload, null, 2)}
              </pre>

              <button
                onClick={() => handleCopyJson(selectedLog.payload)}
                className="absolute top-3 right-3 bg-[#202c33] hover:bg-[#2a3942] text-gray-200 px-3 py-1.5 rounded-lg border border-[#2a3942] text-xs font-semibold flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
              </button>
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="bg-[#00a884] text-white text-xs font-semibold px-5 py-2 rounded-xl"
              >
                Close Payload Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
