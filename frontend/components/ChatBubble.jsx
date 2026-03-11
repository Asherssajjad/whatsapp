'use client';

import React from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

const ChatBubble = ({ message }) => {
    const isBot = message.message_type === 'bot';

    return (
        <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}>
            <div
                className={`max-w-[80%] min-w-[120px] rounded-3xl px-5 py-4 shadow-2xl transition-all duration-300 relative group ${
                    isBot
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tl-none shadow-blue-500/20'
                        : 'bg-white/10 glass text-gray-100 rounded-tr-none border border-white/10'
                }`}
            >
                {/* Message Content */}
                <p className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap">
                    {message.message}
                </p>

                {/* Footer: Time and Status */}
                <div className={`flex justify-end items-center mt-3 space-x-2 ${isBot ? 'text-white/60' : 'text-gray-500'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        {message.timestamp ? format(new Date(message.timestamp), 'HH:mm') : format(new Date(), 'HH:mm')}
                    </span>
                    {!isBot && (
                        <div className="flex">
                            <CheckCheck size={14} className="text-blue-500" />
                        </div>
                    )}
                </div>
                
                {/* Decorative Accent for Bot messages */}
                {isBot && (
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                )}
            </div>
        </div>
    );
};

export default ChatBubble;
