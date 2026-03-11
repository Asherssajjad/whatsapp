'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import { 
    Send, 
    MoreVertical, 
    Search, 
    Plus, 
    Smile, 
    Mic,
    Paperclip,
    Users
} from 'lucide-react';
import { sendManualMessage } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWindow = ({ activeContact, messages, addMessage }) => {
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
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

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        // Add actual recording logic here if needed
    };

    if (!activeContact) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#222e35] text-center p-8 border-b-4 border-[#00a884]">
                <div className="max-w-md">
                    <img 
                        src="https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png" 
                        alt="whatsapp" 
                        className="w-80 opacity-10 mx-auto mb-10 pointer-events-none grayscale"
                    />
                    <h2 className="text-[32px] font-light text-[#e9edef] mb-[12px] opacity-90">WhatsApp Web</h2>
                    <p className="text-[#8696a0] text-[14px] leading-relaxed mb-8 opacity-80">
                        Send and receive messages without keeping your phone online.<br/>
                        Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
                    </p>
                    <div className="text-[#8696a0] text-[13px] flex items-center justify-center mt-24 opacity-40">
                         <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="mr-2"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm0-13a1 1 0 0 0-1 1v4a1 1 0 0 0 .293.707l2.828 2.829a1 1 0 1 0 1.415-1.415L13 9.414V8a1 1 0 0 0-1-1z"></path></svg>
                         End-to-end encrypted
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-[#0b141a] relative overflow-hidden">
            {/* Dark Pattern Overlay */}
            <div className="whatsapp-pattern"></div>

            {/* Header */}
            <div className="h-[60px] bg-[#202c33] px-[16px] flex items-center justify-between z-10 shadow-sm">
                <div className="flex items-center cursor-pointer flex-1">
                    <div className="w-[40px] h-[40px] rounded-full bg-[#6a7175] flex items-center justify-center text-white overflow-hidden shadow-sm">
                        {activeContact.avatar ? (
                            <img src={activeContact.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <Users size={22} className="text-[#cfd4d6]" />
                        )}
                    </div>
                    <div className="ml-[12px]">
                        <h3 className="text-[#e9edef] text-[16px] font-normal leading-tight">
                            {activeContact.name || activeContact.phone_number}
                        </h3>
                        <span className="text-[#8696a0] text-[12px] opacity-80">online</span>
                    </div>
                </div>

                <div className="flex items-center space-x-[24px] text-[#8696a0] pr-2">
                    <Search size={20} className="cursor-pointer hover:text-[#d1d7db] transition-colors" />
                    <MoreVertical size={20} className="cursor-pointer hover:text-[#d1d7db] transition-colors" />
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-[10%] py-6 space-y-1 z-10 no-scrollbar relative"
            >
                {/* Encryption Message */}
                <div className="flex justify-center mb-6">
                    <div className="bg-[#182229] text-[#ffd279]/90 text-[12.5px] px-3 py-1.5 rounded-[8px] shadow-sm font-normal flex items-center max-w-sm text-center leading-snug border border-yellow-900/10">
                        Messages are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them. Click to learn more.
                    </div>
                </div>

                <div className="flex flex-col">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.98 }}
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
            <div className="bg-[#202c33] px-[16px] py-[10px] flex items-center space-x-[16px] z-10 border-l border-gray-700/10">
                <div className="flex items-center space-x-[20px] text-[#8696a0]">
                    <Smile size={24} className="cursor-pointer hover:text-[#d1d7db] transition-colors" />
                    <Plus size={24} className="cursor-pointer hover:text-[#d1d7db] transition-colors" />
                </div>
                
                <div className="flex-1 px-[16px] py-[10px] bg-[#2a3942] rounded-[8px] flex items-center">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleSendMessage}
                        placeholder="Type a message"
                        className="w-full bg-transparent text-[#e9edef] border-none outline-none text-[15px] placeholder-[#8696a0] font-light"
                    />
                </div>

                <div className="text-[#8696a0] flex items-center">
                    {inputText.trim() ? (
                        <button
                            onClick={handleSendMessage}
                            className="p-1.5 text-[#8696a0] hover:text-[#d1d7db] transition-colors"
                        >
                            <Send size={24} />
                        </button>
                    ) : (
                        <button 
                            onClick={toggleRecording}
                            className={`p-1.5 transition-all duration-300 rounded-full ${
                                isRecording ? 'bg-red-500 text-white animate-pulse' : 'hover:text-[#d1d7db]'
                            }`}
                        >
                            <Mic size={24} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
