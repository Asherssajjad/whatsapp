'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import { Send, Settings, Smartphone, Brain, Zap, ShieldCheck } from 'lucide-react';
import { sendManualMessage } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWindow = ({ activeContact, messages, addMessage }) => {
    const [inputText, setInputText] = useState('');
    const [isAiEnabled, setIsAiEnabled] = useState(true);
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
            <div className="flex-1 flex flex-col items-center justify-center bg-[#0f172a] text-center p-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md"
                >
                    <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/10 border border-blue-500/20">
                        <Zap className="text-blue-500" size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Select a Conversation</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        Choose a contact from the list to view the chat history and manage AI auto-replies in real-time.
                    </p>
                    <div className="flex items-center justify-center space-x-6 text-gray-500">
                        <div className="flex flex-col items-center">
                            <ShieldCheck size={20} className="mb-1" />
                            <span className="text-[10px] uppercase tracking-wider font-bold">Secure</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Brain size={20} className="mb-1" />
                            <span className="text-[10px] uppercase tracking-wider font-bold">AI Active</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-[#0f172a] relative overflow-hidden chat-bg">
            {/* Top Bar / Header */}
            <div className="px-8 py-5 glass border-b border-white/5 flex items-center justify-between z-10 shadow-xl">
                <div className="flex items-center">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg overflow-hidden border-2 border-[#1e293b]">
                            {activeContact.avatar ? <img src={activeContact.avatar} alt="avatar" /> : (activeContact.name ? activeContact.name[0] : 'U')}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#1e293b] rounded-full"></div>
                    </motion.div>
                    <div className="ml-4">
                        <h3 className="font-bold text-white text-lg leading-tight">{activeContact.name || activeContact.phone_number}</h3>
                        <div className="flex items-center mt-1">
                            <Smartphone size={10} className="text-gray-500 mr-1" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">+92 314 5686872</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-8">
                    <div className="flex items-center bg-[#1e293b] rounded-2xl px-4 py-2 border border-white/5 shadow-inner">
                        <div className="flex flex-col mr-4">
                            <span className="text-[9px] uppercase tracking-widest font-black text-gray-500">AI STATUS</span>
                            <span className={`text-[10px] font-bold ${isAiEnabled ? 'text-green-400' : 'text-red-400'}`}>
                                {isAiEnabled ? 'ENABLED' : 'DISABLED'}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsAiEnabled(!isAiEnabled)}
                            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isAiEnabled ? 'bg-blue-600' : 'bg-gray-700'}`}
                        >
                            <motion.div 
                                animate={{ x: isAiEnabled ? 26 : 2 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                            />
                        </button>
                    </div>
                    <button className="text-gray-400 hover:text-white transition-all hover:rotate-90 duration-300">
                        <Settings size={22} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide"
            >
                <div className="flex flex-col space-y-4">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChatBubble message={msg} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Input Box Area */}
            <div className="p-6 bg-[#0f172a] border-t border-white/5 z-10">
                <div className="max-w-4xl mx-auto relative group">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleSendMessage}
                        placeholder="Type something amazing..."
                        className="w-full p-4 pl-6 pr-20 bg-[#1e293b] text-white rounded-2xl outline-none ring-1 ring-white/10 focus:ring-4 focus:ring-blue-600/20 transition-all border-none placeholder-gray-500 shadow-2xl"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                        <button
                            onClick={handleSendMessage}
                            className="bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-3 rounded-xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 group-hover:rotate-6"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
                <p className="text-center text-[9px] text-gray-500 mt-4 uppercase tracking-[0.2em] font-black opacity-50">
                    AI Auto-Responder is currently managing this conversation
                </p>
            </div>
        </div>
    );
};

export default ChatWindow;
