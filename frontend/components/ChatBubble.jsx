'use client';

import React from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

const ChatBubble = ({ message }) => {
    const isBot = message.message_type === 'bot';

    return (
        <div className={`flex w-full mb-[2px] ${isBot ? 'justify-start' : 'justify-end'}`}>
            <div
                className={`max-w-[85%] min-w-[60px] px-2 py-1.5 shadow-sm relative text-[14.2px] leading-tight ${
                    isBot
                        ? 'bg-[#202c33] text-[#e9edef] rounded-lg rounded-tl-none'
                        : 'bg-[#005c4b] text-[#e9edef] rounded-lg rounded-tr-none'
                }`}
            >
                {/* Bubble Tail Replacement (Simple approximation with rounded corners) */}
                <div className={`absolute top-0 w-2 h-2 ${
                    isBot 
                        ? '-left-1 bg-[#202c33] rounded-sm rotate-45 z-0' 
                        : '-right-1 bg-[#005c4b] rounded-sm rotate-45 z-0'
                }`}></div>

                {/* Message Content */}
                <div className="relative z-10 px-1 pt-0.5">
                    <span className="whitespace-pre-wrap">{message.message}</span>
                    
                    {/* Inline Footer for Time and Status */}
                    <div className="inline-flex items-end ml-4 float-right mt-1.5 space-x-1 translate-y-0.5">
                        <span className="text-[11px] text-[#8696a0] opacity-90 uppercase tracking-tighter">
                            {message.timestamp ? format(new Date(message.timestamp), 'HH:mm') : format(new Date(), 'HH:mm')}
                        </span>
                        {!isBot && (
                            <CheckCheck size={15} className="text-[#53bdeb]" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBubble;
