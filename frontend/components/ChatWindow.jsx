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
    Users,
    Zap,
    Shield,
    Bot
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
            <div className="flex-1 flex flex-col items-center justify-center bg-[#09090b] text-center p-12 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10"
                >
                    <div className="w-24 h-24 rounded-3xl abelops-gradient flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20 animate-float">
                        <Bot size={48} className="text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Abelops Intelligence</h2>
                    <p className="text-zinc-500 max-w-sm mx-auto leading-relaxed mb-12">
                        Select a conversation to monitor AI interactions and manage your customer engagement in real-time.
                    </p>
                    <div className="flex items-center justify-center space-x-16 mt-6">
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-3">
                                <Zap size={24} className="text-blue-500" />
                            </div>
                            <span className="text-[10px] uppercase font-black text-zinc-600 tracking-[0.3em]">Ultra-Fast</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-3">
                                <Shield size={24} className="text-emerald-500" />
                            </div>
                            <span className="text-[10px] uppercase font-black text-zinc-600 tracking-[0.3em]">Secured</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-[#09090b] relative overflow-hidden">
            {/* Header */}
            <div className="h-[80px] bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between z-10">
                <div className="flex items-center">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center border border-white/5 overflow-hidden">
                            {activeContact.avatar ? (
                                <img src={activeContact.avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <Users size={20} className="text-zinc-500" />
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#09090b] rounded-full"></div>
                    </div>
                    <div className="ml-4">
                        <h3 className="text-white text-lg font-bold leading-tight">
                            {(activeContact.name && activeContact.name !== 'Unknown') ? activeContact.name : `+${activeContact.phone_number}`}
                        </h3>

                        <div className="flex items-center space-x-2">
                            <span className="text-[11px] text-emerald-500 font-bold uppercase tracking-wider">Live Active</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-[11px] text-zinc-500 font-medium">Monitoring Engaged</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                        <Bot size={14} className="text-blue-500" />
                        <span className="text-xs font-bold text-white">AI Engine v2.4</span>
                    </div>
                    <button className="text-zinc-500 hover:text-white transition-colors">
                        <MoreVertical size={22} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-[15%] py-12 space-y-8 scrollbar-hide relative z-0"
            >
                <div className="flex flex-col">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChatBubble message={msg} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Input Bar */}
            <div className="p-8 bg-gradient-to-t from-[#09090b] to-transparent z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#18181b] border border-white/5 rounded-3xl p-2 pl-6 flex items-center shadow-2xl chat-shadow group focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleSendMessage}
                            placeholder="Type a message or command..."
                            className="flex-1 bg-transparent text-white border-none outline-none text-[15px] placeholder-zinc-600 font-light"
                        />
                        <div className="flex items-center space-x-2 pr-2">
                            <button className="p-3 text-zinc-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                                <Plus size={20} />
                            </button>
                            <button
                                onClick={handleSendMessage}
                                className="w-12 h-12 abelops-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
