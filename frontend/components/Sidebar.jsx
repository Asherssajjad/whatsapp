'use client';

import React from 'react';
import { format } from 'date-fns';
import { Search, MoreVertical, MessageSquare } from 'lucide-react';

const Sidebar = ({ contacts, activeContact, onSelectContact }) => {
    return (
        <div className="w-[380px] h-full border-r border-[#334155] bg-[#0f172a] flex flex-col shadow-2xl z-20">
            {/* Header */}
            <div className="p-6 border-b border-[#1e293b] flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
                        <MessageSquare className="mr-2 text-blue-500" />
                        Messages
                    </h1>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <MoreVertical size={20} />
                    </button>
                </div>
                
                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search chats..." 
                        className="w-full bg-[#1e293b] border-none rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none ring-1 ring-[#334155] focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                    />
                </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1 scrollbar-hide">
                {contacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-40">
                        <MessageSquare size={48} className="mb-2" />
                        <p className="text-sm">No messages yet</p>
                    </div>
                ) : (
                    contacts.map((contact) => (
                        <div
                            key={contact.phone_number}
                            onClick={() => onSelectContact(contact)}
                            className={`p-4 mx-2 rounded-2xl flex items-center cursor-pointer transition-all duration-300 group ${
                                activeContact?.phone_number === contact.phone_number
                                    ? 'bg-blue-600 shadow-lg shadow-blue-500/20'
                                    : 'hover:bg-[#1e293b]'
                            }`}
                        >
                            {/* Avatar */}
                            <div className={`relative w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-lg shadow-sm overflow-hidden transition-transform duration-300 group-hover:scale-105 ${
                                activeContact?.phone_number === contact.phone_number
                                    ? 'bg-white/20 text-white'
                                    : 'bg-blue-500/10 text-blue-400'
                            }`}>
                                {contact.avatar ? (
                                    <img src={contact.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    contact.name ? contact.name[0] : 'U'
                                )}
                                {/* Online Status Indicator */}
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0f172a] rounded-full"></div>
                            </div>

                            {/* Info */}
                            <div className="ml-4 flex-1 overflow-hidden">
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`font-semibold block truncate ${
                                        activeContact?.phone_number === contact.phone_number ? 'text-white' : 'text-gray-100'
                                    }`}>
                                        {contact.name || contact.phone_number}
                                    </span>
                                    <span className={`text-[10px] uppercase tracking-wider ${
                                        activeContact?.phone_number === contact.phone_number ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                        {contact.last_message_time ? format(new Date(contact.last_message_time), 'HH:mm') : ''}
                                    </span>
                                </div>
                                <p className={`text-xs truncate ${
                                    activeContact?.phone_number === contact.phone_number ? 'text-blue-50' : 'text-gray-400 font-light'
                                }`}>
                                    {contact.last_message || 'Start a conversation'}
                                </p>
                            </div>

                            {/* Unread Count */}
                            {contact.unread_count > 0 && activeContact?.phone_number !== contact.phone_number && (
                                <div className="ml-2 bg-blue-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-lg font-bold shadow-lg animate-pulse">
                                    {contact.unread_count}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* User Profile / Settings Footer */}
            <div className="p-4 bg-[#1e293b]/30 border-t border-[#1e293b]">
                <div className="flex items-center p-2 rounded-xl hover:bg-[#1e293b] transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        A
                    </div>
                    <div className="ml-3">
                        <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">Admin Panel</p>
                        <p className="text-[10px] text-gray-500 font-medium">System Operator</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
