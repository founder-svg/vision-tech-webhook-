'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Contact, Message, Attachment, MessageStatus } from '@/types';
import {
  Send,
  Plus,
  Check,
  CheckCheck,
  Clock,
  FileText,
  Download,
  Info,
  Zap,
  Phone,
  Video as VideoIcon,
  MoreVertical,
  Paperclip,
  Eye,
  AlertCircle,
  ExternalLink,
  ArrowDownLeft,
  MessageSquare,
  Bot,
  Sparkles
} from 'lucide-react';
import { AttachmentMenu } from './AttachmentMenu';

interface ChatWindowProps {
  contact?: Contact;
  messages?: Message[];
  onSendMessage: (content: string, attachment?: Attachment) => void;
  onSimulateReadStatus?: (messageId: string) => void;
  onSimulateIncomingMessage?: (targetContactId?: string, customText?: string) => void;
  autoReplyEnabled?: boolean;
  onToggleAutoReply?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  contact,
  messages = [],
  onSendMessage,
  onSimulateReadStatus,
  onSimulateIncomingMessage,
  autoReplyEnabled = true,
  onToggleAutoReply,
}) => {
  const [inputText, setInputText] = useState('');
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [activeInfoMessage, setActiveInfoMessage] = useState<Message | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedAttachment]);

  if (!contact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#0b141a] text-gray-400 select-none">
        <div className="text-center space-y-2">
          <p className="text-base font-semibold text-gray-300">No Conversation Selected</p>
          <p className="text-xs text-gray-500">Select a contact from the sidebar to view conversation and dispatch WhatsApp messages</p>
        </div>
      </div>
    );
  }

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedAttachment) return;

    onSendMessage(inputText.trim(), selectedAttachment || undefined);
    setInputText('');
    setSelectedAttachment(null);
  };

  // Predefined CRM daily template dispatches
  const handleQuickTemplate = (templateText: string) => {
    onSendMessage(templateText);
  };

  // Render message delivery status ticks
  const renderMessageStatus = (msg: Message) => {
    if (msg.sender !== 'user' && msg.sender !== 'crm_bot') return null;

    switch (msg.status) {
      case 'sending':
        return (
          <span title="Sending message to WhatsApp..." className="text-gray-400">
            <Clock className="w-3.5 h-3.5 animate-spin" />
          </span>
        );
      case 'sent':
        return (
          <span title={`Sent at ${msg.sentAt || msg.timestamp}`} className="text-gray-400">
            <Check className="w-3.5 h-3.5" />
          </span>
        );
      case 'delivered':
        return (
          <span title={`Delivered at ${msg.deliveredAt || msg.timestamp}`} className="text-gray-400">
            <CheckCheck className="w-3.5 h-3.5" />
          </span>
        );
      case 'read':
        return (
          <span
            title={`Read & Viewed at ${msg.viewedAt || msg.timestamp}`}
            className="text-[#53bdeb] flex items-center gap-0.5 cursor-pointer"
            onClick={() => setActiveInfoMessage(msg)}
          >
            <CheckCheck className="w-3.5 h-3.5 font-bold stroke-[2.5]" />
          </span>
        );
      case 'failed':
        return (
          <span title="Failed to deliver" className="text-rose-500">
            <AlertCircle className="w-3.5 h-3.5" />
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b141a] relative overflow-hidden select-none">
      
      {/* Background WhatsApp Doodle Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#00a884_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      {/* Chat Header */}
      <div className="bg-[#202c33] border-b border-[#2a3942] p-3 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-10 h-10 rounded-full object-cover border border-[#2a3942]"
            />
            {contact.online && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#202c33] absolute bottom-0 right-0"></span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-100 flex items-center gap-2">
              <span>{contact.name}</span>
            </h3>
            <p className="text-[11px] text-gray-400 flex items-center gap-2">
              <span>{contact.phone}</span>
              <span>•</span>
              <span className="text-[#00a884] font-medium">{contact.role || 'WhatsApp Contact'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-gray-300">
          {onSimulateIncomingMessage && (
            <button
              onClick={() => onSimulateIncomingMessage(contact.id)}
              title="Simulate receiving an incoming WhatsApp message from this contact"
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm active:scale-95 animate-pulse"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Receive Message</span>
            </button>
          )}

          {onToggleAutoReply && (
            <button
              onClick={onToggleAutoReply}
              title={autoReplyEnabled ? "Auto-Reply Simulator is ON (Will reply automatically)" : "Auto-Reply Simulator is OFF"}
              className={`text-xs font-semibold px-2 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${
                autoReplyEnabled
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'bg-gray-800 text-gray-400 border-gray-700'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Auto-Reply: {autoReplyEnabled ? 'ON' : 'OFF'}</span>
            </button>
          )}

          {contact.phone && (
            <a
              href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open direct WhatsApp web/app chat with ${contact.name} (${contact.phone})`}
              className="bg-[#00a884]/20 hover:bg-[#00a884]/30 text-[#00a884] border border-[#00a884]/30 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Direct</span>
            </a>
          )}
          <button className="p-2 rounded-full hover:bg-[#2a3942] transition-all" title="Simulate Call">
            <Phone className="w-4 h-4 text-gray-300" />
          </button>
          <button className="p-2 rounded-full hover:bg-[#2a3942] transition-all" title="Simulate Video Call">
            <VideoIcon className="w-4 h-4 text-gray-300" />
          </button>
          <button className="p-2 rounded-full hover:bg-[#2a3942] transition-all" title="Contact Options">
            <MoreVertical className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 z-10">
        
        {/* Encryption Banner */}
        <div className="flex justify-center my-2">
          <div className="bg-[#182229] border border-[#2a3942] rounded-xl px-3 py-1.5 text-center text-[11px] text-amber-300/80 max-w-md shadow-sm">
            🔒 Meta WhatsApp End-to-End Encryption • Vision Tech Webhook Engine Active
          </div>
        </div>

        {messages.map((msg) => {
          const isUser = msg.sender === 'user' || msg.sender === 'crm_bot';

          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md lg:max-w-lg rounded-2xl p-3 shadow-md relative group transition-all ${
                  isUser
                    ? 'bg-[#005c4b] text-gray-100 rounded-tr-none'
                    : 'bg-[#202c33] text-gray-100 rounded-tl-none border border-[#2a3942]'
                }`}
              >
                {/* CRM Bot Badge if triggered via CRM */}
                {msg.sender === 'crm_bot' && (
                  <span className="text-[9px] bg-blue-500/30 text-blue-300 font-bold uppercase px-1.5 py-0.5 rounded mb-1 inline-block">
                    ⚡ CRM Auto-Dispatched
                  </span>
                )}

                {/* Sender Name if contact */}
                {!isUser && msg.senderName && (
                  <span className="text-xs font-bold text-[#00a884] block mb-1">
                    {msg.senderName}
                  </span>
                )}

                {/* Attachment Media Rendering */}
                {msg.attachment && (
                  <div className="mb-2">
                    {msg.attachment.type === 'image' && (
                      <div className="rounded-xl overflow-hidden border border-black/20 bg-black/40">
                        <img
                          src={msg.attachment.url}
                          alt={msg.attachment.fileName}
                          className="max-h-60 w-full object-cover"
                        />
                        <span className="text-[10px] text-gray-300 p-1.5 block">
                          📷 {msg.attachment.fileName} ({msg.attachment.fileSize})
                        </span>
                      </div>
                    )}

                    {msg.attachment.type === 'document' && (
                      <div className="flex items-center gap-3 bg-black/20 p-2.5 rounded-xl border border-white/10">
                        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{msg.attachment.fileName}</p>
                          <span className="text-[10px] text-gray-300">{msg.attachment.fileSize || 'PDF Document'}</span>
                        </div>
                        <a
                          href={msg.attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-200"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    )}

                    {msg.attachment.type === 'video' && (
                      <div className="rounded-xl overflow-hidden border border-black/20 bg-black/40">
                        <video
                          src={msg.attachment.url}
                          controls
                          className="max-h-60 w-full object-cover"
                        />
                        <span className="text-[10px] text-gray-300 p-1.5 block">
                          🎥 {msg.attachment.fileName}
                        </span>
                      </div>
                    )}

                    {msg.attachment.type === 'audio' && (
                      <div className="bg-black/20 p-2 rounded-xl">
                        <audio src={msg.attachment.url} controls className="w-full h-8" />
                        <span className="text-[10px] text-gray-300 mt-1 block">
                          🎙️ Voice Note ({msg.attachment.fileSize})
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Message Body Text */}
                {msg.content && (
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal">
                    {msg.content}
                  </p>
                )}

                {/* Bottom Footer: Timestamp & Ticks & View Info Trigger */}
                <div className="flex items-center justify-end space-x-1.5 mt-1 text-[10px] text-gray-300">
                  <span>{msg.timestamp}</span>

                  {/* Tick rendering */}
                  {renderMessageStatus(msg)}

                  {/* Click to inspect read timestamp info */}
                  {msg.status === 'read' && (
                    <button
                      onClick={() => setActiveInfoMessage(msg)}
                      className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity ml-1"
                      title="View WhatsApp Metadata & Timestamps"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Action button to simulate user opening message if status is not read */}
                {!isUser && onSimulateReadStatus && (
                  <div className="mt-1 text-right">
                    <button
                      onClick={() => onSimulateReadStatus(msg.id)}
                      className="text-[9px] bg-[#00a884]/20 hover:bg-[#00a884]/40 text-[#00a884] px-1.5 py-0.5 rounded font-semibold transition-all"
                    >
                      Trigger Blue Tick Read Receipt
                    </button>
                  </div>
                )}

              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Selected Attachment Preview Box */}
      {selectedAttachment && (
        <div className="bg-[#1f2c34] border-t border-[#2a3942] p-2 px-4 flex items-center justify-between z-20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#00a884]/20 text-[#00a884] rounded-lg">
              <Paperclip className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-100 block truncate">
                Attached: {selectedAttachment.fileName}
              </span>
              <span className="text-[10px] text-gray-400">
                {selectedAttachment.type.toUpperCase()} • {selectedAttachment.fileSize}
              </span>
            </div>
          </div>
          <button
            onClick={() => setSelectedAttachment(null)}
            className="text-rose-400 hover:text-rose-300 text-xs font-semibold px-2 py-1 bg-rose-500/10 rounded-lg"
          >
            Remove
          </button>
        </div>
      )}

      {/* Quick Predefined CRM Messaging Bar */}
      <div className="bg-[#111b21] border-t border-[#222d34] px-3 py-1.5 flex items-center space-x-2 overflow-x-auto no-scrollbar z-20">
        <span className="text-[10px] text-gray-400 font-semibold uppercase flex items-center gap-1 flex-shrink-0">
          <Zap className="w-3 h-3 text-amber-400" /> Quick Actions:
        </span>
        {onSimulateIncomingMessage && (
          <button
            type="button"
            onClick={() => onSimulateIncomingMessage(contact.id)}
            className="text-[10px] bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-bold px-2.5 py-1 rounded-lg border border-emerald-500/50 flex-shrink-0 flex items-center gap-1 transition-all"
          >
            <ArrowDownLeft className="w-3 h-3" /> 📥 Receive Client Reply
          </button>
        )}
        <button
          onClick={() => handleQuickTemplate(`Hello ${contact.name}, this is a gentle reminder regarding payment invoice #VT-9021.`)}
          className="text-[10px] bg-[#202c33] hover:bg-[#2a3942] text-gray-200 px-2.5 py-1 rounded-lg border border-[#2a3942] flex-shrink-0"
        >
          💳 Payment Reminder
        </button>
        <button
          onClick={() => handleQuickTemplate(`Hi ${contact.name}, new task #VT-TASK-402 has been assigned to you. Please check your CRM portal.`)}
          className="text-[10px] bg-[#202c33] hover:bg-[#2a3942] text-gray-200 px-2.5 py-1 rounded-lg border border-[#2a3942] flex-shrink-0"
        >
          📋 Task Assignment
        </button>
        <button
          onClick={() => handleQuickTemplate(`Hello ${contact.name}, please upload the requested verification documents by 5 PM today.`)}
          className="text-[10px] bg-[#202c33] hover:bg-[#2a3942] text-gray-200 px-2.5 py-1 rounded-lg border border-[#2a3942] flex-shrink-0"
        >
          📄 Document Request
        </button>
      </div>

      {/* Message Compose Form */}
      <form onSubmit={handleSend} className="bg-[#202c33] border-t border-[#2a3942] p-3 flex items-center space-x-2 z-20">
        
        {/* + Attachment Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsAttachmentOpen(!isAttachmentOpen)}
            className={`p-2.5 rounded-full transition-all ${
              isAttachmentOpen || selectedAttachment
                ? 'bg-[#00a884] text-white rotate-45'
                : 'text-gray-300 hover:bg-[#2a3942]'
            }`}
            title="Attach Media (Image, Document, Video, Audio)"
          >
            <Plus className="w-5 h-5 transition-transform" />
          </button>

          <AttachmentMenu
            isOpen={isAttachmentOpen}
            onClose={() => setIsAttachmentOpen(false)}
            onSelectAttachment={(att) => setSelectedAttachment(att)}
          />
        </div>

        {/* Text Input */}
        <input
          type="text"
          placeholder="Type a WhatsApp message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-[#2a3942] text-gray-100 placeholder-gray-400 text-xs sm:text-sm rounded-xl px-4 py-2.5 border border-transparent focus:border-[#00a884] focus:outline-none transition-all"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() && !selectedAttachment}
          className="p-2.5 bg-[#00a884] hover:bg-[#008f70] disabled:bg-gray-700 disabled:opacity-50 text-white rounded-full transition-all shadow-md active:scale-95 flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Message Info Modal (Read Timestamp Metadata) */}
      {activeInfoMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#202c33] border border-[#2a3942] rounded-2xl max-w-md w-full p-5 text-gray-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2a3942] pb-3 mb-4">
              <h3 className="text-sm font-bold flex items-center gap-2 text-[#00a884]">
                <CheckCheck className="w-5 h-5 text-[#53bdeb]" />
                <span>WhatsApp Message Read Metadata</span>
              </h3>
              <button
                onClick={() => setActiveInfoMessage(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#111b21] p-3 rounded-xl border border-[#2a3942]">
                <span className="text-gray-400 block mb-1">Message Content</span>
                <p className="font-semibold text-gray-200">{activeInfoMessage.content}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center bg-[#111b21] p-2.5 rounded-lg">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    ⏱️ Sent Time:
                  </span>
                  <span className="font-mono text-gray-200">{activeInfoMessage.sentAt || activeInfoMessage.timestamp}</span>
                </div>

                <div className="flex justify-between items-center bg-[#111b21] p-2.5 rounded-lg">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    ✓✓ Delivered Time:
                  </span>
                  <span className="font-mono text-gray-200">{activeInfoMessage.deliveredAt || activeInfoMessage.timestamp}</span>
                </div>

                <div className="flex justify-between items-center bg-[#111b21] p-2.5 rounded-lg border border-[#53bdeb]/30">
                  <span className="text-[#53bdeb] font-semibold flex items-center gap-1.5">
                    <CheckCheck className="w-4 h-4" /> Blue Tick Viewed Time:
                  </span>
                  <span className="font-mono font-bold text-[#53bdeb]">
                    {activeInfoMessage.viewedAt || 'Just now'}
                  </span>
                </div>
              </div>

              <div className="bg-[#111b21] p-2.5 rounded-xl border border-[#2a3942]">
                <span className="text-gray-400 block mb-1 text-[10px]">Meta WhatsApp Message ID</span>
                <code className="text-[10px] text-gray-300 font-mono break-all block">
                  {activeInfoMessage.metaMessageId || 'wamid.HBgL19876543210VR5920'}
                </code>
              </div>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setActiveInfoMessage(null)}
                className="bg-[#00a884] text-white px-4 py-1.5 rounded-xl font-semibold text-xs"
              >
                Close Metadata
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
