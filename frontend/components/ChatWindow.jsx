'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import { Send, Settings, ToggleRight, ToggleLeft } from 'lucide-react';
import { sendManualMessage } from '../services/api';

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
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 border-l border-r border-gray-200 dark:border-gray-800">
                <div className="text-center">
                    <img
                        src="https://img.icons8.com/bubbles/200/whatsapp.png"
                        alt="Select a contact"
                        className="mx-auto mb-4 opacity-70"
                    />
                    <h2 className="text-xl text-gray-400">Select a contact to start chatting</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f0f2f5] dark:bg-black/50 border-l border-r border-gray-200 dark:border-gray-800">
            {/* Top Bar */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 mr-3">
                        {activeContact.avatar ? <img src={activeContact.avatar} alt="avatar" /> : activeContact.name[0]}
                    </div>
                    <div>
                        <h3 className="font-bold">{activeContact.name || activeContact.phone_number}</h3>
                        <span className="text-xs text-green-500 font-medium">Online</span>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-gray-500">AI Auto-Reply</span>
                        <button
                            onClick={() => setIsAiEnabled(!isAiEnabled)}
                            className="focus:outline-none transition-colors"
                        >
                            {isAiEnabled ? (
                                <ToggleRight className="text-green-500 h-8 w-8" />
                            ) : (
                                <ToggleLeft className="text-gray-300 h-8 w-8" />
                            )}
                        </button>
                    </div>
                    <button className="text-gray-500 hover:text-blue-500">
                        <Settings className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-chat-pattern bg-repeat scroll-smooth"
                style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}
            >
                {messages.map((msg, index) => (
                    <ChatBubble key={index} message={msg} />
                ))}
            </div>

            {/* Input Box */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t flex items-center space-x-3">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleSendMessage}
                    placeholder="Type a message..."
                    className="flex-1 p-3 bg-gray-100 dark:bg-gray-900 rounded-full outline-none focus:ring-2 focus:ring-blue-500 transition-all border-none"
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all shadow-md active:scale-95"
                >
                    <Send className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
