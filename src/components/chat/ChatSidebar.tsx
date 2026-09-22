'use client';

import React, { useState } from 'react';
import { Contact, ContactType } from '@/types';
import { Search, UserCheck, Briefcase, Bell, CheckSquare, Users, UserPlus, Plus, Phone, Check, RotateCcw } from 'lucide-react';

interface ChatSidebarProps {
  contacts: Contact[];
  activeContactId: string;
  onSelectContact: (contactId: string) => void;
  onOpenReminderManager?: () => void;
  onAddContact?: (name: string, phone: string, type: ContactType, role?: string) => void;
  onResetChats?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  contacts,
  activeContactId,
  onSelectContact,
  onOpenReminderManager,
  onAddContact,
  onResetChats
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ContactType | 'all'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newType, setNewType] = useState<ContactType>('client');
  const [newRole, setNewRole] = useState('My Personal Phone');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone.trim()) return;

    const formattedName = newName.trim() || `Contact (${newPhone.trim()})`;
    if (onAddContact) {
      onAddContact(formattedName, newPhone.trim(), newType, newRole);
    }

    setNewName('');
    setNewPhone('');
    setFilterType('all');
    setSearchTerm('');
    setIsAddOpen(false);
  };

  const filteredContacts = (contacts || []).filter((c) => {
    if (!c) return false;
    const nameStr = (c.name || '').toLowerCase();
    const phoneStr = c.phone || '';
    const cleanPhoneDigits = phoneStr.replace(/[^0-9]/g, '');
    const cleanSearchDigits = searchTerm.replace(/[^0-9]/g, '');

    const matchesSearch =
      !searchTerm.trim() ||
      nameStr.includes(searchTerm.toLowerCase()) ||
      phoneStr.includes(searchTerm) ||
      (cleanSearchDigits.length >= 3 && cleanPhoneDigits.includes(cleanSearchDigits));

    const matchesType = filterType === 'all' || c.type === filterType;
    return matchesSearch && matchesType;
  });

  const getCategoryBadge = (type: ContactType) => {
    switch (type) {
      case 'client':
        return <span className="text-[10px] bg-blue-500/20 text-blue-400 font-semibold px-2 py-0.5 rounded">Client</span>;
      case 'employee':
        return <span className="text-[10px] bg-purple-500/20 text-purple-400 font-semibold px-2 py-0.5 rounded">Employee</span>;
      case 'task':
        return <span className="text-[10px] bg-amber-500/20 text-amber-400 font-semibold px-2 py-0.5 rounded">Task</span>;
      case 'reminder':
        return <span className="text-[10px] bg-rose-500/20 text-rose-400 font-semibold px-2 py-0.5 rounded">Reminder</span>;
    }
  };

  return (
    <div className="w-full md:w-80 lg:w-96 bg-[#111b21] border-r border-[#222d34] flex flex-col h-full select-none">
      
      {/* Sidebar Header & Actions */}
      <div className="p-3 border-b border-[#222d34] bg-[#111b21] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00a884]" />
            <span>Conversations</span>
          </h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsAddOpen(true)}
              className="text-[11px] bg-[#00a884]/20 hover:bg-[#00a884]/30 text-[#00a884] border border-[#00a884]/30 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
              title="Add Custom Phone Number / Contact to send WhatsApp messages"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ New Number</span>
            </button>
            {onResetChats && (
              <button
                onClick={onResetChats}
                className="text-[11px] bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-semibold px-2 py-1 rounded-lg flex items-center gap-1 transition-all"
                title="Reset all chat history and start fresh"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Chat</span>
              </button>
            )}
            {onOpenReminderManager && (
              <button
                onClick={onOpenReminderManager}
                className="text-[11px] bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                title="Manage Custom Reminders"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>+ Reminders</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#202c33] text-gray-200 text-xs rounded-xl pl-9 pr-4 py-2 border border-transparent focus:border-[#00a884] focus:outline-none placeholder-gray-400 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
              filterType === 'all'
                ? 'bg-[#00a884] text-white'
                : 'bg-[#202c33] text-gray-400 hover:text-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('client')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
              filterType === 'client'
                ? 'bg-blue-600 text-white'
                : 'bg-[#202c33] text-gray-400 hover:text-gray-200'
            }`}
          >
            Clients
          </button>
          <button
            onClick={() => setFilterType('employee')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
              filterType === 'employee'
                ? 'bg-purple-600 text-white'
                : 'bg-[#202c33] text-gray-400 hover:text-gray-200'
            }`}
          >
            Employees
          </button>
          <button
            onClick={() => setFilterType('task')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
              filterType === 'task'
                ? 'bg-amber-600 text-white'
                : 'bg-[#202c33] text-gray-400 hover:text-gray-200'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setFilterType('reminder')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
              filterType === 'reminder'
                ? 'bg-rose-600 text-white'
                : 'bg-[#202c33] text-gray-400 hover:text-gray-200'
            }`}
          >
            Reminders
          </button>
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#182229]">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs">
            No contacts match the filter criteria.
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const isActive = contact.id === activeContactId;

            return (
              <div
                key={contact.id}
                onClick={() => onSelectContact(contact.id)}
                className={`flex items-center p-3 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#2a3942] border-l-4 border-[#00a884]'
                    : 'hover:bg-[#202c33]'
                }`}
              >
                {/* Avatar & Online Dot */}
                <div className="relative mr-3 flex-shrink-0">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#2a3942]"
                  />
                  {contact.online && (
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#111b21] absolute bottom-0 right-0"></span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-sm font-semibold text-gray-100 truncate">
                      {contact.name}
                    </h3>
                    <span className="text-[10px] text-gray-400">
                      {contact.lastMessageTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 truncate pr-2">
                      {contact.lastMessage}
                    </p>
                    {contact.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#00a884] text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-1.5">
                    {getCategoryBadge(contact.type)}
                    <span className="text-[10px] text-gray-500 truncate">
                      {contact.phone}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD CUSTOM PHONE NUMBER / CONTACT MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1f2c34] border border-[#2a3942] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#2a3942] pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#00a884]" />
                <h3 className="font-bold text-white text-base">Add Contact / Custom Phone Number</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Target Phone Number (With Country Code)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210 or +1 555 123 4567"
                    className="w-full bg-[#111b21] text-emerald-300 font-mono text-xs rounded-xl pl-9 pr-3 py-2.5 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  You can enter your own personal phone number to send WhatsApp test messages to yourself!
                </span>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Contact Name / Label</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. My Personal WhatsApp"
                  className="w-full bg-[#111b21] text-white text-xs rounded-xl px-3 py-2.5 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Category Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ContactType)}
                    className="w-full bg-[#111b21] text-white text-xs rounded-xl px-3 py-2 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
                  >
                    <option value="client">Client</option>
                    <option value="employee">Employee</option>
                    <option value="task">Task</option>
                    <option value="reminder">Reminder Bot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Role / Description</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Personal Phone Test"
                    className="w-full bg-[#111b21] text-white text-xs rounded-xl px-3 py-2 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2a3942]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-2 text-gray-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00a884] hover:bg-[#029071] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Add & Start Chat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
