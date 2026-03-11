'use client';

import React from 'react';
import { format } from 'date-fns';
import { 
    Search, 
    MoreVertical, 
    MessageSquare, 
    CircleDashed, 
    Users, 
    Archive, 
    Settings, 
    Filter,
    Plus,
    CheckCheck
} from 'lucide-react';

const Sidebar = ({ contacts, activeContact, onSelectContact }) => {
    return (
        <div className="flex h-full border-r border-gray-700/30">
            {/* Leftmost Icon Rail */}
            <div className="w-[60px] bg-[#202c33] flex flex-col items-center py-4 space-y-6 text-[#8696a0]">
                <div className="p-2 hover:bg-[#374248] rounded-full cursor-pointer transition-colors relative">
                    <MessageSquare size={24} className="text-[#d1d7db]" />
                    <div className="absolute top-1 right-1 w-4 h-4 bg-[#00a884] rounded-full text-[10px] flex items-center justify-center text-[#111b21] font-bold">34</div>
                </div>
                <CircleDashed size={24} className="cursor-pointer hover:text-[#d1d7db]" />
                <Users size={24} className="cursor-pointer hover:text-[#d1d7db]" />
                <div className="flex-1"></div>
                <Settings size={24} className="cursor-pointer hover:text-[#d1d7db]" />
                <div className="w-8 h-8 rounded-full bg-[#374248] shadow-inner mb-2 overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=00a884&color=fff" alt="profile" />
                </div>
            </div>

            {/* Chats Column */}
            <div className="w-[400px] bg-[#111b21] flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[#e9edef]">WhatsApp</h1>
                    <div className="flex items-center space-x-4 text-[#8696a0]">
                        <Plus size={20} className="cursor-pointer hover:text-[#d1d7db]" />
                        <MoreVertical size={20} className="cursor-pointer hover:text-[#d1d7db]" />
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="px-3 pb-3">
                    <div className="bg-[#202c33] rounded-lg flex items-center px-3 py-1.5 mb-3 ring-1 ring-offset-0 ring-transparent focus-within:ring-[#00a884]">
                        <Search size={18} className="text-[#8696a0] mr-4" />
                        <input 
                            type="text" 
                            placeholder="Search or start a new chat" 
                            className="bg-transparent border-none text-sm w-full outline-none text-[#d1d7db] placeholder-[#8696a0]"
                        />
                    </div>
                    
                    <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
                        {['All', 'Unread', 'Favorites', 'Groups'].map((filter) => (
                            <button
                                key={filter}
                                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                                    filter === 'All' 
                                        ? 'bg-[#00a884]/20 text-[#00a884]' 
                                        : 'bg-[#202c33] text-[#8696a0] hover:bg-[#374248]'
                                }`}
                            >
                                {filter === 'Unread' ? `Unread 34` : filter}
                            </button>
                        ))}
                        <button className="p-1 text-[#8696a0] hover:text-[#d1d7db]">
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                {/* List Body */}
                <div className="flex-1 overflow-y-auto mt-2">
                    {/* Fixed Rows */}
                    <div className="px-4 py-3 flex items-center space-x-4 hover:bg-[#202c33] cursor-pointer transition-colors border-b border-gray-800/20">
                        <Archive size={20} className="text-[#00a884] ml-2" />
                        <span className="text-[#e9edef] text-sm font-medium">Archived</span>
                    </div>

                    {/* Contacts List */}
                    {contacts.map((contact) => (
                        <div
                            key={contact.phone_number}
                            onClick={() => onSelectContact(contact)}
                            className={`px-4 py-3 flex items-center cursor-pointer transition-colors relative ${
                                activeContact?.phone_number === contact.phone_number
                                    ? 'bg-[#2a3942]'
                                    : 'hover:bg-[#202c33]'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-[#6a7175] flex items-center justify-center font-bold text-lg text-white/50 flex-shrink-0 overflow-hidden">
                                {contact.avatar ? (
                                    <img src={contact.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <Users size={24} />
                                )}
                            </div>
                            <div className="ml-4 flex-1 border-b border-gray-800/30 pb-3 mt-1 overflow-hidden">
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className="text-[#e9edef] font-medium truncate">
                                        {contact.name || contact.phone_number}
                                    </span>
                                    <span className={`text-[11px] ${contact.unread_count > 0 ? 'text-[#00a884] font-bold' : 'text-[#8696a0]'}`}>
                                        {contact.last_message_time ? format(new Date(contact.last_message_time), 'HH:mm') : ''}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center text-[#8696a0] text-sm truncate w-full">
                                        {!contact.unread_count && <CheckCheck size={16} className="text-[#53bdeb] mr-1 flex-shrink-0" />}
                                        <span className="truncate">{contact.last_message || 'No messages yet'}</span>
                                    </div>
                                    {contact.unread_count > 0 && (
                                        <div className="ml-2 bg-[#00a884] text-[#111b21] text-[10px] min-w-[18px] h-[18px] px-1.5 flex items-center justify-center rounded-full font-black">
                                            {contact.unread_count}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Footer Link */}
                <div className="p-3 text-center border-t border-gray-800/10">
                    <div className="flex items-center justify-center space-x-2 text-[#00a884] text-xs font-bold hover:underline cursor-pointer">
                        <div className="bg-[#00a884] rounded-full p-0.5">
                            <Plus size={10} className="text-[#111b21]" />
                        </div>
                        <span>Get WhatsApp for Windows</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
