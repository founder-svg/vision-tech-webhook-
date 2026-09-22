'use client';

import React, { useState } from 'react';
import { CustomReminder, Contact, ReminderMode, ReminderFrequency } from '@/types';
import {
  Bell,
  Clock,
  Zap,
  Plus,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Send,
  Trash2,
  Pause,
  Play,
  User,
  Phone,
  FileText,
  Sparkles,
  X,
  Sliders,
  Check
} from 'lucide-react';

interface ReminderManagerProps {
  reminders: CustomReminder[];
  contacts: Contact[];
  onCreateReminder: (reminder: Omit<CustomReminder, 'id' | 'createdAt' | 'status'>) => void;
  onDispatchReminder: (reminderId: string) => void;
  onTogglePauseReminder: (reminderId: string) => void;
  onDeleteReminder: (reminderId: string) => void;
}

export const ReminderManager: React.FC<ReminderManagerProps> = ({
  reminders,
  contacts,
  onCreateReminder,
  onDispatchReminder,
  onTogglePauseReminder,
  onDeleteReminder,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'automated' | 'manual'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dispatchedSuccessId, setDispatchedSuccessId] = useState<string | null>(null);

  // Modal Form State
  const [title, setTitle] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string>(contacts[0]?.id || '');
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<ReminderMode>('automated');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [frequency, setFrequency] = useState<ReminderFrequency>('once');

  // Filtered Reminders
  const filteredReminders = reminders.filter((r) => {
    if (activeFilter === 'automated') return r.mode === 'automated';
    if (activeFilter === 'manual') return r.mode === 'manual';
    return true;
  });

  const totalAutomated = reminders.filter((r) => r.mode === 'automated').length;
  const totalManual = reminders.filter((r) => r.mode === 'manual').length;
  const totalDispatched = reminders.filter((r) => r.status === 'dispatched').length;

  const handleSelectTemplate = (templateMsg: string) => {
    setMessage(templateMsg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    let targetName = customName;
    let targetPhone = customPhone;
    let targetContactId = undefined;

    if (selectedContactId !== 'custom') {
      const contactObj = contacts.find((c) => c.id === selectedContactId);
      if (contactObj) {
        targetName = contactObj.name;
        targetPhone = contactObj.phone;
        targetContactId = contactObj.id;
      }
    }

    onCreateReminder({
      title: title.trim(),
      contactId: targetContactId,
      contactName: targetName || 'Client',
      contactPhone: targetPhone || '+91 98000 00000',
      message: message.trim(),
      mode,
      scheduledDate: mode === 'automated' ? scheduledDate : undefined,
      scheduledTime: mode === 'automated' ? scheduledTime : undefined,
      frequency: mode === 'automated' ? frequency : undefined,
    });

    // Reset Form
    setTitle('');
    setMessage('');
    setIsModalOpen(false);
  };

  const handleTriggerDispatch = (id: string) => {
    onDispatchReminder(id);
    setDispatchedSuccessId(id);
    setTimeout(() => setDispatchedSuccessId(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-gray-100 select-none">
      
      {/* Top Banner */}
      <div className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="h-12 px-3 py-1 bg-white rounded-2xl flex items-center justify-center border border-white/20 shadow-md">
            <img src="./vision-tech-logo.png" alt="Vision Tech" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Custom Reminders & Scheduled Automation</span>
              <span className="text-xs bg-rose-500/20 text-rose-300 font-semibold px-2.5 py-0.5 rounded-full border border-rose-500/30">
                Meta Cloud API v20.0
              </span>
            </h2>
            <p className="text-xs text-gray-400">Configure automated date/time triggers or dispatch manual one-click reminders</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Custom Reminder</span>
        </button>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1f2c34] border border-[#2a3942] rounded-2xl p-4 flex items-center space-x-3">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-medium uppercase">Total Reminders</span>
            <span className="text-xl font-bold text-white">{reminders.length}</span>
          </div>
        </div>

        <div className="bg-[#1f2c34] border border-[#2a3942] rounded-2xl p-4 flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-medium uppercase">⚡ Scheduled Automations</span>
            <span className="text-xl font-bold text-amber-400">{totalAutomated}</span>
          </div>
        </div>

        <div className="bg-[#1f2c34] border border-[#2a3942] rounded-2xl p-4 flex items-center space-x-3">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-medium uppercase">🖐️ Manual Quick Action</span>
            <span className="text-xl font-bold text-purple-400">{totalManual}</span>
          </div>
        </div>

        <div className="bg-[#1f2c34] border border-[#2a3942] rounded-2xl p-4 flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-medium uppercase">Dispatched Alerts</span>
            <span className="text-xl font-bold text-emerald-400">{totalDispatched}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Content */}
      <div className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#2a3942] pb-4">
          <div className="flex items-center space-x-2 bg-[#111b21] p-1.5 rounded-2xl border border-[#2a3942]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#00a884] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Reminders ({reminders.length})
            </button>
            <button
              onClick={() => setActiveFilter('automated')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeFilter === 'automated'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>⚡ Automated ({totalAutomated})</span>
            </button>
            <button
              onClick={() => setActiveFilter('manual')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeFilter === 'manual'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>🖐️ Manual ({totalManual})</span>
            </button>
          </div>

          <p className="text-xs text-gray-400 hidden md:block">
            Automated scheduled reminders fire automatically via Meta Webhook API when scheduled date/time arrives.
          </p>
        </div>

        {/* Reminders List Grid */}
        {filteredReminders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <Bell className="w-12 h-12 text-gray-600 mx-auto" />
            <p className="text-sm font-semibold">No reminders found under this filter.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs bg-[#00a884] text-white font-semibold px-4 py-2 rounded-xl"
            >
              + Create First Reminder
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReminders.map((reminder) => {
              const isAutomated = reminder.mode === 'automated';
              const isDispatched = reminder.status === 'dispatched';
              const isPaused = reminder.status === 'paused';

              return (
                <div
                  key={reminder.id}
                  className={`bg-[#111b21] border rounded-2xl p-5 shadow-lg relative flex flex-col justify-between transition-all ${
                    isDispatched
                      ? 'border-emerald-500/40 bg-gradient-to-b from-[#111b21] to-emerald-950/20'
                      : isAutomated
                      ? 'border-amber-500/30'
                      : 'border-[#2a3942]'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {isAutomated ? (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            <span>⚡ AUTOMATED</span>
                          </span>
                        ) : (
                          <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2.5 py-1 rounded-lg border border-purple-500/30 flex items-center gap-1">
                            <Sliders className="w-3 h-3" />
                            <span>🖐️ MANUAL ACTION</span>
                          </span>
                        )}

                        {isDispatched ? (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>DISPATCHED</span>
                          </span>
                        ) : isPaused ? (
                          <span className="text-[10px] bg-gray-500/20 text-gray-400 font-bold px-2.5 py-1 rounded-lg border border-gray-500/30">
                            PAUSED
                          </span>
                        ) : (
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-2.5 py-1 rounded-lg border border-blue-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                            ACTIVE SCHEDULED
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onDeleteReminder(reminder.id)}
                        className="text-gray-500 hover:text-rose-400 p-1 transition-all"
                        title="Delete Reminder"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Title & Contact */}
                    <div>
                      <h3 className="text-base font-bold text-white">{reminder.title}</h3>
                      <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{reminder.contactName}</span>
                        <span className="text-gray-400 font-mono text-[11px]">({reminder.contactPhone})</span>
                      </p>
                    </div>

                    {/* Date / Time Schedule if Automated */}
                    {isAutomated && (
                      <div className="bg-[#1f2c34] border border-[#2a3942] rounded-xl p-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2 text-amber-300">
                          <Calendar className="w-4 h-4 text-amber-400" />
                          <span className="font-semibold">
                            {reminder.scheduledDate} at {reminder.scheduledTime}
                          </span>
                        </div>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded uppercase font-bold">
                          {reminder.frequency || 'once'}
                        </span>
                      </div>
                    )}

                    {/* Message Box */}
                    <div className="bg-[#1f2c34]/60 border border-[#2a3942] rounded-xl p-3 text-xs text-gray-300 leading-relaxed font-mono">
                      "{reminder.message}"
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-[#2a3942] flex items-center justify-between gap-2">
                    <span className="text-[10px] text-gray-400">
                      Created: {reminder.createdAt}
                    </span>

                    <div className="flex items-center space-x-2">
                      {isAutomated && !isDispatched && (
                        <button
                          onClick={() => onTogglePauseReminder(reminder.id)}
                          className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                            isPaused
                              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                          }`}
                          title={isPaused ? 'Resume Automation' : 'Pause Automation'}
                        >
                          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      <button
                        onClick={() => handleTriggerDispatch(reminder.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                          dispatchedSuccessId === reminder.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-[#00a884] hover:bg-[#008f70] text-white shadow-[#00a884]/20'
                        }`}
                      >
                        {dispatchedSuccessId === reminder.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Triggered!</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>⚡ Trigger Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE REMINDER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl p-6 w-full max-w-xl shadow-2xl space-y-5 text-gray-100 select-none">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2a3942] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-[#00a884]/20 text-[#00a884] rounded-2xl">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Create Custom Reminder</h3>
                  <p className="text-xs text-gray-400">Schedule automated date/time triggers or set manual follow-up reminders</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-[#2a3942] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Reminder Title */}
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Reminder Title / Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Invoice Payment Reminder #VT-9021"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#111b21] border border-[#2a3942] text-white text-xs rounded-xl px-4 py-3 focus:border-[#00a884] focus:outline-none"
                />
              </div>

              {/* Recipient Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Select Contact Recipient</label>
                  <select
                    value={selectedContactId}
                    onChange={(e) => setSelectedContactId(e.target.value)}
                    className="w-full bg-[#111b21] border border-[#2a3942] text-white text-xs rounded-xl px-3 py-3 focus:border-[#00a884] focus:outline-none"
                  >
                    {contacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                    <option value="custom">+ Custom Name & Phone</option>
                  </select>
                </div>

                {selectedContactId === 'custom' && (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Custom Recipient Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Vikram Malhotra"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full bg-[#111b21] border border-[#2a3942] text-white text-xs rounded-xl px-4 py-3 focus:border-[#00a884] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Custom WhatsApp Phone</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., +91 98123 45678"
                        value={customPhone}
                        onChange={(e) => setCustomPhone(e.target.value)}
                        className="w-full bg-[#111b21] border border-[#2a3942] text-white text-xs rounded-xl px-4 py-3 focus:border-[#00a884] focus:outline-none font-mono"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Mode Switcher */}
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">Reminder Mode & Execution</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('automated')}
                    className={`p-3 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                      mode === 'automated'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                        : 'bg-[#111b21] border-[#2a3942] text-gray-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-5 h-5 mt-0.5 text-amber-400 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold block text-white">⚡ Automated Scheduled</span>
                      <span className="text-[10px] text-gray-400">Triggers automatically at specific Date & Time</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('manual')}
                    className={`p-3 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                      mode === 'manual'
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-md'
                        : 'bg-[#111b21] border-[#2a3942] text-gray-400 hover:text-white'
                    }`}
                  >
                    <Sliders className="w-5 h-5 mt-0.5 text-purple-400 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold block text-white">🖐️ Manual Quick Action</span>
                      <span className="text-[10px] text-gray-400">Saved for one-click manual dispatch</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Date & Time Selection (If Automated) */}
              {mode === 'automated' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#111b21] p-4 rounded-2xl border border-[#2a3942]">
                  <div>
                    <label className="text-[11px] font-semibold text-amber-300 block mb-1">Scheduled Date</label>
                    <input
                      type="date"
                      required
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full bg-[#1f2c34] border border-[#2a3942] text-white text-xs rounded-xl px-3 py-2 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-amber-300 block mb-1">Scheduled Time</label>
                    <input
                      type="time"
                      required
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full bg-[#1f2c34] border border-[#2a3942] text-white text-xs rounded-xl px-3 py-2 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-amber-300 block mb-1">Frequency</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as ReminderFrequency)}
                      className="w-full bg-[#1f2c34] border border-[#2a3942] text-white text-xs rounded-xl px-3 py-2 focus:border-amber-500 focus:outline-none capitalize"
                    >
                      <option value="once">Once (One-time)</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Message Body & Quick Templates */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-300">WhatsApp Message Body</label>
                  <span className="text-[10px] text-gray-400">Quick Templates:</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate('Hello! Gentle reminder regarding Invoice payment processing. Please let us know if you need invoice copy.')}
                    className="text-[10px] bg-[#2a3942] hover:bg-[#32444f] text-gray-300 px-2.5 py-1 rounded-lg border border-gray-600/30"
                  >
                    💳 Payment Reminder
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate('Hi, kindly confirm project milestone status & review submission for Vision Tech task.')}
                    className="text-[10px] bg-[#2a3942] hover:bg-[#32444f] text-gray-300 px-2.5 py-1 rounded-lg border border-gray-600/30"
                  >
                    📌 Milestone Follow-up
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate('Vision Tech Contract Renewal Alert: Your service plan contract is scheduled for review next week.')}
                    className="text-[10px] bg-[#2a3942] hover:bg-[#32444f] text-gray-300 px-2.5 py-1 rounded-lg border border-gray-600/30"
                  >
                    📄 Contract Renewal
                  </button>
                </div>

                <textarea
                  required
                  rows={3}
                  placeholder="Type the WhatsApp reminder message to send to the recipient..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#111b21] border border-[#2a3942] text-white text-xs rounded-xl p-3 focus:border-[#00a884] focus:outline-none font-mono"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#2a3942]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-[#2a3942]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00a884] hover:bg-[#008f70] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-[#00a884]/20 flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create & Activate Reminder</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
