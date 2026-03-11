'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import { 
    Send, 
    MoreVertical, 
    Search, 
    Smartphone, 
    Plus, 
    Smile, 
    Mic,
    Paperclip
} from 'lucide-react';
import { sendManualMessage } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWindow = ({ activeContact, messages, addMessage }) => {
    const [inputText, setInputText] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        if (e.key && e.key !== 'Enter') return;
        if (!inputText.trim() || !activeContact) return;

        try {
            const response = await sendManualMessage(activeContact.phone_number, inputText);
            addMessage(response.data);
            setInputText('');
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    if (!activeContact) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#222e35] text-center p-8 border-b-4 border-[#00a884]">
                <div className="max-w-md">
                    <img 
                        src="https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png" 
                        alt="whatsapp" 
                        className="w-80 opacity-10 mx-auto mb-10 pointer-events-none"
                    />
                    <h2 className="text-[32px] font-light text-[#e9edef] mb-4">WhatsApp Web</h2>
                    <p className="text-[#8696a0] text-sm leading-relaxed mb-8">
                        Send and receive messages without keeping your phone online.<br/>
                        Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
                    </p>
                    <p className="text-[#8696a0] text-xs flex items-center justify-center mt-20">
                         End-to-end encrypted
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-[#0b141a] relative overflow-hidden">
            {/* Dark Pattern Overlay */}
            <div className="whatsapp-pattern"></div>

            {/* Header */}
            <div className="h-[60px] bg-[#202c33] px-4 flex items-center justify-between z-10">
                <div className="flex items-center cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-[#6a7175] flex items-center justify-center font-bold text-white overflow-hidden">
                        {activeContact.avatar ? <img src={activeContact.avatar} alt="avatar" /> : <Smartphone size={20} />}
                    </div>
                    <div className="ml-3">
                        <h3 className="text-[#e9edef] text-[16px] font-medium leading-tight">
                            {activeContact.name || activeContact.phone_number}
                        </h3>
                        <span className="text-[#8696a0] text-[11px]">online</span>
                    </div>
                </div>

                <div className="flex items-center space-x-5 text-[#8696a0]">
                    <Search size={20} className="cursor-pointer hover:text-[#d1d7db]" />
                    <MoreVertical size={20} className="cursor-pointer hover:text-[#d1d7db]" />
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-10 space-y-2 z-10 scrollbar-hide relative"
            >
                {/* Encryption Message */}
                <div className="flex justify-center mb-6">
                    <div className="bg-[#182229] text-[#ffd279] text-[11px] px-3 py-1.5 rounded-lg shadow-sm font-medium flex items-center max-w-sm text-center">
                        Messages are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them. Click to learn more.
                    </div>
                </div>

                <div className="flex flex-col">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChatBubble message={msg} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Input Bar */}
            <div className="min-h-[62px] bg-[#202c33] px-4 py-2 flex items-center space-x-3 z-10">
                <div className="flex items-center space-x-4 text-[#8696a0]">
                    <Smile size={26} className="cursor-pointer hover:text-[#d1d7db]" />
                    <Plus size={26} className="cursor-pointer hover:text-[#d1d7db]" />
                </div>
                
                <div className="flex-1 px-4 py-2 bg-[#2a3942] rounded-lg flex items-center">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleSendMessage}
                        placeholder="Type a message"
                        className="w-full bg-transparent text-[#e9edef] border-none outline-none text-[15px] placeholder-[#8696a0]"
                    />
                </div>

                <div className="text-[#8696a0] pl-2 flex items-center">
                    {inputText.trim() ? (
                        <button
                            onClick={handleSendMessage}
                            className="p-2 text-[#8696a0] hover:text-[#d1d7db] transition-colors"
                        >
                            <Send size={24} />
                        </button>
                    ) : (
                        <Mic size={24} className="cursor-pointer hover:text-[#d1d7db]" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
