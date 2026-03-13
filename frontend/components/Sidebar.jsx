'use client';

import React from 'react';
import { format } from 'date-fns';
import { 
    Search, 
    MoreVertical, 
    Settings, 
    Plus,
    CheckCheck,
    Users,
    Activity,
    MessageSquare
} from 'lucide-react';

const Sidebar = ({ contacts, activeContact, onSelectContact }) => {
    return (
        <div className="w-[420px] h-full bg-[#111113] border-r border-white/5 flex flex-col overflow-hidden">
            {/* Brand Header */}
            <div className="px-8 pt-10 pb-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl abelops-gradient flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                            <Activity className="text-white" size={24} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold text-white tracking-tight leading-none mb-1">Abelops Bot</h1>
                            <div className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">System Online</span>
                            </div>
                        </div>
                    </div>
                    <button className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-white">
                        <Plus size={22} />
                    </button>
                </div>
            </div>

            {/* Search Section */}
            <div className="px-6 mb-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Jump to contact..." 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-light"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-2 px-6 mb-6 overflow-x-auto no-scrollbar">
                {['Recent', 'Active', 'Unread', 'Archived'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                            tab === 'Recent' 
                                ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20' 
                                : 'text-zinc-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto px-4 space-y-2 mb-4">
                {contacts.map((contact) => (
                    <div
                        key={contact.phone_number}
                        onClick={() => onSelectContact(contact)}
                        className={`p-4 rounded-3xl flex items-center cursor-pointer transition-all duration-300 relative group ${
                            activeContact?.phone_number === contact.phone_number
                                ? 'bg-white/10 ring-1 ring-white/10 shadow-2xl'
                                : 'hover:bg-white/[0.03]'
                        }`}
                    >
                        <div className="relative">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner overflow-hidden border-2 transition-all duration-300 ${
                                activeContact?.phone_number === contact.phone_number
                                    ? 'bg-blue-600 border-blue-500 scale-105'
                                    : 'bg-zinc-800 border-white/5'
                            }`}>
                                {contact.avatar ? (
                                    <img src={contact.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <Users size={24} className={activeContact?.phone_number === contact.phone_number ? 'text-white' : 'text-zinc-500'} />
                                )}
                            </div>
                            {contact.unread_count > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white rounded-lg flex items-center justify-center text-[10px] font-bold border-2 border-black animate-bounce">
                                    {contact.unread_count}
                                </div>
                            )}
                        </div>

                        <div className="ml-4 flex-1 overflow-hidden">
                            <div className="flex justify-between items-center mb-1">
                                <span className={`font-semibold text-base truncate transition-colors ${
                                    activeContact?.phone_number === contact.phone_number ? 'text-white' : 'text-zinc-200 group-hover:text-blue-400'
                                }`}>
                                    {(contact.name && contact.name !== 'Unknown') ? contact.name : `+${contact.phone_number}`}
                                </span>

                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-2">
                                    {contact.last_message_time ? format(new Date(contact.last_message_time), 'HH:mm') : ''}
                                </span>
                            </div>
                            <div className="flex items-center text-[13px] text-zinc-500 truncate font-light">
                                {!contact.unread_count && (
                                    <CheckCheck size={14} className="mr-1 text-blue-500/50" />
                                )}
                                <span className="truncate">{contact.last_message || 'No engagement yet'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Profile Footer */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center p-0.5 border border-white/5 overflow-hidden flex-shrink-0">
                             <Users size={20} className="text-zinc-500" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white leading-tight truncate">
                                {typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('user') || '{}').name || 'Operator') : 'Operator'}
                            </p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-tighter truncate">
                                {typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('user') || '{}').role || 'System') : 'System'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        {typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || '{}').role === 'ADMIN' && (
                            <button 
                                onClick={() => window.location.href = '/admin'}
                                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-white"
                                title="Admin Settings"
                            >
                                <Settings size={20} />
                            </button>
                        )}
                        <button 
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                window.location.href = '/login';
                            }}
                            className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-zinc-500 hover:text-red-500"
                            title="Logout"
                        >
                            <Activity size={20} className="rotate-90" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Sidebar;
