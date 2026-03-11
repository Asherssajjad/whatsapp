'use client';

import React from 'react';
import { format } from 'date-fns';
import { 
    Search, 
    MoreVertical, 
    MessageSquare, 
    Settings, 
    Plus,
    CheckCheck,
    Users
} from 'lucide-react';

const Sidebar = ({ contacts, activeContact, onSelectContact }) => {
    return (
        <div className="flex h-full border-r border-gray-700/20">
            {/* Leftmost Icon Rail */}
            <div className="w-[64px] bg-[#202c33] flex flex-col items-center py-4 space-y-6 text-[#8696a0]">
                <div className="p-2 hover:bg-[#374248] rounded-full cursor-pointer transition-colors relative group">
                    <MessageSquare size={24} className="text-[#d1d7db]" />
                    <div className="absolute top-1 right-1 w-4 h-4 bg-[#00a884] rounded-full text-[10px] flex items-center justify-center text-[#111b21] font-bold border-2 border-[#202c33]">34</div>
                </div>
                
                <div className="flex-1"></div>
                
                <Settings size={22} className="cursor-pointer hover:text-[#d1d7db] mb-2" />
                <div className="w-10 h-10 rounded-full bg-[#374248] shadow-inner mb-4 overflow-hidden border border-gray-700/30">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=00a884&color=fff&size=64" alt="profile" />
                </div>
            </div>

            {/* Chats Column */}
            <div className="w-[410px] bg-[#111b21] flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="px-[16px] pt-[20px] pb-[12px] flex items-center justify-between">
                    <h1 className="text-[22px] font-bold text-[#e9edef] tracking-tight">Chats</h1>
                    <div className="flex items-center space-x-[24px] text-[#8696a0]">
                        <Plus size={20} className="cursor-pointer hover:text-[#d1d7db]" />
                        <MoreVertical size={20} className="cursor-pointer hover:text-[#d1d7db]" />
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="px-[12px] pb-[12px]">
                    <div className="bg-[#202c33] rounded-[8px] flex items-center px-[12px] py-[6px] mb-[12px]">
                        <Search size={16} className="text-[#8696a0] mr-4 ml-1" />
                        <input 
                            type="text" 
                            placeholder="Search or start a new chat" 
                            className="bg-transparent border-none text-[15px] w-full outline-none text-[#d1d7db] placeholder-[#8696a0] font-light"
                        />
                    </div>
                    
                    <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
                        {['All', 'Unread', 'Favorites', 'Groups'].map((filter) => (
                            <button
                                key={filter}
                                className={`px-[12px] py-[4px] rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                                    filter === 'All' 
                                        ? 'bg-[#00a884]/20 text-[#00a884]' 
                                        : 'bg-[#202c33] text-[#8696a0] hover:bg-[#374248]'
                                }`}
                            >
                                {filter === 'Unread' ? `Unread 34` : filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List Body */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {/* Contacts List */}
                    {contacts.map((contact) => (
                        <div
                            key={contact.phone_number}
                            onClick={() => onSelectContact(contact)}
                            className={`px-4 flex items-center cursor-pointer transition-colors relative min-h-[72px] ${
                                activeContact?.phone_number === contact.phone_number
                                    ? 'bg-[#2a3942]'
                                    : 'hover:bg-[#202c33]'
                            }`}
                        >
                            <div className="w-[49px] h-[49px] rounded-full bg-[#6a7175] flex items-center justify-center text-white/50 flex-shrink-0 overflow-hidden shadow-sm">
                                {contact.avatar ? (
                                    <img src={contact.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="bg-[#51585c] w-full h-full flex items-center justify-center">
                                        <Users size={28} className="text-[#cfd4d6]" />
                                    </div>
                                )}
                            </div>
                            <div className="ml-4 flex-1 border-b border-gray-800/20 py-3 flex flex-col justify-center h-full overflow-hidden">
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className="text-[#e9edef] text-[17px] leading-tight truncate font-normal">
                                        {contact.name || contact.phone_number}
                                    </span>
                                    <span className={`text-[12px] ${contact.unread_count > 0 ? 'text-[#00a884] font-bold' : 'text-[#8696a0]'}`}>
                                        {contact.last_message_time ? format(new Date(contact.last_message_time), 'HH:mm') : ''}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center text-[#8696a0] text-[14px] truncate w-full pr-2">
                                        {!contact.unread_count && (
                                            <CheckCheck size={16} className="text-[#53bdeb] mr-1 flex-shrink-0" />
                                        )}
                                        <span className="truncate">{contact.last_message || '—'}</span>
                                    </div>
                                    {contact.unread_count > 0 && (
                                        <div className="bg-[#00a884] text-[#111b21] text-[11px] min-w-[19px] h-[19px] px-1.5 flex items-center justify-center rounded-full font-bold">
                                            {contact.unread_count}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {contacts.length === 0 && (
                       <div className="p-8 text-center text-[#8696a0] text-sm italic">
                           No chats found. Use the + icon to start one.
                       </div>
                    )}
                </div>
                
                {/* Footer Section */}
                <div className="py-2 flex items-center justify-center">
                    <div className="text-[#8696a0] text-[11px] flex items-center space-x-1 opacity-50">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm0-13a1 1 0 0 0-1 1v4a1 1 0 0 0 .293.707l2.828 2.829a1 1 0 1 0 1.415-1.415L13 9.414V8a1 1 0 0 0-1-1z"></path></svg>
                        <span>Encrypted chat</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
