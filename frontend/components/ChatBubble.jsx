'use client';

import React from 'react';
import { format } from 'date-fns';
import { CheckCheck } from 'lucide-react';

const ChatBubble = ({ message }) => {
    const isBot = message.message_type === 'bot';

    return (
        <div className={`flex w-full mb-1 ${isBot ? 'justify-start' : 'justify-end'}`}>
            <div
                className={`max-w-[85%] min-w-[70px] px-[8px] py-[6px] shadow-sm relative text-[14.2px] ${
                    isBot
                        ? 'bg-[#202c33] text-[#e9edef] rounded-[8px] rounded-tl-none'
                        : 'bg-[#005c4b] text-[#e9edef] rounded-[8px] rounded-tr-none'
                }`}
            >
                {/* Bubble Tail Replacement */}
                <svg 
                    className={`absolute top-0 ${isBot ? '-left-[10px]' : '-right-[10px]'} z-0`} 
                    viewBox="0 0 10 21" 
                    width="10" 
                    height="21"
                >
                    <path 
                        d={isBot 
                            ? "M10 0 L10 21 L0 0 Z" 
                            : "M0 0 L0 21 L10 0 Z"
                        } 
                        fill={isBot ? "#202c33" : "#005c4b"} 
                    />
                </svg>

                {/* Message Content */}
                <div className="relative z-10 px-1 pt-0.5 pb-2">
                    <span className="whitespace-pre-wrap leading-snug">{message.message}</span>
                    
                    {/* Inline Footer for Time and Status */}
                    <div className="absolute bottom-1 right-2 flex items-center space-x-1">
                        <span className="text-[11px] text-[#8696a0] opacity-80 uppercase font-light">
                            {message.timestamp ? format(new Date(message.timestamp), 'HH:mm') : format(new Date(), 'HH:mm')}
                        </span>
                        {!isBot && (
                            <CheckCheck size={16} className="text-[#53bdeb] opacity-90" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBubble;
