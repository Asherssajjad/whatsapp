'use client';

import React from 'react';
import { format } from 'date-fns';
import { CheckCheck, Bot } from 'lucide-react';

const ChatBubble = ({ message }) => {
    const isBot = message.message_type === 'bot';

    return (
        <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex flex-col max-w-[70%] ${isBot ? 'items-start' : 'items-end'}`}>
                {isBot && (
                    <div className="flex items-center space-x-2 mb-2 ml-1">
                        <div className="w-5 h-5 rounded-md abelops-gradient flex items-center justify-center">
                            <Bot size={12} className="text-white" />
                        </div>
                        <span className="text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em]">Abelops AI</span>
                    </div>
                )}
                
                <div
                    className={`px-5 py-4 rounded-3xl relative transition-all duration-300 ${
                        isBot
                            ? 'bg-[#18181b] text-zinc-100 rounded-tl-none border border-white/5'
                            : 'abelops-gradient text-white rounded-tr-none shadow-xl shadow-blue-500/10'
                    }`}
                >
                    <p className="text-[15px] leading-relaxed font-light whitespace-pre-wrap">
                        {message.message}
                    </p>

                    <div className={`flex items-center mt-3 justify-end space-x-2 opacity-50`}>
                        <span className="text-[10px] font-bold tracking-tighter uppercase font-mono">
                            {message.timestamp ? format(new Date(message.timestamp), 'HH:mm') : format(new Date(), 'HH:mm')}
                        </span>
                        {!isBot && (
                            <CheckCheck size={14} className="text-white" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBubble;
